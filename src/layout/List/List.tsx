import { Box, Grid, Typography, useTheme } from '@mui/material';
import React from 'react';
import { IList } from '../../@types/layout/list/list';
import { useRouter } from 'next/router';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import moment from 'moment';
import 'moment/locale/ko';
import { IRendering } from '../../@types/layout/list/list';
import DataUtil from '../../utils/data/DataUtil';

// type Props = {};

const List = (props: IList) => {
	//* Modules
	const router = useRouter();
	const theme = useTheme();
	const dataUtil = new DataUtil();

	//* Functions
	const renderColumn = (
		targetRenderFunction: IRendering | undefined,
		columnKey: string,
		element: any,
		isFixed?: boolean
	) => {
		let renderDefault: boolean = true;

		if (targetRenderFunction !== undefined) {
			if (targetRenderFunction[columnKey] !== undefined) {
				renderDefault = false;
			}
		}

		if (renderDefault == true) {
			//* Set render data
			const targetData = element[columnKey];
			let renderData = '';

			if (
				targetData === undefined ||
				targetData === null ||
				targetData === ''
			) {
				renderData = '데이터 없음';
			} else {
				if (/(CREATED|DELETED|UPDATED)_AT/g.test(columnKey) == true) {
					renderData = moment(element[columnKey]).format(
						'YYYY/MM/DD a hh시 mm분'
					);

					renderData = dataUtil.convertATypeFormattedDate(renderData);
				} else {
					if (typeof targetData === 'string') {
						renderData =
							targetData.length > 20
								? targetData.slice(0, 20) + '...'
								: targetData;
					} else {
						renderData = targetData;
					}
				}
			}

			//* Default render method
			return (
				<Box>
					<Typography
						variant={'body2'}
						sx={{ whiteSpace: 'pre-line' }}
						fontWeight={'400'}
						color={
							isFixed === true
								? '#fff'
								: renderData === '데이터 없음'
								? theme.palette.grey[600]
								: undefined
						}
					>
						{renderData}
					</Typography>
				</Box>
			);
		} else {
			if (targetRenderFunction !== undefined) {
				return targetRenderFunction[columnKey](
					element,
					props.allData,
					props.setAllData
				);
			}
		}
	};

	return (
		<Box
			width={'100%'}
			display={'flex'}
			flexDirection={'column'}
			sx={{
				overflowX: props.disableOverflow === true ? 'initial' : 'auto',
			}}
		>
			{props.disableTotal !== true && (
				<Box>
					<Typography variant={'h6'}>총 {props.total}개</Typography>
				</Box>
			)}
			<Box
				width={'100%'}
				minWidth={
					props.minWidth !== undefined ? props.minWidth : '1000px'
				}
			>
				<Box mt={1}>
					<Grid
						container
						spacing={1}
						sx={{
							borderBottom: `1px solid ${theme.palette.grey[400]}`,
							borderTop: `1px solid ${theme.palette.grey[400]}`,
						}}
					>
						{props.listHeader.map((item, index) => (
							<Grid
								item
								md={item.gridMd}
								xs={item.gridXs}
								key={index}
							>
								<Box
									pl={index == 0 ? 1 : 0}
									pb={1}
									display={'flex'}
									alignItems={'center'}
									justifyContent={
										props.textAlign !== undefined
											? props.textAlign
											: 'start'
									}
								>
									{item.icon !== undefined && (
										<Box mr={1}>{item.icon}</Box>
									)}

									<Box>
										<Typography
											variant={
												item.fontSize !== undefined
													? (item.fontSize as
															| 'button'
															| 'caption'
															| 'h1'
															| 'h2'
															| 'h3'
															| 'h4'
															| 'h5'
															| 'h6'
															| 'inherit'
															| 'subtitle1'
															| 'subtitle2'
															| 'body1'
															| 'body2'
															| 'overline'
															| undefined)
													: 'subtitle1'
											}
											fontWeight={
												props.headerFontWeight !==
												undefined
													? props.headerFontWeight
													: '500'
											}
											color={theme.palette.grey[600]}
										>
											{item.label}
										</Typography>
									</Box>
								</Box>
							</Grid>
						))}
					</Grid>
				</Box>
				{props.fixedData !== undefined &&
					props.fixedData.map((fixedEl: any, fixedIndex: number) => {
						return (
							<Box
								py={2}
								sx={Object.assign(
									{
										backgroundColor:
											theme.palette.primary.main,
										borderBottom: `1px solid ${theme.palette.grey[400]}`,
										cursor: 'pointer',
										'&:hover': {
											backgroundColor:
												theme.palette.primary.dark,
										},
									},
									props.disableRoute == true
										? {}
										: {
												'&:hover': {
													backgroundColor:
														theme.palette.primary
															.dark,
												},
										  }
								)}
								onClick={() => {
									if (props.modelIdKey !== undefined) {
										if (props.disableRoute !== true) {
											let targetLink = `${
												router.pathname
											}/${fixedEl[props.modelIdKey]}`;

											if (
												props.linkCallback !== undefined
											) {
												targetLink =
													props.linkCallback(fixedEl);
											} else {
												router.push(targetLink);
											}
										}
									}
								}}
							>
								<Grid container spacing={1} key={fixedIndex}>
									{props.listHeader.map(
										(
											listFixedHeaderElement: any,
											i: number
										) => {
											return (
												<Grid
													item
													pr={1}
													key={JSON.stringify(i)}
													md={
														listFixedHeaderElement.gridMd
													}
													xs={
														listFixedHeaderElement.gridXs
													}
												>
													<Box pl={i == 0 ? 1 : 0}>
														{renderColumn(
															props.fixedRender,
															listFixedHeaderElement.key,
															fixedEl,
															true
														)}
													</Box>
												</Grid>
											);
										}
									)}
								</Grid>
							</Box>
						);
					})}
				{props.data.length == 0 ? (
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
						<Box>
							<Typography
								variant={'h6'}
								color={theme.palette.grey[700]}
							>
								데이터가 존재하지 않습니다.
							</Typography>
						</Box>
					</Box>
				) : (
					<Box
						sx={{
							width: '100%',
							backgroundColor: '#fbfbfb',
						}}
					>
						{props.data.map((element: any, index: number) => {
							return props.customListItemRenderCallback !==
								undefined ? (
								props.customListItemRenderCallback(
									element,
									index,
									props.listHeader,
									(columnKey: string, element: any) => {
										return renderColumn(
											props.render,
											columnKey,
											element
										);
									}
								)
							) : (
								<Box
									py={2}
									sx={{
										'&:hover': {
											backgroundColor:
												props.headerBackgroundColor !==
													undefined &&
												props.disableRoute !== true
													? props.headerBackgroundColor
													: '#f5f5f5',
										},

										borderBottom: `1px solid ${theme.palette.grey[400]}`,
										cursor: 'pointer',
									}}
									onClick={() => {
										if (props.disableOnClick !== true) {
											if (
												props.modelIdKey !== undefined
											) {
												if (
													props.disableRoute !== true
												) {
													let targetLink = `${
														router.pathname
													}/${
														element[
															props.modelIdKey
														]
													}`;

													if (
														props.linkCallback !==
														undefined
													) {
														targetLink =
															props.linkCallback(
																element
															);
													} else {
														router.push(targetLink);
													}
												}
											}
										}
									}}
								>
									<Grid container spacing={1} key={index}>
										{props.listHeader.map(
											(
												listHeaderElement: any,
												index: number
											) => {
												return (
													<Grid
														item
														md={
															listHeaderElement.gridMd
														}
														display={'flex'}
														alignItems={'center'}
														xs={
															listHeaderElement.gridXs
														}
														key={JSON.stringify(
															index
														)}
													>
														<Box
															pl={
																index == 0
																	? 1
																	: 0
															}
														>
															{renderColumn(
																props.render,
																listHeaderElement.key,
																element
															)}
														</Box>
													</Grid>
												);
											}
										)}
									</Grid>
								</Box>
							);
						})}
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default List;
