import { Box, BoxProps, Button, Theme, Typography } from "@mui/material";
import { TextTypeInput } from "@leanoncompany/supporti-react-ui";
import moment from "moment";
import React, { cloneElement, Dispatch, useEffect, useState } from "react";
import AuthController from "../../../../controller/default/AuthController";
import PhoneAuth from "../PhonAuth";
import Grid2 from "@mui/material/Unstable_Grid2";
import { SxProps } from "@mui/material/styles";

type Props = {
  setShowTab: Dispatch<React.SetStateAction<boolean>>;
  findIdResult: { label: string; value: string }[];
  setFindIdResult: Dispatch<
    React.SetStateAction<{ label: string; value: string }[]>
  >;
  passwordStep: number;
  setPasswordStep: Dispatch<React.SetStateAction<number>>;
  userType?: string;

  textFieldStyle?: SxProps<Theme>;

  thirdText?: React.ReactElement;

  textTypeInputVariant?: "standard" | "filled" | "outlined" | undefined;
  goToLogin?: React.ReactElement;
  typographyFontWeight?: string;
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
  boxStyle?: BoxProps;
  labelBoxStyle?: BoxProps;
  // 인증번호 보내기 버튼 스타일
  sendVerifyCodeButtonStyle?: SxProps<Theme>;
  sendVerifyCodeButtonText?: string;

  // 인증하기 버튼 스타일
  buttonStyle?: SxProps<Theme>;
  disableButton?: boolean;

  // 전화번호 휴대전화  텍스트
  phoneNumberLabel?: string;

  findBtnText?: string;
  findBtnStyle?: SxProps<Theme>;

  phoneNumberPlaceholder?: string;

  setBtnColor?: React.Dispatch<React.SetStateAction<boolean>>;
  passwordConfirmBtn?: React.ReactElement;

  setPasswordChangeBtnColor?: React.Dispatch<React.SetStateAction<boolean>>;
  passwordChangeBtn?: React.ReactElement;

  passwordChangeMarginBottom?: string;

  emailLabel?: string;

  fourthText?: React.ReactElement;

  newPasswordLabel?: string;
  newPasswordPlaceholder?: string;
  newPasswordCheckLabel?: string;
  newPasswordCheckPlaceholder?: string;

  useEmailRegex?: boolean;
};

const FindPassword = (props: Props) => {
  /**
   * theme
   */
  // const theme = useTheme();
  const authController = new AuthController();

  /**
   * 이름 전화번호 인증번호코드 state
   */

  const [userName, setUserName] = useState<string>("");
  const [userNameInputStatus, setUserNameInputStatus] = useState<{
    status: string;
  }>({
    status: "default",
  });

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneNumberInputStatus, setPhoneNumberInputStatus] = useState<{
    status: string;
  }>({ status: "default" });

  const [verifyCodeInputStatus, setVerifyCodeInputStatus] = useState<{
    status: string;
  }>({ status: "default" });

  const [authorizeStatus, setAuthorizeStatus] = React.useState<
    "default" | "sended" | "success"
  >("default");

  /**
   * 바꿀 패스워드
   */
  const [password, setPassword] = useState<string>("");
  const [passwordInputStatus, setPasswordInputStatus] = useState<{
    status: string;
  }>({ status: "default" });

  const [checkPassword, setCheckPassword] = useState<string>("");
  const [checkPasswordInputStatus, setCheckPasswordInputStatus] = useState<{
    status: string;
  }>({ status: "default" });

  /**
   * 유효성 함수 두개
   */
  const regexUserNamePhoneNumberVerifyCode = () => {
    let isValidate = true;
    // 아이디
    let userNameRegex = /^[a-z0-9]{5,19}$/;
    if (props.useEmailRegex === true) {
      userNameRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    }

    if (userNameRegex.test(userName) === false) {
      isValidate = false;
      setUserNameInputStatus({ status: "error" });
    }

    if (
      /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/.test(phoneNumber) === false
    ) {
      isValidate = false;
      setPhoneNumberInputStatus({ status: "error" });
    }
    if (authorizeStatus !== "success") {
      isValidate = false;
      setVerifyCodeInputStatus({ status: "error" });
    }

    if (isValidate) {
      authController.validationFindPassword(
        { USER_NAME: userName, PHONE_NUMBER: phoneNumber },
        (response) => {
          if (response.data.result === true) {
            props.setPasswordStep(props.passwordStep + 1);
          } else {
            alert("일치하는 회원이 존재하지 않습니다.");
          }
        }
      );
    }
  };

  const regexPassword = () => {
    let isValidate = true;

    if (
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/.test(
        password
      ) === false
    ) {
      isValidate = false;
      setPasswordInputStatus({ status: "error" });
    }

    // 비밀번호, 비밀번호 확인 같은지
    if (password !== checkPassword) {
      isValidate = false;
      setCheckPasswordInputStatus({ status: "required" });
    }

    if (isValidate) {
      authController.changePasswordInFindPassword(
        {
          USER_NAME: userName,
          PHONE_NUMBER: phoneNumber,
          PASSWORD: password,
        },
        (response: any) => {
          if (response.data.status === 500) {
            alert("존재하지 않는 회원입니다.");
          } else if (response.data.status === 200) {
            let cloneList = [...props.findIdResult];
            cloneList[0].value = moment(response.data.result.CREATED_AT).format(
              "YYYY.MM.DD"
            );
            cloneList[1].value = response.data.result.USER_NAME;
            props.setFindIdResult(cloneList);
            props.setShowTab(false);
          }
        },
        (err: any) => {
          alert("존재하지 않는 회원입니다.");
        }
      );
    }
    props.setShowTab(false);
  };

  useEffect(() => {
    if (props.setPasswordChangeBtnColor !== undefined) {
      if (password.length > 0 && checkPassword.length > 0) {
        props.setPasswordChangeBtnColor(true);
      } else if (password.length === 0 || checkPassword.length === 0) {
        props.setPasswordChangeBtnColor(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, props.setPasswordChangeBtnColor, checkPassword]);

  return (
    <React.Fragment>
      {props.passwordStep === 0 ? (
        <Box mt={3}>
          <Grid2 container>
            <Grid2
              item
              md={12}
              xs={12}
              display={props.emailLabel !== undefined ? "flex" : "none"}
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
                sx={{
                  fontWeight: props.typographyFontWeight,
                }}
              >
                {props.emailLabel}
              </Typography>
            </Grid2>
            <Grid2 item md={12} xs={12} mb={1.5}>
              <TextTypeInput
                labelConfig={
                  props.emailLabel === undefined
                    ? {
                        position: "outer",
                        label: "아이디",
                      }
                    : {}
                }
                fullWidth
                textFieldStyle={
                  props.textFieldStyle !== undefined ? props.textFieldStyle : {}
                }
                variant={
                  props.textTypeInputVariant !== undefined
                    ? props.textTypeInputVariant
                    : undefined
                }
                maxLength={20}
                placeholder={"아이디를 입력해주세요."}
                value={userName}
                setValue={setUserName}
                inputCaptionConfig={{
                  status: userNameInputStatus,
                  errorMessage:
                    "최소 5자, 최대 19자 알파벳과 숫자의 조합만 가능합니다.",
                  requiredMessage: "아이디 중복 확인을 해주세요.",
                }}
                onChangeCallback={(args: any) => {
                  if (args.event.target.value.length > 0) {
                    setUserNameInputStatus({
                      status: "default",
                    });
                  }
                }}
              />
            </Grid2>
            <Grid2 item md={12} xs={12}>
              <PhoneAuth
                verifyInputStatus={verifyCodeInputStatus}
                setVerifyInputStatus={setVerifyCodeInputStatus}
                authorizeStatus={authorizeStatus}
                setAuthorizeStatus={setAuthorizeStatus}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                phoneNumberInputStatus={phoneNumberInputStatus}
                setPhoneNumberInputStatus={setPhoneNumberInputStatus}
                textFieldStyle={props.textFieldStyle}
                textTypeInputVariant={
                  props.textTypeInputVariant !== undefined
                    ? props.textTypeInputVariant
                    : undefined
                }
                typographyFontWeight={
                  props.typographyFontWeight !== undefined
                    ? props.typographyFontWeight
                    : undefined
                }
                typographyVariant={
                  props.typographyVariant !== undefined
                    ? props.typographyVariant
                    : undefined
                }
                boxStyle={
                  props.boxStyle !== undefined ? props.boxStyle : undefined
                }
                labelBoxStyle={
                  props.labelBoxStyle !== undefined
                    ? props.labelBoxStyle
                    : undefined
                }
                sendVerifyCodeButtonStyle={
                  props.sendVerifyCodeButtonStyle !== undefined
                    ? props.sendVerifyCodeButtonStyle
                    : undefined
                }
                buttonStyle={
                  props.buttonStyle !== undefined
                    ? props.buttonStyle
                    : undefined
                }
                disableButton={
                  props.disableButton !== undefined
                    ? props.disableButton
                    : undefined
                }
                phoneNumberLabel={
                  props.phoneNumberLabel !== undefined
                    ? props.phoneNumberLabel
                    : undefined
                }
                sendVerifyCodeButtonText={
                  props.sendVerifyCodeButtonText !== undefined
                    ? props.sendVerifyCodeButtonText
                    : undefined
                }
                phoneNumberPlaceholder={
                  props.phoneNumberPlaceholder !== undefined
                    ? props.phoneNumberPlaceholder
                    : undefined
                }
                setBtnColor={
                  props.setBtnColor !== undefined
                    ? props.setBtnColor
                    : undefined
                }
                userName={userName}
              />
            </Grid2>
            {props.thirdText !== undefined && props.thirdText}
            <Grid2
              item
              md={12}
              xs={12}
              mt={props.thirdText !== undefined ? 0 : 5}
            >
              {props.passwordConfirmBtn !== undefined ? (
                cloneElement(props.passwordConfirmBtn, {
                  onClick: () => {
                    regexUserNamePhoneNumberVerifyCode();
                  },
                })
              ) : (
                <Button
                  // width={"100%"}
                  fullWidth
                  color={"primary"}
                  variant="contained"
                  sx={{
                    marginBottom: 2,
                  }}
                  onClick={() => {
                    regexUserNamePhoneNumberVerifyCode();
                  }}
                >
                  {props.findBtnText !== undefined
                    ? props.findBtnText
                    : "비밀번호 찾기"}
                </Button>
              )}
            </Grid2>
            {props.goToLogin !== undefined && props.goToLogin}
          </Grid2>
        </Box>
      ) : (
        <Grid2 container mt={3}>
          <Grid2
            item
            md={12}
            xs={12}
            mb={
              props.passwordChangeMarginBottom !== undefined
                ? props.passwordChangeMarginBottom
                : 1.5
            }
            sx={{
              display: props.newPasswordLabel !== undefined ? "flex" : "block",
              flexDirection:
                props.newPasswordLabel !== undefined ? "column" : undefined,
            }}
          >
            {props.newPasswordLabel !== undefined && (
              <Typography
                variant={props.typographyVariant}
                sx={{
                  fontWeight: props.typographyFontWeight,
                }}
              >
                {props.newPasswordLabel}
              </Typography>
            )}
            <TextTypeInput
              labelConfig={
                props.newPasswordLabel === undefined
                  ? {
                      position: "outer",
                      label: "새 비밀번호",
                    }
                  : {}
              }
              fullWidth
              value={password}
              setValue={setPassword}
              textFieldStyle={
                props.textFieldStyle !== undefined ? props.textFieldStyle : {}
              }
              variant={
                props.textTypeInputVariant !== undefined
                  ? props.textTypeInputVariant
                  : undefined
              }
              type={"password"}
              maxLength={20}
              placeholder={
                props.newPasswordPlaceholder !== undefined
                  ? props.newPasswordPlaceholder
                  : "비밀번호를 입력해주세요."
              }
              inputCaptionConfig={{
                status: passwordInputStatus,
                errorMessage:
                  "최소 10자, 최대 20자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자가 필요합니다.",
              }}
              onChangeCallback={(args: any) => {
                if (args.event.target.value.length > 0) {
                  setPasswordInputStatus({
                    status: "default",
                  });
                }
              }}
            />
          </Grid2>
          <Grid2
            item
            md={12}
            xs={12}
            mb={
              props.passwordChangeMarginBottom !== undefined
                ? props.passwordChangeMarginBottom
                : 0
            }
            sx={{
              display:
                props.newPasswordCheckLabel !== undefined ? "flex" : "block",
              flexDirection:
                props.newPasswordCheckLabel !== undefined
                  ? "column"
                  : undefined,
            }}
          >
            {props.newPasswordCheckLabel !== undefined && (
              <Typography
                variant={props.typographyVariant}
                sx={{
                  fontWeight: props.typographyFontWeight,
                }}
              >
                {props.newPasswordCheckLabel}
              </Typography>
            )}
            <TextTypeInput
              labelConfig={
                props.newPasswordCheckLabel === undefined
                  ? {
                      position: "outer",
                      label: "새 비밀번호 확인",
                    }
                  : {}
              }
              fullWidth
              maxLength={20}
              type={"password"}
              textFieldStyle={
                props.textFieldStyle !== undefined ? props.textFieldStyle : {}
              }
              variant={
                props.textTypeInputVariant !== undefined
                  ? props.textTypeInputVariant
                  : undefined
              }
              placeholder={
                props.newPasswordCheckPlaceholder !== undefined
                  ? props.newPasswordCheckPlaceholder
                  : "비밀번호를 입력해주세요."
              }
              setValue={setCheckPassword}
              value={checkPassword}
              inputCaptionConfig={{
                status: checkPasswordInputStatus,
                errorMessage:
                  "알파벳 소문자, 숫자, 특수문자를 한개이상 포함하여 5 ~ 20글자여야 합니다 (한글 X)",
                requiredMessage: "비밀번호가 일치하지 않습니다",
              }}
              onChangeCallback={(args: any) => {
                if (args.event.target.value.length > 0) {
                  setCheckPasswordInputStatus({
                    status: "default",
                  });
                }
              }}
            />
          </Grid2>
          {props.fourthText !== undefined && props.fourthText}
          <Grid2 item md={12} xs={12}>
            {props.passwordChangeBtn !== undefined ? (
              cloneElement(props.passwordChangeBtn, {
                onClick: () => {
                  regexPassword();
                },
              })
            ) : (
              <Button
                fullWidth
                color={"primary"}
                variant="contained"
                sx={
                  props.findBtnStyle !== undefined
                    ? { ...props.findBtnStyle }
                    : {
                        marginBottom: 2,
                        mt: 5,
                      }
                }
                onClick={() => {
                  regexPassword();
                }}
              >
                변경하기
              </Button>
            )}
          </Grid2>
          {props.goToLogin !== undefined && props.goToLogin}
        </Grid2>
      )}
    </React.Fragment>
  );
};

export default FindPassword;
