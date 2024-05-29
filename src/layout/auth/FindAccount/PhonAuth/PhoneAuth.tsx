import {
  Box,
  Typography,
  Button,
  Grid,
  useTheme,
  BoxProps,
  TextFieldProps,
  ButtonProps,
  Theme,
  SxProps,
} from "@mui/material";
import {
  CSSSelectorObjectOrCssVariables,
  SystemCssProperties,
  SystemStyleObject,
} from "@mui/system";

import { TextTypeInput } from "@leanoncompany/supporti-react-ui";
import { RegexManager } from "@leanoncompany/supporti-utility";
import React from "react";
import AuthController from "../../../../controller/default/AuthController";
import Timer from "./Timer";

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

  phoneNumberPlaceholder?: string;

  sendVerifyCodeButtonText?: string;

  containerStyle?: BoxProps;
  boxStyle?: BoxProps;
  textFieldStyle?:
    | SystemCssProperties<Theme>
    | CSSSelectorObjectOrCssVariables<Theme>
    | ((theme: Theme) => SystemStyleObject<Theme>)
    | readonly (
        | boolean
        | SystemStyleObject<Theme>
        | ((theme: Theme) => SystemStyleObject<Theme>)
      )[]
    | null
    | undefined;
  labelBoxStyle?: BoxProps;

  typographyVariant?:
    | "button"
    | "caption"
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
    | "overline"
    | "inherit";
  typographyFontWeight?: string;

  textTypeInputVariant?: "standard" | "filled" | "outlined" | undefined;

  // 인증번호 보내기 버튼 스타일
  sendVerifyCodeButtonStyle?: SxProps<Theme>;

  // 인증하기 버튼 스타일
  buttonStyle?: SxProps<Theme>;
  disableButton?: boolean;

  // 전화번호 휴대전화  텍스트
  phoneNumberLabel?: string;
  // * 표시
  required?: boolean;

  setBtnColor?: React.Dispatch<React.SetStateAction<boolean>>;

  userName?: string;
}

const PhoneAuth = (props: IPhoneAuthSection) => {
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
        } else if (response.data.result !== true) {
          props.setVerifyInputStatus({
            status: "error",
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

  // 버튼색 위해서 있음 확인이나 등등
  React.useEffect(() => {
    if (props.setBtnColor !== undefined) {
      if (props.userName !== undefined) {
        if (
          props.phoneNumber.length > 0 &&
          authCode.length > 0 &&
          props.userName.length > 0
        ) {
          props.setBtnColor(true);
        } else if (
          props.phoneNumber.length === 0 ||
          authCode.length === 0 ||
          props.userName.length === 0
        ) {
          props.setBtnColor(false);
        }
      } else {
        if (props.phoneNumber.length > 0 && authCode.length > 0) {
          props.setBtnColor(true);
        } else if (props.phoneNumber.length === 0 || authCode.length === 0) {
          props.setBtnColor(false);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.phoneNumber, authCode]);

  return (
    <Box
      sx={
        props.containerStyle !== undefined
          ? { ...props.containerStyle }
          : { my: 1 }
      }
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        sx={props.boxStyle !== undefined ? { ...props.boxStyle } : { my: 1 }}
      >
        <Box
          display={props.phoneNumberLabel !== undefined ? "flex" : "none"}
          sx={
            props.labelBoxStyle !== undefined
              ? {
                  ...props.labelBoxStyle,
                }
              : {}
          }
        >
          <Typography
            variant={props.typographyVariant}
            fontWeight={props.typographyFontWeight}
          >
            {props.phoneNumberLabel !== undefined
              ? props.phoneNumberLabel
              : "전화번호"}{" "}
            {props.required === true ? "*" : ""}
          </Typography>
        </Box>
        <TextTypeInput
          labelConfig={
            props.phoneNumberLabel !== undefined
              ? props.phoneNumberLabel
              : {
                  position: "outer",
                  label: "전화번호",
                  typograhpyVariant: "body1",
                }
          }
          fullWidth
          maxLength={20}
          placeholder={
            props.phoneNumberPlaceholder !== undefined
              ? props.phoneNumberPlaceholder
              : "핸드폰 번호를 입력해주세요(숫자만)"
          }
          value={props.phoneNumber}
          setValue={props.setPhoneNumber}
          adornmentPosition={"end"}
          variant={
            props.textTypeInputVariant !== undefined
              ? props.textTypeInputVariant
              : undefined
          }
          textFieldStyle={
            props.textFieldStyle !== undefined ? props.textFieldStyle : {}
          }
          adornmentElement={
            <Button
              variant="text"
              onClick={
                encryptedAuthCode.length !== 0
                  ? resendAuthNumber
                  : sendAuthNumber
              }
              sx={
                props.sendVerifyCodeButtonStyle !== undefined
                  ? { ...props.sendVerifyCodeButtonStyle }
                  : {}
              }
            >
              {props.sendVerifyCodeButtonText !== undefined ? (
                props.sendVerifyCodeButtonText
              ) : (
                <Typography
                  variant="subtitle2"
                  sx={{ textDecoration: "underline" }}
                  color={"black"}
                >
                  {encryptedAuthCode.length !== 0 ? "재요청" : "인증요청"}
                </Typography>
              )}
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
        display={"flex"}
        flexDirection={"column"}
        sx={props.boxStyle !== undefined ? { ...props.boxStyle } : { my: 1 }}
      >
        {props.phoneNumberLabel !== undefined ? (
          <Box
            sx={
              props.labelBoxStyle !== undefined
                ? {
                    ...props.labelBoxStyle,
                  }
                : {}
            }
          >
            <Typography
              variant={props.typographyVariant}
              fontWeight={props.typographyFontWeight}
            >
              인증번호 {props.required === true ? "*" : ""}
            </Typography>
          </Box>
        ) : (
          <Box mb={1}>
            <Typography variant={"body1"}>인증번호</Typography>
          </Box>
        )}

        <Grid container spacing={1} alignItems={"flex-start"}>
          <Grid
            item
            md={props.disableButton !== true ? 9 : 12}
            xs={8}
            flexDirection={"column"}
          >
            <TextTypeInput
              fullWidth
              maxLength={4}
              placeholder={"인증번호 입력"}
              setValue={setAuthCode}
              variant={
                props.textTypeInputVariant !== undefined
                  ? props.textTypeInputVariant
                  : undefined
              }
              textFieldStyle={
                props.textFieldStyle !== undefined ? props.textFieldStyle : {}
              }
              value={authCode}
              inputCaptionConfig={{
                status: props.verifyInputStatus,
                errorMessage: "올바른 인증번호를 입력해주세요",
                passedMessage: "인증되었습니다.",
              }}
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

          <Grid
            item
            md={props.disableButton !== true ? 3 : 0}
            xs={props.disableButton !== true ? 4 : 0}
          >
            {props.disableButton !== true && (
              <Button
                onClick={() => {
                  validateAuthCode();
                }}
                fullWidth
                variant={"outlined"}
                color={"primary"}
                sx={
                  props.buttonStyle !== undefined
                    ? { ...props.buttonStyle }
                    : {
                        height: "44px",
                        width: "100%",
                        display: "flex",
                      }
                }
              >
                인증하기
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PhoneAuth;
