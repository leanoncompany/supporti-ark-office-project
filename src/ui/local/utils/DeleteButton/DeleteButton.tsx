import { IconButton, Button, Box, Typography } from '@mui/material';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { IDeleteButtonProps } from '../../../../@types/ui/local/utils';

import usePageRole from '../../../../hooks/pages/usePageRole';

const DeleteButton = (props: IDeleteButtonProps) => {
	//* Modules
	const router = useRouter();

	//* States
	const { pageRole, pid } = usePageRole();
	const [finalPageRole, setFinalPageRole] = React.useState<string>('');

	const setFindOneOption = () => {
		const findOneOption: { [key: string]: any } = {};

		if (props.data !== undefined) {
			findOneOption[props.modelIdKey] = props.data[props.modelIdKey];
		} else {
			findOneOption[props.modelIdKey] = props.pid || Number(pid);
		}

		return findOneOption;
	};

	useEffect(() => {
		//* Set final page role
		if (props.pageRole !== undefined) {
			setFinalPageRole(props.pageRole);
		} else {
			setFinalPageRole(pageRole);
		}
	}, [pageRole, props.pageRole]);

	//* Function
	const onClickButton = () => {
		// eslint-disable-next-line no-restricted-globals
		const result = confirm('정말 데이터를 삭제하시겠습니까?');

		if (result) {
			const findOneOption: { [key: string]: any } = setFindOneOption();

			if (props.deleteCallback !== undefined) {
				props.deleteCallback(
					findOneOption,
					(response) => {
						alert('삭제가 완료되었습니다.');
						router.back();
					},
					(err) => {
						alert('삭제에 실패하였습니다.');
					}
				);
			} else {
				alert('삭제에 실패하였습니다. (삭제 기능 제공 안됨)');
			}
		}
	};

	return (
		<React.Fragment>
			{finalPageRole == 'edit' && (
				<Box ml={1.5}>
					{props.buttonType === 'icon' ||
					props.buttonType === undefined ? (
						<Box
							display={'flex'}
							flexDirection={'column'}
							alignItems={'center'}
						>
							<IconButton
								color={'primary'}
								onClick={() => {
									onClickButton();
								}}
							>
								<DeleteForeverRoundedIcon />
							</IconButton>
							<Box mt={'-10px'}>
								<Typography variant={'caption'}>
									삭제
								</Typography>
							</Box>
						</Box>
					) : (
						<Button
							onClick={() => {
								onClickButton();
							}}
						>
							삭제하기
						</Button>
					)}
				</Box>
			)}
		</React.Fragment>
	);
};

export default DeleteButton;
