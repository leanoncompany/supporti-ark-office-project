import { Box, Button, CardContent, Fade, Grid, Modal, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DefaultController from '../../../../../../controller/default/DefaultController';
import { BadgeFilter } from '../../../../../../ui/local/input/BadgeFilter';
import DataUtil from '../../../../../../utils/data/DataUtil';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { DateSelectPicker } from '../../../../../../ui/local/utils/DateSelectPicker';
import moment from 'moment';
import { ModalCore } from '@leanoncompany/supporti-react-ui';
import AutoCompleteTypeFilter, {
  IAutoCompleteTypeFilterSelectableOption,
} from '../../../../../../ui/local/input/AutoCompleteTypeFilter/AutoCompleteTypeFilter';

export interface ISelectedDeliveryShopFilterValue {
  SELECTED_DELIVERY_APP_SERVICE_MEMBER_ID: string | null;
  SELECTED_DELIVERY_APP_ACCOUNT_ID: string | null;
  SELECTED_DELIVERY_APP_SHOP_ID: string | null;
}

interface IShopFilterModalProps {
  memory: any;
  deliveryAppServiceMemberId?: string | string[];
  value: ISelectedDeliveryShopFilterValue;
  setValue: React.Dispatch<React.SetStateAction<ISelectedDeliveryShopFilterValue | undefined>>;
}

const ShopFilterModal = (props: IShopFilterModalProps) => {
  //* Modules
  const theme = useTheme();
  const dataUtil = new DataUtil();
  const firstFilterModelName = 'DeliveryAppServiceMember';
  const firstFilterController = new DefaultController(firstFilterModelName);
  const secondFilterModelName = 'DeliveryAppAccount';
  const secondFilterController = new DefaultController(secondFilterModelName);
  const thirdFilterModelName = 'DeliveryAppShop';
  const thirdFilterController = new DefaultController(thirdFilterModelName);

  //* States
  /**
   * 모달
   */
  const [openModal, setOpenModal] = useState<boolean>(false);

  /**
   * 뱃지
   */
  const [badgeLabelList, setBadgeLabelList] = useState<string[]>([]);

  /**
   * 배달앱 서비스 회원 리스트
   */
  const [selectedDeliveryAppServiceMember, setSelectedDeliveryAppServiceMember] =
    useState<IAutoCompleteTypeFilterSelectableOption | null>(null);
  const [deliveryAppServiceMemberList, setDeliveryAppServiceMemberList] = useState<any[]>([]);

  /**
   * 플랫폼별 계정 선택
   */
  const [selectedDeliveryAppAccount, setSelectedDeliveryAppAccount] =
    useState<IAutoCompleteTypeFilterSelectableOption | null>(null);
  const [deliveryAppAccountList, setDeliveryAppAccountList] = useState<any[]>([]);

  /**
   * 계정별 상점 선택
   */
  const [selectedDeliveryAppShop, setSelectedDeliveryAppShop] =
    useState<IAutoCompleteTypeFilterSelectableOption | null>(null);
  const [deliveryAppShopList, setDeliveryAppShopList] = useState<any[]>([]);

  /**
   * 선택된 데이터들
   */

  /**
   * 선택 가능한 플랫폼
   */
  const selectablePlatformList = [
    {
      label: '배달의 민족',
      value: 'BAEMIN_REVIEW_REPLY_SERVICE',
    },
    {
      label: '요기요',
      value: 'YOGIYO_REVIEW_REPLY_SERVICE',
    },
    {
      label: '쿠팡 이츠',
      value: 'COUPANG_EATS_REVIEW_REPLY_SERVICE',
    },
  ];

  //* Functions
  const getSelectedFilterLabel = (
    selectableFilterList: {
      label: string;
      value: string;
    }[],
    selectedFilterList: string[],
    fallbackLabel: string
  ) => {
    const selectedLabelList: string[] = [];

    selectableFilterList.forEach((selectableFilter) => {
      if (selectedFilterList.includes(selectableFilter.value)) {
        selectedLabelList.push(selectableFilter.label);
      }
    });

    if (selectedLabelList.length === 0) {
      return [fallbackLabel];
    } else {
      return selectedLabelList;
    }
  };

  /**
   * 적용 버튼 클릭 시 필터 적용
   */
  const applyFilter = () => {
    props.setValue({
      SELECTED_DELIVERY_APP_SERVICE_MEMBER_ID: selectedDeliveryAppServiceMember?.value ?? null,
      SELECTED_DELIVERY_APP_ACCOUNT_ID: selectedDeliveryAppAccount?.value ?? null,
      SELECTED_DELIVERY_APP_SHOP_ID: selectedDeliveryAppShop?.value ?? null,
    });

    setOpenModal(false);
  };

  //* Hooks
  /**
   * 입력받은 특정 배달앱 서비스 회원 아이디가 없을 경우, 전체 배달앱 서비스 회원 리스트를 가져온다.
   */
  useEffect(() => {
    if (props.deliveryAppServiceMemberId !== undefined) {
      firstFilterController.getOneItemByKey(
        {
          [dataUtil.getModelIdentificationCode(firstFilterModelName)]: props.deliveryAppServiceMemberId,
        },
        (res) => {
          setSelectedDeliveryAppServiceMember({
            label: res.data.result.SHOP_USER_NAME,
            value: String(props.deliveryAppServiceMemberId),
          });
        },
        (err) => {
          alert('첫 번째 필터 데이터를 가져오는데 실패했습니다.');
          console.log(err);
        }
      );
    } else {
      firstFilterController.findAllItems(
        {
          [dataUtil.getModelIdentificationCode(firstFilterModelName)]: props.deliveryAppServiceMemberId,
        },
        (res) => {
          setDeliveryAppServiceMemberList(res.data.result.rows);
        },
        (err) => {
          alert('첫 번째 필터 데이터를 가져오는데 실패했습니다.');
          console.log(err);
        }
      );
    }
  }, [props.deliveryAppServiceMemberId]);

  /**
   * 회원이 선택되었을 경우, 선택된 회원의 계정 리스트를 가져옴
   */
  useEffect(() => {
    setSelectedDeliveryAppAccount(null);

    let findOption: { [key: string]: any } = {};

    if (selectedDeliveryAppServiceMember !== null) {
      findOption[dataUtil.getModelIdentificationCode(firstFilterModelName)] = selectedDeliveryAppServiceMember['value'];
    }

    secondFilterController.findAllItems(
      findOption,
      (res) => {
        setDeliveryAppAccountList(
          res.data.result.rows.map((row: any) => {
            const platformName =
              selectablePlatformList.find((platform) => {
                return platform.value === row['SHOP_PLATFORM_KEY'];
              })?.label ?? '알 수 없음';

            return {
              ...row,
              PLATFORM_NAME: platformName,
            };
          })
        );
      },
      (err) => {
        alert('두 번째 필터 데이터를 가져오는데 실패했습니다.');
        console.log(err);
      }
    );
  }, [selectedDeliveryAppServiceMember]);

  /**
   * 회원의 계정이 선택되었을 경우, 선택된 계정의 상점 리스트를 가져옴
   */
  useEffect(() => {
    setSelectedDeliveryAppShop(null);

    let findOption: { [key: string]: any } = {};

    if (selectedDeliveryAppAccount !== null) {
      findOption[dataUtil.getModelIdentificationCode(secondFilterModelName)] = selectedDeliveryAppAccount['value'];
    }

    thirdFilterController.findAllItems(
      findOption,
      (res) => {
        let respondedDeliveryAppShopList = res.data.result.rows.map((row: any) => {
          const platformName =
            selectablePlatformList.find((platform) => {
              return platform.value === row['SHOP_PLATFORM_KEY'];
            })?.label ?? '알 수 없음';

          return {
            ...row,
            PLATFORM_NAME: platformName,
          };
        });

        if (selectedDeliveryAppAccount === null && props.deliveryAppServiceMemberId !== undefined) {
          respondedDeliveryAppShopList = respondedDeliveryAppShopList.filter((shop: any) => {
            return shop['DELIVERY_APP_SERVICE_MEMBER_IDENTIFICATION_CODE'] === props.deliveryAppServiceMemberId;
          });
        }

        setDeliveryAppShopList(respondedDeliveryAppShopList);
      },
      (err) => {
        alert('세 번째 필터 데이터를 가져오는데 실패했습니다.');
        console.log(err);
      }
    );
  }, [selectedDeliveryAppAccount]);

  /**
   * 뱃지 리스트 변경 훅
   */
  useEffect(() => {
    const targetBadgeList: string[] = [];

    targetBadgeList.push(selectedDeliveryAppAccount?.label ?? '전체 계정');
    targetBadgeList.push(selectedDeliveryAppShop?.label ?? '전체 상점');

    setBadgeLabelList(targetBadgeList);
  }, [props.value]);

  //* Components
  return (
    <Box>
      {/* 모달 */}
      <ModalCore
        modalWidth={
          {
            xs: '360px',
            md: '500px',
          } as any
        }
        isModalOpen={openModal}
        setIsModalOpen={setOpenModal}
        useModalCloseButton={true}
        modalWrapperStyle={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
        }}
        modalButtonElement={
          <CardContent
            onClick={() => {
              setOpenModal(true);
            }}
            sx={{
              p: '0 !important',
              pb: '0 !important',
              width: '100%',
            }}>
            <Box p={2} display={'flex'} alignItems={'center'}>
              {/* 아이콘 영역 */}
              <Box pr={2}>
                <FilterAltOutlinedIcon fontSize="small" htmlColor={theme.palette.grey['800']} />
              </Box>

              {/* 데이터 영역 */}
              <Box display={'flex'}>
                {badgeLabelList.map((label, index) => (
                  <Box
                    key={index}
                    mr={0.5}
                    my={0.5}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    px={1.25}
                    py={0.375}
                    borderRadius={0.75}
                    border={`1px solid ${theme.palette.primary.main}`}>
                    <Typography variant={'body1'} color={theme.palette.primary.main} fontWeight={500}>
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        }
        titleElement={
          <Typography variant={'h5'} fontWeight={'600'} textAlign={'center'}>
            필터
          </Typography>
        }>
        {/* Modal content */}
        <Box
          position={'relative'}
          px={2}
          sx={{
            width: '100%',
            height: '100%',
            overflowX: 'clip',
          }}>
          {/* 회원별 필터 (1차) */}
          {props.deliveryAppServiceMemberId === undefined && deliveryAppServiceMemberList.length !== 0 && (
            <Box borderBottom={'1px solid rgb(242, 242, 242)'} pb={2.5} mb={2}>
              <AutoCompleteTypeFilter
                placeholder="전체 회원"
                label={'회원 선택'}
                value={selectedDeliveryAppServiceMember}
                setValue={setSelectedDeliveryAppServiceMember}
                selectableOptionList={deliveryAppServiceMemberList.map((deliveryAppServiceMember) => {
                  return {
                    label: deliveryAppServiceMember['FULL_NAME'],
                    value: deliveryAppServiceMember[dataUtil.getModelIdentificationCode(firstFilterModelName)],
                  };
                })}
              />
            </Box>
          )}

          {/* 계정별 필터 (2차) */}
          <Box borderBottom={'1px solid rgb(242, 242, 242)'} pb={2.5} mb={2}>
            <AutoCompleteTypeFilter
              placeholder="전체 계정"
              groupBy={(option) => {
                return option.args?.PLATFORM_NAME;
              }}
              label={'플랫폼별 계정 선택'}
              value={selectedDeliveryAppAccount}
              setValue={setSelectedDeliveryAppAccount}
              selectableOptionList={deliveryAppAccountList.map((deliveryAppAccount) => {
                return {
                  label: deliveryAppAccount['SHOP_USER_NAME'],
                  value: deliveryAppAccount[dataUtil.getModelIdentificationCode(secondFilterModelName)],
                  args: {
                    PLATFORM_NAME: deliveryAppAccount['PLATFORM_NAME'],
                  },
                };
              })}
            />
          </Box>

          {/* 상점별 필터 (3차) */}
          <Box>
            <AutoCompleteTypeFilter
              placeholder="전체 상점"
              groupBy={(option) => {
                return option.args?.PLATFORM_NAME;
              }}
              label={'상점별 선택'}
              value={selectedDeliveryAppShop}
              setValue={setSelectedDeliveryAppShop}
              selectableOptionList={deliveryAppShopList.map((deliveryAppShop) => {
                return {
                  label: deliveryAppShop['SHOP_NAME'],
                  value: deliveryAppShop[dataUtil.getModelIdentificationCode(thirdFilterModelName)],
                  args: {
                    PLATFORM_NAME: deliveryAppShop['PLATFORM_NAME'],
                  },
                };
              })}
            />
          </Box>

          {/* 적용 버튼 */}
          <Box mt={5}>
            <Button size={'large'} fullWidth variant="contained" color="primary" onClick={applyFilter}>
              <Typography color={'#fff'} variant={'h6'} fontWeight={500}>
                적용하기
              </Typography>
            </Button>
          </Box>
        </Box>
      </ModalCore>
    </Box>
  );
};

export default ShopFilterModal;
