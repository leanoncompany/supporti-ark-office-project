import MemberControllerABC from '../base/MemberControllerABC';

class MemberController extends MemberControllerABC {
	//* 클래스 멤버
	constructor(modelName: string) {
		super(modelName);
	}
}

export default MemberController;
