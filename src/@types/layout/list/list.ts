export interface IListHeader {
	label: string;
	key: string;
	fontSize?: string;
	icon?: JSX.Element;
	gridMd: number;
	gridXs: number;
}

export interface IListContent {
	id: number | string;
	contentChild: IListContentChild[];
}

export interface IListContentChild {
	key: string;
	value: () => any;
	fontSize?: string;
	fontWeight?: string;
	icon?: JSX.Element;
}

export interface IRendering {
	[key: string]: (
		el: any,
		allData?: any[],
		setAllData?: React.Dispatch<React.SetStateAction<any[]>>
	) => any;
}

export interface IWholeData {}

export interface IList {
	allData?: any[];
	setAllData?: React.Dispatch<React.SetStateAction<any[]>>;
	disableRoute?: boolean;
	modelIdKey?: string;
	total: number;
	disableTotal?: boolean;
	// moveToDetail: (id: number) => void;
	textAlign?: 'center' | 'right';

	headerBackgroundColor?: string;
	hoverColor?: string;
	headerFontWeight?: string;
	listHeader: IListHeader[];
	// listContent: IListContent[];
	render?: IRendering;
	fixedData?: any;
	fixedRender?: IRendering;
	data: any;
	linkCallback?: (args: { [key: string]: any }) => any;
	customListItemRenderCallback?: (
		element: any,
		index: number,
		listHeader: IListHeader[],
		wrappedRenderColumnCallback: (columnKey: string, element: any) => any
	) => React.ReactElement;
	minWidth?: string;
	disableOverflow?: boolean;
	disableOnClick?: boolean;
}
