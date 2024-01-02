import {
	useState,
	useCallback,
	useEffect,
	Dispatch,
	SetStateAction,
} from 'react';
import { IWrappedData } from '../../@types/base/data';
import { DataControl } from './DataControl';

type useDataControlReturnType = {
	wrappedDataDict: { [key: string]: IWrappedData };
};

const useDataControl = (
	modelIdKey: string,
	pageRole: string,
	pid: string | string[] | undefined,
	dataList: any[],
	findOneCallback: (
		args: { [key: string]: any },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => void,
	setFetchedData?: React.Dispatch<{ [key: string]: IWrappedData }>
): useDataControlReturnType => {
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
				dataList,
				pageRole
			);

			if (pageRole == 'edit') {
				const findOneOption: { [key: string]: any } = {};
				findOneOption[modelIdKey] = Number(pid);

				findOneCallback(
					findOneOption,
					(response) => {
						for (const [key, value] of Object.entries(
							response.data.result
						)) {
							if (wrappedData[key]?.state !== undefined) {
								console.log(key);
								console.log(wrappedData[key].state);
								console.log('---');
								console.log(typeof wrappedData[key].state);
								console.log(wrappedData[key].state instanceof
									Date)

								switch (typeof wrappedData[key].state) {
									case 'object':
										if (
											wrappedData[key].state instanceof
											Date
										) {
											if (value !== null) {
												wrappedData[key].state =  value instanceof Date ? value : new Date(value as any);
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

								console.log(wrappedData[key].state)
								console.log("=====")
							}
						}

						setWrappedDataDict(wrappedData);

						if (setFetchedData !== undefined) {
							const fetchedData: { [key: string]: IWrappedData } =
								{};

							Object.keys(response.data.result).map((key) => {
								let targetData: any = {
									state: response.data.result[key],
								};

								if (key in wrappedData) {
									targetData = wrappedData[key];
								}

								fetchedData[key] = targetData;
							});

							setFetchedData(fetchedData);
						}
					},
					(err) => {
						alert('데이터 로드에 실패했습니다.');
						console.log(err);
					}
				);
			} else if (pageRole == 'write') {
				setWrappedDataDict(wrappedData);
			}
		};

		if (pageRole != '') {
			fetchData();
		}
	}, [pageRole]);

	return { wrappedDataDict };
};

export default useDataControl;
