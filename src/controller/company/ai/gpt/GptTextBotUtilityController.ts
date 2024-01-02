import { ControllerABC } from '../../../base/ControllerABC';

class GptTextBotUtilityController extends ControllerABC {
	//* 클래스 멤버
	constructor() {
		super();
	}

	/**
	 * 텍스트 훈련 파일 openai 에 저장하는 함수
	 */
	public registerTextTrainData = (
		GPT_TEXT_TRAIN_DATA_HEADER_IDENTIFICATION_CODE: number,
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => {
		this.postData(
			{
				GPT_TEXT_TRAIN_DATA_HEADER_IDENTIFICATION_CODE:
					GPT_TEXT_TRAIN_DATA_HEADER_IDENTIFICATION_CODE,
			},
			`${this.rootRoute}/common/ai/gpt/text/utility/register_text_train_data`,
			successCallback,
			failCallback
		);
	};

	/**
	 * 텍스트 훈련 시키기
	 */
	public startTrainTextModel = (
		GPT_TEXT_BOT_IDENTIFICATION_CODE: number,
		TRAINING_DATA_FILE_ID: number,
		VALIDATION_DATA_FILE_ID: number,
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => {
		this.postData(
			{
				TRAINING_DATA_FILE_ID: TRAINING_DATA_FILE_ID,
				VALIDATION_DATA_FILE_ID: VALIDATION_DATA_FILE_ID,
				GPT_TEXT_BOT_IDENTIFICATION_CODE:
					GPT_TEXT_BOT_IDENTIFICATION_CODE,
			},
			`${this.rootRoute}/common/ai/gpt/text/utility/start_train_text_model`,
			successCallback,
			failCallback
		);
	};

	/**
	 * 텍스트 훈련 상태 확인
	 */
	public checkModelTrainStatus = (
		GPT_TEXT_BOT_IDENTIFICATION_CODE: number,
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => {
		this.getData(
			{
				GPT_TEXT_BOT_IDENTIFICATION_CODE:
					GPT_TEXT_BOT_IDENTIFICATION_CODE,
			},
			`${this.rootRoute}/common/ai/gpt/text/utility/check_model_train_status`,
			successCallback,
			failCallback
		);
	};

	/**
	 * 채팅 전송
	 */
	public sendChat = (
		MESSAGE: string,
		USER_NAME?: string,
		PROMPT?: {
			role: 'user' | 'assistant';
			content: string;
			name?: string;
		}[],
		GPT_TEXT_BOT_IDENTIFICATION_CODE?: number,
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => {
		this.postData(
			{
				MESSAGE: MESSAGE,
				USER_NAME: USER_NAME,
				PROMPT: PROMPT,
				GPT_TEXT_BOT_IDENTIFICATION_CODE:
					GPT_TEXT_BOT_IDENTIFICATION_CODE,
			},
			`${this.rootRoute}/common/ai/gpt/text/utility/send_chat`,
			successCallback,
			failCallback
		);
	};

	/**
	 * 완성 전송
	 */
	public sendCompletion = (
		MESSAGE: string,
		GPT_TEXT_BOT_IDENTIFICATION_CODE?: number,
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => {
		this.postData(
			{
				MESSAGE: MESSAGE,
				GPT_TEXT_BOT_IDENTIFICATION_CODE:
					GPT_TEXT_BOT_IDENTIFICATION_CODE,
			},
			`${this.rootRoute}/common/ai/gpt/text/utility/send_completion`,
			successCallback,
			failCallback
		);
	};

	/**
	 * 채팅 전송
	 */
	public resetTextBotBaseModelAndTrainDataConnection = (
		MODEL_ROLE: string,
		GPT_TEXT_BOT_IDENTIFICATION_CODE?: number,
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => {
		this.putData(
			{
				MODEL_ROLE: MODEL_ROLE,
				GPT_TEXT_BOT_IDENTIFICATION_CODE:
					GPT_TEXT_BOT_IDENTIFICATION_CODE,
			},
			`${this.rootRoute}/common/ai/gpt/text/utility/reset_text_bot_connections`,
			successCallback,
			failCallback
		);
	};
}

export default GptTextBotUtilityController;
