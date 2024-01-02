import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

interface IEmptyListProps {
	children?: React.ReactNode;
}

const EmptyList = (props: IEmptyListProps) => {
	//* Modules
	const theme = useTheme();

	return (
		<Box
			width={'100%'}
			height={'300px'}
			display={'flex'}
			flexDirection={'column'}
			justifyContent={'center'}
			alignItems={'center'}
			sx={{
				backgroundColor: '#fbfbfb',
			}}
		>
			<Box>
				<SentimentVeryDissatisfiedIcon
					sx={{
						width: '60px',
						height: '60px',
						marginBottom: '10px',
						color: theme.palette.grey[800],
					}}
				/>
			</Box>
			<Box>{props.children}</Box>
			<Box>
				<Typography variant={'h6'} color={theme.palette.grey[700]}>
					데이터가 존재하지 않습니다.
				</Typography>
			</Box>
		</Box>
	);
};

export default EmptyList;
