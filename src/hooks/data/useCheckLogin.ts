import { CookieManager } from '@leanoncompany/supporti-utility';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

type useCheckLoginReturnType = {
  isLogin: boolean;
};

const useCheckLogin = (): useCheckLoginReturnType => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const cookieManager = new CookieManager();

  useEffect(() => {
    const accessToken = cookieManager.getItemInCookies('ACCESS_TOKEN');
    if (accessToken !== undefined) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [router.asPath]);

  return { isLogin };
};

export default useCheckLogin;
