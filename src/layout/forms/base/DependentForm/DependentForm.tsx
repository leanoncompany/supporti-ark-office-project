import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import DeleteButton from '../../../../ui/local/utils/DeleteButton';
import UpdateButton from '../../../../ui/local/utils/UpdateButton';
import { InputRenderer } from '../../../../utils/render/InputRenderer';
import useDataControl from '../../../../hooks/data/useDataControl';
import usePageRole from '../../../../hooks/pages/usePageRole';
import { IDependentFormProps } from '../../../../@types/layout/forms/base';
import useDependentDataControl from '../../../../hooks/data/useDependentDataControl';
import usePageLabel from '../../../../hooks/data/usePageLabel';

const DependentForm = (props: IDependentFormProps) => {
	//* Modules
	const inputRenderer = new InputRenderer();

	//* States
	const { labelTail } = usePageLabel(props.memory);
	const [data, setData] = React.useState<any>(null);
	const [labelSuffix, setLabelSuffix] = React.useState<string>('');

	//* Constant
	const buttonType: 'icon' | 'text' = 'icon';

	//* States
	const { pageRole, wrappedDataDict } = useDependentDataControl(
		setData,
		props.dependentModelData,
		props.dependentModelIdKey,
		props.dataList,
		props.findOneByKeyCallback,
		props.setFetchedData
	);

	//* Hooks
	/**
	 * Hook to set label's suffix
	 */
	React.useEffect(() => {
		if (pageRole == 'write') {
			setLabelSuffix('등록');
		} else if (pageRole == 'edit') {
			setLabelSuffix('상세');
		}
	}, [pageRole]);

	/**
	 * Data loader hook
	 */

	return (
		<Box p={1.75} borderRadius={2} sx={{ background: '#f3f3f3' }} mb={1.5}>
			<Box
				p={1.5}
				pt={1.25}
				borderRadius={1.75}
				sx={{ background: '#fff' }}
			>
				{/* Header */}
				<Box
					display={props.hideHeader == true ? 'none' : 'flex'}
					justifyContent={'space-between'}
					alignItems={'center'}
				>
					{/* Label */}
					<Typography variant={'h6'} fontWeight={500}>
						{props.label !== undefined
							? props.label
							: `${labelTail} ${labelSuffix}`}
					</Typography>

					{/* Buttons */}
					<Box
						alignItems={'center'}
						display={props.disableEdit == true ? 'none' : 'flex'}
					>
						{/* Update Button */}
						<Box>
							<UpdateButton
								data={data}
								dependentModelData={props.dependentModelData}
								pageRole={pageRole}
								modelIdKey={props.modelIdKey}
								dependentModelIdKey={props.dependentModelIdKey}
								dataList={props.dataList}
								createCallback={props.createCallback}
								updateCallback={props.updateCallback}
								wrappedDataDict={wrappedDataDict}
								buttonType={buttonType}
								validationCallback={props.validationCallback}
								disableNavigateAfterAction={
									props.disableNavigateAfterAction
								}
							/>
						</Box>

						{/* Delete button */}
						<DeleteButton
							data={data}
							pageRole={pageRole}
							modelIdKey={props.modelIdKey}
							buttonType={buttonType}
							deleteCallback={props.deleteCallback}
						/>
					</Box>
				</Box>

				{/* Contents */}
				<Box>
					<Grid container spacing={1.5} alignItems={'flex-end'}>
						{Object.keys(wrappedDataDict).length != 0 &&
							props.dataList.map((data) => {
								return (
									<Grid
										item
										{...data.grid}
										key={JSON.stringify(data.keys)}
									>
										{inputRenderer.render(
											data,
											wrappedDataDict,
											props.disableEdit
										)}
									</Grid>
								);
							})}
					</Grid>
				</Box>
			</Box>
		</Box>
	);
};

export default DependentForm;
