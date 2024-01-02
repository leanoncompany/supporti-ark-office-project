import { Box, Collapse } from '@mui/material';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { IMenu } from '../../../@types/layout/sideBar/sideBar';
import MenuButton from '../../../ui/local/input/MenuButton/MenuButton';

interface IRecursiveDropdownMenuProps {
	depth: number;
	setDrawerOpened?: React.Dispatch<React.SetStateAction<boolean>>;
	link: string;
	menu: IMenu;
	icon?: React.ReactElement;
	openedRootMenuId?: string;
	setOpenedRootMenuId?: React.Dispatch<React.SetStateAction<string>>;
	menuId?: string;
	currentPath: string;
	menuIndex: number;
	parentNotificationStatusList?: boolean[];
	setParentNotificationStatusList?: React.Dispatch<
		React.SetStateAction<boolean[]>
	>;
}

const RecursiveDropdownMenu = (props: IRecursiveDropdownMenuProps) => {
	//* Modules
	const router = useRouter();

	//* States
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [isNotificated, setIsNotificated] = React.useState<boolean>(false);
	const [childrenNotificationStatusList, setChildrenNotificationStatusList] =
		React.useState<boolean[]>(
			props.menu.children.map(() => {
				return false;
			})
		);

	//* Constants
	const control: any = {
		openedRootMenuId: props.openedRootMenuId,
		setOpenedRootMenuId: props.setOpenedRootMenuId,
		menuId: props.menuId,
		depth: props.depth,
		label: props.menu.label,
		icon: props.icon,
		currentPath: props.currentPath,
		link: props.link,
		isNotificated: isNotificated,
	};

	//* Hooks
	/**
	 * 자신 활성화 여부 결정 훅
	 */
	useEffect(() => {
		let tempIsNotificated = false;

		childrenNotificationStatusList.map((isNotificated) => {
			if (isNotificated) {
				tempIsNotificated = true;
			}
		});

		if (isNotificated !== tempIsNotificated) {
			setIsNotificated(tempIsNotificated);
		}
	}, [childrenNotificationStatusList]);

	/**
	 * 활성화 여부 결정 훅 (자기 자신은 표현 못하고 있나?)
	 */
	useEffect(() => {
		if (
			props.parentNotificationStatusList !== undefined &&
			props.setParentNotificationStatusList !== undefined
		) {
			if (
				isNotificated !==
				props.parentNotificationStatusList[props.menuIndex]
			) {
				const clonedList = [...props.parentNotificationStatusList];
				clonedList[props.menuIndex] = isNotificated;
				props.setParentNotificationStatusList(clonedList);
			}
		}
	}, [isNotificated]);

	/**
	 * 활성화 결정 함수 실행 훅 (링크 변경 시)
	 */
	useEffect(() => {
		if (props.menu.notificationCallback !== undefined) {
			props.menu.notificationCallback(setIsNotificated);
		}
	}, [router.asPath]);

	/**
	 * 활성화 결정 함수 실행 훅 (초기화 시)
	 */
	useEffect(() => {
		if (props.menu.notificationCallback !== undefined) {
			props.menu.notificationCallback(setIsNotificated);
		}
	}, []);

	return (
		<Box pl={props.depth}>
			{props.menu.children.length == 0 ? (
				<Box>
					<MenuButton
						{...control}
						setDrawerOpened={props.setDrawerOpened}
					/>
				</Box>
			) : (
				<Box>
					<Box>
						<MenuButton
							{...control}
							isOpen={isOpen}
							setIsOpen={setIsOpen}
						/>
					</Box>

					<Collapse
						in={
							props.depth === 0
								? props.openedRootMenuId === props.menuId
								: isOpen
						}
						timeout="auto"
						unmountOnExit={false}
					>
						<Box component="div">
							{props.menu.children.map((menu, menuIndex) => (
								<Box key={menuIndex}>
									<RecursiveDropdownMenu
										link={`${props.link}${
											menu.link[0] == '&'
												? ''
												: menu.link.length == 0
												? ''
												: '/'
										}${menu.link}`}
										depth={props.depth + 1}
										setDrawerOpened={props.setDrawerOpened}
										menu={menu}
										currentPath={props.currentPath}
										menuIndex={menuIndex}
										parentNotificationStatusList={
											childrenNotificationStatusList
										}
										setParentNotificationStatusList={
											setChildrenNotificationStatusList
										}
									/>
								</Box>
							))}
						</Box>
					</Collapse>
				</Box>
			)}
		</Box>
	);
};

export default RecursiveDropdownMenu;
