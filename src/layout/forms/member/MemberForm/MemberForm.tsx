import { Box } from '@mui/material';
import React from 'react';
import { IData } from '../../../../@types/base/data';
import { IMemberFormProps } from '../../../../@types/layout/auth/forms';
import MemberController from '../../../../controller/default/MemberController';
import DataUtil from '../../../../utils/data/DataUtil';
import BaseForm from '../../base/BaseForm/BaseForm';

const MemberForm = (props: IMemberFormProps) => {
	//* Modules
	const dataUtil = new DataUtil();

	//* Controller
	const controller = new MemberController(props.modelName);

	const dataList: IData[] = [
		{
			keys: ['USER_NAME'],
			ui: 'textarea',
			type: 'username',
			label: '아이디',
			callbacks: {
				doubleCheckUserName:
					controller.doubleCheckUserName.bind(controller),
			},
			grid: {
				xs: 12,
				md: 6,
			},
		},
		{
			keys: ['PASSWORD'],
			ui: 'textarea',
			type: 'password',
			isOptional: true,
			label: '비밀번호',
			grid: {
				xs: 12,
				md: 6,
			},
		},
		{
			keys: ['FULL_NAME'],
			ui: 'textarea',
			label: '이름',
			grid: {
				xs: 12,
				md: 6,
			},
		},
		{
			keys: ['PHONE_NUMBER'],
			ui: 'textarea',
			label: '전화번호',
			grid: {
				xs: 12,
				md: 6,
			},
		},
		{
			keys: ['POST_CODE', 'PRIMARY_ADDRESS', 'DETAILED_ADDRESS'],
			ui: 'address',
			label: '유저 주소',
			isOptional: true,
			grid: {
				xs: 12,
				md: 6,
			},
		},
	];

	return (
		<Box>
			<BaseForm
				modelIdKey={
					dataUtil.convertToUpperCasedUnderbarSeparated(
						props.modelName
					) + '_IDENTIFICATION_CODE'
				}
				dataList={
					props.dataList !== undefined ? props.dataList : dataList
				}
				memory={props.memory}
				createCallback={controller.createItem.bind(controller)}
				updateCallback={controller.updateItem.bind(controller)}
				findOneCallback={controller.getOneItem.bind(controller)}
				deleteCallback={controller.deleteItem.bind(controller)}
			/>
		</Box>
	);
};

export default MemberForm;
