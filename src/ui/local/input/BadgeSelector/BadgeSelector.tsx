import { Box, Typography, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

interface IBadgeSelectorReturnType {
	component: React.ReactElement;
	selectedItemList: string[];
	setSelectedItemList: React.Dispatch<React.SetStateAction<string[]>>;
}

interface IBadgeSelectorProps {
	label: string;
	selectableItemList: {
		label: string;
		value: string;
	}[];
	allowMultiSelect: boolean;
	allowEmptySelect: boolean;
}

const BadgeSelector = (
	props: IBadgeSelectorProps
): IBadgeSelectorReturnType => {
	//* Modules
	const theme = useTheme();

	//* States
	const [selectedItemList, setSelectedItemList] = useState<string[]>([]);

	//* Functions
	/**
	 * 배지 클릭 시
	 */
	const onClickBadgeElement = (selectedItemValue: string) => {
		if (selectedItemList.includes(selectedItemValue)) {
			if (selectedItemList.length === 1) {
				if (props.allowEmptySelect === true) {
					setSelectedItemList([]);
				}
			} else {
				setSelectedItemList(
					selectedItemList.filter((item) => {
						return item !== selectedItemValue;
					})
				);
			}
		} else {
			if (props.allowMultiSelect === true) {
				setSelectedItemList(selectedItemList.concat(selectedItemValue));
			} else {
				setSelectedItemList([selectedItemValue]);
			}
		}
	};

	//* Hooks
	/**
	 * 초기화 시
	 */
	useEffect(() => {
		if (props.allowEmptySelect === false && selectedItemList.length == 0) {
			setSelectedItemList([props.selectableItemList[0].value]);
		}
	}, [props.selectableItemList, props.allowEmptySelect]);

	//* Component
	const component = (
		<Box>
			<Box>
				<Typography variant={'caption'}>{props.label}</Typography>
			</Box>

			<Box
				width={'100%'}
				display={'flex'}
				flexDirection={'column'}
				justifyContent={'center'}
				alignItems={'center'}
				flexWrap={'wrap'}
			>
				{props.selectableItemList.map((selectableItem, index) => (
					<Box
						key={index}
						m={0.5}
						display={'flex'}
						justifyContent={'center'}
						alignItems={'center'}
						px={1.5}
						py={1}
						borderRadius={1}
						bgcolor={
							selectedItemList.includes(selectableItem.value)
								? theme.palette.primary.main
								: 'white'
						}
						borderColor={theme.palette.primary.main}
						border={1}
						onClick={() => {
							onClickBadgeElement(selectableItem.value);
						}}
					>
						<Typography
							variant={'body1'}
							color={
								selectedItemList.includes(selectableItem.value)
									? 'white'
									: theme.palette.primary.main
							}
						>
							{selectableItem.label}
						</Typography>
					</Box>
				))}
			</Box>
		</Box>
	);

	return {
		component: component,
		selectedItemList: selectedItemList,
		setSelectedItemList: setSelectedItemList,
	};
};

export default BadgeSelector;
