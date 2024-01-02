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
import DeliveryAppCardViewer, {
	IDeliveryAppCardSummary,
} from '../../ui/DeliveryAppCardViewer/DeliveryAppCardViewer';
import EmptyList from '../../../../ui/local/display/EmptyList';
import ReviewEditForm from '../../ui/ReviewEditForm/ReviewEditForm';

interface IDeliveryAppReviewViewerProps {
	memory: Memory;
	deliveryAppServiceMemberId?: string | string[];
}

const DeliveryAppReviewViewer = (props: IDeliveryAppReviewViewerProps) => {
	//* Modules
	const dataUtil = new DataUtil();
	const router = useRouter();
	const theme = useTheme();

	//* Controller
	const modelName = 'Review';
	const controller = new DefaultController(modelName);

	//* States
	/**
	 * 검색
	 */
	const [searchKeyword, setSearchKeyword] = useState<string>('');

	/**
	 * 필터
	 */
	const [deliveryAppReviewList, setDeliveryAppReviewList] = useState<any[]>(
		[]
	);

	/**
	 * 선택된 요약 엘리먼트
	 */
	const [activatedSummaryIndex, setActivatedSummaryIndex] =
		useState<number>(0);

	/**
	 * 리뷰 수
	 */
	const [reviewDataSet, setReviewDataSet] = useState<{
		NUM_OF_UPLOAD_READY_REVIEW: number;
		NUM_OF_UPLOADED_REVIEW: number;
	}>({
		NUM_OF_UPLOAD_READY_REVIEW: 0,
		NUM_OF_UPLOADED_REVIEW: 0,
	});

	/**
	 * 그래프
	 */

	//* Constants
	const reviewSummaryList: IDeliveryAppCardSummary[] = [
		{
			label: '답변 예정 리뷰',
			value: reviewDataSet['NUM_OF_UPLOAD_READY_REVIEW'],
			key: 'NUM_OF_UPLOAD_READY_REVIEW',
			postFix: '건',
		},
		{
			label: '답변 완료된 리뷰',
			value: reviewDataSet['NUM_OF_UPLOADED_REVIEW'],
			key: 'NUM_OF_UPLOADED_REVIEW',
			postFix: '건',
		},
	];

	//* Functions

	//* Hooks
	/**
	 * 주문 건수 훅
	 */
	useEffect(() => {
		const result = {
			NUM_OF_UPLOAD_READY_REVIEW: 0,
			NUM_OF_UPLOADED_REVIEW: 0,
		};

		deliveryAppReviewList.map((deliveryAppReview) => {
			if (deliveryAppReview.IS_REPLIED == 'N') {
				result.NUM_OF_UPLOAD_READY_REVIEW += 1;
			} else {
				result.NUM_OF_UPLOADED_REVIEW += 1;
			}
		});

		setReviewDataSet(result);
	}, [deliveryAppReviewList]);

	return (
		<Box pb={10}>
			{/* 필터 영역 */}
			<Box mb={1.5}>
				<DeliveryAppItemFilter
					memory={props.memory}
					deliveryAppServiceMemberId={
						props.deliveryAppServiceMemberId
					}
					dataController={controller}
					setFilteredDataList={setDeliveryAppReviewList}
					injectedDateRange={[
						{
							startDate: moment().subtract(1, 'months').toDate(),
							endDate: moment().toDate(),
							key: 'selection',
						},
					]}
				/>
			</Box>

			{/* 리뷰 요약 영역 */}
			<Box mb={1.5}>
				<DeliveryAppCardViewer
					summaryList={reviewSummaryList}
					activatedSummaryIndex={activatedSummaryIndex}
					setActivatedSummaryIndex={setActivatedSummaryIndex}
				/>
			</Box>

			{/* 콘텐츠 영역 */}
			<Box>
				{deliveryAppReviewList.length == 0 ? (
					<EmptyList />
				) : (
					<Box>
						{deliveryAppReviewList
							.filter((dataEl) => {
								if (activatedSummaryIndex == 0) {
									return dataEl.IS_REPLIED == 'N';
								} else if (activatedSummaryIndex == 1) {
									return dataEl.IS_REPLIED == 'Y';
								} else {
									return true;
								}
							})
							.map((dataEl, index) => (
								<Box key={index}>
									<ReviewEditForm
										reviewBotDelay={dataEl.DELAY_HOUR}
										element={dataEl}
									/>
								</Box>
							))}
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default DeliveryAppReviewViewer;
