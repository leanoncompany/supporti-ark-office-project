import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { ITermBoardFormProps } from '../../../../@types/layout/board';
import UpsertForm from '../../base/UpsertForm/UpsertForm';
import TermController from '../../../../controller/default/TermController';
import DataUtil from '../../../../utils/data/DataUtil';
import { IData } from '../../../../@types/base/data';

const TermsBoardForm = (props: ITermBoardFormProps) => {
	//* Modules
	const dataUtil = new DataUtil();

	//* Controller
	const controller = new TermController(props.modelName);

	//* Constants
	const dataList: IData[] = [
		{
			keys: ['CONTENT'],
			ui: 'textarea',
			label: '내용',
			rows: 20,
			captionMessages: {
				requiredMessage: '내용을 입력해야합니다',
			},
			grid: {
				xs: 12,
				md: 12,
			},
		},
	];

	//* Hooks
	useEffect(() => {});

	return (
		<Box>
			<UpsertForm
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
			/>
		</Box>
	);
};

export default TermsBoardForm;
