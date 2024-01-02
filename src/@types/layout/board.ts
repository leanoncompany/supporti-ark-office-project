import Memory from '../../utils/data/Memory';
import { IData } from '../base/data';

export interface IUnidirectionalBoardFormProps {
	modelName: string;
	memory: Memory;
	dataList?: IData[];
	disableEdit?: boolean;
}

export interface IBidirectionalBoardFormProps {
	disableEdit?: boolean;
	mainLabel?: string;
	subLabel?: string;
	mainModelName: string;
	subModelName: string;
	memory: Memory;
	mainSectionDataList?: IData[];
	subSectionDataList?: IData[];
}

export interface ITermBoardFormProps {
	modelName: string;
	memory: Memory;
	dataList?: IData[];
}
