import { Box, Grid, IconButton, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { IListHeader } from '../../../../@types/layout/list/list';
import BaseList from '../../../../layout/List/base/BaseList/BaseList';
import moment from 'moment';
import DataUtil from '../../../../utils/data/DataUtil';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import Memory from '../../../../utils/data/Memory';
import DefaultController from '../../../../controller/default/DefaultController';

export interface IDeliveryAppServiceMemberListProps {
	memory: Memory;
}

const DeliveryAppServiceMemberList = (
	props: IDeliveryAppServiceMemberListProps
) => {
	const dataUtil = new DataUtil();
	const modelName = 'DeliveryAppServiceMember';
	const controller = new DefaultController(modelName);
	const [header, setHeader] = useState<IListHeader[]>([
		{
			label: '회원명',
			key: 'FULL_NAME',
			gridMd: 3,
			gridXs: 3,
		},
		{
			label: '전화번호',
			key: 'PHONE_NUMBER',
			gridMd: 3,
			gridXs: 3,
		},
		{
			label: '생성일',
			key: 'CREATED_AT',
			gridMd: 3,
			gridXs: 3,
		},
	]);

	const [filterList, setFilterList] = useState<
		{ label: string; value: string }[]
	>([
		{
			label: '사장님 이름',
			value: 'FULL_NAME',
		},
		{
			label: '사장님 전화번호',
			value: 'PHONE_NUMBER',
		},
		// {
		// 	label: '배달앱 계정 아이디',
		// 	value: 'REGISTERED_ACCOUNT_USER_NAME',
		// },
		// {
		// 	label: '샵인샵 가게명',
		// 	value: 'REGISTERED_ACCOUNT_SHOP_NAME',
		// },
	]);

	const [contentChild, setContentChild] = useState<{
		[key: string]: (el: any) => any;
	}>({});

	useEffect(() => {}, []);

	return (
		<Box>
			<BaseList
				contentChild={contentChild}
				disableTotal={true}
				modelIdKey={
					dataUtil.convertToUpperCasedUnderbarSeparated(modelName) +
					'_IDENTIFICATION_CODE'
				}
				memory={props.memory}
				getAllCallback={controller.getAllItems.bind(controller)}
				filterList={filterList}
				tableHeader={header}
				customControllerButton={
					<Box
						display={'flex'}
						flexDirection={'column'}
						alignItems={'center'}
					>
						{/* <IconButton
							color={'primary'}
							size="small"
							sx={{}}
							onClick={() => {
								const input = document.getElementById(
									'excel-input'
								) as HTMLInputElement;

								input.click();
							}}
						>
							<UploadFileRoundedIcon
								style={{
									fontSize: 'larger',
								}}
							/>
						</IconButton>
						<Box mt={'-10px'}>
							<Typography variant={'caption'}>
								엑셀 업로드
							</Typography>
						</Box>

						<Box display={'none'}>
							<input
								accept=".xlsx"
								type="file"
								id="excel-input"
							/>
						</Box> */}
					</Box>
				}
			/>
		</Box>
	);
};

export default DeliveryAppServiceMemberList;
