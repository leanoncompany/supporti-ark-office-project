import { BoxProps } from '@mui/material';
import Memory from '../../../utils/data/Memory';
import { IData, IWrappedData, IWrappedDataDict } from '../../base/data';
import { IListHeader } from '../list/list';

export interface IFormPropsABC {
	memory: Memory;
	modelIdKey: string;
	hideHeader?: boolean;
	dataList: IData[];
	disableEdit?: boolean;
	disableDelete?: boolean;
	disableUpdate?: boolean;
	label?: string;
	pageRole?: 'write' | 'edit';
	pid?: string | string[];
	setFetchedData?: React.Dispatch<{ [key: string]: IWrappedData }>;
	createCallback?: (
		args: { [key: string]: any },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => void;
	updateCallback?: (
		args: { [key: string]: any },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => void;
	validationCallback?: (wrappedDataDict: {
		[key: string]: IWrappedData;
	}) => Promise<boolean>;
	disableNavigateAfterAction?: boolean;
	injectedComponent?: React.ReactNode;
}

export interface IBaseFormProps extends IFormPropsABC {
	findOneCallback: (
		args: { [key: string]: any },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => void;
	deleteCallback?: (
		args: { [key: string]: any },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => void;
	renderCustomDeleteButton?: (
		wrappedDataDict: IWrappedDataDict
	) => React.ReactNode;
	outerBoxProps?: BoxProps;
	innerBoxProps?: BoxProps;
}

export interface IUpsertFormProps extends IFormPropsABC {
	updateCallback: (
		args: { [key: string]: any },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => void;
	createCallback: (
		args: { [key: string]: any },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => void;
	findOneCallback: (
		args: { [key: string]: any },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => void;
}

export interface IDependentFormProps extends IFormPropsABC {
	dependentModelData: { [key: string]: any };
	dependentModelIdKey: string | string[];
	findOneByKeyCallback: (
		args: { [key: string]: any },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => void;
	deleteCallback?: (
		args: { [key: string]: any },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => void;
}

export interface IBasicStatisticsFormProps {
	memory: Memory;
	listHeader: IListHeader[];
	render: {
		[key: string]: (el: any) => any;
	};
	targets?: {
		modelName: string;
		columns: string[];
		findAllArgs?: { [key: string]: any };
	}[];
	formatDataList?: (
		dataList: { [key: string]: any }[]
	) => { [key: string]: any }[];
	injectedGetStatisticsList?: (
		startDate: Date | null,
		endDate: Date | null,
		selectedDateUnit: string,
		setDataList: React.Dispatch<
			React.SetStateAction<
				{
					[key: string]: any;
				}[]
			>
		>
	) => void;
	setSelectedDateUnit?: React.Dispatch<string | null>;
	useRange?: boolean;
	sumKey?: {
		modelKey: string;
		valueKey: string;
		sumCallback?: (totalAmount: number, element: any) => number;
	};
}
