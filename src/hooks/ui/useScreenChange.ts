import { useState, useEffect } from 'react';

type useScreenChangeReturnType = {
	screenWidth: number | null;
	screenHeight: number | null;
};

const useScreenChange = (): useScreenChangeReturnType => {
	//* States
	const [screenWidth, setScreenWidth] = useState<number | null>(null);
	const [screenHeight, setScreenHeight] = useState<number | null>(null);

	//* Hooks
	useEffect(() => {
		setScreenWidth(window.innerWidth);
		setScreenHeight(window.innerHeight);

		/**
		 * Detect screen change
		 */
		const handleResize = () => {
			console.log('handleResize');
			console.log(window.innerWidth);
			setScreenWidth(window.innerWidth);
			setScreenHeight(window.innerHeight);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return { screenWidth, screenHeight };
};

export default useScreenChange;
