import {
  Box,
  Button,
  CircularProgress,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  Modal,
  Pagination,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import { IData, IWrappedData } from '../../../../@types/base/data';
import DefaultController from '../../../../controller/default/DefaultController';
import DataUtil from '../../../../utils/data/DataUtil';
import BaseForm from '../../../../layout/forms/base/BaseForm/BaseForm';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Memory from '../../../../utils/data/Memory';
import { DeliveryAppItemFilter } from '../../ui/DeliveryAppItemFilter';
import { DateSelectPicker } from '../../../../ui/local/utils/DateSelectPicker';
import { LineChart } from '../../../../ui/local/graph/LineChart';
import BadgeSelector from '../../../../ui/local/input/BadgeSelector/BadgeSelector';
import { DeliveryAppCardViewer } from '../../ui/DeliveryAppCardViewer';
import { IDeliveryAppCardSummary } from '../../ui/DeliveryAppCardViewer/DeliveryAppCardViewer';
import { DoughnutChart } from '../../../../ui/local/graph/DoughnutChart';
import { TabPanel } from '@leanoncompany/supporti-react-ui';

interface IDeliveryAppProfitViewerProps {
  memory: Memory;
  deliveryAppServiceMemberId?: string | string[];
}

const DeliveryAppProfitViewer = (props: IDeliveryAppProfitViewerProps) => {
  //* Modules
  const dataUtil = new DataUtil();
  const router = useRouter();
  const theme = useTheme();

  //* Controller
  const modelName = 'DeliveryAppProfit';
  const controller = new DefaultController(modelName);

  //* States
  /**
   * 필터
   */
  const [deliveryAppProfitList, setDeliveryAppProfitList] = useState<any[]>([]);

  /**
   * 선택된 요약 엘리먼트
   */
  const [activatedSummaryIndex, setActivatedSummaryIndex] = useState<number>(0);

  /**
   * 데이터 합본
   */
  const [profitDataSet, setProfitDataSet] = useState<{
    ORDER_AMOUNT: number;
    NUM_OF_ORDERS: number;
  }>({
    ORDER_AMOUNT: 0,
    NUM_OF_ORDERS: 0,
  });

  /**
   * 그래프
   */

  //* Functions
  const flatOrderedMenus = (targetProfitList: any[]) => {
    let flattenItems: { MENU_NAME: string; MENU_PRICE: number }[] = [];

    targetProfitList.map((deliveryAppProfit) => {
      const orderedMenu = JSON.parse(deliveryAppProfit.ORDERED_MENU);

      if (orderedMenu.length != 0) {
        flattenItems = flattenItems.concat(
          orderedMenu.map((data: any) => {
            return {
              MENU_NAME: data.MENU_NAME,
              MENU_PRICE: data.MENU_PRICE,
              NUM_OF_ITEM: data.NUM_OF_ITEM,
            };
          })
        );
      }
    });

    return flattenItems;
  };

  const calculateOrderAmount = (pastSumAmount: number, deliveryAppProfit: any) => {
    let sumOrderAmount = pastSumAmount + deliveryAppProfit.ORDER_AMOUNT;

    if (deliveryAppProfit.SHOP_PLATFORM_KEY === 'BAEMIN_REVIEW_REPLY_SERVICE') {
      if (!/\[배민1\]/gi.test(deliveryAppProfit.SHOP_NAME)) {
        sumOrderAmount -= deliveryAppProfit.DELIVERY_FEE;
      }
    } else if (deliveryAppProfit.SHOP_PLATFORM_KEY === 'YOGIYO_REVIEW_REPLY_SERVICE') {
      sumOrderAmount += deliveryAppProfit.DELIVERY_FEE;
    }

    return sumOrderAmount;
  };

  //* Constants
  const profitSummaryList: IDeliveryAppCardSummary[] = [
    {
      label: '주문 금액',
      value: profitDataSet['ORDER_AMOUNT'],
      key: 'ORDER_AMOUNT',
      postFix: '원',
    },
    {
      label: '주문 수',
      value: profitDataSet['NUM_OF_ORDERS'],
      key: 'NUM_OF_ORDERS',
      postFix: '건',
    },
  ];

  const tabContents = [
    {
      title: '주문 통계',
      element: (
        <Box width={'100%'}>
          <LineChart
            dataList={(() => {
              let dataGroupByOrderDate: {
                [key: string]: any;
              } = {};

              deliveryAppProfitList.map((data) => {
                const orderDate = moment(data['ORDER_DATE']).format('YYYY-MM');

                let sumOrderAmount = 0;

                if (dataGroupByOrderDate[orderDate]) {
                  sumOrderAmount = calculateOrderAmount(dataGroupByOrderDate[orderDate].ORDER_AMOUNT, data);

                  dataGroupByOrderDate[orderDate] = {
                    NUM_OF_ORDERS: dataGroupByOrderDate[orderDate].NUM_OF_ORDERS + 1,
                    ORDER_AMOUNT: sumOrderAmount,
                  };
                } else {
                  sumOrderAmount = calculateOrderAmount(0, data);

                  dataGroupByOrderDate[orderDate] = {
                    ORDER_AMOUNT: sumOrderAmount,
                    NUM_OF_ORDERS: 1,
                  };
                }
              });

              return Object.keys(dataGroupByOrderDate).map((key) => {
                return {
                  ORDER_DATE: key,
                  ...dataGroupByOrderDate[key],
                };
              });
            })()}
            xAxis={{
              formatterCallback: (data, source) => {
                return `${moment(source['ORDER_DATE']).format('YYYY.MM')}`;
              },
            }}
            yAxis={{
              key: profitSummaryList[activatedSummaryIndex].key,
              formatterCallback: (data) => {
                const dataWithCommans = dataUtil.numberWithCommas(data);

                return `${dataWithCommans}${profitSummaryList[activatedSummaryIndex].postFix}`;
              },
            }}
          />
        </Box>
      ),
    },
    {
      title: '상품별 통계',
      element: (
        <Box>
          {/* 상품 판매 통계 (원형 차트 및 표 차트), 금액 기준으로 정렬 */}
          <Box>
            <DoughnutChart
              dataList={flatOrderedMenus(deliveryAppProfitList)}
              labelKey={'MENU_NAME'}
              valueKey={'MENU_PRICE'}
              numOfRanking={5}
              useTable={true}
              subValueReducerCallback={(data, sum) => {
                if (sum === undefined) {
                  return {
                    NUM_OF_ITEM: Number(data.NUM_OF_ITEM),
                  };
                } else {
                  return {
                    NUM_OF_ITEM: Number(sum.NUM_OF_ITEM) + Number(data.NUM_OF_ITEM),
                  };
                }
              }}
              valueFormatterCallback={(value) => {
                return `${dataUtil.numberWithCommas(value)}원`;
              }}
              tableSubLabelCallback={(data) => {
                return `${dataUtil.numberWithCommas(data['NUM_OF_ITEM'])}개`;
              }}
            />
          </Box>
        </Box>
      ),
    },
  ];

  //* Hooks
  /**
   * 주문 건수 훅
   */
  useEffect(() => {
    const result = (() => {
      return deliveryAppProfitList.reduce(
        (sum, deliveryAppProfit) => {
          let sumOrderAmount = calculateOrderAmount(sum.ORDER_AMOUNT, deliveryAppProfit);

          return {
            ORDER_AMOUNT: sumOrderAmount,
            NUM_OF_ORDERS: sum.NUM_OF_ORDERS + 1,
          };
        },
        {
          ORDER_AMOUNT: 0,
          NUM_OF_ORDERS: 0,
        }
      );
    })();

    setProfitDataSet(result);
  }, [deliveryAppProfitList]);

  return (
    <Box pb={10}>
      {/* 가게 필터 영역 */}
      <Box mb={1.5}>
        <DeliveryAppItemFilter
          memory={props.memory}
          deliveryAppServiceMemberId={props.deliveryAppServiceMemberId}
          dataController={controller}
          setFilteredDataList={setDeliveryAppProfitList}
        />
      </Box>

      {/* 콘텐츠 영역 */}
      <Box>
        {/* 수익 요약 영역 */}
        <Box mb={1}>
          <DeliveryAppCardViewer
            summaryList={profitSummaryList}
            activatedSummaryIndex={activatedSummaryIndex}
            setActivatedSummaryIndex={setActivatedSummaryIndex}
          />
        </Box>

        {/* 탭 영역 (주문 통계, 상품 통계) */}
        <Box>
          <TabPanel
            tabSelectionSectionConfig={{
              tabLabelTypographyProps: {
                color: theme.palette.grey['500'],
                variant: 'h6',
                sx: {
                  whiteSpace: 'nowrap',
                },
              },
              boxProps: {
                sx: {
                  mb: 3,
                  borderBottom: `1px solid ${theme.palette.grey['300']}`,
                },
              },
            }}
            tabContents={tabContents}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DeliveryAppProfitViewer;
