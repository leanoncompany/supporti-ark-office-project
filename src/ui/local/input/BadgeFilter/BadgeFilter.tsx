import {
	Box,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
	useTheme,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Button } from '@mui/material';
import {
	useWhatChanged,
	setUseWhatChange,
} from '@simbathesailor/use-what-changed';

interface IBadgeFilterProps {
	label: string;
	filterKey: string;
	selectedFilter: string[];
	setSelectedFilter: React.Dispatch<React.SetStateAction<string[]>>;
	sourceList: any[];
	selectableFilterList: {
		label: string;
		value: string;
	}[];
	setFilteredItemList: React.Dispatch<React.SetStateAction<any[]>>;
	isToggleGroup?: boolean;
}

const BadgeFilter = (props: IBadgeFilterProps) => {
	//* Modules
	const theme = useTheme();

	//* States
	//* Functions
	/**
	 * 필터 클릭 시
	 */
	const onClickFilterElement = (selectableFilter: string) => {
		if (selectableFilter === '전체') {
			props.setSelectedFilter([]);
		} else {
			if (props.selectedFilter.includes(selectableFilter)) {
				props.setSelectedFilter(
					props.selectedFilter.filter((item) => {
						return item !== selectableFilter;
					})
				);
			} else {
				props.setSelectedFilter(
					props.selectedFilter.concat(selectableFilter)
				);
			}
		}
	};

	//* Functions
	const getSelectableFilterWithDefaultList = () => {
		return [
			{
				label: '전체',
				value: '전체',
			},
		].concat(props.selectableFilterList);
	};

	//* Hooks
	/**
	 * 선택된 필터 초기화
	 */
	useEffect(() => {
		props.setSelectedFilter([]);
	}, [props.sourceList]);

	/**
	 * 필터 변경 시 필터링
	 */
	const dev = [props.selectedFilter, props.sourceList, props.filterKey];

	useWhatChanged(dev, 'a, b, c, d');

	useEffect(() => {
		const filteredItemList =
			props.selectedFilter.length == 0
				? props.sourceList
				: props.sourceList.filter((item) => {
						return props.selectedFilter.includes(
							item[props.filterKey]
						);
				  });

		props.setFilteredItemList(filteredItemList);
	}, dev);

	//* Component
	return (
		<Box p={2}>
			<Box mb={1.5}>
				<Typography variant={'h6'}>{props.label}</Typography>
			</Box>

			{props.isToggleGroup === true ? (
				<ToggleButtonGroup
					size="large"
					value={props.selectableFilterList}
					onChange={(
						event: React.MouseEvent<HTMLElement>,
						value: string[] | null
					) => {
						if (value !== null) {
							if (value.includes('전체')) {
								props.setSelectedFilter([]);
							} else {
								props.setSelectedFilter(value);
							}
						}
					}}
					exclusive={false}
					aria-label="Large sizes"
				>
					{getSelectableFilterWithDefaultList().map(
						(selectableFilter) => (
							<ToggleButton
								value={selectableFilter.value}
								key={selectableFilter.value}
								sx={{
									display: 'block',
									height: '50px',
									borderLeft: `1px solid #e5e5e5 !important`,
									backgroundColor: (
										selectableFilter.value === '전체'
											? props.selectedFilter.length == 0
											: props.selectedFilter.includes(
													selectableFilter.value
											  )
									)
										? `${theme.palette.primary.main} !important`
										: 'white',
									'&:hover': {
										backgroundColor: (
											selectableFilter.value === '전체'
												? props.selectedFilter.length ==
												  0
												: props.selectedFilter.includes(
														selectableFilter.value
												  )
										)
											? `${theme.palette.primary.dark} !important`
											: '#e0e0e0',
									},
								}}
							>
								<Box
									display={'flex'}
									alignItems={'center'}
									justifyContent={'center'}
									flexDirection={'column'}
								>
									<Typography
										variant={'h6'}
										color={
											(
												selectableFilter.value ===
												'전체'
													? props.selectedFilter
															.length == 0
													: props.selectedFilter.includes(
															selectableFilter.value
													  )
											)
												? '#ffffff'
												: theme.palette.grey[800]
										}
									>
										{selectableFilter.label}
									</Typography>
								</Box>
							</ToggleButton>
						)
					)}
				</ToggleButtonGroup>
			) : (
				<Box
					width={'100%'}
					display={'flex'}
					justifyContent={'flex-start'}
					alignItems={'center'}
					flexWrap={'wrap'}
				>
					{getSelectableFilterWithDefaultList().map(
						(selectableFilter, index) => (
							<Box
								key={index}
								mr={0.5}
								mb={0.5}
								display={'flex'}
								justifyContent={'center'}
								alignItems={'center'}
								px={1.5}
								py={1}
								borderRadius={2}
								sx={{
									cursor: 'pointer',
									backgroundColor: (
										selectableFilter.value === '전체'
											? props.selectedFilter.length == 0
											: props.selectedFilter.includes(
													selectableFilter.value
											  )
									)
										? `${theme.palette.primary.main}`
										: 'white',
									'&:hover': {
										backgroundColor: (
											selectableFilter.value === '전체'
												? props.selectedFilter.length ==
												  0
												: props.selectedFilter.includes(
														selectableFilter.value
												  )
										)
											? `${theme.palette.primary.dark}`
											: '#e0e0e0',
									},
								}}
								borderColor={theme.palette.primary.main}
								border={`1px solid ${
									(
										selectableFilter.value === '전체'
											? props.selectedFilter.length == 0
											: props.selectedFilter.includes(
													selectableFilter.value
											  )
									)
										? theme.palette.primary.main
										: 'rgb(126, 128, 130)'
								}`}
								onClick={() => {
									onClickFilterElement(
										selectableFilter.value
									);
								}}
							>
								<Typography
									fontWeight={500}
									variant={'body1'}
									color={
										(
											selectableFilter.value === '전체'
												? props.selectedFilter.length ==
												  0
												: props.selectedFilter.includes(
														selectableFilter.value
												  )
										)
											? 'white'
											: 'rgb(126, 128, 130)'
									}
								>
									{selectableFilter.label}
								</Typography>
							</Box>
						)
					)}
				</Box>
			)}
		</Box>
	);
};

export default BadgeFilter;
