import { Box, BoxProps } from '@mui/material';
import React from 'react';

interface IAccountLayout {
	px?: number;
	py?: number;
	containerStyle?: BoxProps;
	type?: 'success';
	children: React.ReactElement | React.ReactElement[];
	maxWidth?: string;
	disableShadow?: boolean;
	disablePadding?: boolean;
}

const AccountLayout = (props: IAccountLayout) => {
	return (
		<Box
			mb={props.containerStyle !== undefined ? 0 : 60}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Box
				px={{
					md:
						props.disablePadding === true
							? 0
							: props.px !== undefined
							? props.px
							: 3.75,
					xs: 4,
				}}
				py={
					props.disablePadding === true
						? 0
						: props.py !== undefined
						? { xs: 0, md: props.py }
						: { xs: 0, md: 4 }
				}
				width={'100%'}
				maxWidth={
					props.maxWidth !== undefined ? props.maxWidth : '524px'
				}
				borderRadius={2}
				boxShadow={{
					md:
						props.disableShadow === true
							? undefined
							: props.type !== undefined
							? '0px 0px 8px 0px #11111A1A'
							: '0px 8px 24px 0px rgba(149, 157, 165, 0.15)',
					xs: 'none',
				}}
				sx={
					props.containerStyle !== undefined
						? Object.assign(
								{
									backgroundColor:
										props.type !== undefined
											? 'inherit'
											: 'rgba(255, 255, 255, 1)',
								},
								{ ...props.containerStyle }
						  )
						: {
								backgroundColor:
									props.type !== undefined
										? 'inherit'
										: 'rgba(255, 255, 255, 1)',
						  }
				}
			>
				{props.children}
			</Box>
		</Box>
	);
};

export default AccountLayout;
