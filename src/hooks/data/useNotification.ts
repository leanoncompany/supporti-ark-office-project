import { useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import { IWrappedData } from '../../@types/base/data';
import NotificationController from '../../controller/default/NotificationController';
import { DataControl } from './DataControl';
import useCheckLogin from './useCheckLogin';
import { CookieManager } from '@leanoncompany/supporti-utility';
import { TSuccessCallback, TFailCallback } from '@leanoncompany/supporti-utility/dist/@types/ICommon/ICommon';
import { AxiosResponse } from 'axios';

type useNotificationReturnType = {
  readNotification: any;
  // readNotification: (notificationId: number) => Promise<
  // 	| (() => {
  // 			promise: Promise<AxiosResponse<any, any>>;
  // 			successCallback: TSuccessCallback | undefined;
  // 			failCallback: TFailCallback | undefined;
  // 	  })
  // 	| undefined
  // >;
};

const useNotification = (
  afterReadNotificationSuccessCallback: (response: any) => void,
  afterReadNotificationFailCallback: (err: any) => void
): useNotificationReturnType => {
  //* Modules
  const cookieManager = new CookieManager();
  const notificationController = new NotificationController();
  const router = useRouter();

  const query = router.query;

  //* Functions
  const readNotification = (notificationId: number) => {
    return notificationController.readNotification(
      notificationId,
      afterReadNotificationSuccessCallback,
      afterReadNotificationFailCallback
    );
  };

  //* Hooks
  useEffect(() => {
    if (query?.notification_id !== undefined) {
      const accessToken = cookieManager.getItemInCookies('ACCESS_TOKEN');

      if (accessToken !== undefined) {
        notificationController.readNotification(
          query.notification_id as any,
          afterReadNotificationSuccessCallback,
          afterReadNotificationFailCallback
        );
      }
    }
  }, [router.asPath]);

  return { readNotification };
};

export default useNotification;
