import {
	Box,
	Button,
	CircularProgress,
	Fade,
	FormControlLabel,
	Grid,
	IconButton,
	Modal,
	Pagination,
	Switch,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
	useTheme,
} from '@mui/material';
import { IData, IWrappedData } from '../../../../@types/base/data';
import DefaultController from '../../../../controller/default/DefaultController';
import DataUtil from '../../../../utils/data/DataUtil';
import BaseForm from '../../../../layout/forms/base/BaseForm/BaseForm';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Memory from '../../../../utils/data/Memory';
import { DeliveryAppItemFilter } from '../../ui/DeliveryAppItemFilter';
import { DateSelectPicker } from '../../../../ui/local/utils/DateSelectPicker';
import Select from '../../../../ui/local/input/Select/Select';
import BadgeSelector from '../../../../ui/local/input/BadgeSelector/BadgeSelector';
import { LineChart } from '../../../../ui/local/graph/LineChart';
import { DeliveryAppCardViewer } from '../../ui/DeliveryAppCardViewer';
import { IDeliveryAppCardSummary } from '../../ui/DeliveryAppCardViewer/DeliveryAppCardViewer';
import { AutoCompleteTypeFilter } from '../../../../ui/local/input/AutoCompleteTypeFilter';
import axios from 'axios';

interface IDeliveryAppAdvertisementViewerProps {
	memory: Memory;
	deliveryAppServiceMemberId?: string | string[];
}

const DeliveryAppAdvertisementViewer = (
	props: IDeliveryAppAdvertisementViewerProps
) => {
	//* Modules
	const dataUtil = new DataUtil();
	const router = useRouter();
	const theme = useTheme();

	//* Controller
	const modelName = 'DeliveryAppAdvertise';
	const controller = new DefaultController(modelName);

	//* States
	/**
	 * 필터
	 */
	const [deliveryAppAdvertisementList, setDeliveryAppAdvertisementList] =
		useState<any[]>([]);

	/**
	 * 선택된 특정 광고
	 */
	const [selectedAdvertisement, setSelectedAdvertisement] =
		useState<any>(null);

	/**
	 * 선택된 요약 엘리먼트
	 */
	const [activatedSummaryIndex, setActivatedSummaryIndex] =
		useState<number>(0);

	/**
	 * 주문 수
	 */
	const [advertisementDataSet, setAdvertisementDataSet] = useState<{
		NUM_OF_ORDERS: number;
		REVENUE_OF_ADVERTISEMENT: number;
		NUM_OF_EXPOSURE: number;
		NUM_OF_CLICK: number;
	}>({
		NUM_OF_ORDERS: 0,
		REVENUE_OF_ADVERTISEMENT: 0,
		NUM_OF_EXPOSURE: 0,
		NUM_OF_CLICK: 0,
	});

	/**
	 * 그래프
	 */

	//* Constants
	const advertisementSummaryList: IDeliveryAppCardSummary[] = [
		{
			label: '광고 주문 수',
			value: advertisementDataSet['NUM_OF_ORDERS'],
			key: 'NUM_OF_ORDERS',
			postFix: '건',
		},
		{
			label: '광고 주문 금액',
			value: advertisementDataSet['REVENUE_OF_ADVERTISEMENT'],
			key: 'REVENUE_OF_ADVERTISEMENT',
			postFix: '원',
		},
		{
			label: '광고 노출 수',
			value: advertisementDataSet['NUM_OF_EXPOSURE'],
			key: 'NUM_OF_EXPOSURE',
			postFix: '건',
		},
		{
			label: '광고 클릭 수',
			value: advertisementDataSet['NUM_OF_CLICK'],
			key: 'NUM_OF_CLICK',
			postFix: '건',
		},
	];

	//* Functions
	const filterSelectableAdvertisementOptionList = (targetDeliveryAppAdvertisementList: any[]) => {
		const filteredOptionList: {label: string, value: any}[] = []
		
		targetDeliveryAppAdvertisementList.map(
			(deliveryAppAdvertisement) => {
				if (deliveryAppAdvertisement.ADVERTISEMENT_TITLE !== '데이터 없음') {
					//* 데이터 리스트에 있는지 찾기
					const findIndexResult = filteredOptionList.findIndex(
						(option) =>
							option.label ===
							`${deliveryAppAdvertisement.ADVERTISEMENT_TITLE}`
					);

					if (findIndexResult == -1) {
						filteredOptionList.push({
							label: `${deliveryAppAdvertisement.ADVERTISEMENT_TITLE}`,
							value: JSON.stringify([deliveryAppAdvertisement.DELIVERY_APP_ADVERTISE_IDENTIFICATION_CODE]),
						});
					} else {
						filteredOptionList[findIndexResult].value = JSON.stringify(
							[
								...JSON.parse(
									filteredOptionList[findIndexResult].value
								),
								deliveryAppAdvertisement.DELIVERY_APP_ADVERTISE_IDENTIFICATION_CODE,
							]
						);
					}
				}
			}
		)

		return filteredOptionList
	}

	//* Hooks
	/**
	 * 주문 건수 훅
	 */
	useEffect(() => {
		const result = (() => {
			return deliveryAppAdvertisementList
				.filter((data) => {
					if (selectedAdvertisement === null) {
						return true;
					} else {
						const isExist = JSON.parse(selectedAdvertisement.value).includes(
							data.DELIVERY_APP_ADVERTISE_IDENTIFICATION_CODE)

						return isExist
					}
				})
				.reduce(
					(sum, deliveryAppAdvertisement) => {
						return {
							NUM_OF_EXPOSURE:
								sum.NUM_OF_EXPOSURE +
								deliveryAppAdvertisement.NUM_OF_EXPOSURE,
							NUM_OF_ORDERS:
								sum.NUM_OF_ORDERS +
								deliveryAppAdvertisement.NUM_OF_ORDERS,
							REVENUE_OF_ADVERTISEMENT:
								sum.REVENUE_OF_ADVERTISEMENT +
								deliveryAppAdvertisement.REVENUE_OF_ADVERTISEMENT,
							NUM_OF_CLICK:
								sum.NUM_OF_CLICK +
								deliveryAppAdvertisement.NUM_OF_CLICK,
						};
					},
					{
						NUM_OF_EXPOSURE: 0,
						NUM_OF_ORDERS: 0,
						REVENUE_OF_ADVERTISEMENT: 0,
						NUM_OF_CLICK: 0,
					}
				);
		})();

		setAdvertisementDataSet(result);
	}, [deliveryAppAdvertisementList, selectedAdvertisement]);

	return (
		<Box pb={10}>
			{/* <Button
				onClick={() => {
					axios({
						method: 'get',
						url: '/api2/common/scraper/service/automation/delivery_app/business/run_send_advertisement_report',
					}).then((res) => {
						res.data.result.map((target: any) => {
							const formData = new FormData();
							formData.append('api_key', 'IPDO94X5ZZQ0117');
							formData.append('template_code', 'SJT_092084');
							formData.append(
								'variable',
								// 결제자 이름, 결제 요청자, 결제 내용, 금액
								`${target.message}`
							);
							formData.append('callback', '01066534066');
							formData.append('dstaddr', target.dstaddr);
							formData.append('next_type', '1');
							formData.append('send_reserve', '0');

							axios({
								method: 'post',
								url: 'https://alimtalkme.com/API/alimtalk_api', //환경변수
								data: formData,
								headers: {
									'Content-Type': 'multipart/form-data',
								},
							})
								.then((res) => {
									console.log('SUCCESS');
									console.log(res.data);
								})
								.catch((err) => {
									console.log('ERROR');
									console.log(err);
								});
						});
					});
				}}
			>
				전송
			</Button> */}

			{/* 가게 필터 영역 */}
			<Box>
				<DeliveryAppItemFilter
					memory={props.memory}
					deliveryAppServiceMemberId={
						props.deliveryAppServiceMemberId
					}
					dataController={controller}
					setFilteredDataList={setDeliveryAppAdvertisementList}
				/>
			</Box>

			{/* 광고 제목 필터 영역 */}
			<Box my={1.5} key={JSON.stringify(deliveryAppAdvertisementList)}>
				<AutoCompleteTypeFilter
					placeholder="전체 광고"
					value={selectedAdvertisement}
					setValue={setSelectedAdvertisement}
					selectableOptionList={filterSelectableAdvertisementOptionList(deliveryAppAdvertisementList)}
				/>
			</Box>

			{/* 콘텐츠 영역 */}
			<Box>
				{/* 광고 요약 영역 */}
				<Box mb={1}>
					<DeliveryAppCardViewer
						summaryList={advertisementSummaryList}
						activatedSummaryIndex={activatedSummaryIndex}
						setActivatedSummaryIndex={setActivatedSummaryIndex}
					/>
				</Box>

				{/* 그래프 영역 */}
				<Box width={'100%'}>
					<LineChart
						dataList={(() => {
							let dataGroupByStartDate: {
								[key: string]: any;
							} = {};

							deliveryAppAdvertisementList
								.filter((data) => {
									if (selectedAdvertisement === null) {
										return true;
									} else {
										const isExist = JSON.parse(selectedAdvertisement.value).includes(
											data.DELIVERY_APP_ADVERTISE_IDENTIFICATION_CODE)

										return isExist
									}
								})
								.map((data) => {
									const startDate = moment(
										data['START_DATE']
									).format('YYYY-MM');

									if (dataGroupByStartDate[startDate]) {
										dataGroupByStartDate[startDate] = {
											NUM_OF_EXPOSURE:
												dataGroupByStartDate[startDate]
													.NUM_OF_EXPOSURE +
												data.NUM_OF_EXPOSURE,
											NUM_OF_ORDERS:
												dataGroupByStartDate[startDate]
													.NUM_OF_ORDERS +
												data.NUM_OF_ORDERS,
											REVENUE_OF_ADVERTISEMENT:
												dataGroupByStartDate[startDate]
													.REVENUE_OF_ADVERTISEMENT +
												data.REVENUE_OF_ADVERTISEMENT,
											NUM_OF_CLICK:
												dataGroupByStartDate[startDate]
													.NUM_OF_CLICK +
												data.NUM_OF_CLICK,
										};
									} else {
										dataGroupByStartDate[startDate] = {
											NUM_OF_EXPOSURE:
												data.NUM_OF_EXPOSURE,
											NUM_OF_ORDERS: data.NUM_OF_ORDERS,
											REVENUE_OF_ADVERTISEMENT:
												data.REVENUE_OF_ADVERTISEMENT,
											NUM_OF_CLICK: data.NUM_OF_CLICK,
										};
									}
								});

							return Object.keys(dataGroupByStartDate).map(
								(key) => {
									return {
										START_DATE: key,
										...dataGroupByStartDate[key],
									};
								}
							);
						})()}
						xAxis={{
							formatterCallback: (data, source) => {
								return `${moment(source['START_DATE']).format(
									'YYYY년 MM월'
								)}`;
							},
						}}
						yAxis={{
							key: advertisementSummaryList[activatedSummaryIndex]
								.key,
							formatterCallback: (data) => {
								const dataWithCommans =
									dataUtil.numberWithCommas(data);

								return `${dataWithCommans}${advertisementSummaryList[activatedSummaryIndex].postFix}`;
							},
						}}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default DeliveryAppAdvertisementViewer;
