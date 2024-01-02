import { Box } from '@mui/material';
import React from 'react';
// import { IData } from '../../../../@types/base/data';
import { IUnidirectionalBoardFormProps } from '../../../../@types/layout/board';
import BaseForm from '../../base/BaseForm/BaseForm';
import BoardController from '../../../../controller/default/BoardController';
import DataUtil from '../../../../utils/data/DataUtil';
import { IData } from '../../../../@types/base/data';

const UnidirectionalBoardForm = (props: IUnidirectionalBoardFormProps) => {
	//* Modules
	const dataUtil = new DataUtil();

	//* Controller
	const controller = new BoardController(props.modelName);

	const dataList: IData[] = [
		{
			keys: ['TITLE'],
			ui: 'textarea',
			label: '제목',
			captionMessages: {
				requiredMessage: '제목을 입력해야합니다',
			},
			grid: {
				xs: 12,
				md: 8,
			},
		},
		{
			keys: ['CONTENT'],
			ui: 'textarea',
			rows: 10,
			label: '내용',
			captionMessages: {
				requiredMessage: '내용을 입력해야합니다',
			},
			grid: {
				xs: 12,
				md: 12,
			},
		},
		{
			keys: ['IMAGE_LIST'],
			ui: 'imageUpload',
			isOptional: true,
			label: '이미지',
			captionMessages: {
				requiredMessage: '이미지를 골라야합니다',
			},
			grid: {
				xs: 12,
				md: 12,
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
				disableEdit={props.disableEdit}
				memory={props.memory}
				createCallback={controller.createItem.bind(controller)}
				updateCallback={controller.updateItem.bind(controller)}
				findOneCallback={controller.getOneItem.bind(controller)}
				deleteCallback={controller.deleteItem.bind(controller)}
			/>
		</Box>
	);
};

export default UnidirectionalBoardForm;
