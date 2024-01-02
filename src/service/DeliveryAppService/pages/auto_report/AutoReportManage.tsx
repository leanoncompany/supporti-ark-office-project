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
import DeliveryAppAccountControlModal from '../../ui/DeliveryAppAccountControlModal/DeliveryAppAccountControlModal';
import DeliveryAppProfitViewer from '../profit/DeliveryAppProfitViewer';
import UpsertForm from '../../../../layout/forms/base/UpsertForm/UpsertForm';
import { RegexManager } from '@leanoncompany/supporti-utility';

interface IAutoReportManageProps {
  memory: Memory;
}

const AutoReportManage = (props: IAutoReportManageProps) => {
  //* Modules
  const dataUtil = new DataUtil();

  //* Controller
  const modelName = 'DeliveryAppAutoReport';
  const controller = new DefaultController(modelName);

  const dataList: IData[] = [
    {
      keys: ['KAKAO_AUTH_TOKEN'],
      ui: 'textarea',
      label: '카카오 토큰 (운영진에게 문의해주세요.)',
      captionMessages: {
        requiredMessage: '내용을 입력해야합니다',
      },
      grid: {
        xs: 12,
        md: 12,
      },
    },
    {
      keys: ['USE_AUTO_REVIEW_REPLY'],
      ui: 'switch',
      label: '자동 리뷰 답변',
      grid: {
        xs: 6,
        md: 4,
      },
    },
    {
      keys: ['USE_PROFIT'],
      ui: 'switch',
      label: '자동 매출 보고',
      grid: {
        xs: 6,
        md: 4,
      },
    },
    {
      keys: ['USE_ADVERTISE'],
      ui: 'switch',
      label: '자동 광고 성과 보고',
      grid: {
        xs: 6,
        md: 4,
      },
    },
  ];

  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Box>
        <UpsertForm
          label={'자동 보고서 관리'}
          modelIdKey={dataUtil.convertToUpperCasedUnderbarSeparated(modelName) + '_IDENTIFICATION_CODE'}
          dataList={dataList}
          memory={props.memory}
          createCallback={controller.createItem.bind(controller)}
          updateCallback={controller.updateItem.bind(controller)}
          findOneCallback={controller.getOneItem.bind(controller)}
        />
      </Box>
    </Box>
  );
};

export default AutoReportManage;
