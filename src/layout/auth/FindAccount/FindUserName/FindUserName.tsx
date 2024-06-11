import React, { cloneElement } from 'react';
import { Box, BoxProps, Button, Grid, SxProps, Theme } from '@mui/material';
// import moment from 'moment';
import { Dispatch, useState } from 'react';
import {
	CSSSelectorObjectOrCssVariables,
	SystemCssProperties,
	SystemStyleObject,
} from '@mui/system';

// import PhoneAuthSection from "../../../modules/auth/PhoneAuthSection";

import PhoneAuth from '../PhonAuth';
import AuthController from '../../../../controller/default/AuthController';
import moment from 'moment';

interface IFindUserName {
	setShowTab: Dispatch<React.SetStateAction<boolean>>;
	setFindIdResult: Dispatch<
		React.SetStateAction<{ label: string; value: string }[]>
	>;
	idStep: number;
	setIdStep: Dispatch<React.SetStateAction<number>>;
	findIdResult: {
		label: string;
		value: string;
	}[];

	// 유저 타입
	userType?: string;

	// 텍스트 타입
	textFieldStyle?:
		| SystemCssProperties<Theme>
		| CSSSelectorObjectOrCssVariables<Theme>
		| ((theme: Theme) => SystemStyleObject<Theme>)
		| readonly (
				| boolean
				| SystemStyleObject<Theme>
				| ((theme: Theme) => SystemStyleObject<Theme>)
		  )[]
		| null
		| undefined;

	thirdText?: React.ReactElement;

	textTypeInputVariant?: 'standard' | 'filled' | 'outlined' | undefined;

	typographyFontWeight?: string;
	typographyVariant?:
		| 'button'
		| 'caption'
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
		| 'overline'
		| 'inherit';
	boxStyle?: BoxProps;
	labelBoxStyle?: BoxProps;
	// 인증번호 보내기 버튼 스타일
	sendVerifyCodeButtonStyle?: SxProps<Theme>;
	sendVerifyCodeButtonText?: string;

	phoneNumberPlaceholder?: string;

	// 인증하기 버튼 스타일
	buttonStyle?: SxProps<Theme>;
	disableButton?: boolean;

	// 전화번호 휴대전화  텍스트
	phoneNumberLabel?: string;

	findBtnText?: string;
	findBtnStyle?: SxProps<Theme>;
	goToLogin?: React.ReactElement;

	setBtnColor?: React.Dispatch<React.SetStateAction<boolean>>;

	emailConfirmBtn?: React.ReactElement;
}

const FindUserName = (props: IFindUserName) => {
	/**
	 * theme
	 */
	// const theme = useTheme();

	/**
	 * 이름 전화번호 인증번호코드 state
	 */

	// const [name, setName] = useState<string>('');
	// const [nameInputStatus, setNameInputStatus] = useState<{ status: string }>({
	// 	status: 'default',
	// });

	const authController = new AuthController();

	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [phoneNumberInputStatus, setPhoneNumberInputStatus] = useState<{
		status: string;
	}>({ status: 'default' });

	const [verifyCodeInputStatus, setVerifyCodeInputStatus] = useState<{
		status: string;
	}>({ status: 'default' });

	const [authorizeStatus, setAuthorizeStatus] = React.useState<
		'default' | 'sended' | 'success'
	>('default');

	/**
	 * 함수
	 */
	const onClickFindIdBtn = () => {
		let isValidate = true;

		if (
			/^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/.test(phoneNumber) ===
			false
		) {
			isValidate = false;
			setPhoneNumberInputStatus({ status: 'error' });
		}

		if (authorizeStatus !== 'success') {
			isValidate = false;
			setVerifyCodeInputStatus({ status: 'error' });
		}

		if (isValidate) {
			authController.findUserName(
				{ PHONE_NUMBER: phoneNumber },
				(response: any) => {
					if (response.data.status === 500) {
						alert('존재하지 않는 회원입니다.');
					} else if (response.data.status === 200) {
						let cloneList = [...props.findIdResult];
						cloneList[0].value = moment(
							response.data.result.CREATED_AT
						).format('YYYY.MM.DD');
						cloneList[1].value = response.data.result.USER_NAME;
						props.setIdStep(props.idStep + 1);
						props.setShowTab(false);
						props.setFindIdResult(cloneList);
					}
				},
				(err: any) => {
					alert('존재하지 않는 회원입니다.');
				}
			);
		}
	};

	return (
		<React.Fragment>
			{props.idStep === 0 && (
				<Box mt={3}>
					<Grid container>
						<Grid item md={12} xs={12}>
							<PhoneAuth
								phoneNumber={phoneNumber}
								setPhoneNumber={setPhoneNumber}
								phoneNumberInputStatus={phoneNumberInputStatus}
								setPhoneNumberInputStatus={
									setPhoneNumberInputStatus
								}
								verifyInputStatus={verifyCodeInputStatus}
								setVerifyInputStatus={setVerifyCodeInputStatus}
								authorizeStatus={authorizeStatus}
								setAuthorizeStatus={setAuthorizeStatus}
								textFieldStyle={
									props.textFieldStyle !== undefined
										? props.textFieldStyle
										: {}
								}
								textTypeInputVariant={
									props.textTypeInputVariant !== undefined
										? props.textTypeInputVariant
										: undefined
								}
								typographyFontWeight={
									props.typographyFontWeight !== undefined
										? props.typographyFontWeight
										: undefined
								}
								typographyVariant={
									props.typographyVariant !== undefined
										? props.typographyVariant
										: undefined
								}
								boxStyle={
									props.boxStyle !== undefined
										? props.boxStyle
										: undefined
								}
								labelBoxStyle={
									props.labelBoxStyle !== undefined
										? props.labelBoxStyle
										: undefined
								}
								sendVerifyCodeButtonStyle={
									props.sendVerifyCodeButtonStyle !==
									undefined
										? props.sendVerifyCodeButtonStyle
										: undefined
								}
								buttonStyle={
									props.buttonStyle !== undefined
										? props.buttonStyle
										: undefined
								}
								disableButton={
									props.disableButton !== undefined
										? props.disableButton
										: undefined
								}
								phoneNumberLabel={
									props.phoneNumberLabel !== undefined
										? props.phoneNumberLabel
										: undefined
								}
								sendVerifyCodeButtonText={
									props.sendVerifyCodeButtonText !== undefined
										? props.sendVerifyCodeButtonText
										: undefined
								}
								phoneNumberPlaceholder={
									props.phoneNumberPlaceholder !== undefined
										? props.phoneNumberPlaceholder
										: undefined
								}
								setBtnColor={
									props.setBtnColor !== undefined
										? props.setBtnColor
										: undefined
								}
								useDuplicate={false}
							/>
						</Grid>

						{props.thirdText !== undefined && props.thirdText}

						<Grid
							item
							md={12}
							xs={12}
							mt={props.emailConfirmBtn !== undefined ? 0 : 5}
						>
							<Box width={'100%'}>
								{props.emailConfirmBtn !== undefined ? (
									cloneElement(props.emailConfirmBtn, {
										onClick: () => {
											onClickFindIdBtn();
										},
									})
								) : (
									<Button
										fullWidth
										color={'primary'}
										variant={'contained'}
										sx={
											props.findBtnStyle !== undefined
												? { ...props.findBtnStyle }
												: {
														marginBottom: 2,
												  }
										}
										onClick={() => {
											onClickFindIdBtn();
										}}
									>
										{props.findBtnText !== undefined
											? props.findBtnText
											: '아이디 찾기'}
									</Button>
								)}
							</Box>
						</Grid>
						{props.goToLogin !== undefined && props.goToLogin}
					</Grid>
				</Box>
			)}
		</React.Fragment>
	);
};

export default FindUserName;
