import React from 'react';
import { ControllerABC } from '../base/ControllerABC';

class CategoryController extends ControllerABC {
	//* 클래스 멤버
	constructor() {
		super();
	}

	/**
	 * 카테고리 트리 가져오기
	 */
	public getCategoryTree = (
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => {
		this.getData(
			{},
			`${this.rootRoute}/user/product_primary_category/get_category_tree`,
			successCallback,
			failCallback
		);
	};
}

export default CategoryController;
