import { IconButton, Button, Box } from '@mui/material';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { IDeleteButtonProps } from '../../../../@types/ui/local/utils';
import usePageRole from '../../../../hooks/pages/usePageRole';
import Memory from '../../../../utils/data/Memory';
import DependentForm from '../../../../layout/forms/base/DependentForm/DependentForm';
import DefaultController from '../../../../controller/default/DefaultController';
import { IData, IWrappedDataDict } from '../../../../@types/base/data';

interface IMemoEditorProps {
	memberType: string;
	memory: Memory;
	modelData: IWrappedDataDict | undefined;
}

const MemoEditor = (props: IMemoEditorProps) => {
	//* Modules
	const memoController = new DefaultController('MemberMemo');

	//* States
	const [partialWrappedDataDict, setPartialWrappedDataDict] = React.useState<
		IWrappedDataDict | undefined
	>(undefined);

	//* Constants
	const dataList: IData[] = [
		{
			keys: ['CONTENT'],
			ui: 'textarea',
			rows: 3,
			label: '메모',
			captionMessages: {
				requiredMessage: '메모를  입력해야합니다',
			},
			grid: {
				xs: 12,
				md: 12,
			},
		},
	];

	//* Hooks
	useEffect(() => {
		if (
			props.modelData !== undefined &&
			partialWrappedDataDict === undefined
		) {
			if (Object.keys(props.modelData).length != 0) {
				//* Set partial wrapped data dict
				const tempPartialWrappedDataDict: IWrappedDataDict = {};
				const memberIdKey = `${props.memberType}_IDENTIFICATION_CODE`;

				console.log(props.modelData);
				console.log(memberIdKey);
				console.log(props.modelData[memberIdKey]);

				tempPartialWrappedDataDict['MEMBER_ID'] = {
					state: props.modelData[memberIdKey].state,
				};
				tempPartialWrappedDataDict['MEMBER_TYPE'] = {
					state: props.memberType,
				};

				setPartialWrappedDataDict(tempPartialWrappedDataDict);
			}
		}
	}, [props.modelData]);

	return (
		<React.Fragment>
			{partialWrappedDataDict !== undefined && (
				<DependentForm
					disableNavigateAfterAction={true}
					dependentModelData={partialWrappedDataDict}
					dependentModelIdKey={['MEMBER_ID', 'MEMBER_TYPE']}
					modelIdKey={'MEMBER_MEMO_IDENTIFICATION_CODE'}
					hideHeader={false}
					dataList={dataList}
					memory={props.memory}
					label={'메모'}
					createCallback={memoController.createItem.bind(
						memoController
					)}
					updateCallback={memoController.updateItem.bind(
						memoController
					)}
					findOneByKeyCallback={memoController.getOneItemByKey.bind(
						memoController
					)}
					deleteCallback={memoController.deleteItem.bind(
						memoController
					)}
				/>
			)}
		</React.Fragment>
	);
};

export default MemoEditor;
