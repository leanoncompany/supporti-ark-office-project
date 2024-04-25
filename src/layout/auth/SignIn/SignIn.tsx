import React from 'react';
import { ISignIn } from '../../../@types/layout/auth/auth';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { TextTypeInput } from '@leanoncompany/supporti-react-ui';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import { useRouter } from 'next/router';
import AuthController from '../../../controller/default/AuthController';
import { CookieManager } from '@leanoncompany/supporti-utility';
import AccountLayout from '../../AccountLayout';
// type Props = {};

const SignIn = (props: ISignIn) => {
  const cookieManager = new CookieManager();

  const theme = useTheme();

  const router = useRouter();
  const [userName, setUserName] = React.useState<string>('');
  const [userNameInputStatus, setUserNameInputStatus] = React.useState<{
    status: string;
  }>({
    status: 'default',
  });

  const [password, setPassword] = React.useState<string>('');
  const [passwordInputStatus, setPasswordInputStatus] = React.useState<{
    status: string;
  }>({
    status: 'default',
  });

  const handleLogin = () => {
    let isValidated = true;

    if (userName.length === 0) {
      isValidated = false;
      setUserNameInputStatus({ status: 'required' });
    }

    if (password.length === 0) {
      isValidated = false;
      setPasswordInputStatus({ status: 'required' });
    }

    if (isValidated === true) {
      if (props.signInCallback !== undefined) {
        props.signInCallback({
          USER_NAME: userName,
          PASSWORD: password,
        });
      } else {
        const authController = new AuthController();

        authController.signIn(
          { USER_NAME: userName, PASSWORD: password },
          (response: any) => {
            if (response.data.status === 200) {
              cookieManager.setItemInCookies('ACCESS_TOKEN', response.data.result.accessToken, {
                path: '/',
                maxAge: props.tokenExpireHours * 3600,
              });
              cookieManager.setItemInCookies('REFRESH_TOKEN', response.data.result.refreshToken, {
                path: '/',
                maxAge: props.tokenExpireHours * 3600,
              });

              props.additionalSignInSuccessCallback !== undefined &&
                props.additionalSignInSuccessCallback(response.data.result);

              window.location.href = props.signInSuccessLink !== undefined ? props.signInSuccessLink : '/';

              alert('로그인 성공하셨습니다.');
            } else if (response.data.status === 500) {
              alert('등록된 회원이 아닙니다.');
            }
          },
          (err: any) => {
            alert('로그인에 실패하셨습니다.');
          }
        );
      }
    }
  };

  return (
    <AccountLayout>
      <Box display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
        <Box width={'100%'}>
          <Box width={'100%'}>
            <Typography variant={'h6'} fontWeight={'600'} textAlign={'center'}>
              로그인
            </Typography>
          </Box>
          <Box mt={3} width={'100%'}>
            <TextTypeInput
              fullWidth
              maxLength={20}
              placeholder={'아이디를 입력해주세요.'}
              value={userName}
              setValue={setUserName}
              inputCaptionConfig={{
                status: userNameInputStatus,
                errorMessage: '',
                requiredMessage: '아이디를 입력해주세요.',
              }}
              adornmentPosition={'start'}
              adornmentElement={<PermIdentityIcon fontSize="small" />}
              // onEnter={() => {
              // 	props.handleLogin(userName, password);
              // }}
              onChangeCallback={(args: any) => {
                if (args.event.target.value.length > 0) {
                  setUserNameInputStatus({
                    status: 'default',
                  });
                }
              }}
            />
          </Box>
          <Box mt={1} width={'100%'}>
            <TextTypeInput
              fullWidth
              maxLength={20}
              type={'password'}
              placeholder={'비밀번호를 입력해주세요.'}
              value={password}
              setValue={setPassword}
              adornmentPosition={'start'}
              adornmentElement={<HttpsOutlinedIcon fontSize="small" />}
              inputCaptionConfig={{
                status: passwordInputStatus,
                errorMessage: '',
                requiredMessage: '비밀번호를 입력해주세요.',
              }}
              onChangeCallback={(args: any) => {
                if (args.event.target.value.length > 0) {
                  setPasswordInputStatus({
                    status: 'default',
                  });
                }
              }}
              onEnter={() => {
                handleLogin();
              }}
            />
          </Box>
          <Box mb={1} width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            {props.findInfo !== undefined && (
              <Button
                variant="text"
                onClick={() => {
                  if (props.findInfo !== undefined) {
                    router.push(props.findInfo.link);
                  }
                }}>
                <Typography
                  variant="subtitle1"
                  color={theme.palette.grey[800]}
                  sx={{
                    textDecoration: 'underline',
                  }}>
                  계정 찾기
                </Typography>
              </Button>
            )}

            {props.signUp !== undefined && (
              <Button
                variant="text"
                onClick={() => {
                  if (props.signUp !== undefined) {
                    router.push(props.signUp.link);
                  }
                }}>
                <Typography
                  variant="subtitle1"
                  color={theme.palette.grey[800]}
                  sx={{
                    textDecoration: 'underline',
                  }}>
                  회원가입
                </Typography>
              </Button>
            )}
          </Box>
          <Box width={'100%'} mt={1}>
            <Button variant={'contained'} fullWidth onClick={() => handleLogin()}>
              로그인
            </Button>
          </Box>
        </Box>
      </Box>
    </AccountLayout>
  );
};

export default SignIn;
