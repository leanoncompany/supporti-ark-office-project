import { Dispatch, SetStateAction } from 'react';
import { IData, IWrappedData } from '../../@types/base/data';

export class DataControl {
	/**
	 * Set initial value
	 * @param type
	 * @param injectedInitialValue
	 * @returns
	 */
	public setInitialValue = (ui: string, injectedInitialValue?: any) => {
		let initialValue: any = null;

		if (injectedInitialValue !== undefined) {
			initialValue = injectedInitialValue;
		} else {
			switch (ui) {
				case 'autoCompleteSelector':
					initialValue = -999;
					break;

				case 'datePicker':
					initialValue = new Date();
					break;

				case 'timePicker':
					initialValue = '00:00';
					break;

				case 'textarea':
					initialValue = '';
					break;

				case 'editor':
					initialValue = '';
					break;

				case 'imageUpload':
					initialValue = [];
					break;

				case 'fileUpload':
					initialValue = [];
					break;

				case 'optionEditor':
					initialValue = [];
					break;

				case 'tagEditor':
					initialValue = [];
					break;

				case 'rating':
					initialValue = 0;
					break;

				case 'select':
					initialValue = '';
					break;

				case 'address':
					initialValue = '';
					break;

				case 'switch':
					initialValue = 'N';
					break;

				case 'bankSelector':
					initialValue = '';
					break;

				case 'keyLabelEditor':
					initialValue = [];
					break;

				default:
					initialValue = null;
			}
		}

		return initialValue;
	};

	public setExtendedStates = (
		key: string,
		setWrappedDataDict: Dispatch<
			SetStateAction<{
				[key: string]: IWrappedData;
			}>
		>,
		type?: string,
		pageRole?: string
	) => {
		let extendedStates:
			| {
					[key: string]: {
						state: any;
						setter: Dispatch<SetStateAction<any>>;
					};
			  }
			| undefined = {};

		const convertToAny = (data: any) => {
			return data as any;
		};

		let extendInfoList: { key: string; initialValue: any }[] = [];

		switch (type) {
			case 'username':
				extendInfoList = [
					{
						key: 'doubleCheckPassed',
						initialValue: pageRole == 'edit' ? true : false,
					},
				];
				break;

			case 'password':
				extendInfoList = [
					{ key: 'passwordConfirm', initialValue: '' },
					{
						key: 'passwordConfirmInputStatus',
						initialValue: { status: 'default' },
					},
				];
				break;

			default:
				extendedStates = undefined;
		}

		extendInfoList.map((extendInfo) => {
			if (extendedStates !== undefined) {
				extendedStates[extendInfo.key] = {
					state: extendInfo.initialValue,
					setter: (value) =>
						setWrappedDataDict((prevState) => ({
							...prevState,
							[key]: {
								...prevState[key],
								extendedStates: {
									...prevState[key].extendedStates,
									[extendInfo.key]: {
										...convertToAny(
											prevState[key]?.extendedStates
										)[extendInfo.key],
										state: value,
									},
								},
							},
						})),
				};
			}
		});

		return extendedStates;
	};

	public createWrappedData = (
		setWrappedDataDict: Dispatch<
			SetStateAction<{
				[key: string]: IWrappedData;
			}>
		>,
		dataList: IData[],
		pageRole?: string
	) => {
		// API 호출 결과를 저장할 변수
		const wrappedData: { [key: string]: IWrappedData } = {};

		// wrappedData를 생성하는 코드를 이곳으로 옮김
		for (const data of dataList) {
			//* Wrap data
			data.keys.map((key) => {
				wrappedData[key] = {
					state: this.setInitialValue(data.ui, data.initialValue),
					setter: (value) =>
						setWrappedDataDict((prevState) => ({
							...prevState,
							[key]: {
								...prevState[key],
								state: value,
							},
						})),
					inputStatus: { status: 'default' },
					setInputStatus: (value) =>
						setWrappedDataDict((prevState) => ({
							...prevState,
							[key]: {
								...prevState[key],
								inputStatus: value,
							},
						})),
					extendedStates: this.setExtendedStates(
						key,
						setWrappedDataDict,
						data.type,
						pageRole
					),
				};
			});
		}

		return wrappedData;
	};
}
