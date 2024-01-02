import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CookieManager } from '@leanoncompany/supporti-utility';

type useLoggedInMemberProfileReturnType = {
  profile: any | null;
};

const useLoggedInMemberProfile = (memberController: any): useLoggedInMemberProfileReturnType => {
  //* Modules
  const cookieManager = new CookieManager();
  const router = useRouter();

  //* States
  const [profile, setProfile] = useState<any>(null);

  //* Hooks
  useEffect(() => {
    const accessToken = cookieManager.getItemInCookies('ACCESS_TOKEN');

    if (accessToken !== undefined) {
      memberController.getProfile(
        (res: any) => {
          setProfile(res.data.result);
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }, [router.asPath]);

  return { profile };
};

export default useLoggedInMemberProfile;
