import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Memory from '../../utils/data/Memory';
import { IMenuSet, IMenu } from '../../@types/layout/sideBar/sideBar';
import DataUtil from '../../utils/data/DataUtil';

type usePageLabelReturnType = {
	labelCombination: string[];
	labelTail: string;
};

const usePageLabel = (memory?: Memory): usePageLabelReturnType => {
	//* Modules
	const router = useRouter();
	const dataUtil = new DataUtil();

	//* States
	const [labelTail, setLabelTail] = useState<string>('');
	const [labelCombination, setLabelCombination] = useState<string[]>([]);

	//* Functions
	/**
	 * 메뉴 세트 링크 <=> 라벨 딕셔너리로 만듦
	 */
	const getMergedMenuSets = (
		menuSets: IMenuSet[]
	): { [link: string]: string[] } => {
		const mergedMenuSets: { [link: string]: string[] } = {};

		const mergeLinkRecursively = (
			menu: IMenu,
			mergedLink: string,
			menuPath: string[]
		) => {
			const newMenuPath = [...menuPath, menu.label];
			const newLink = dataUtil.normalizePath(
				`${mergedLink}${
					menu.link[0] == '&' ? '' : menu.link.length == 0 ? '' : '/'
				}${menu.link}`
			);
			mergedMenuSets[newLink] = newMenuPath;

			if (menu.children.length > 0) {
				menu.children.forEach((childMenu) => {
					mergeLinkRecursively(childMenu, newLink, newMenuPath);
				});
			}
		};

		menuSets.forEach((menuSet) => {
			menuSet.menus.forEach((menu) => {
				mergeLinkRecursively(menu, menuSet.link, [menuSet.label]);
			});
		});

		return mergedMenuSets;
	};

	function removeNotificationId(input: string): string {
		const regex = /[?&]notification_id=\d+/;
		// 입력된 문자열에서 '?notification_id' 또는 '&notification_id'와 그 뒤에 붙은 숫자 값을 찾습니다.
		// 정규식의 [?&]는 '?' 또는 '&'를 의미합니다.
		// \d+는 1개 이상의 숫자를 의미합니다.

		const matchedIndex = input.search(regex);
		// 정규식으로 찾은 첫 번째 매치의 인덱스를 반환합니다.

		if (matchedIndex === -1) {
			// 찾은 매치가 없으면 입력된 문자열을 그대로 반환합니다.
			return input;
		} else {
			// 찾은 매치가 있으면 매치 이전의 문자열을 반환합니다.
			return input.slice(0, matchedIndex);
		}
	}

	//* Hooks
	useEffect(() => {
		//* Get menu sets from memory
		if (memory !== undefined) {
			const menuSets: IMenuSet[] = memory.getData('menuSets', []);

			if (menuSets.length !== 0) {
				const cleanedPath = removeNotificationId(router.asPath);

				const mergedMenuSets = getMergedMenuSets(menuSets);

				//* Get label combination from merged menu sets
				const targetLabelCombination = mergedMenuSets[cleanedPath];

				if (targetLabelCombination !== undefined) {
					setLabelCombination(targetLabelCombination);
				}
			}
		}
	}, [router.asPath]);

	useEffect(() => {
		if (labelCombination.length > 0) {
			setLabelTail(labelCombination[labelCombination.length - 1]);
		} else {
			setLabelTail('');
		}
	}, [labelCombination]);

	return { labelCombination, labelTail };
};

export default usePageLabel;
