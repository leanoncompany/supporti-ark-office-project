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
import { TabPanel, TextTypeInput } from '@leanoncompany/supporti-react-ui';
import EmptyList from '../../../../ui/local/display/EmptyList';
import DeliveryAppAdvertisementViewer from '../advertisement/DeliveryAppAdvertismentViewer';
import DeliveryAppReviewViewer from '../review/DeliveryAppReviewViewer';

interface IDeliveryAppServiceMemberDetailProps {
  memory: Memory;
  isAdmin?: boolean;
}

const DeliveryAppServiceMemberDetail = (props: IDeliveryAppServiceMemberDetailProps) => {
  //* Modules
  const dataUtil = new DataUtil();
  const router = useRouter();
  const theme = useTheme();

  //* Controller
  const modelName = 'DeliveryAppServiceMember';
  const controller = new DefaultController(modelName);
  const deliveryAppAccountModel = 'DeliveryAppAccount';
  const deliveryAppAccountController = new DefaultController(deliveryAppAccountModel);

  //* States
  const [modelData, setModelData] = useState<{
    [key: string]: IWrappedData;
  }>();

  /**
   * 강제로 등록된 계정 정보를 주입하기 위한 상태값
   */
  const [injectedAppMemberIdentificationCode, setInjectedAppMemberIdentificationCode] = useState<number>();

  /**
   * 등록된 계정 정보
   */
  const [deliveryAppAcountList, setDeliveryAppAccountList] = useState<any[]>([]);

  //* Constants
  const dataList: IData[] = [
    {
      keys: ['FULL_NAME'],
      ui: 'textarea',
      label: '사장님 이름',
      grid: {
        xs: 12,
        md: 6,
      },
    },
    {
      keys: ['PHONE_NUMBER'],
      ui: 'textarea',
      label: '사장님 연락처',
      grid: {
        xs: 12,
        md: 6,
      },
    },
    {
      keys: ['USE_AUTO_REVIEW_REPLY'],
      ui: 'switch',
      label: '리뷰 답글 자동화 활성화 여부',
      grid: {
        xs: 6,
        md: 3,
      },
    },
    {
      keys: ['USE_PROFIT'],
      ui: 'switch',
      label: '수익 정보 수집 여부',
      grid: {
        xs: 6,
        md: 3,
      },
    },
    {
      keys: ['USE_ADVERTISE'],
      ui: 'switch',
      label: '광고 정보 수집 여부',
      grid: {
        xs: 6,
        md: 3,
      },
    },
  ];

  //* Functions

  //* Hooks

  //* Contants

  return (
    <Box pb={10}>
      <BaseForm
        setFetchedData={setModelData}
        modelIdKey={dataUtil.convertToUpperCasedUnderbarSeparated(modelName) + '_IDENTIFICATION_CODE'}
        validationCallback={async (wrappedDataDict) => {
          let isValidated = true;

          //* 중복 검사
          const isDuplicateMethodSet = await controller.getOneItemByKey({}, undefined, undefined, true);

          if (isDuplicateMethodSet) {
            isDuplicateMethodSet().promise.then((res) => {});
          }

          return isValidated;
        }}
        dataList={dataList}
        memory={props.memory}
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
        findOneCallback={controller.getOneItem.bind(controller)}
        deleteCallback={controller.deleteItem.bind(controller)}
      />
    </Box>
  );
};

export default DeliveryAppServiceMemberDetail;
