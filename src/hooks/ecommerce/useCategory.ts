import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import CategoryController from '../../controller/default/CategoryController';

export interface ICategoryTree {
	category: any;
	children: any[];
}

type useCategoryReturnType = {
	categoryTree: ICategoryTree[];
	setCategoryTree: Dispatch<SetStateAction<ICategoryTree[]>>;
};

const useCategory = (
	detectRoute?: boolean,
	disableCategory?: boolean
): useCategoryReturnType => {
	//* Modules
	const router = useRouter();
	const [categoryTree, setCategoryTree] = useState<ICategoryTree[]>([]);

	//* Hooks
	useEffect(() => {
		if (disableCategory !== true) {
			const categoryController = new CategoryController();

			return categoryController.getCategoryTree(
				(response) => {
					setCategoryTree(response.data.result);
				},
				(err) => {
					console.log(err);
				}
			);
		}
	}, []);

	useEffect(() => {
		if (disableCategory !== true) {
			if (detectRoute === true) {
				const categoryController = new CategoryController();

				return categoryController.getCategoryTree(
					(response) => {
						setCategoryTree(response.data.result);
					},
					(err) => {
						console.log(err);
					}
				);
			}
		}
	}, [router.asPath]);

	return { categoryTree, setCategoryTree };
};

export default useCategory;
