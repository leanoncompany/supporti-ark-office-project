import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
	ListItemButton,
	ListItemText,
	Collapse,
	List,
	Box,
	Checkbox,
} from '@mui/material';
import React, { useState } from 'react';

interface IDropdownListItemProps {
	selectedValues: any[];
	setSelectedValues: (values: any[]) => void;
	data: { label: string; value: number };
	children: { label: string; value: number }[];
	useCheckBox?: boolean;
}

const DropdownListItem = (props: IDropdownListItemProps) => {
	//* States
	const [isOpen, setIsOpen] = useState<boolean>(false);

	//* Functions
	const checkIsSelected = (values: any[]) => {
		if (values.length == 1) {
			return (
				JSON.stringify(values) ==
				JSON.stringify(props.selectedValues.slice(0, 1))
			);
		} else if (values.length == 2) {
			return (
				JSON.stringify(values) == JSON.stringify(props.selectedValues)
			);
		}

		return false;
	};

	const handleSelect = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		values: any[]
	) => {
		e.stopPropagation();
		e.preventDefault();

		props.setSelectedValues(values);
	};

	return props.children.length == 0 ? (
		<ListItemButton onClick={() => {}}>
			<Box display={'flex'} alignItems={'center'}>
				<Box mr={0.5}>
					<Checkbox
						checked={checkIsSelected([props.data.value])}
						onClick={(e) => {
							handleSelect(e, [props.data.value]);
						}}
					/>
				</Box>

				<Box mr={0.5}>
					<ListItemText primary={props.data.label} />
				</Box>
			</Box>
		</ListItemButton>
	) : (
		<React.Fragment>
			<ListItemButton
				onClick={() => {
					setIsOpen(!isOpen);
				}}
			>
				<Box display={'flex'} alignItems={'center'}>
					<Box mr={0.5}>
						<Checkbox
							checked={checkIsSelected([props.data.value])}
							onClick={(e) => {
								handleSelect(e, [props.data.value]);
							}}
						/>
					</Box>

					<Box mr={0.5}>
						<ListItemText primary={props.data.label} />
					</Box>

					{(checkIsSelected([props.data.value]) ? true : isOpen) ? (
						<ExpandLess />
					) : (
						<ExpandMore />
					)}
				</Box>
			</ListItemButton>

			<Collapse
				in={checkIsSelected([props.data.value]) ? true : isOpen}
				timeout="auto"
				unmountOnExit
			>
				<List component="div" disablePadding>
					{props.children.map((child, index) => (
						<ListItemButton
							key={index}
							sx={{ pl: 4 }}
							onClick={() => {}}
						>
							<Box display={'flex'} alignItems={'center'}>
								<Box mr={0.5}>
									<Checkbox
										checked={checkIsSelected([
											props.data.value,
											child.value,
										])}
										onClick={(e) => {
											handleSelect(e, [
												props.data.value,
												child.value,
											]);
										}}
									/>
								</Box>

								<Box mr={0.5}>
									<ListItemText primary={child.label} />
								</Box>
							</Box>
						</ListItemButton>
					))}
				</List>
			</Collapse>
		</React.Fragment>
	);
};

export default DropdownListItem;
