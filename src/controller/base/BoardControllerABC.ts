import { ControllerABC } from './ControllerABC';

class BoardControllerABC extends ControllerABC {
	//* 클래스 멤버
	constructor(modelName: string) {
		super(modelName);
	}

	/**
	 * 생성 함수
	 */
	public createItem(
		args: { [key: string]: any },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void,
		returnPromise?: boolean
	) {
		const clonedArgs = { ...args };

		if (clonedArgs.IMAGE_LIST !== undefined) {
			clonedArgs.IMAGE_LIST = JSON.stringify(clonedArgs.IMAGE_LIST);
		}

		return super.createItem(
			clonedArgs,
			successCallback,
			failCallback,
			returnPromise
		);
	}

	/**
	 * 업데이트 함수
	 */
	public updateItem(
		args: { [key: string]: any },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void,
		returnPromise?: boolean
	) {
		const clonedArgs = { ...args };

		if (clonedArgs.IMAGE_LIST !== undefined) {
			clonedArgs.IMAGE_LIST = JSON.stringify(clonedArgs.IMAGE_LIST);
		}

		return super.updateItem(
			clonedArgs,
			successCallback,
			failCallback,
			returnPromise
		);
	}

	/**
	 * 데이터 여러개 가져오는 함수
	 */
	public getAllTopfixedItems(
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) {
		this.getData(
			{},
			`${this.mergedPath}/find_all_top_fixed`,
			successCallback,
			failCallback
		);
	}
}

export default BoardControllerABC;
