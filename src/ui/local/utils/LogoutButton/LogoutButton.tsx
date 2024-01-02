import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';

import { IconButton, Button, Tooltip } from '@mui/material';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { CookieManager } from '@leanoncompany/supporti-utility';

const LogoutButton = () => {
  //* Modules
  const cookieManager = new CookieManager();
  const router = useRouter();

  //* States
  const onClickLogout = () => {
    cookieManager.removeItemInCookies('ACCESS_TOKEN', {
      path: '/',
    });
    cookieManager.removeItemInCookies('REFRESH_TOKEN', {
      path: '/',
    });
    alert('로그아웃 되었습니다.');
    router.push('/auth/sign_in');
  };

  return (
    <React.Fragment>
      <Tooltip title="로그아웃">
        <IconButton
          onClick={() => {
            onClickLogout();
          }}>
          <ExitToAppRoundedIcon fontSize="medium" />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
};

export default LogoutButton;
