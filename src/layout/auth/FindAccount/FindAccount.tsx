import {
  Box,
  BoxProps,
  Button,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { SxProps } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TabPanel } from "@leanoncompany/supporti-react-ui";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FindUserName from "./FindUserName";
import FindPassword from "./FindPassword";
import AccountLayout from "../../AccountLayout";

interface IFindAccount {
  // 레이아웃
  containerStyle?: BoxProps;
  maxWidth?: string;
  disableShadow?: boolean;
  disablePadding?: boolean;

  titleVariant?:
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
  titleFontWeight?: string;
  titleBoxStyle?: BoxProps;
  secondTitle?: React.ReactElement;

  secondText?: React.ReactElement;

  thirdText?: React.ReactElement;

  textFieldStyle?: SxProps<Theme>;

  textTypeInputVariant?: "standard" | "filled" | "outlined" | undefined;

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
  buttonText?: string;
  buttonStyle?: SxProps<Theme>;
  disableButton?: boolean;

  // 전화번호 휴대전화  텍스트
  phoneNumberLabel?: string;

  goToLogin?: React.ReactElement;
  phoneNumberPlaceholder?: string;

  setEmailBtnColor?: React.Dispatch<React.SetStateAction<boolean>>;
  setPasswordBtnColor?: React.Dispatch<React.SetStateAction<boolean>>;

  passwordConfirmBtn?: React.ReactElement;
  emailConfirmBtn?: React.ReactElement;

  setPasswordChangeBtnColor?: React.Dispatch<React.SetStateAction<boolean>>;
  passwordChangeBtn?: React.ReactElement;

  passwordChangeMarginBottom?: string;

  emailLabel?: string;

  fourthText?: React.ReactElement;

  newPasswordLabel?: string;
  newPasswordPlaceholder?: string;
  newPasswordCheckLabel?: string;
  newPasswordCheckPlaceholder?: string;

  useHideTitle?: boolean;

  emailSuccessPage?: boolean;
  passwordSuccessPage?: React.ReactElement;

  emailImage?: React.ReactElement;
  passwordImage?: React.ReactElement;

  customCallbackDict?: {
    [key: string]: (args: { [key: string]: any }) => React.ReactElement;
  };

  tabPanelFontSize?:
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

  useEmailRegex?: boolean;
}

const FindAccount = (props: IFindAccount) => {
  const router = useRouter();
  const theme = useTheme();

  const [findIdResult, setFindIdResult] = useState<
    { label: string; value: string }[]
  >([
    { label: "가입일", value: "없음" },
    { label: "아이디", value: "없음" },
  ]);
  const [showTab, setShowTab] = useState<boolean>(true);
  const [idStep, setIdStep] = useState<number>(0);
  const [passwordStep, setPasswordStep] = useState<number>(0);

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

  useEffect(() => {
    setShowTab(true);
    setIdStep(0);
    setPasswordStep(0);
    setFindIdResult([
      { label: "가입일", value: "없음" },
      { label: "아이디", value: "없음" },
    ]);
  }, [selectedTabIndex]);

  /**
   * Url 쿼리에 탭 지정 후 진입 시 해당 탭으로 바로 이동하는 훅
   */
  useEffect(() => {
    // const { pid } = router.query;
    // console.log(router.query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);
  return (
    <AccountLayout
      disablePadding={
        props.disablePadding !== undefined ? props.disablePadding : false
      }
      disableShadow={
        props.disableShadow !== undefined ? props.disableShadow : false
      }
      maxWidth={props.maxWidth !== undefined ? props.maxWidth : undefined}
      containerStyle={
        props.containerStyle !== undefined ? { ...props.containerStyle } : {}
      }
    >
      <Box width={"100%"}>
        {/* {props.secondTitle !== undefined && passwordStep === 1  ? (
					props.secondTitle
				) : ( */}
        <Box
          display={
            props.useHideTitle === true && (passwordStep > 0 || idStep > 0)
              ? "none"
              : "block"
          }
          width={"100%"}
          sx={
            props.titleBoxStyle !== undefined
              ? props.useHideTitle === true && passwordStep === 1
                ? Object.assign(
                    {
                      ...props.titleBoxStyle,
                    },
                    {
                      mb: 10,
                    }
                  )
                : {
                    ...props.titleBoxStyle,
                  }
              : {
                  mb:
                    props.useHideTitle === true && passwordStep === 1 ? 10 : 1,
                }
          }
        >
          <Typography
            variant={
              props.titleVariant !== undefined ? props.titleVariant : "h6"
            }
            sx={{
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            {(() => {
              let mainTitle: string = "";
              if (passwordStep === 1) {
                mainTitle = "비밀번호 재설정";
              } else {
                mainTitle = "계정 찾기";
              }
              return mainTitle;
            })()}
            {/* {passwordStep === 1 ? "비밀번호 재설정" :"계정 찾기"} */}
          </Typography>
        </Box>
        {/* )} */}
        {props.secondText !== undefined &&
          passwordStep === 0 &&
          idStep === 0 &&
          props.secondText}
        {showTab === true ? (
          <TabPanel
            hideTab={
              passwordStep !== 0 && props.useHideTitle === true ? true : false
            }
            tabSelectionSectionConfig={{
              tabLabelTypographyProps: {
                color: theme.palette.grey["500"],
                variant:
                  props.tabPanelFontSize !== undefined
                    ? props.tabPanelFontSize
                    : "subtitle1",
                sx: {
                  whiteSpace: "nowrap",
                },
              },
              boxProps: {
                sx: {
                  borderBottom: `1px solid ${theme.palette.grey["300"]}`,
                },
              },
            }}
            injectedSelectedTabIndexConfig={{
              selectedTabIndex: selectedTabIndex,
              setSelectedTabIndex: setSelectedTabIndex,
            }}
            tabContents={[
              {
                title: "아이디 찾기",
                element: (
                  <FindUserName
                    findIdResult={findIdResult}
                    setFindIdResult={setFindIdResult}
                    setShowTab={setShowTab}
                    idStep={idStep}
                    setIdStep={setIdStep}
                    textFieldStyle={
                      props.textFieldStyle !== undefined
                        ? props.textFieldStyle
                        : {}
                    }
                    phoneNumberPlaceholder={
                      props.phoneNumberPlaceholder !== undefined
                        ? props.phoneNumberPlaceholder
                        : undefined
                    }
                    textTypeInputVariant={
                      props.textTypeInputVariant !== undefined
                        ? props.textTypeInputVariant
                        : undefined
                    }
                    goToLogin={
                      props.goToLogin !== undefined
                        ? props.goToLogin
                        : undefined
                    }
                    thirdText={
                      props.thirdText !== undefined
                        ? props.thirdText
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
                    setBtnColor={
                      props.setEmailBtnColor !== undefined
                        ? props.setEmailBtnColor
                        : undefined
                    }
                    emailConfirmBtn={
                      props.emailConfirmBtn !== undefined
                        ? props.emailConfirmBtn
                        : undefined
                    }
                  />
                ),
              },
              {
                title: "비밀번호 찾기",
                element: (
                  <FindPassword
                    findIdResult={findIdResult}
                    passwordStep={passwordStep}
                    setPasswordStep={setPasswordStep}
                    setShowTab={setShowTab}
                    setFindIdResult={setFindIdResult}
                    textFieldStyle={
                      props.textFieldStyle !== undefined
                        ? props.textFieldStyle
                        : {}
                    }
                    phoneNumberPlaceholder={
                      props.phoneNumberPlaceholder !== undefined
                        ? props.phoneNumberPlaceholder
                        : undefined
                    }
                    textTypeInputVariant={
                      props.textTypeInputVariant !== undefined
                        ? props.textTypeInputVariant
                        : undefined
                    }
                    goToLogin={
                      props.goToLogin !== undefined
                        ? props.goToLogin
                        : undefined
                    }
                    thirdText={
                      props.thirdText !== undefined
                        ? props.thirdText
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
                    passwordConfirmBtn={
                      props.passwordConfirmBtn !== undefined
                        ? props.passwordConfirmBtn
                        : undefined
                    }
                    setBtnColor={
                      props.setPasswordBtnColor !== undefined
                        ? props.setPasswordBtnColor
                        : undefined
                    }
                    setPasswordChangeBtnColor={
                      props.setPasswordChangeBtnColor !== undefined
                        ? props.setPasswordChangeBtnColor
                        : undefined
                    }
                    passwordChangeBtn={
                      props.passwordChangeBtn !== undefined
                        ? props.passwordChangeBtn
                        : undefined
                    }
                    emailLabel={
                      props.emailLabel !== undefined
                        ? props.emailLabel
                        : undefined
                    }
                    fourthText={
                      props.fourthText !== undefined
                        ? props.fourthText
                        : undefined
                    }
                    passwordChangeMarginBottom={
                      props.passwordChangeMarginBottom !== undefined
                        ? props.passwordChangeMarginBottom
                        : undefined
                    }
                    newPasswordLabel={
                      props.newPasswordLabel !== undefined
                        ? props.newPasswordLabel
                        : undefined
                    }
                    newPasswordPlaceholder={
                      props.newPasswordPlaceholder !== undefined
                        ? props.newPasswordPlaceholder
                        : undefined
                    }
                    newPasswordCheckLabel={
                      props.newPasswordCheckLabel !== undefined
                        ? props.newPasswordCheckLabel
                        : undefined
                    }
                    newPasswordCheckPlaceholder={
                      props.newPasswordCheckPlaceholder !== undefined
                        ? props.newPasswordCheckPlaceholder
                        : undefined
                    }
                    useEmailRegex={
                      props.useEmailRegex !== undefined
                        ? props.useEmailRegex
                        : undefined
                    }
                  />
                ),
              },
            ]}
          />
        ) : idStep > 0 ? (
          props.emailSuccessPage !== true ? (
            <Box>
              <Box
                mt={24}
                display={"flex"}
                alignItems={"center"}
                flexDirection={"column"}
                justifyContent={"center"}
              >
                <Typography
                  variant="h5"
                  sx={{
                    whiteSpace: "pre-wrap",
                    textAlign: "center",
                    mb: "12px",
                  }}
                >
                  아이디 찾기에 성공하셨습니다!
                </Typography>
                <Typography
                  sx={{
                    mb: "35px",
                    color: "#7A7A7A",
                  }}
                  variant="body1"
                >
                  고객님의 가입 정보입니다.
                </Typography>
              </Box>
              <Box
                border={`1px solid ${theme.palette.grey["100"]} `}
                borderRadius={"10px"}
                p={"20px"}
              >
                {findIdResult.map((element, index) => (
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    key={JSON.stringify(index)}
                    mt={index === 0 ? 0 : 0.666}
                  >
                    <Typography
                      variant="subtitle2"
                      color={theme.palette.grey[900]}
                    >
                      {element.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                      }}
                      variant="subtitle2"
                      color={theme.palette.grey[900]}
                    >
                      {element.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box mt={3}>
                <Button
                  color={"primary"}
                  variant={"contained"}
                  fullWidth
                  onClick={() => {
                    router.push("/auth/sign_in");
                  }}
                  endIcon={<NavigateNextIcon />}
                >
                  로그인 페이지로 이동
                </Button>
              </Box>
              <Box mt={1.5}>
                <Button
                  color={"primary"}
                  variant={"outlined"}
                  fullWidth
                  onClick={() => {
                    router.push(
                      `/auth/find_account?tab=find_password&timestamp=${new Date().getTime()}`
                    );
                  }}
                  endIcon={<NavigateNextIcon />}
                >
                  비밀번호 찾기로 이동
                </Button>
              </Box>
            </Box>
          ) : (
            (() => {
              if (props.customCallbackDict !== undefined) {
                if (props.customCallbackDict["success"] !== undefined) {
                  let item: any = {
                    email: findIdResult[1].value,
                  };
                  return props.customCallbackDict["success"](item);
                }
              }
            })()
          )
        ) : (
          passwordStep > 0 &&
          (props.passwordSuccessPage !== undefined ? (
            props.passwordSuccessPage
          ) : (
            <Box>
              <Box
                display={"flex"}
                mt={24}
                alignItems={"center"}
                flexDirection={"column"}
                justifyContent={"center"}
              >
                <Typography
                  variant="h5"
                  sx={{
                    whiteSpace: "pre-wrap",
                    textAlign: "center",
                    mb: "12px",
                  }}
                >
                  비밀번호 변경이 완료되었습니다.
                </Typography>
                <Typography
                  sx={{
                    mb: "35px",
                    color: "#7A7A7A",
                  }}
                  variant="body1"
                >
                  변경된 비밀번호로 로그인이 가능합니다.
                </Typography>
              </Box>
              <Box
                border={`1px solid ${theme.palette.grey["100"]} `}
                borderRadius={"10px"}
                p={"20px"}
              >
                {findIdResult.map((element, index) => (
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    key={JSON.stringify(index)}
                    mt={index === 0 ? 0 : 0.666}
                  >
                    <Typography
                      variant="subtitle2"
                      color={theme.palette.grey[900]}
                    >
                      {element.label}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color={theme.palette.grey[900]}
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {element.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box mt={3}>
                <Button
                  color={"primary"}
                  variant={"contained"}
                  fullWidth
                  onClick={() => {
                    router.push("/auth/sign_in");
                  }}
                  endIcon={<NavigateNextIcon />}
                >
                  로그인 페이지로 이동
                </Button>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </AccountLayout>
  );
};

export default FindAccount;
