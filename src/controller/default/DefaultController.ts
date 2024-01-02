import { ControllerABC } from '../base/ControllerABC';

class DefaultController extends ControllerABC {
	//* 클래스 멤버
	constructor(modelName: string, role?: string) {
		super(modelName, role);
	}
}

export default DefaultController;
