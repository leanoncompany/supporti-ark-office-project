import { ControllerABC } from './ControllerABC';

class MemberControllerABC extends ControllerABC {
	//* 클래스 멤버
	constructor(modelName: string) {
		super(modelName);
	}

	/**
	 * 아이디 중복 확인 함수
	 */
	public doubleCheckUserName(
		args: { USER_NAME: string; ID?: string },
		successCallback: (response: any) => void,
		failCallback?: (err: any) => void
	) {
		this.getData(
			args,
			`${this.mergedPath}/double_check_username`,
			successCallback,
			failCallback
		);
	}
}

export default MemberControllerABC;
