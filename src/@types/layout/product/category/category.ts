export interface ICategory {
	name: string;
	primaryCategoryId: number;
	children?: ISubCategory[];
}

export interface ISubCategory {
	parentPrimaryCategoryId: number;
	subCategoryId: number;
	name: string;
}
