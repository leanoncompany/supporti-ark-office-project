export interface IAlarm {
	// count: number;
	borderRadius?: number;
	modelName: string;
	width?: number;
	height?: number | string;
	soundDict?: { [key: string]: any };
	// alarmList: IAlarmList[];
	titleSize?: string;
	titleWeight?: string;
	titleColor?: string;
	descriptionSize?: string;
	descriptionWeight?: string;
	descriptionColor?: string;
}

export interface IAlarmList {
	link: string;
	title: string;
	description: string;
	hoverColor?: string;
	date: string;
	createdAt: Date;
}
