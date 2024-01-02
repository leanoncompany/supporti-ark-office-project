import { IProfileProps } from '../../../layout/Profile/Profile';
import { IAlarm } from '../../ui/global/alarm';

export interface IMenu {
	label: string;
	link: string;
	icon?: React.ReactElement;
	notificationCallback?: (
		setIsNotificated: React.Dispatch<React.SetStateAction<boolean>>
	) => void;
	children: IMenu[];
}

export interface IMenuSet {
	hide?: boolean;
	label: string;
	link: string;
	menus: IMenu[];
}

export interface ISideBar {
	profilePlugins?: React.ReactElement[];
	plugin?: {
		label: string;
		icon: React.ReactElement;
		element: React.ReactElement;
	}[]; // 민구가 추가함 (프로필에 플러그인을 추가할 수 있도록)/ 민구가 추가함 (프로필에 플러그인을 추가할 수 있도록)
	menuSets: IMenuSet[];
	loginLink: string;
	menuHeight: number;
	alarm?: Partial<IAlarm>;
	disableAlarm?: boolean;
	profileProps?: IProfileProps;
	disableCategory?: boolean;
}
