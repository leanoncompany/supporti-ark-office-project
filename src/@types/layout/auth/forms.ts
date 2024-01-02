import Memory from '../../../utils/data/Memory';
import { IData } from '../../base/data';

export interface IMemberFormProps {
	dataList?: IData[];
	modelName: string;
	memory: Memory;
}
