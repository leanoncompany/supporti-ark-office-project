import { IData } from '../base/data';

export interface IUseDataControlProps {
	pid: string | string[] | undefined;
	dataList: IData[];
	findOneCallback: (
		id: number,
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => void;
}
