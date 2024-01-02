import {
	Box,
	Grid,
	ToggleButtonGroup,
	ToggleButton,
	Typography,
	TextField,
	useTheme,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import moment from 'moment';

interface IPeriod {
	label: string;
	period: 'all' | 'year' | 'month' | 'week' | 'day' | 'directInput';
	value?: number;
}

interface IDateRangePickerProps {
	startDate: Date | null;
	setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
	endDate: Date | null;
	setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
	selectablePeriodList?: IPeriod[];
	gridConfig?: {
		left?: {
			[key: string]: any;
		};
		right?: {
			[key: string]: any;
		};
		container?: {
			[key: string]: any;
		};
	};
}

const DateRangePicker = (props: IDateRangePickerProps) => {
	//* Modules
	const theme = useTheme();

	//* Constants
	const periodList: IPeriod[] = [
		{
			period: 'all',
			label: '전체',
		},
		{
			value: 1,
			period: 'month',
			label: '1개월',
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
	];

	//* Functions
	const getPeriods = () => {
		let targetPeriods: IPeriod[] = [];

		if (props.selectablePeriodList !== undefined) {
			targetPeriods = props.selectablePeriodList;
		} else {
			targetPeriods = periodList;
		}

		if (targetPeriods.length > 0) {
			return targetPeriods;
		} else {
			throw new Error('Selectable Period List is Empty');
		}
	};

	//* States
	const [startDate, setStartDate] = useState<Dayjs | null>(null);
	const [endDate, setEndDate] = useState<Dayjs | null>(null);
	const [selectedIndex, setSelectedIndex] = useState<number>(0);

	//* Hooks
	useEffect(() => {
		const selectedPeriod = getPeriods()[selectedIndex];
		const current = moment();
		let past = moment();

		if (selectedPeriod.period == 'all') {
			past = past.subtract('years', 10);
		} else {
			if (selectedPeriod.period != 'directInput') {
				if (selectedPeriod.value !== undefined) {
					past = past.subtract(
						selectedPeriod.period,
						selectedPeriod.value
					);
				} else {
					throw new Error(
						'If period is not "all" or "directInput" value must be number'
					);
				}
			}
		}

		if (selectedPeriod.period != 'directInput') {
			setStartDate(dayjs(past.format('YYYY-MM-DD 00:00:00')));
			setEndDate(dayjs(current.format('YYYY-MM-DD 23:59:59')));
		}
	}, [selectedIndex]);

	useEffect(() => {
		if (startDate !== null && endDate !== null) {
			props.setStartDate(
				new Date(startDate.format('YYYY-MM-DDT00:00:00'))
			);
			props.setEndDate(new Date(endDate.format('YYYY-MM-DDT23:59:59')));
		}
	}, [startDate, endDate]);

	return (
		<Box>
			<Grid
				container
				columnSpacing={{ xs: 0.5, md: 2 }}
				mt={1}
				display={'flex'}
				justifyContent={'space-between'}
				alignItems={'center'}
				mb={1}
				{...props.gridConfig?.container}
			>
				<Grid
					item
					md={4}
					xs={12}
					display={'flex'}
					{...props.gridConfig?.left}
				>
					<ToggleButtonGroup
						size="small"
						value={selectedIndex}
						exclusive={true}
						onChange={(
							event: React.MouseEvent<HTMLElement>,
							newPeriodIndex: number
						) => {
							if (
								!(
									newPeriodIndex === null &&
									selectedIndex !== null
								)
							) {
								setSelectedIndex(newPeriodIndex);
							}
						}}
						aria-label="Large sizes"
						fullWidth
					>
						{getPeriods().map((period, index) => (
							<ToggleButton
								value={index}
								key={period.label}
								sx={{
									'&.Mui-selected': {
										backgroundColor:
											theme.palette.primary.main,
									},
									'&:hover': {
										backgroundColor:
											selectedIndex == index
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
												selectedIndex == index
													? '#ffffff'
													: theme.palette.grey[800],
										}}
									>
										{period.label}
									</Typography>
								</Box>
							</ToggleButton>
						))}
					</ToggleButtonGroup>
				</Grid>

				<Grid
					item
					md={6}
					xs={12}
					flexDirection={'row'}
					display={'flex'}
					mt={{ md: 0, xs: 1 }}
					{...props.gridConfig?.right}
				>
					<Box
						display={
							getPeriods()[selectedIndex].period == 'directInput'
								? 'block'
								: 'none'
						}
					>
						<Grid container spacing={{ xs: 0.5, md: 1.5 }}>
							<Grid item xs={6} md={6}>
								<LocalizationProvider
									dateAdapter={AdapterDayjs}
								>
									<DatePicker
										disableFuture
										openTo="day"
										value={startDate}
										inputFormat={'YYYY/MM/DD'}
										mask={'____/__/__'}
										onChange={(newValue) => {
											setStartDate(newValue);
										}}
										renderInput={(params) => (
											<TextField
												{...params}
												size="small"
												sx={{
													borderRadius: '50%',
													input: {
														fontSize: '12px',
													},
													'.MuiSvgIcon-root ': {
														width: '19px',
													},
												}}
											/>
										)}
									/>
								</LocalizationProvider>
							</Grid>
							<Grid item xs={6} md={6}>
								<LocalizationProvider
									dateAdapter={AdapterDayjs}
								>
									<DatePicker
										disableFuture
										openTo="day"
										value={endDate}
										inputFormat={'YYYY/MM/DD'}
										mask={'____/__/__'}
										onChange={(newValue) => {
											setEndDate(newValue);
										}}
										renderInput={(params) => (
											<TextField
												{...params}
												size="small"
												sx={{
													borderRadius: '10px',
													input: {
														fontSize: '12px',
													},
													'.MuiSvgIcon-root ': {
														width: '19px',
													},
												}}
											/>
										)}
									/>
								</LocalizationProvider>
							</Grid>
						</Grid>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default DateRangePicker;
