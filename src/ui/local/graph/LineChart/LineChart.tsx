//* Import libraries
import React from 'react';
import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material';
import moment from 'moment';
import { Doughnut, Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	LinearScale,
	ArcElement,
	Tooltip,
	Legend,
	LineElement,
	PointElement,
	CoreChartOptions,
	DatasetChartOptions,
	DoughnutControllerChartOptions,
	ElementChartOptions,
	PluginChartOptions,
	CategoryScale,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import useScreenChange from '../../../../hooks/ui/useScreenChange';

ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement
);

interface ILineChartProps {
	dataList: { [key: string]: any }[];
	xAxis: {
		key?: string;
		formatterCallback?: (targetXData: any, source: any) => string;
	};
	yAxis: {
		key: string;
		formatterCallback?: (value: any) => string;
	};
	borderColor?: string;
	xAxisLabelColor?: string;
	pointBackgroundColorCallback?: (
		xData: any,
		yData: any,
		index: number,
		dataList: { [key: string]: any }[]
	) => string;
	pointLabelFontColorCallback?: (
		xData: any,
		yData: any,
		index: number,
		dataList: { [key: string]: any }[]
	) => string;
	pointRadiusCallback?: (
		xData: any,
		yData: any,
		index: number,
		dataList: { [key: string]: any }[]
	) => number;
	pointLabelFontWeightCallback?: (
		xData: any,
		yData: any,
		index: number,
		dataList: { [key: string]: any }[]
	) => number;
}

const LineChart = (props: ILineChartProps) => {
	/**
	 * Modules
	 */
	const themes = useTheme();

	//* Constants
	const defaultXAxisLabelColor = themes.palette.grey['400'];
	const defaultBorderColor = themes.palette.grey['A200'];
	const defaultPointBackgroundColor = themes.palette.grey['A400'];
	const defaultPointLabelFontColor = themes.palette.grey['500'];
	const defaultPointRadius = 5;
	const defaultPointLabelFontWeight = 400;

	//* States
	const [graph, setGraph] = React.useState<React.ReactElement | null>(null);
	const { screenWidth, screenHeight } = useScreenChange();

	//* Functions
	/**
	 * Function to get graph's X data
	 */
	const getXAxisData = (data: { [key: string]: any }) => {
		let targetData = '';

		if (props.xAxis.key !== undefined) {
			targetData = data[props.xAxis.key];
		}

		if (props.xAxis.formatterCallback !== undefined) {
			targetData = props.xAxis.formatterCallback(targetData, data);
		}

		return targetData;
	};

	/**
	 * Function to set graphs's X data list
	 */
	const convertToXAxisDataList = (dataList: { [key: string]: any }[]) => {
		let xAxisDataList: any[] = [];

		dataList.map((data) => {
			xAxisDataList.push(getXAxisData(data));
		});

		return xAxisDataList;
	};

	/**
	 * Function to set graphs's Y data set (list, ...)
	 */
	const convertToGraphDataSet = (dataList: { [key: string]: any }[]) => {
		/**
		 * 해당 점의 배경 색상 리스트
		 */
		const pointBackgroundColorList: string[] = [];

		/**
		 * 해당 점의 라벨 폰트 색상 리스트
		 */
		const pointLabelFontColorList: string[] = [];

		/**
		 * 해당 점의 점 원 크기 리스트
		 */
		const pointRadiusList: number[] = [];

		/**
		 * 해당 점의 폰트 굵기 리스트
		 */
		const pointLabelFontWeightList: number[] = [];

		/**
		 * 변환된 Y 데이터 리스트
		 */
		const yAxisDataList: number[] = [];

		//* 데이터 변환
		dataList.map((data, index) => {
			/**
			 * 각 축의 점 데이터
			 */
			const xData = getXAxisData(data);
			const yData = data[props.yAxis.key];

			/**
			 * 해당 점의 배경 색상
			 */
			let pointBackgroundColor = defaultPointBackgroundColor;

			if (props.pointBackgroundColorCallback !== undefined) {
				pointBackgroundColor = props.pointBackgroundColorCallback(
					xData,
					yData,
					index,
					dataList
				);
			}

			pointBackgroundColorList.push(pointBackgroundColor);

			/**
			 * 해당 점의 라벨 폰트 색상
			 */
			let pointLabelFontColor = defaultPointLabelFontColor;

			if (props.pointLabelFontColorCallback !== undefined) {
				pointLabelFontColor = props.pointLabelFontColorCallback(
					xData,
					yData,
					index,
					dataList
				);
			}

			pointLabelFontColorList.push(pointLabelFontColor);

			/**
			 * 해당 점의 점 원 크기
			 */
			let pointRadius = defaultPointRadius;

			if (props.pointRadiusCallback !== undefined) {
				pointRadius = props.pointRadiusCallback(
					xData,
					yData,
					index,
					dataList
				);
			}

			pointRadiusList.push(pointRadius);

			/**
			 * 해당 점의 폰트 굵기
			 */
			let pointLabelFontWeight = defaultPointLabelFontWeight;

			if (props.pointLabelFontWeightCallback !== undefined) {
				pointLabelFontWeight = props.pointLabelFontWeightCallback(
					xData,
					yData,
					index,
					dataList
				);
			}

			pointLabelFontWeightList.push(pointLabelFontWeight);

			/**
			 * 변환된 Y 데이터
			 */

			yAxisDataList.push(yData);
		});

		return {
			pointBackgroundColorList,
			pointLabelFontColorList,
			pointRadiusList,
			pointLabelFontWeightList,
			yAxisDataList,
		};
	};

	/**
	 * Hook to initiate graph
	 */
	React.useEffect(() => {
		if (screenWidth !== null) {
			//* Set data of graph
			const xAxisDataList = convertToXAxisDataList(props.dataList);
			const graphDataSet = convertToGraphDataSet(props.dataList);

			console.log('그래프');
			console.log(graphDataSet);
			console.log(xAxisDataList);
			console.log('-----------');

			/**
			 * Labels 와, datasets 는 1:1 매칭
			 */
			const graphData = {
				labels: xAxisDataList,
				datasets: [
					{
						borderColor: props.borderColor || defaultBorderColor,
						data: graphDataSet.yAxisDataList,
						fill: false,
						backgroundColor: graphDataSet.pointBackgroundColorList,
						pointRadius: graphDataSet.pointRadiusList,
					},
				],
			};

			//* Set option of graph
			const graphOption = {
				layout: {
					padding: {
						top: 40,
						right: 40,
					},
				},
				scales: {
					x: {
						ticks: {
							font: {
								size: 12,
								weight: graphDataSet.pointLabelFontWeightList,
								color:
									props.xAxisLabelColor ||
									defaultXAxisLabelColor,
							},
						},
						grid: {
							display: false,
						},
					},
					y: {
						ticks: {
							display: false,
							// callback: function(val: any, index: any) {
							//     return val;
							// },
						},
						grid: {
							drawBorder: false,
						},
					},
				},
				plugins: {
					legend: {
						display: false,
					},
					datalabels: {
						display: true,
						color: graphDataSet.pointLabelFontColorList,
						anchor: 'end',
						font: {
							size: 12,
							weight: 700,
						},
						offset: -25,
						align: 'start',
						formatter: (value: number) => {
							if (props.yAxis.formatterCallback !== undefined) {
								return props.yAxis.formatterCallback(value);
							} else {
								return value;
							}
						},
					},
				},
			};

			//* Set graph
			setGraph(
				<Line
					plugins={[ChartDataLabels]}
					data={graphData as any}
					options={graphOption as any}
				/>
			);
		}
	}, [props.dataList, props.xAxis, props.yAxis, screenWidth]);

	return <Box key={screenWidth}>{graph}</Box>;
};

export default LineChart;
