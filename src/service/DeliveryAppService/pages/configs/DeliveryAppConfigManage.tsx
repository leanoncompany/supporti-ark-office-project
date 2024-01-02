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
import UpsertForm from '../../../../layout/forms/base/UpsertForm/UpsertForm';

interface IDeliveryAppConfigManageProps {
  memory: Memory;
  isAdmin?: boolean;
}

const DeliveryAppConfigManage = (props: IDeliveryAppConfigManageProps) => {
  //* Modules
  const dataUtil = new DataUtil();
  const router = useRouter();
  const theme = useTheme();

  //* Controller
  const modelName = 'DeliveryAppConfig';
  const controller = new DefaultController(modelName);

  //* States
  const [injectedAppMemberIdentificationCode, setInjectedAppMemberIdentificationCode] = useState<number>();

  //* Constants
  const dataList: IData[] = [
    {
      keys: ['CRAWL_ADVERTISEMENT_RANGE_ON_INIT'],
      ui: 'select',
      initialValue: 'MONTH',
      selectableItems: [
        {
          label: '1일',
          value: 'DAY',
        },
        {
          label: '1주일',
          value: 'WEEK',
        },
        {
          label: '1달',
          value: 'MONTH',
        },
      ],
      label: '광고 수집 범위',
      grid: {
        xs: 12,
        md: 6,
      },
    },
  ];

  //* Functions

  /**
   * 관리자일 경우 강제로 유저 아이디 4번 지정
   */
  useEffect(() => {
    if (props.isAdmin === true) {
      setInjectedAppMemberIdentificationCode(4);
    }
  }, [props.isAdmin]);

  return (
    <Box pb={10}>
      {injectedAppMemberIdentificationCode !== undefined && (
        <UpsertForm
          label={'설정 관리'}
          modelIdKey={dataUtil.convertToUpperCasedUnderbarSeparated(modelName) + '_IDENTIFICATION_CODE'}
          dataList={dataList}
          memory={props.memory}
          disableDelete={true}
          createCallback={(args, successCallback, failCallback) => {
            if (props.isAdmin === true) {
              args.APP_MEMBER_IDENTIFICATION_CODE = injectedAppMemberIdentificationCode;
            }

            controller.createItem(args, successCallback, failCallback);
          }}
          updateCallback={(args, successCallback, failCallback) => {
            if (props.isAdmin === true) {
              args.APP_MEMBER_IDENTIFICATION_CODE = injectedAppMemberIdentificationCode;
            }

            controller.updateItem(args, successCallback, failCallback);
          }}
          findOneCallback={(args, successCallback, failCallback) => {
            if (props.isAdmin === true) {
              args.APP_MEMBER_IDENTIFICATION_CODE = injectedAppMemberIdentificationCode;
            }

            controller.getOneItem(args, successCallback, failCallback);
          }}
        />
      )}
    </Box>
  );
};

export default DeliveryAppConfigManage;
