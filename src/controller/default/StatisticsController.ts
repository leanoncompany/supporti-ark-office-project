import React from 'react';
import { ControllerABC } from '../base/ControllerABC';

class StatisticsController extends ControllerABC {
	//* 클래스 멤버
	constructor() {
		super();
	}

	/**
	 * 알림 리스트
	 */
	public getStatisticsList = (
		{
			TARGETS,
			INTERVAL_TYPE,
			START_DATE,
			END_DATE,
		}: {
			TARGETS: {
				modelName: string;
				columns: string[];
				findAllArgs?: { [key: string]: any };
			}[];
			INTERVAL_TYPE: string;
			START_DATE: Date;
			END_DATE: Date;
		},
		successCallback?: (response: any) => void,
		failCallback?: (err: any) => void
	) => {
		return this.getData(
			{
				TARGETS: JSON.stringify(TARGETS),
				INTERVAL_TYPE: INTERVAL_TYPE,
				START_DATE: START_DATE,
				END_DATE: END_DATE,
			},
			`${this.rootRoute}/common/statistics/find_by_range`,
			successCallback,
			failCallback
		);
	};
}

export default StatisticsController;
