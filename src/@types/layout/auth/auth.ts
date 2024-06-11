import { IUserInputStatus } from '@leanoncompany/supporti-react-ui';
import React, { SetStateAction } from 'react';

export interface ISignIn {
  tokenExpireHours: number;
  useAutoLogin: boolean;
  disableSignUp?: boolean;
  disableAccountFinder?: boolean;
  saveUserName: boolean;
  controller?: any;
  signUp?: {
    link: string;
    label: string;
  };
  findInfo?: {
    link: string;
    label: string;
  };
  signInSuccessLink?: string;
  signInCallback?: (args: { [key: string]: any }) => void;
  additionalSignInSuccessCallback?: (args: { [key: string]: any }) => void;
}

// export interface ISignUp {
// 	data: {
// 		[key: string]: {
// 			isRequired: boolean;
// 			placeholder: string;
// 			errorMessage: string;
// 			requiredMessage: string;
// 			uiType: string;
// 			label: string;
// 			value: string | number;
// 			setValue: React.Dispatch<SetStateAction<string | number>>;
// 			inputStatus: IUserInputStatus;
// 			setInputStatus: React.Dispatch<SetStateAction<IUserInputStatus>>;
// 			checkUserName?: (userName: string) => void;
// 			adornmentPosition?: 'start' | 'end';
// 			adornmentElement?: JSX.Element;
// 		};
// 	}[];
// }

export interface ISignUp {
  controller?: any;
  additionalInputs?: React.ReactElement;
  additionalSetValue?: (value?: any) => void;
  useRecommender?: boolean;
  useBankAccount?: boolean;
  usePhone: boolean;
  // useDuplicate?: boolean;
  data?: {
    // isRequired: boolean;
    placeholder: string;
    errorMessage: string;
    requiredMessage: string;
    uiType: string;
    label: string;
    value: string;
    setValue: React.Dispatch<SetStateAction<string>>;
    inputStatus: IUserInputStatus;
    setInputStatus: React.Dispatch<SetStateAction<IUserInputStatus>>;
    adornmentPosition?: 'start' | 'end';
    adornmentElement?: React.ReactElement;
  }[];
  handleSignUp?: (func: (isValidate?: boolean) => void) => void;
  injectedSignUpValidationCallback?: (signUpCallback: any, args: { [key: string]: any }) => void;
  afterSignUpCallback?: (result: any, args: { [key: string]: any }) => void;
  signUpCallback?: (args: { [key: string]: any }) => void;
  doubleCheckUserNameCallback?: (args: { [key: string]: any }) => void;
}
