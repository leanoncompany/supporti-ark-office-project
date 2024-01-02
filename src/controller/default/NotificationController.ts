import React from 'react';
import { ControllerABC } from '../base/ControllerABC';

class NotificationController extends ControllerABC {
	//* 클래스 멤버
	constructor() {
		super();
	}

	/**
	 * 알림 리스트
	 */
	public getNotificationList = (
		{
			CONNECTED_USER_MODEL_NAME,
			LIMIT,
			PAGE,
		}: { CONNECTED_USER_MODEL_NAME: string; LIMIT: number; PAGE: number },
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => {
		return this.getData(
			{
				LIMIT: LIMIT,
				PAGE: PAGE,
				CONNECTED_USER_MODEL_NAME: CONNECTED_USER_MODEL_NAME,
				SORT_KEY: 'CREATED_AT',
				SORT_DIRECTION: 'DESC',
			},
			`${this.rootRoute}/common/notification/find_all`,
			successCallback,
			failCallback
		);
	};

	/**
	 * 알림 읽음 처리
	 */
	public readNotification = (
		NOTIFICATION_IDENTIFICATION_CODE: number,
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => {
		return this.putData(
			{
				NOTIFICATION_IDENTIFICATION_CODE:
					NOTIFICATION_IDENTIFICATION_CODE,
			},
			`${this.rootRoute}/common/notification/update_read_status`,
			successCallback,
			failCallback
		);
	};
}

export default NotificationController;
