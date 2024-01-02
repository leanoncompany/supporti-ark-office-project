import {
	useState,
	useCallback,
	useEffect,
	Dispatch,
	SetStateAction,
} from 'react';
import { IWrappedData } from '../../@types/base/data';
import { DataControl } from './DataControl';

type useDependentDataControlReturnType = {
	pageRole: string;
	wrappedDataDict: { [key: string]: IWrappedData };
};

const useDependentDataControl = (
	setData: React.Dispatch<{ [key: string]: any }>,
	dependentModelData: { [key: string]: any },
	dependentModelIdKey: string | string[],
	dataList: any[],
	findOneByKeyCallback: (
		args: { [key: string]: any },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => void,
	setFetchedData?: React.Dispatch<{ [key: string]: IWrappedData }>
): useDependentDataControlReturnType => {
	//* Modules
	const dataControl = new DataControl();

	const [pageRole, setPageRole] = useState<string>('');
	const [wrappedDataDict, setWrappedDataDict] = useState<{
		[key: string]: IWrappedData;
	}>({});

	//* Hooks
	useEffect(() => {
		let isInDependentModelIdKey = true;

		if (typeof dependentModelIdKey === 'string') {
			isInDependentModelIdKey =
				dependentModelData[dependentModelIdKey] !== undefined;
		} else {
			for (const key of dependentModelIdKey) {
				if (dependentModelData[key] === undefined) {
					isInDependentModelIdKey = false;
					break;
				}
			}
		}

		if (isInDependentModelIdKey) {
			const wrappedData = dataControl.createWrappedData(
				setWrappedDataDict,
				dataList
			);

			const findOneOption: { [key: string]: any } = {};

			if (typeof dependentModelIdKey === 'string') {
				let targetData = dependentModelData[dependentModelIdKey];

				if (targetData.hasOwnProperty('state')) {
					targetData = targetData.state;
				}

				findOneOption[dependentModelIdKey] = targetData;
			} else {
				for (const key of dependentModelIdKey) {
					let targetData = dependentModelData[key];

					if (targetData.hasOwnProperty('state')) {
						targetData = targetData.state;
					}

					findOneOption[key] = targetData;
				}
			}

			findOneByKeyCallback(
				findOneOption,
				(response) => {
					if (response.data.result !== null) {
						for (const [key, value] of Object.entries(
							response.data.result
						)) {
							if (wrappedData[key]?.state !== undefined) {
								switch (typeof wrappedData[key].state) {
									case 'object':
										if (
											wrappedData[key].state instanceof
											Date
										) {
											if (value !== null) {
												wrappedData[key].state =
													value instanceof Date
														? value
														: new Date(
																value as any
														  );
											}
										} else if (
											wrappedData[key].state === null
										) {
										} else {
											wrappedData[key].state = JSON.parse(
												value as any
											);
										}

										break;

									default:
										wrappedData[key].state = value;
								}
							}
						}

						setPageRole('edit');
					} else {
						setPageRole('write');
					}

					setWrappedDataDict(wrappedData);

					setData(response.data.result);

					if (setFetchedData !== undefined) {
						setFetchedData(response.data.result);
					}
				},
				(err) => {
					alert('데이터 로드에 실패했습니다.');
					console.log(err);
				}
			);
		}
	}, [dependentModelData]);

	return { pageRole, wrappedDataDict };
};

export default useDependentDataControl;
