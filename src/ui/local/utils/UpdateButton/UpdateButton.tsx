import { IconButton, Button, Box, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import usePageRole from '../../../../hooks/pages/usePageRole';
import DataUtil from '../../../../utils/data/DataUtil';
import { IUpdateButtonProps } from '../../../../@types/ui/local/utils';

const UpdateButton = (props: IUpdateButtonProps) => {
	//* Modules
	const dataUtil = new DataUtil();
	const router = useRouter();

	//* States
	const { pageRole, pid } = usePageRole();
	const [finalPageRole, setFinalPageRole] = React.useState<string>('');

	const setFindOneOption = () => {
		const findOneOption: { [key: string]: any } = {};

		if (finalPageRole === 'upsert') {
			findOneOption[props.modelIdKey] = 1;
		} else {
			if (props.data !== undefined) {
				findOneOption[props.modelIdKey] = props.data[props.modelIdKey];
			} else {
				findOneOption[props.modelIdKey] = props.pid || Number(pid);
			}
		}

		return findOneOption;
	};

	useEffect(() => {
		//* Set final page role
		if (props.pageRole !== undefined) {
			setFinalPageRole(props.pageRole);
		} else {
			setFinalPageRole(pageRole);
		}
	}, [pageRole, props.pageRole]);

	const onClickButton = async () => {
		//* Validate data
		let isAllValidated: boolean = true;

		props.dataList.map((data) => {
			data.keys.map((key) => {
				let isValidated: boolean = true;
				const setInputStatusCallback =
					props.wrappedDataDict[key].setInputStatus;

				console.log('키와 값 입니다.');
				console.log(key);
				console.log(props.wrappedDataDict[key].state);
				console.log(typeof props.wrappedDataDict[key].state);

				if (data.isOptional !== true) {
					switch (typeof props.wrappedDataDict[key].state) {
						case 'string':
							if (props.wrappedDataDict[key].state.length === 0) {
								if (setInputStatusCallback !== undefined) {
									setInputStatusCallback({
										status: 'required',
									});
								}
								isValidated = false;
							}

							break;

						case 'object':
							if (props.wrappedDataDict[key].state === null) {
								if (setInputStatusCallback !== undefined) {
									setInputStatusCallback({
										status: 'required',
									});

									isValidated = false;
								}
							} else {
								if (
									props.wrappedDataDict[key].state.length ===
									0
								) {
									if (setInputStatusCallback !== undefined) {
										setInputStatusCallback({
											status: 'required',
										});

										isValidated = false;
									}
								}
							}

							break;
					}
				}

				if (isValidated) {
					switch (data.ui) {
						case 'autoCompleteSelector':
							if (props.wrappedDataDict[key].state !== null) {
								if (props.wrappedDataDict[key].state === -999) {
									if (data.isOptional === true) {
										const targetSetter =
											props.wrappedDataDict[key].setter;

										if (targetSetter !== undefined) {
											targetSetter(null);
										}
									} else {
										if (
											setInputStatusCallback !== undefined
										) {
											setInputStatusCallback({
												status: 'required',
											});

											isValidated = false;
										}
									}
								}
							}

							break;
					}

					switch (data.type) {
						case 'password':
							if (props.wrappedDataDict[key].state.length != 0) {
								if (
									props.wrappedDataDict[key].state !=
									props.wrappedDataDict[key]?.extendedStates
										?.passwordConfirm?.state
								) {
									props.wrappedDataDict[
										key
									]?.extendedStates?.passwordConfirmInputStatus?.setter(
										{ status: 'required' }
									);
									isValidated = false;
								}
							} else {
								if (finalPageRole == 'write') {
									if (setInputStatusCallback !== undefined) {
										setInputStatusCallback({
											status: 'required',
										});

										isValidated = false;
									}
								}
							}
							break;
					}

					switch (key) {
						case 'USER_NAME':
							if (
								props.wrappedDataDict[key]?.extendedStates
									?.doubleCheckPassed?.state == false
							) {
								if (setInputStatusCallback !== undefined) {
									setInputStatusCallback({
										status: 'required',
									});

									isValidated = false;
								}
							}

							break;

						case 'PASSWORD':
							if (props.wrappedDataDict[key].state.length != 0) {
								if (
									props.wrappedDataDict[key].state !=
									props.wrappedDataDict[key]?.extendedStates
										?.passwordConfirm?.state
								) {
									props.wrappedDataDict[
										key
									]?.extendedStates?.passwordConfirmInputStatus?.setter(
										{ status: 'required' }
									);
									isValidated = false;
								}
							} else {
								if (finalPageRole == 'write') {
									if (setInputStatusCallback !== undefined) {
										setInputStatusCallback({
											status: 'required',
										});

										isValidated = false;
									}
								}
							}
							break;
					}
				}

				if (!isValidated) {
					isAllValidated = false;
				}
			});
		});

		//* Check with additional validation callback
		if (props.validationCallback !== undefined) {
			isAllValidated = await props.validationCallback(
				props.wrappedDataDict
			);
		}

		//* Update or create data
		if (isAllValidated) {
			const flattenDataDict = dataUtil.flatWrapedDataDict(
				props.wrappedDataDict
			);

			if (
				finalPageRole === 'write' &&
				props.createCallback !== undefined
			) {
				const dependentModelData = props.dependentModelData;

				if (
					props.dependentModelIdKey !== undefined &&
					dependentModelData !== undefined
				) {
					if (typeof props.dependentModelIdKey === 'string') {
						flattenDataDict[props.dependentModelIdKey] =
							dependentModelData[props.dependentModelIdKey].state;
					} else {
						props.dependentModelIdKey.map((key) => {
							flattenDataDict[key] =
								dependentModelData[key].state;
						});
					}
				}
				props.createCallback(
					flattenDataDict,
					(response) => {
						alert('생성되었습니다.');

						if (props.disableNavigateAfterAction !== true) {
							router.back();
						}
					},
					(err) => {
						console.log(err);
						alert('생성에 실패했습니다.');
					}
				);
			} else if (
				(finalPageRole === 'edit' || finalPageRole === 'upsert') &&
				props.updateCallback !== undefined
			) {
				const findOneOption: { [key: string]: any } =
					setFindOneOption();
				if ('PASSWORD' in findOneOption) {
					if (findOneOption['PASSWORD'].length === 0) {
						delete findOneOption['PASSWORD'];
					}
				}

				props.updateCallback(
					Object.assign(findOneOption, flattenDataDict),
					(response) => {
						alert('업데이트되었습니다.');

						if (finalPageRole === 'edit') {
							if (props.disableNavigateAfterAction !== true) {
								router.back();
							}
						}
					},
					(err) => {
						alert('업데이트에 실패했습니다.');
					}
				);
			} else {
				throw new Error('pageRole is not defined');
			}
		} else {
			//* 에러
			alert(`유효성 검사에 실패했습니다! 데이터를 확인해주세요.`);
		}
	};

	return (
		<React.Fragment>
			{props.buttonType === 'icon' || props.buttonType === undefined ? (
				<Box
					display={'flex'}
					flexDirection={'column'}
					alignItems={'center'}
				>
					<IconButton
						color={'primary'}
						onClick={async () => {
							onClickButton();
						}}
					>
						<SaveIcon />
					</IconButton>
					<Box mt={'-10px'}>
						<Typography variant={'caption'}>저장</Typography>
					</Box>
				</Box>
			) : (
				<Button
					onClick={async () => {
						onClickButton();
					}}
				>
					{finalPageRole === 'write' ? '생성' : '업데이트'}
				</Button>
			)}
		</React.Fragment>
	);
};

export default UpdateButton;
