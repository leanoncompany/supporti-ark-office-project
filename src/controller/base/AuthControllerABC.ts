import MemberControllerABC from './MemberControllerABC';

class AuthControllerABC extends MemberControllerABC {
	//* 클래스 멤버
	constructor(modelName: string) {
		super(modelName);
	}

	/**
	 * 로컬 로그인
	 */
	public signIn(
		args: { USER_NAME: string; PASSWORD: string },
		successCallback: (response: any) => void,
		failCallback?: (err: any) => void
	) {
		this.postData(
			args,
			`${this.mergedPath}/sign_in/local`,
			successCallback,
			failCallback
		);
	}

	/**
	 * 로컬 회원가입
	 */
	public signUp(
		args: {
			[key: string]: any;
		},
		successCallback: (response: any) => void,
		failCallback?: (err: any) => void
	) {
		this.postData(
			args,
			`${this.mergedPath}/sign_up/local`,
			successCallback,
			failCallback
		);
	}

	/**
	 * 아이디 찾기
	 */
	public findUserName(
		args: {
			PHONE_NUMBER: string;
		},
		successCallback: (response: any) => void,
		failCallback?: (err: any) => void
	) {
		this.postData(
			args,
			`${this.mergedPath}/find/user_name`,
			successCallback,
			failCallback
		);
	}

	/**
	 * 비밀번호 찾기 검증
	 */
	public validationFindPassword(
		args: {
			USER_NAME: string;
			PHONE_NUMBER: string;
		},
		successCallback: (response: any) => void,
		failCallback?: (err: any) => void
	) {
		this.postData(
			args,
			`${this.mergedPath}/find/password/validate`,
			successCallback,
			failCallback
		);
	}

	/**
	 * 비밀번호 찾기 검증 이후 비밀번호 변경
	 */
	public changePasswordInFindPassword(
		args: {
			USER_NAME: string;
			PHONE_NUMBER: string;
			PASSWORD: string;
		},
		successCallback: (response: any) => void,
		failCallback?: (err: any) => void
	) {
		this.postData(
			args,
			`${this.mergedPath}/find/password/success`,
			successCallback,
			failCallback
		);
	}

	/**
	 * 전화번호로 해당 유저 이름 가져오기
	 */
	public getUserNameByPhoneNumber(
		args: {
			PHONE_NUMBER: string;
		},
		successCallback: (response: any) => void,
		failCallback?: (err: any) => void
	) {
		this.getData(
			args,
			`${this.mergedPath}/get_user_name_by_phone_number`,
			successCallback,
			failCallback
		);
	}

	/**
	 * 전화번호 중복 확인
	 */
	public isPhoneNumberUsed(
		args: { PHONE_NUMBER: string },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) {
		this.getData(
			args,
			`${this.mergedPath}/double_check_phone_number`,
			successCallback,
			failCallback
		);
	}

	/**
	 * 인증번호 요청
	 */
	public sendPhoneAuth(
		args: {
			TARGET_PHONE_NUMBER: string;
		},
		successCallback: (response: any) => void,
		failCallback?: (err: any) => void
	) {
		this.postData(
			args,
			`${this.mergedPath}/send_phone_auth`,
			successCallback,
			failCallback
		);
	}

	/**
	 * 인증번호 인증
	 */
	public validateAuthCode(
		args: {
			AUTH_CODE: string;
			ENCRYPTED_AUTH_CODE: string;
		},
		successCallback: (response: any) => void,
		failCallback?: (err: any) => void
	) {
		this.postData(
			args,
			`${this.mergedPath}/validate_phone_auth`,
			successCallback,
			failCallback
		);
	}

	/**
	 * 프로필 가져오기
	 */
	public getProfile(
		successCallback: (response: any) => void,
		failCallback?: (err: any) => void
	) {
		this.getData(
			{},
			`${this.mergedPath}/profile`,
			successCallback,
			failCallback
		);
	}
}

export default AuthControllerABC;
