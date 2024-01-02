import { SxProps, Theme } from '@mui/material';

export interface IInnerLabel extends ILabelConfig {}
export interface IOuterLabel extends Partial<ILabelConfig> {
	children: JSX.Element;
}
export interface IUserInputCaption {
	status: IUserInputStatus;
	defaultMessage?: string;
	requiredMessage?: string;
	secondRequiredMessage?: string;
	errorMessage?: string;
	secondErrorMessage?: string;
	passedMessage?: string;
}
export interface IUserInputStatus {
	status: 'default' | 'passed' | 'required' | 'error' | 'error2';
}

export interface ILabelConfig {
	position: 'outer' | 'inner';
	label: string;
	wrapperStyle?: { [key: string]: any };
	typograhpyVariant?:
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
	typographySx?: SxProps<Theme>;
}

export interface IInputCore_EXTENDED {
	inputStatus: IUserInputStatus;
	width?: number | string;
	labelConfig?: IInnerLabel | IOuterLabel;
	inputCaptionConfig?: Partial<IUserInputCaption>;
}
