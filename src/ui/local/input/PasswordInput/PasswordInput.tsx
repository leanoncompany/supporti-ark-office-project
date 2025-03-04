import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { TextTypeInput } from "@leanoncompany/supporti-react-ui";
import { AddressPicker } from "@leanoncompany/supporti-react-ui";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import Grid2 from "@mui/material/Unstable_Grid2";

interface IPasswordInputProps {
  commonTextAreaConfigs: any;
  passwordInputStatus: any;
  setPasswordInputStatus?: React.Dispatch<React.SetStateAction<any>>;
  passwordConfirm: any;
  setPasswordConfirm?: React.Dispatch<React.SetStateAction<any>>;
  passwordConfirmInputStatus: any;
  setPasswordConfirmInputStatus?: React.Dispatch<React.SetStateAction<any>>;
}

const PasswordInput = (props: IPasswordInputProps) => {
  //* Modules
  const theme = useTheme();

  //* States
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<boolean>(false);

  return (
    <Box>
      <Grid2 container spacing={1}>
        <Grid2 item xs={12} md={6}>
          <TextTypeInput
            {...props.commonTextAreaConfigs}
            type={showPassword ? "text" : "password"}
            placeholder={"비밀번호를 입력해주세요."}
            inputCaptionConfig={Object.assign(
              {
                status: props.passwordInputStatus,
              },
              {
                requiredMessage: "비밀번호는 필수값입니다.",
                errorMessage:
                  "최소 10자, 최대 20자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자가 필요합니다.",
              }
            )}
            onChangeCallback={(args: any) => {
              if (props.setPasswordInputStatus !== undefined) {
                props.setPasswordInputStatus({
                  status: "default",
                });
              }

              if (props.setPasswordConfirmInputStatus !== undefined) {
                props.setPasswordConfirmInputStatus({
                  status: "default",
                });
              }
            }}
            adornmentPosition={"end"}
            adornmentElement={
              <IconButton
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <VisibilityOffRoundedIcon />
                ) : (
                  <VisibilityRoundedIcon />
                )}
              </IconButton>
            }
          />
        </Grid2>

        <Grid2 item xs={12} md={6}>
          <TextTypeInput
            {...props.commonTextAreaConfigs}
            value={props.passwordConfirm}
            setValue={props.setPasswordConfirm}
            labelConfig={{
              position: "outer",
              label: "비밀번호 확인",
            }}
            type={showPasswordConfirm ? "text" : "password"}
            placeholder={"비밀번호를 다시 입력해주세요."}
            inputCaptionConfig={{
              status: props.passwordConfirmInputStatus,
              errorMessage:
                "알파벳 소문자, 숫자, 특수문자를 한개이상 포함하여 5 ~ 20글자여야 합니다 (한글 X)",
              requiredMessage: "비밀번호가 일치하지 않습니다",
            }}
            onChangeCallback={(args: any) => {
              if (props.setPasswordConfirmInputStatus !== undefined) {
                props.setPasswordConfirmInputStatus({
                  status: "default",
                });
              }
            }}
            adornmentPosition={"end"}
            adornmentElement={
              <IconButton
                onClick={() => {
                  setShowPasswordConfirm(!showPasswordConfirm);
                }}
              >
                {showPasswordConfirm ? (
                  <VisibilityOffRoundedIcon />
                ) : (
                  <VisibilityRoundedIcon />
                )}
              </IconButton>
            }
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default PasswordInput;
