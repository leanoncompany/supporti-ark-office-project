import BoardControllerABC from '../base/BoardControllerABC';

class BoardController extends BoardControllerABC {
	//* 클래스 멤버
	constructor(boardModelName: string) {
		super(boardModelName);
	}
}

export default BoardController;
