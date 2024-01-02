import {
	useState,
	useCallback,
	useEffect,
	Dispatch,
	SetStateAction,
} from 'react';
import { IWrappedData } from '../../@types/base/data';
import { DataControl } from './DataControl';

type useUpsertDataControlReturnType = {
	wrappedDataDict: { [key: string]: IWrappedData };
};

const useUpsertDataControl = (
	modelIdKey: string,
	dataList: any[],
	findOneCallback: (
		args: { [key: string]: any },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => void,
	createCallback: (
		args: { [key: string]: any },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => void,
	setFetchedData?: React.Dispatch<{ [key: string]: IWrappedData }>
): useUpsertDataControlReturnType => {
	//* Modules
	const dataControl = new DataControl();

	const [wrappedDataDict, setWrappedDataDict] = useState<{
		[key: string]: IWrappedData;
	}>({});

	//* Functions
	//* Hooks
	useEffect(() => {
		const fetchData = async () => {
			const wrappedData = dataControl.createWrappedData(
				setWrappedDataDict,
				dataList
			);

			const findOneOption: { [key: string]: any } = {};
			findOneOption[modelIdKey] = Number(1);

			//* Find first
			findOneCallback(findOneOption, (response) => {
				if (response.data.result === null) {
					const createOneOption: { [key: string]: any } = {};

					for (const [key, value] of Object.entries(wrappedData)) {
						if (value?.state !== undefined) {
							createOneOption[key] = value.state;
						}
					}

					createCallback(createOneOption);
				} else {
					for (const [key, value] of Object.entries(
						response.data.result
					)) {
						if (wrappedData[key]?.state !== undefined) {
							switch (typeof wrappedData[key].state) {
								case 'object':
									wrappedData[key].state = JSON.parse(
										value as any
									);
									break;

								default:
									wrappedData[key].state = value;
							}
						}
					}

					if (setFetchedData !== undefined) {
						setFetchedData(response.data.result);
					}
				}

				setWrappedDataDict(wrappedData);
			});
		};

		fetchData();
	}, []);

	return { wrappedDataDict };
};

export default useUpsertDataControl;
