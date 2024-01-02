import AuthControllerABC from '../base/AuthControllerABC';

class AuthController extends AuthControllerABC {
	//* 클래스 멤버
	constructor() {
		super(process.env.NEXT_PUBLIC_AUTH_MODEL_NAME || 'AdminMember');
	}
}

export default AuthController;
