import { EmotionCache } from '@emotion/react';
import { Theme } from '@mui/material';
import { IRouteLeaf } from '@leanoncompany/supporti-react-ui';
import Memory from '../../utils/data/Memory';
import { ISideBar } from '../layout/sideBar/sideBar';
import IFooterProps from '../ui/global/footer';
import { INavigatorProps } from '../ui/global/navigator';
import { IProfileProps } from '../../layout/Profile/Profile';
import React from 'react';
import { ISignIn } from '../layout/auth/auth';

export interface IEntryProps {
  customHeader?: React.ReactElement;
  disableAccountFinder?: boolean;
  disableSignUp?: boolean;
  disableSideBar?: boolean;
  noAuthRoutes?: string[];
  memory: Memory;
  loginCheckCallback?: (
    args: { [key: string]: any },
    successCallback?: (res: any) => void,
    failCallback?: (err: any) => void
  ) => void;
  useAuthCheck?: boolean;
  configs: {
    signIn?: ISignIn;
    sidebar: ISideBar;
    header: INavigatorProps;
    footer: IFooterProps;
    useFooter?: boolean;
    head: {
      title: string;
    };
  };
  anotherFooter?: React.ReactElement;
  cache: {
    emotion: EmotionCache;
    theme: Theme;
  };
  Component: any;
  pageProps: any;
  router: any;
  disableBreadCrumb?: boolean;
  containerMaxWidth?: string;
  disableGutturs?: boolean;
  containerPaddingX?: string;
  headerTags?: React.ReactElement[];
}
