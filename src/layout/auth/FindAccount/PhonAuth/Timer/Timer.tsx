import React, { useState, useEffect, useRef } from 'react';
import { Typography } from '@mui/material';

// Custom Hooks
const useInterval = (callback: any, delay: any, setToggleTimer: any) => {
	const intervalRef = useRef<any>();
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		if (typeof delay === 'number') {
			intervalRef.current = setInterval(() => {
				callbackRef.current();
			}, delay);
		}
		return () => clearInterval(intervalRef.current);
	}, [delay]);

	return intervalRef;
};

const Timer = (props: {
	toggleTimer: boolean;
	setToggleTimer: React.Dispatch<React.SetStateAction<boolean>>;
	timer: number;
	setTimer: React.Dispatch<React.SetStateAction<number>>;
}) => {
	// States
	const [minute, setMinute] = useState('');
	const [second, setSecond] = useState('');
	const [milliSecond, setMilliSecond] = useState('');
	const [isTimerRunning, setIsTimerRunning] = useState(false);

	// Refs
	const startTimeRef = useRef(0);
	const leftTimeRef = useRef(0);

	// Hooks
	useEffect(() => {
		minuteCalculator();
		if (props.timer <= 0) {
			props.setToggleTimer(false);
			setIsTimerRunning(false);
			props.setTimer(0);
		}
	}, [props.timer]);

	useEffect(() => {
		if (props.toggleTimer) {
			startTimeRef.current = Date.now();
			leftTimeRef.current = props.timer;
			setIsTimerRunning(true);
		} else if (!props.toggleTimer || props.timer < 0) {
			// setIsTimerRunning(false);
		}
	}, [props.toggleTimer]);

	// Custom Hook
	useInterval(
		() => {
			try {
				timeDecrement();
			} catch (err) {}
		},
		props.toggleTimer ? 10 : null,
		props.setToggleTimer
	);

	const minuteCalculator = () => {
		let toSecond = parseInt(String(props.timer / 1000));
		let tempMinute = parseInt(String(toSecond / 60)).toString();
		let tempSecond = parseInt(String(toSecond % 60)).toString();
		let tempMilliSecond = parseInt(
			String((props.timer % 1000) / 10)
		).toString();

		setMinute(tempMinute);
		setSecond(tempSecond);
		setMilliSecond(tempMilliSecond);
	};

	const timeDecrement = () => {
		const timePassed = Date.now() - startTimeRef.current;
		props.setTimer(leftTimeRef.current - timePassed);
	};

	const clearTime = () => {
		props.setTimer(0);
	};

	return (
		<Typography variant="subtitle2" fontWeight={600} color={'white'}>
			{`${minute.padStart(2, '0')}:${second.padStart(2, '0')}`}
		</Typography>
	);
};

export default Timer;
