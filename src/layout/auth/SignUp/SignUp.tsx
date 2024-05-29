import { Box, Button, Typography } from "@mui/material";
import {
  IUserInputStatus,
  TextTypeInput,
} from "@leanoncompany/supporti-react-ui";
import React, { SetStateAction, useState } from "react";
import { ISignUp } from "../../../@types/layout/auth/auth";
import AuthController from "../../../controller/default/AuthController";
import PhoneAuth from "../FindAccount/PhonAuth";
import { useRouter } from "next/router";
import RegistBankAccount from "../../RegistBankAccount";
import AccountLayout from "../../AccountLayout";

// type Props = {};

const SignUp = (props: ISignUp) => {
  const router = useRouter();

  const [userName, setUserName] = useState<string>("");
  const [userNameInputStatus, setUserNameInputStatus] =
    useState<IUserInputStatus>({
      status: "default",
    });

  const [alreadyExistUserName, setAlreadyExistUserName] =
    useState<boolean>(false);

  const [password, setPassword] = useState<string>("");
  const [passwordInputStatus, setPasswordInputStatus] =
    useState<IUserInputStatus>({
      status: "default",
    });

  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [passwordConfirmInputStatus, setPasswordConfirmInputStatus] =
    useState<IUserInputStatus>({
      status: "default",
    });

  const [fullName, setFullName] = useState<string>("");
  const [fullNameInputStatus, setFullNameInputStatus] =
    useState<IUserInputStatus>({
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

  const [recommenderCode, setRecommenderCode] = useState<string>("");
  const [recommenderCodeInputStatus, setRecommenderCodeInputStatus] =
    useState<IUserInputStatus>({
      status: "default",
    });

  const [bankType, setBankType] = useState<string | undefined>();

  const [bankAccount, setBankAccount] = useState<string>("");
  const [bankAccountInputStatus, setBankAccountInputStatus] =
    useState<IUserInputStatus>("default");

  const renderTextTypeInput = (renderData: {
    placeholder: string;
    errorMessage: string;

    label: string;
    value: string;
    setValue: React.Dispatch<SetStateAction<string>>;
    inputStatus: IUserInputStatus;
    setInputStatus: React.Dispatch<SetStateAction<IUserInputStatus>>;
    adornmentPosition?: "start" | "end";
    adornmentElement?: JSX.Element;
    requiredMessage?: string;
    types?: string;
    maxLength?: number;
    passedMessage?: string;
  }) => {
    return (
      <Box mb={1.5}>
        <TextTypeInput
          fullWidth
          maxLength={
            renderData.maxLength !== undefined ? renderData.maxLength : 20
          }
          labelConfig={{
            position: "outer",
            label: renderData.label,
            typograhpyVariant: "body1",
          }}
          placeholder={renderData.placeholder}
          value={renderData.value}
          setValue={renderData.setValue}
          inputCaptionConfig={{
            status: renderData.inputStatus,
            errorMessage:
              renderData.errorMessage !== undefined
                ? renderData.errorMessage
                : "올바르게 입력해주세요",
            secondErrorMessage: "이미 존재하는 아이디입니다.",
            requiredMessage:
              renderData.requiredMessage !== undefined
                ? renderData.requiredMessage
                : "통과되었습니다.",
            passedMessage:
              renderData.passedMessage !== undefined
                ? renderData.passedMessage
                : "통과되었습니다.",
          }}
          type={renderData.types !== undefined ? "password" : "text"}
          adornmentElement={renderData.adornmentElement}
          adornmentPosition={renderData.adornmentPosition}
          onChangeCallback={(args: any) => {
            if (args.event.target.value.length > 0) {
              renderData.setInputStatus({
                status: "default",
              });
            }
          }}
        />
      </Box>
    );
  };

  /**
   * Functions
   */
  // * 10자리 랜덤 스트링
  const generateRandomString = (length: number): string => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }
    return result;
  };

  //* 아이디 중복 확인 함수
  const onClickDoubleCheckUserNameButton = () => {
    if (/^[a-z0-9]{6,19}$/.test(userName) === false) {
      setUserNameInputStatus({ status: "error" });
    } else {
      if (props.doubleCheckUserNameCallback !== undefined) {
        props.doubleCheckUserNameCallback({
          USER_NAME: userName,
        });
      } else {
        const authController = new AuthController();

        authController.doubleCheckUserName(
          { USER_NAME: userName },
          (response: any) => {
            if (response.data.result === true) {
              setAlreadyExistUserName(true);
              setUserNameInputStatus({ status: "passed" });
            } else {
              setUserNameInputStatus({ status: "required" });
            }
          },
          (err: any) => {
            console.log(err);
          }
        );
      }
    }
  };

  const signUpClicked = (isValidate?: boolean) => {
    let isValidated = isValidate !== undefined ? isValidate : true;

    if (/^[a-z0-9]{5,19}$/.test(userName) === false) {
      isValidate = false;
      setUserNameInputStatus({ status: "error" });
    } else {
      // 아이디 중복
      if (alreadyExistUserName === false) {
        isValidated = false;
        setUserNameInputStatus({ status: "required" });
      }
    }

    if (password.length == 0) {
      isValidated = false;
      setPasswordInputStatus({ status: "error" });
    }

    // 비밀번호, 비밀번호 확인 같은지
    if (password !== passwordConfirm) {
      isValidated = false;
      setPasswordConfirmInputStatus({ status: "required" });
    }

    if (fullName.length == 0) {
      isValidated = false;
      setFullNameInputStatus({ status: "error" });
    }

    if (props.usePhone === true) {
      if (
        /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/.test(phoneNumber) === false
      ) {
        isValidated = false;
        setPhoneNumberInputStatus({ status: "error" });
      }

      if (authorizeStatus !== "success") {
        isValidated = false;
        setVerifyCodeInputStatus({ status: "error" });
      }
    }

    if (props.useBankAccount === true) {
      if (bankType === undefined) {
        isValidated = false;
        alert("은행을 선택해주세요.");
      }
      if (bankAccount.length === 0) {
        isValidated = false;
        alert("계좌번호를 확인해주세요");
      }
    }

    if (isValidated) {
      let args: { [key: string]: any } = {
        USER_NAME: userName,
        PASSWORD: password,
        PHONE_NUMBER: phoneNumber,
        FULL_NAME: fullName,
      };

      if (props.useRecommender === true && recommenderCode.length >= 0) {
        args = {
          ...args,
          INPUT_RECOMMENDER_CODE: recommenderCode,
          MY_RECOMMENDER_CODE: userName,
        };
      }

      if (bankType !== undefined) {
        if (bankAccount.length >= 0) {
          args = {
            ...args,
            ACCOUNT_CODE: bankType,
            ACCOUNT_NUMBER: bankAccount,
          };
        }
      }

      const signUpCallback = (customizedArgs?: { [key: string]: any }) => {
        if (props.signUpCallback !== undefined) {
          props.signUpCallback(
            Object.assign(
              args,
              customizedArgs !== undefined ? customizedArgs : {}
            )
          );
        } else {
          const authController = new AuthController();

          const signUp = () => {
            authController.signUp(
              Object.assign(
                args,
                customizedArgs !== undefined ? customizedArgs : {}
              ),
              (response: any) => {
                if (props.afterSignUpCallback !== undefined) {
                  props.afterSignUpCallback(
                    response.data.result,
                    Object.assign(
                      args,
                      customizedArgs !== undefined ? customizedArgs : {}
                    )
                  );
                }

                alert("회원가입 성공하셨습니다. 로그인 후 이용해주세요!");
                router.push("/auth/sign_in");
              }
            );
          };

          if (props.usePhone === true) {
            authController.isPhoneNumberUsed(
              { PHONE_NUMBER: phoneNumber },
              (response) => {
                if (response.data.result === true) {
                  signUp();
                } else {
                  alert("이미 사용중인 휴대폰 번호입니다.");
                }
              },
              (err) => {
                console.log(err);
              }
            );
          } else {
            signUp();
          }
        }
      };

      if (props.injectedSignUpValidationCallback !== undefined) {
        props.injectedSignUpValidationCallback(signUpCallback, args);
      } else {
        signUpCallback();
      }
    }
  };

  return (
    <AccountLayout>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        width={"100%"}
      >
        <Box width={"100%"}>
          <Box>
            <Typography
              variant={"h6"}
              fontWeight={"600"}
              mb={3}
              textAlign={"center"}
            >
              회원가입
            </Typography>
          </Box>
          {renderTextTypeInput({
            placeholder: "아이디를 입력해주세요",
            errorMessage: "올바른 아이디를 입력해주세요(6자 이상, 숫자,영문 )",
            requiredMessage: "이미 사용중인 아이디입니다.",
            passedMessage: "사용 가능한 아이디입니다.",
            label: "아이디",
            value: userName,
            setValue: setUserName,
            inputStatus: userNameInputStatus,
            setInputStatus: setUserNameInputStatus,
            adornmentPosition: "end",
            adornmentElement: (
              <Button variant="text" onClick={onClickDoubleCheckUserNameButton}>
                <Typography
                  variant="subtitle2"
                  sx={{ textDecoration: "underline" }}
                  color={"black"}
                >
                  중복확인
                </Typography>
              </Button>
            ),
          })}
          {renderTextTypeInput({
            placeholder: "비밀번호를 입력해주세요",
            errorMessage: "올바른 비밀번호를 입력해주세요",
            requiredMessage: "비밀번호를 입력하셔야합니다.",
            label: "비밀번호",
            value: password,
            setValue: setPassword,
            inputStatus: passwordInputStatus,
            setInputStatus: setPasswordInputStatus,
            types: "password",
          })}
          {renderTextTypeInput({
            placeholder: "비밀번호 확인",
            errorMessage: "올바른 비밀번호를 입력해주세요",
            requiredMessage: "비밀번호가 서로 일치하지 않습니다",
            label: "비밀번호 확인",
            value: passwordConfirm,
            setValue: setPasswordConfirm,
            inputStatus: passwordConfirmInputStatus,
            setInputStatus: setPasswordConfirmInputStatus,
            types: "password",
          })}
          {renderTextTypeInput({
            placeholder: "이름을 입력해주세요",
            errorMessage: "올바른 이름을 입력해주세요",
            requiredMessage: "이름을 입력하셔야합니다.",
            label: "이름",
            value: fullName,
            setValue: setFullName,
            inputStatus: fullNameInputStatus,
            maxLength: 10,
            setInputStatus: setFullNameInputStatus,
          })}

          {/* <Box width={'100%'} mb={1}> */}
          {props.useBankAccount === true && (
            <RegistBankAccount
              bankAccount={bankAccount}
              setBankAccount={setBankAccount}
              bankAccountInputStatus={bankAccountInputStatus}
              bankType={bankType}
              setBankAccountInputStatus={setBankAccountInputStatus}
              setBankType={setBankType}
            />
          )}
          {/* </Box> */}
          {props.data !== undefined &&
            props.data.map((element, index) => {
              return (
                <Box key={JSON.stringify(index)} mb={3}>
                  <TextTypeInput
                    fullWidth
                    maxLength={20}
                    placeholder={element.placeholder}
                    value={element.value}
                    setValue={element.setValue}
                    labelConfig={{
                      position: "outer",
                      label: element.label,
                    }}
                    inputCaptionConfig={{
                      status: element.inputStatus,
                      errorMessage: "",
                      requiredMessage: "올바르게 입력해주세요.",
                    }}
                    adornmentElement={element.adornmentElement}
                    adornmentPosition={element.adornmentPosition}
                    onChangeCallback={(args: any) => {
                      if (args.event.target.value.length > 0) {
                        element.setInputStatus({
                          ...element.inputStatus,
                          status: "default",
                        });
                      }
                    }}
                  />
                </Box>
              );
            })}
          {/* <Box width={'100%'} mb={1}> */}
          {props.usePhone === true && (
            <PhoneAuth
              verifyInputStatus={verifyCodeInputStatus}
              setVerifyInputStatus={setVerifyCodeInputStatus}
              authorizeStatus={authorizeStatus}
              setAuthorizeStatus={setAuthorizeStatus}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              phoneNumberInputStatus={phoneNumberInputStatus}
              setPhoneNumberInputStatus={setPhoneNumberInputStatus}
            />
          )}

          {/* Additional Data */}
          <Box>
            {props.additionalInputs !== undefined && props.additionalInputs}
          </Box>

          {/* </Box> */}
          {props.useRecommender === true &&
            renderTextTypeInput({
              placeholder: "추천인 코드를 입력해주세요",
              errorMessage: "올바른 추천인 코드를 입력해주세요",
              requiredMessage: "추천인 코드를 입력하셔야합니다.",
              label: "추천인 코드",
              value: recommenderCode,
              setValue: setRecommenderCode,
              inputStatus: recommenderCodeInputStatus,
              setInputStatus: setRecommenderCodeInputStatus,
            })}
          <Box mt={4}>
            <Button
              onClick={() =>
                props.handleSignUp !== undefined
                  ? props.handleSignUp(signUpClicked)
                  : signUpClicked()
              }
              variant={"contained"}
              fullWidth
            >
              회원가입
            </Button>
          </Box>
        </Box>
      </Box>
    </AccountLayout>
  );
};

export default SignUp;
