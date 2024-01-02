import {
	Box,
	Grid,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
	useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IBasicStatisticsFormProps } from '../../../@types/layout/forms/base';
import DateRangePicker from '../../../ui/local/utils/DateRangePicker/DateRangePicker';
import moment from 'moment';
import List from '../../List';
import StatisticsController from '../../../controller/default/StatisticsController';
import usePageLabel from '../../../hooks/data/usePageLabel';
import { DateSelectPicker } from '../../../ui/local/utils/DateSelectPicker';
// type Props = {}

const BasicStatisticsForm = (props: IBasicStatisticsFormProps) => {
	//* Modules
	const statisticsController = new StatisticsController();
	const theme = useTheme();

	//* States
	const { labelTail } = usePageLabel(props.memory);
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);

	const [selectedDateUnit, setSelectedDateUnit] = useState<string | null>(
		'month'
	);
	const [dataList, setDataList] = useState<{ [key: string]: any }[]>([]);

	const [totalValue, setTotalValue] = useState<number>();

	//* Constants
	const dateUnitOptions: { value: string; label: string }[] = [
		{ value: 'month', label: '월별' },
		{ value: 'day', label: '일별' },
	];

	const [contentChild, setContentChild] = useState<{
		[key: string]: (el: any) => any;
	}>({
		CREATED_AT: (element: any) => {
			return (
				<Typography
					sx={{ whiteSpace: 'pre-line' }}
					fontWeight={'400'}
					variant={'body2'}
				>
					{moment(element.date).format(
						element.SELECTED_DATE_UNIT === 'month'
							? 'YYYY/MM'
							: 'YYYY/MM/DD'
					)}
				</Typography>
			);
		},
	});

	//* Hooks
	useEffect(() => {
		if (props.setSelectedDateUnit !== undefined) {
			props.setSelectedDateUnit(selectedDateUnit);
		}
	}, [selectedDateUnit]);

	useEffect(() => {
		if (
			startDate !== null &&
			endDate !== null &&
			selectedDateUnit !== null
		) {
			const startDateMoment = moment(startDate);
			const endDateMoment = moment(endDate);

			if (selectedDateUnit === 'month') {
				startDateMoment.add('year', 1);
				endDateMoment.add('year', 1);
			}

			if (props.injectedGetStatisticsList !== undefined) {
				props.injectedGetStatisticsList(
					startDate,
					endDate,
					selectedDateUnit,
					setDataList
				);
			} else {
				if (props.targets !== undefined) {
					statisticsController.getStatisticsList(
						{
							TARGETS: props.targets,
							INTERVAL_TYPE: selectedDateUnit,
							START_DATE: startDateMoment.toDate(),
							END_DATE: endDateMoment.toDate(),
						},
						(response) => {
							console.log({
								TARGETS: props.targets,
								INTERVAL_TYPE: selectedDateUnit,
								START_DATE: startDate,
								END_DATE: endDate,
							});
							let resultDataList = response.data.result;

							if (props.formatDataList !== undefined) {
								resultDataList =
									props.formatDataList(resultDataList);
							}

							setDataList(
								resultDataList.map((resultData: any) => {
									return Object.assign(resultData, {
										SELECTED_DATE_UNIT: selectedDateUnit,
									});
								})
							);

							const sumModelKey = props.sumKey?.modelKey;
							const sumValueKey = props.sumKey?.valueKey;
							const sumCallback = props.sumKey?.sumCallback;

							if (
								sumModelKey !== undefined &&
								sumValueKey !== undefined
							) {
								let totalAmount: number = 0;

								resultDataList.map((el: any) => {
									if (el.data.hasOwnProperty(sumModelKey)) {
										el.data[sumModelKey].map(
											(element: any) => {
												if (sumCallback !== undefined) {
													totalAmount = sumCallback(
														totalAmount,
														element
													);
												} else {
													totalAmount +=
														element[sumValueKey];
												}
											}
										);
									}
								});

								setTotalValue(totalAmount);
							}
						},
						(error) => {
							alert('통계 데이터 로드에 실패했습니다.');
						}
					);
				} else {
					throw new Error('Invalid target.');
				}
			}
		}
		// else {
		// 	throw new Error('Invalid date range or date unit.');
		// }
	}, [startDate, endDate]);

	return (
		<Box>
			{/* Header section */}
			<Box alignItems={'center'}>
				{/* Label */}
				<Typography variant="h6" fontWeight={600}>
					{`${labelTail}`}
				</Typography>
			</Box>

			{/* Controller section */}
			<Box>
				{/* Date Range area */}
				<Box>
					{props.useRange ? (
						<DateRangePicker
							startDate={startDate}
							setStartDate={setStartDate}
							endDate={endDate}
							setEndDate={setEndDate}
							selectablePeriodList={[
								{
									value: 1,
									period: 'month',
									label: '1개월',
								},
								{
									value: 3,
									period: 'month',
									label: '3개월',
								},
								{
									value: 6,
									period: 'month',
									label: '6개월',
								},
								{
									period: 'directInput',
									label: '직접입력',
								},
							]}
						/>
					) : (
						<DateSelectPicker
							startDate={startDate}
							setStartDate={setStartDate}
							endDate={endDate}
							setEndDate={setEndDate}
							selectedDateUnit={selectedDateUnit}
							selectors={(() => {
								if (selectedDateUnit == 'month') {
									return ['year'];
								} else {
									return ['year', 'month'];
								}
							})()}
						/>
					)}
				</Box>

				{/* Date unit format */}
				<Box>
					<ToggleButtonGroup
						size="small"
						value={selectedDateUnit}
						exclusive={true}
						onChange={(
							event: React.MouseEvent<HTMLElement>,
							value: string
						) => {
							if (
								!(value === null && selectedDateUnit !== null)
							) {
								setSelectedDateUnit(value);
							}
						}}
						aria-label="Large sizes"
						fullWidth
					>
						{dateUnitOptions.map((dateUnitOption) => (
							<ToggleButton
								value={dateUnitOption.value}
								key={dateUnitOption.value}
								sx={{
									'&.Mui-selected': {
										backgroundColor:
											theme.palette.primary.main,
									},
									'&:hover': {
										backgroundColor:
											selectedDateUnit ===
											dateUnitOption.value
												? `${theme.palette.primary.dark} !important`
												: '#e0e0e0',
									},
								}}
							>
								<Box
									display={'flex'}
									alignItems={'center'}
									justifyContent={'center'}
									flexDirection={'column'}
									py={0.5}
								>
									<Typography
										variant={'subtitle2'}
										sx={{
											color:
												selectedDateUnit ===
												dateUnitOption.value
													? '#ffffff'
													: theme.palette.grey[800],
										}}
									>
										{dateUnitOption.label}
									</Typography>
								</Box>
							</ToggleButton>
						))}
					</ToggleButtonGroup>
				</Box>
			</Box>

			{/* List section */}
			<Box mt={1} display={'flex'} flexDirection={'column'}>
				<List
					disableTotal={true}
					data={dataList}
					total={0}
					listHeader={props.listHeader}
					render={Object.assign(props.render, contentChild)}
					minWidth={'100%'}
					disableOverflow={true}
				/>
				{props.sumKey !== undefined && (
					<Box
						py={2}
						borderBottom={'1px solid #D4D4D4'}
						sx={{ backgroundColor: '#e6e6e6' }}
					>
						<Typography variant="body1" fontWeight={500}>
							합계 : {totalValue !== undefined ? totalValue : 0}
						</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default BasicStatisticsForm;
