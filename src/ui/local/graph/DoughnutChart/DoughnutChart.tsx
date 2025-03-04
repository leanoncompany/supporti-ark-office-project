//* Import libraries
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import moment from "moment";
import { Doughnut } from "react-chartjs-2";
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
} from "chart.js";
// import DougnutLabelPlugin from "chartjs-plugin-doughnutlabel";
import ChartDataLabels from "chartjs-plugin-datalabels";
import useScreenChange from "../../../../hooks/ui/useScreenChange";
import Grid2 from "@mui/material/Unstable_Grid2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

interface IDoughnutChartProps {
  dataList: { [key: string]: any }[];
  labelKey: string;
  valueKey: string;
  numOfRanking: number;
  useTable?: boolean;
  borderWidth?: number;
  subValueReducerCallback?: (data: any, sum?: any) => { [key: string]: any };
  valueFormatterCallback?: (value: any) => string;
  tableSubLabelCallback?: (value: any) => string;
  xAxisLabelColor?: string;
  pointBackgroundColorCallback?: (
    xData: any,
    yData: any,
    index: number,
    dataList: { [key: string]: any }[]
  ) => string;
  pointBorderColorCallback?: (
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
  pointLabelFontWeightCallback?: (
    xData: any,
    yData: any,
    index: number,
    dataList: { [key: string]: any }[]
  ) => number;
}

const DoughnutChart = (props: IDoughnutChartProps) => {
  /**
   * Modules
   */
  const themes = useTheme();

  //* Constants
  const defaultAreaBackgroundColorSet: string[] = [
    "rgba(107, 109, 177, 1)",
    "rgba(248, 115, 138, 1)",
    "rgba(255, 200, 91, 1)",
    "rgba(164, 92, 178, 1)",
    "rgba(42, 149, 112, 1)",
    "rgba(183, 47, 131, 1)",
    "rgba(175, 106, 37, 1)",
    "rgba(143, 51, 66, 1)",
  ];

  const defaultAreaBorderColorSet: string[] = [
    "rgba(107, 109, 177, 0.3)",
    "rgba(248, 115, 138, 0.3)",
    "rgba(255, 200, 91, 0.3)",
    "rgba(164, 92, 178, 0.3)",
    "rgba(42, 149, 112, 0.3)",
    "rgba(183, 47, 131, 0.3)",
    "rgba(175, 106, 37, 0.3)",
    "rgba(143, 51, 66, 0.3)",
  ];

  const defaultXAxisLabelColor = themes.palette.grey["400"];
  const defaultPointLabelFontColor = themes.palette.grey["500"];
  const defaultPointRadius = 5;
  const defaultPointLabelFontWeight = 400;

  //* States
  const [graph, setGraph] = React.useState<React.ReactElement | null>(null);
  const [table, setTable] = React.useState<React.ReactElement | null>(null);
  const { screenWidth, screenHeight } = useScreenChange();

  //* Functions
  /**
   * Function to set graphs's Y data set (list, ...)
   */
  const convertToGraphDataSet = (dataList: { [key: string]: any }[]) => {
    //* 데이터 변환 (데이터 합산 후, 순위 별 정렬)
    const mergedDataDict: {
      [key: string]: { value: number; subValue?: { [key: string]: any } };
    } = {};

    dataList.map((data, index) => {
      const label = data[props.labelKey];
      const value = data[props.valueKey];
      let subValue: { [key: string]: any } = {};

      if (props.subValueReducerCallback !== undefined) {
        subValue = props.subValueReducerCallback(
          data,
          mergedDataDict[label]?.subValue
        );
      }

      if (label !== undefined && value !== undefined) {
        if (mergedDataDict[label] === undefined) {
          mergedDataDict[label] = {
            value: value,
            subValue: subValue,
          };
        } else {
          mergedDataDict[label].value += value;
          mergedDataDict[label].subValue = subValue;
        }
      }
    });

    const sortedMergedDataList = Object.keys(mergedDataDict)
      .map((key) => {
        return {
          label: key,
          value: mergedDataDict[key].value,
          subValue: mergedDataDict[key].subValue,
        };
      })
      .sort((a, b) => {
        return b.value - a.value;
      })
      .slice(0, props.numOfRanking);

    //* 데이터 변환 (그래프 데이터로 변환)
    /**
     * 해당 점의 배경 색상 리스트
     */
    const pointBackgroundColorList: string[] = [];

    /**
     * 해당 점의 외곽선 색상 리스트
     */
    const pointBorderColorList: string[] = [];

    /**
     * 해당 점의 라벨 폰트 색상 리스트
     */
    const pointLabelFontColorList: string[] = [];

    /**
     * 해당 점의 폰트 굵기 리스트
     */
    const pointLabelFontWeightList: number[] = [];

    const areaDataList: number[] = [];
    const subDataList: any[] = [];
    const labels: string[] = [];

    sortedMergedDataList.map((data, index) => {
      console.log(data);

      areaDataList.push(data.value);
      labels.push(data.label);
      subDataList.push(data.subValue);

      /**
       * 해당 영역의 배경 색상
       */
      let pointBackgroundColor = defaultAreaBackgroundColorSet[index];

      if (props.pointBackgroundColorCallback !== undefined) {
        pointBackgroundColor = props.pointBackgroundColorCallback(
          data.label,
          data.value,
          index,
          dataList
        );
      }

      pointBackgroundColorList.push(pointBackgroundColor);

      /**
       * 해당 영역의 외곽선 색상
       */
      let pointBorderColor = defaultAreaBorderColorSet[index];

      if (props.pointBorderColorCallback !== undefined) {
        pointBorderColor = props.pointBorderColorCallback(
          data.label,
          data.value,
          index,
          dataList
        );
      }

      pointBorderColorList.push(pointBorderColor);
    });

    return {
      areaDataList,
      labels,
      subDataList,
      pointBackgroundColorList,
      pointBorderColorList,
      pointLabelFontColorList,
      pointLabelFontWeightList,
    };
  };

  /**
   * Hook to initiate graph
   */
  React.useEffect(() => {
    if (screenWidth !== null) {
      //* Set data of graph
      const graphDataSet = convertToGraphDataSet(props.dataList);

      console.log("그래프");
      console.log(graphDataSet);
      console.log("-----------");

      /**
       * Labels 와, datasets 는 1:1 매칭
       */
      const graphData = {
        labels: graphDataSet.labels,
        datasets: [
          {
            borderColor: graphDataSet.pointBorderColorList,
            data: graphDataSet.areaDataList,
            backgroundColor: graphDataSet.pointBackgroundColorList,
            borderWidth: props.borderWidth || 1,
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
                color: props.xAxisLabelColor || defaultXAxisLabelColor,
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
            anchor: "end",
            font: {
              size: 12,
              weight: 700,
            },
            offset: -25,
            align: "start",
            formatter: (value: number) => {
              if (props.valueFormatterCallback !== undefined) {
                return props.valueFormatterCallback(value);
              } else {
                return value;
              }
            },
          },
        },
      };

      //* Set graph
      setGraph(
        <Doughnut
          plugins={[ChartDataLabels as any]}
          data={graphData as any}
          options={graphOption as any}
        />
      );

      //* Set table
      if (props.useTable === true) {
        setTable(
          <Box>
            {graphDataSet.areaDataList.map((data, index) => (
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                mb={index === props.dataList.length - 1 ? 0 : 1}
              >
                {/* 라벨 및 표시 영역 */}
                <Box display={"flex"} alignItems={"center"}>
                  {/* 썸네일 영역 */}
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    width={"30px"}
                    height={"30px"}
                    borderRadius={"15px"}
                    mr={1.5}
                    justifyContent={"center"}
                    sx={{
                      backgroundColor: defaultAreaBackgroundColorSet[index],
                    }}
                  >
                    <Typography
                      variant={"h6"}
                      sx={{
                        fontWeight: 600,
                      }}
                      color={"#fff"}
                    >
                      {index + 1}
                    </Typography>
                  </Box>

                  {/* 라벨 영역 */}
                  <Box>
                    {/* 메인 라벨 */}
                    <Box>
                      <Typography
                        variant={"h6"}
                        sx={{
                          fontWeight: 600,
                        }}
                        color={"#000"}
                      >
                        {graphDataSet.labels[index]}
                      </Typography>
                    </Box>

                    {/* 서브 라벨 */}
                    {props.tableSubLabelCallback !== undefined && (
                      <Box mt={0.5}>
                        <Typography
                          variant={"body1"}
                          sx={{
                            fontWeight: 400,
                          }}
                          color={"#5f5f5f"}
                        >
                          {props.tableSubLabelCallback(
                            graphDataSet.subDataList[index]
                          )}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* 값 영역 */}
                <Box>
                  <Typography
                    variant={"h6"}
                    sx={{
                      fontWeight: 600,
                    }}
                    color={"#000"}
                  >
                    {props.valueFormatterCallback !== undefined
                      ? props.valueFormatterCallback(
                          graphDataSet.areaDataList[index]
                        )
                      : graphDataSet.areaDataList[index]}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        );
      }
    }
  }, [props.dataList, props.labelKey, props.valueKey, screenWidth]);

  return (
    <Box key={screenWidth}>
      <Grid2 container spacing={1} alignItems={"flex-end"}>
        {/* 원형 차트 영역 */}
        <Grid2 item xs={12} md={props.useTable === true ? 6 : 12}>
          {graph}
        </Grid2>

        {/* 표 차트 (순위, 메뉴명, 판매량, 판매 금액) 영역 */}
        {props.useTable === true && (
          <Grid2 item xs={12} md={6}>
            {table}
          </Grid2>
        )}
      </Grid2>
    </Box>
  );
};

export default DoughnutChart;
