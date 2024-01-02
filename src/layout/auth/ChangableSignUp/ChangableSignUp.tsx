import { Box, Button, Typography } from '@mui/material';
import { IUserInputStatus, TextTypeInput } from '@leanoncompany/supporti-react-ui';
import React, { SetStateAction, useState } from 'react';
import { ISignUp } from '../../../@types/layout/auth/auth';
import AuthController from '../../../controller/default/AuthController';
import PhoneAuth from '../FindAccount/PhonAuth';
import { useRouter } from 'next/router';
import RegistBankAccount from '../../RegistBankAccount';
import AccountLayout from '../../AccountLayout';
import { Value } from 'react-quill';
import { IUserInputCaption } from '../../../@types/external/qillieReactUi';

export interface IInputs {
  placeholder: string;
  maxLength?: number;
  rows?: number;
  type?: 'text' | 'password' | undefined;
  value: string;

  padding: string;
  borderRadius?: string;
  borderLeft?: string;
  borderRight?: string;
  borderTop?: string;
  borderBottom?: string;
  setValue: React.Dispatch<SetStateAction<string>>;
  label: string;
  labelFontSize:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'button'
    | 'overline'
    | 'inherit'
    | undefined;
  labelFontWeight: string;
  inputFontSize: string;
  inputCaptionConfig: Partial<IUserInputCaption>;
  // inputStatus: IUserInputStatus;
  setInputStatus: React.Dispatch<React.SetStateAction<IUserInputStatus>>;
  require: boolean;
  variant: 'standard' | 'filled' | 'outlined' | undefined;
  inputColor: string;
  // 라벨 간격
  labelMargin: string;
  // 인풋간 간격
  inputMargin: string;
}

export interface IChangableSignUp {
  // 박스 크기
  containerWidth: string;

  // 상단 글
  title: string;
  titleVariant:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'button'
    | 'overline'
    | 'inherit'
    | undefined;
  titleFontWeight: string;
  titleMarginTop: string;
  titleMarginBottom: string;

  // 인풋 관련
  stringInputItem: IInputs[];

  // 약관 동의

  terms?: React.ReactElement;
  termsMarginTop?: string;
  termsMarginBottom?: string;

  // 가입 버튼
  signUpBtn: React.ReactElement;
  signUpBtnMarginTop?: string;
  signUpBtnMarginBottom?: string;

  phoneAuthSection?: React.ReactElement;

  // 버튼
  handleOnClick: () => void;
}

const ChangableSignUp = (props: IChangableSignUp) => {
  const renderInput = (data: IInputs) => {
    return (
      <Box display={'flex'} flexDirection={'column'} mb={data.inputMargin}>
        <Box mb={data.labelMargin}>
          <Typography variant={data.labelFontSize} fontWeight={data.labelFontWeight}>
            {data.label} {data.require && <span style={{ color: 'black' }}>*</span>}
          </Typography>
        </Box>
        <TextTypeInput
          fullWidth
          maxLength={data.maxLength}
          rows={data.rows}
          inputCaptionConfig={data.inputCaptionConfig}
          type={data.type}
          placeholder={data.placeholder}
          value={data.value}
          setValue={data.setValue}
          variant={data.variant}
          textFieldStyle={{
            backgroundColor: '#ffffff',
            '.MuiInput-input': {
              padding: data.padding,
              color: data.inputColor,
              fontSize: data.inputFontSize,
            },
            '.MuiInput-root:before': {
              borderBottom: data.borderBottom,
              borderLeft: data.borderLeft,
              borderRight: data.borderRight,
              borderTop: data.borderTop,
            },
            '.MuiInputBase-input-MuiInput-input': {
              borderBottom: 0,
            },
          }}
          onChangeCallback={(args: any) => {
            if (args.event.target.value.length > 0) {
              data.setInputStatus({
                status: 'default',
              });
            }
          }}
          onEnter={() => {
            props.handleOnClick();
          }}
        />
      </Box>
    );
  };

  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
      <Box minWidth={{ md: props.containerWidth, xs: '340px' }} maxWidth={{ md: props.containerWidth, xs: '340px' }}>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          mt={props.titleMarginTop}
          mb={props.titleMarginBottom}>
          <Typography variant={props.titleVariant} fontWeight={props.titleFontWeight}>
            {props.title}
          </Typography>
        </Box>
        <Box display={'flex'} flexDirection={'column'}>
          {props.stringInputItem.map((inputEl: IInputs) => renderInput(inputEl))}
        </Box>
        <Box>{props.phoneAuthSection}</Box>
        <Box mb={props.termsMarginBottom} mt={props.termsMarginTop}>
          {props.terms}
        </Box>
        <Box mb={props.signUpBtnMarginBottom} mt={props.signUpBtnMarginTop}>
          {props.signUpBtn}
        </Box>
      </Box>
    </Box>
  );
};

export default ChangableSignUp;
