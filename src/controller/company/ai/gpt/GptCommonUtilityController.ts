import { ControllerABC } from '../../../base/ControllerABC';

class GptCommonUtilityController extends ControllerABC {
	//* 클래스 멤버
	constructor() {
		super();
	}

	/**
	 * 선택 가능한 GPT 모델 리스트 가져오는 함수
	 */
	public getListOfModels = (
		MODEL_ROLE?: string,
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => {
		this.getData(
			MODEL_ROLE === undefined ? {} : { MODEL_ROLE: MODEL_ROLE },
			`${this.rootRoute}/common/ai/gpt/common/utility/get_list_of_models`,
			successCallback,
			failCallback
		);
	};
}

export default GptCommonUtilityController;
