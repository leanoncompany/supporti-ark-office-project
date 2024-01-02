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
  const [shopLoaderKey, setShopLoaderKey] = useState<number>(0);
  const [serviceMemberLoaderKey, setServiceMemberLoaderKey] = useState<number>(0);
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
      initialValue: 'Y',
      grid: {
        xs: 6,
        md: 3,
      },
    },
    {
      keys: ['USE_PROFIT'],
      ui: 'switch',
      label: '수익 정보 수집 여부',
      initialValue: 'Y',
      grid: {
        xs: 6,
        md: 3,
      },
    },
    {
      keys: ['USE_ADVERTISE'],
      ui: 'switch',
      label: '광고 정보 수집 여부',
      initialValue: 'Y',
      grid: {
        xs: 6,
        md: 3,
      },
    },
  ];

  //* Functions

  //* Hooks
  /**
   * 유저 아이디 주입 시 불러오는 훅
   */
  useEffect(() => {
    if (modelData !== undefined) {
      setInjectedAppMemberIdentificationCode(modelData.APP_MEMBER_IDENTIFICATION_CODE.state);
    }
  }, [modelData]);

  /**
   * 등록된 계정 정보 불러오는 훅
   */
  useEffect(() => {
    if (modelData !== undefined) {
      deliveryAppAccountController.findAllItems(
        {
          [dataUtil.getModelIdentificationCode(modelName)]: dataUtil.getModelIdentificationCodeFromWrappedDataSet(
            modelData,
            modelName
          ),
        },
        (res) => {
          setDeliveryAppAccountList(res.data.result.rows);
        }
      );
    }
  }, [modelData, serviceMemberLoaderKey]);

  /**
   * 관리자일 경우 강제로 유저 아이디 4번 지정
   */
  useEffect(() => {
    if (props.isAdmin === true) {
      setInjectedAppMemberIdentificationCode(4);
    }
  }, [props.isAdmin]);

  //* Contants
  /**
   * 탭 정보
   */
  const tabContents = [
    {
      title: '계정 기본 정보',
      element: (
        <Box>
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
      ),
    },
    {
      title: '소속 가게 관리',
      element: (
        <Box>
          {/* 계정 관련 정보 */}
          {modelData !== undefined && (
            <Box>
              {/* 계정 등록 컨트롤러 */}
              <Box>
                <DeliveryAppAccountControlModal
                  deliveryAppServiceMemberId={dataUtil.getModelIdentificationCodeFromWrappedDataSet(
                    modelData,
                    modelName
                  )}
                  appMemberId={injectedAppMemberIdentificationCode}
                  memory={props.memory}
                  deliveryAppAcountList={deliveryAppAcountList}
                  setDeliveryAppAcountList={setDeliveryAppAccountList}
                  shopLoaderKey={shopLoaderKey}
                  setShopLoaderKey={setShopLoaderKey}
                  serviceMemberLoaderKey={serviceMemberLoaderKey}
                  setServiceMemberLoaderKey={setServiceMemberLoaderKey}
                />
              </Box>

              <Box>
                {deliveryAppAcountList.length === 0 ? (
                  <EmptyList />
                ) : (
                  <Box
                    p={1.5}
                    pt={1.5}
                    borderRadius={1.75}
                    sx={{
                      background: '#e6e6e6',
                    }}>
                    {/* 계정 리스트 */}
                    {deliveryAppAcountList.map((deliveryAppAccount, index) => (
                      <Box
                        sx={{
                          backgroundColor: '#fff',
                        }}
                        mb={index !== deliveryAppAcountList.length - 1 ? 1.5 : 0}
                        borderRadius={1}>
                        <DeliveryAppAccountControlModal
                          deliveryAppServiceMemberId={dataUtil.getModelIdentificationCodeFromWrappedDataSet(
                            modelData,
                            modelName
                          )}
                          appMemberId={injectedAppMemberIdentificationCode}
                          deliveryAppAcountList={deliveryAppAcountList}
                          setDeliveryAppAcountList={setDeliveryAppAccountList}
                          memory={props.memory}
                          deliveryAppAcountId={deliveryAppAccount.DELIVERY_APP_ACCOUNT_IDENTIFICATION_CODE}
                          shopLoaderKey={shopLoaderKey}
                          setShopLoaderKey={setShopLoaderKey}
                          serviceMemberLoaderKey={serviceMemberLoaderKey}
                          setServiceMemberLoaderKey={setServiceMemberLoaderKey}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      ),
    },
    {
      title: '수익 관리',
      element: (
        <Box>
          {/* 수익 관련 정보 */}
          {modelData !== undefined && (
            <DeliveryAppProfitViewer
              memory={props.memory}
              deliveryAppServiceMemberId={dataUtil.getModelIdentificationCodeFromWrappedDataSet(modelData, modelName)}
            />
          )}
        </Box>
      ),
    },
    // noAvailable
    // noPastReview
    {
      title: '광고 관리',
      element: (
        <Box>
          {/* 광고 관련 정보 */}
          {modelData !== undefined && (
            <DeliveryAppAdvertisementViewer
              memory={props.memory}
              deliveryAppServiceMemberId={dataUtil.getModelIdentificationCodeFromWrappedDataSet(modelData, modelName)}
            />
          )}
        </Box>
      ),
    },
    {
      title: '리뷰 관리',
      element: (
        <Box>
          {/* 리뷰 관련 정보 */}
          {modelData !== undefined && (
            <DeliveryAppReviewViewer
              memory={props.memory}
              deliveryAppServiceMemberId={dataUtil.getModelIdentificationCodeFromWrappedDataSet(modelData, modelName)}
            />
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box pb={10}>
      <Box>
        <TabPanel
          tabSelectionSectionConfig={{
            tabWrapperProps: {
              variant: 'scrollable',
              scrollButtons: 'auto',
              allowScrollButtonsMobile: true,
            },
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
          tabContents={modelData !== undefined ? tabContents : tabContents.slice(0, 1)}
        />
      </Box>
    </Box>
  );
};

export default DeliveryAppServiceMemberDetail;
