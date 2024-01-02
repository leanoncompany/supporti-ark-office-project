import { Box, CardContent, Grid, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DefaultController from '../../../../controller/default/DefaultController';
import { BadgeFilter } from '../../../../ui/local/input/BadgeFilter';
import DataUtil from '../../../../utils/data/DataUtil';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { DateSelectPicker } from '../../../../ui/local/utils/DateSelectPicker';
import moment from 'moment';
import { DateFilterModal } from './children/DateFilterModal';
import { ShopFilterModal } from './children/ShopFilterModal';
import { ISelectedDeliveryShopFilterValue } from './children/ShopFilterModal/ShopFilterModal';

interface IDeliveryAppItemFilterProps {
	memory: any;
	deliveryAppServiceMemberId?: string | string[];
	dataController: DefaultController;
	setFilteredDataList: React.Dispatch<React.SetStateAction<any[]>>;
	injectedDateRange?: {
		startDate: Date;
		endDate: Date;
		key: string;
	}[];
}

const DeliveryAppItemFilter = (props: IDeliveryAppItemFilterProps) => {
	//* Modules
	const theme = useTheme();
	const dataUtil = new DataUtil();

	//* States
	// 시간 필터링 정보
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);

	/**
	 * 상점 필터링 정보
	 */
	const [shopFilterOption, setShopFilterOption] =
		useState<ISelectedDeliveryShopFilterValue>();

	//* Functions

	//* Hooks
	useEffect(() => {
		setShopFilterOption({
			SELECTED_DELIVERY_APP_SERVICE_MEMBER_ID:
				props.deliveryAppServiceMemberId !== undefined
					? String(props.deliveryAppServiceMemberId)
					: null,
			SELECTED_DELIVERY_APP_ACCOUNT_ID: null,
			SELECTED_DELIVERY_APP_SHOP_ID: null,
		});
	}, [props.deliveryAppServiceMemberId]);

	/**
	 * 데이터 불러오는 훅
	 */
	useEffect(() => {
		if (
			startDate !== null &&
			endDate !== null &&
			shopFilterOption !== undefined
		) {
			const startDateMoment = moment(startDate);
			const endDateMoment = moment(endDate);

			props.dataController.getData(
				{
					FILTER_OPTION: shopFilterOption,
					START_DATE: startDateMoment.toDate(),
					END_DATE: endDateMoment.toDate(),
				},
				`${props.dataController.mergedPath}/filter_data_by_shop`,
				(res) => {
					props.setFilteredDataList(res.data.result.rows);
				},
				(err) => {
					console.log(err);
					alert('데이터를 불러오는데 실패했습니다.');
				}
			);
		}
	}, [shopFilterOption, startDate, endDate]);

	//* Components
	return (
		<Box>
			{/* 필터 */}
			<Box border={'1px solid rgba(0,0,0,.1)'} borderRadius={1}>
				<Grid container>
					{/* 시간 필터 */}
					<Grid item xs={12} md={4}>
						<DateFilterModal
							memory={props.memory}
							startDate={startDate}
							setStartDate={setStartDate}
							endDate={endDate}
							setEndDate={setEndDate}
							injectedDateRange={props.injectedDateRange}
						/>
					</Grid>

					{/* 데이터 필터 */}
					<Grid item xs={12} md={8}>
						{shopFilterOption !== undefined && (
							<ShopFilterModal
								value={shopFilterOption}
								setValue={setShopFilterOption}
								memory={props.memory}
								deliveryAppServiceMemberId={
									props.deliveryAppServiceMemberId
								}
							/>
						)}
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
};

export default DeliveryAppItemFilter;
