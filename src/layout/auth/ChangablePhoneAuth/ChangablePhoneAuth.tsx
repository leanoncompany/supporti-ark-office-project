import { Box, Typography, Button, useTheme, Grid } from "@mui/material";
import { TextTypeInput } from "@leanoncompany/supporti-react-ui";
import { RegexManager } from "@leanoncompany/supporti-utility";
import React from "react";

import { IUserInputCaption } from "../../../@types/external/qillieReactUi";
import AuthController from "../../../controller/default/AuthController";
import Timer from "../FindAccount/PhonAuth/Timer";

// type Props = {};

interface IPhoneAuthSection {
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  phoneNumberInputStatus: { status: string };
  setPhoneNumberInputStatus: React.Dispatch<
    React.SetStateAction<{
      status: string;
    }>
  >;
  authorizeStatus: "default" | "sended" | "success";
  setAuthorizeStatus: React.Dispatch<
    React.SetStateAction<"default" | "sended" | "success">
  >;
  setVerifyInputStatus: React.Dispatch<
    React.SetStateAction<{
      status: string;
    }>
  >;
  verifyInputStatus: {
    status: string;
  };

  // 전화번호 휴대전화  텍스트
  phoneNumberLabel?: string;

  // * 표시
  required: boolean;

  phoneAuthStyle?: {
    require: boolean;
    labelFontWeight: string;
    inputFontSize: string;
    labelFontSize:
      | "h1"
      | "h2"
      | "h3"
      | "h4"
      | "h5"
      | "h6"
      | "subtitle1"
      | "subtitle2"
      | "body1"
      | "body2"
      | "caption"
      | "button"
      | "overline"
      | "inherit"
      | undefined;
    variant: "standard" | "filled" | "outlined" | undefined;
    inputColor: string;
    // 라벨 간격
    labelMargin: string;
    // 인풋간 간격
    inputMargin: string;
    padding: string;
    phoneAuthMarginTop?: string;
    phoneAuthMarginBottom?: string;
    borderBottom?: string;
    borderLeft?: string;
    borderRight?: string;
    borderTop?: string;
  };
}

const ChangablePhoneAuth = (props: IPhoneAuthSection) => {
  //* Modules
  const regexManager = new RegexManager();
  // const authController = new AuthController();
  const theme = useTheme();

  const authController = new AuthController();

  //* States
  /**
   * 인증 번호 입력 관련 상태값
   */
  const [activeTimer, setActiveTimer] = React.useState<boolean>(false);

  /**
   * 인증번호 정보 관련 상태값
   */
  const [authCode, setAuthCode] = React.useState<string>("");
  const [encryptedAuthCode, setEncryptedAuthCode] = React.useState<string>("");

  const [authRemainedTime, setAuthRemainedTime] = React.useState<number>(0);

  //* Functions
  /**
   * 인증 요청 함수
   */
  const sendAuthNumber = () => {
    if (
      /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/.test(props.phoneNumber) ===
      false
    ) {
      props.setPhoneNumberInputStatus({ status: "error" });
    } else {
      setActiveTimer(false);
      setAuthRemainedTime(180000);

      authController.sendPhoneAuth(
        { TARGET_PHONE_NUMBER: props.phoneNumber },
        (response: any) => {
          setEncryptedAuthCode(response.data.result);
          setActiveTimer(true);
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  };

  /**
   * 인증 재요청 함수
   */
  const resendAuthNumber = () => {
    //* Reset auth status
    props.setAuthorizeStatus("default");

    setTimeout(() => {
      props.setAuthorizeStatus("sended");
    }, 1000);
  };

  /**
   * 인증번호 확인 함수
   */
  const validateAuthCode = () => {
    authController.validateAuthCode(
      { AUTH_CODE: authCode, ENCRYPTED_AUTH_CODE: encryptedAuthCode },
      (response: any) => {
        if (response.data.result === true) {
          props.setAuthorizeStatus("success");
          props.setVerifyInputStatus({
            status: "passed",
          });
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  };

  //* Hooks
  /**
   * 메세지 전송을 위한 훅
   */
  React.useEffect(() => {
    if (props.authorizeStatus === "sended") {
      sendAuthNumber();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.authorizeStatus]);

  return (
    <Box
      mt={props.phoneAuthStyle?.phoneAuthMarginTop}
      mb={props.phoneAuthStyle?.phoneAuthMarginBottom}
      my={
        props.phoneAuthStyle?.phoneAuthMarginTop !== undefined &&
        props.phoneAuthStyle?.phoneAuthMarginBottom !== undefined
          ? undefined
          : 1
      }
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        mb={
          props.phoneAuthStyle?.inputMargin !== undefined
            ? props.phoneAuthStyle?.inputMargin
            : 1
        }
      >
        <Box
          display={props.phoneNumberLabel !== undefined ? "flex" : "none"}
          mb={props.phoneAuthStyle?.labelMargin}
        >
          <Typography
            variant={props.phoneAuthStyle?.labelFontSize}
            sx={{
              fontWeight: props.phoneAuthStyle?.labelFontWeight,
            }}
          >
            {props.phoneNumberLabel !== undefined
              ? props.phoneNumberLabel
              : "전화번호"}{" "}
            {props.phoneAuthStyle?.require === true ? "*" : ""}
          </Typography>
        </Box>
        <TextTypeInput
          fullWidth
          maxLength={20}
          labelConfig={
            props.phoneNumberLabel === undefined
              ? {
                  position: "outer",
                  label: "전화번호",
                }
              : undefined
          }
          placeholder={"핸드폰 번호를 입력해주세요(숫자만)"}
          textFieldStyle={
            props.phoneAuthStyle !== undefined
              ? {
                  backgroundColor: "#ffffff",
                  ".MuiInput-input": {
                    padding: props.phoneAuthStyle?.padding,
                    color: props.phoneAuthStyle?.inputColor,
                    fontSize: props.phoneAuthStyle?.inputFontSize,
                  },
                  ".MuiInput-root:before": {
                    borderBottom: props.phoneAuthStyle?.borderBottom,
                    borderLeft: props.phoneAuthStyle?.borderLeft,
                    borderRight: props.phoneAuthStyle?.borderRight,
                    borderTop: props.phoneAuthStyle?.borderTop,
                  },
                  ".MuiInputBase-input-MuiInput-input": {
                    borderBottom: 0,
                  },
                }
              : undefined
          }
          variant={
            props.phoneAuthStyle?.variant !== undefined
              ? props.phoneAuthStyle?.variant
              : undefined
          }
          value={props.phoneNumber}
          setValue={props.setPhoneNumber}
          adornmentPosition={"end"}
          adornmentElement={
            <Button
              variant="text"
              onClick={
                encryptedAuthCode.length !== 0
                  ? resendAuthNumber
                  : sendAuthNumber
              }
            >
              <Typography
                variant="subtitle2"
                sx={{ textDecoration: "underline" }}
                color={"black"}
              >
                {encryptedAuthCode.length !== 0 ? "재요청" : "인증요청"}
              </Typography>
            </Button>
          }
          inputCaptionConfig={{
            status: props.phoneNumberInputStatus,
            errorMessage: "올바른 전화번호를 입력해주세요",
          }}
          onChangeCallback={(args: any) => {
            if (args.event.target.value.length > 0) {
              props.setPhoneNumberInputStatus({
                status: "default",
              });
            }
            props.setPhoneNumber(
              regexManager.filterNotNumber(args.event.target.value)
            );

            props.setAuthorizeStatus("default");
            props.setVerifyInputStatus({
              status: "default",
            });

            setAuthCode("");
          }}
        />
      </Box>

      <Box
        display={props.phoneNumberLabel !== undefined ? "flex" : "none"}
        mb={props.phoneAuthStyle?.labelMargin}
      >
        <Typography
          variant={props.phoneAuthStyle?.labelFontSize}
          sx={{
            fontWeight: props.phoneAuthStyle?.labelFontWeight,
          }}
        >
          인증번호 {props.phoneAuthStyle?.require === true ? "*" : ""}
        </Typography>
      </Box>

      <Grid container spacing={1} alignItems={"flex-start"}>
        <Grid item md={9} xs={8} sx={{ flexDirection: "column" }}>
          <TextTypeInput
            fullWidth
            maxLength={4}
            placeholder={"인증번호 입력"}
            labelConfig={
              props.phoneNumberLabel === undefined
                ? {
                    position: "outer",
                    label: "인증번호",
                  }
                : undefined
            }
            setValue={setAuthCode}
            value={authCode}
            inputCaptionConfig={{
              status: props.verifyInputStatus,
              errorMessage: "올바른 인증번호를 입력해주세요",
              passedMessage: "인증되었습니다.",
            }}
            variant={props.phoneAuthStyle?.variant}
            textFieldStyle={
              props.phoneAuthStyle !== undefined
                ? {
                    backgroundColor: "#ffffff",
                    ".MuiInput-input": {
                      padding: props.phoneAuthStyle?.padding,
                      color: props.phoneAuthStyle?.inputColor,
                      fontSize: props.phoneAuthStyle?.inputFontSize,
                    },
                    ".MuiInput-root:before": {
                      borderBottom: props.phoneAuthStyle?.borderBottom,
                      borderLeft: props.phoneAuthStyle?.borderLeft,
                      borderRight: props.phoneAuthStyle?.borderRight,
                      borderTop: props.phoneAuthStyle?.borderTop,
                    },
                    ".MuiInputBase-input-MuiInput-input": {
                      borderBottom: 0,
                    },
                  }
                : undefined
            }
            adornmentPosition={"end"}
            adornmentElement={
              <Box
                display={encryptedAuthCode.length !== 0 ? "block" : "block"}
                sx={{
                  borderRadius: 5,
                  backgroundColor: theme.palette.primary.main,
                }}
                px={1}
                py={0.75}
              >
                <Timer
                  toggleTimer={activeTimer}
                  setToggleTimer={setActiveTimer}
                  timer={authRemainedTime}
                  setTimer={setAuthRemainedTime}
                />
              </Box>
            }
            onChangeCallback={(args: any) => {
              props.setVerifyInputStatus({
                status: "default",
              });
            }}
          />
        </Grid>

        <Grid item md={3} xs={4}>
          <Button
            onClick={() => {
              validateAuthCode();
            }}
            fullWidth
            variant={"outlined"}
            color={"primary"}
            sx={{
              backgroundColor: "#000",
              fontSize: "11px !important",
              py: "12px",
              borderRadius: 1.5,
              color: "#fff",
              ".MuiButton-root:hover": {
                backgroundColor: "#000",
              },
              "&:hover": {
                backgroundColor: "#000",
              },
            }}
          >
            인증하기
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChangablePhoneAuth;
