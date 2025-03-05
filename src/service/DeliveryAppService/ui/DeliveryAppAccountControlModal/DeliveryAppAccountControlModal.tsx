import {
  Box,
  Button,
  CardContent,
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
} from "@mui/material";
import { IData, IWrappedData } from "../../../../@types/base/data";
import DefaultController from "../../../../controller/default/DefaultController";
import DataUtil from "../../../../utils/data/DataUtil";
import BaseForm from "../../../../layout/forms/base/BaseForm/BaseForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import moment from "moment";
import Memory from "../../../../utils/data/Memory";
import {
  InputCore,
  ModalCore,
  TextTypeInput,
} from "@leanoncompany/supporti-react-ui";
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import BikeScooterRoundedIcon from "@mui/icons-material/BikeScooterRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EmptyList from "../../../../ui/local/display/EmptyList";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

interface IDeliveryAppAccountControlModalProps {
  memory: Memory;
  deliveryAppServiceMemberId: number;
  deliveryAppAcountId?: string | string[];
  deliveryAppAcountList: any[];
  setDeliveryAppAcountList: React.Dispatch<React.SetStateAction<any[]>>;
  appMemberId?: number;
  serviceMemberLoaderKey: number;
  setServiceMemberLoaderKey: React.Dispatch<React.SetStateAction<number>>;
  shopLoaderKey: number;
  setShopLoaderKey: React.Dispatch<React.SetStateAction<number>>;
}

const DeliveryAppAccountControlModal = (
  props: IDeliveryAppAccountControlModalProps
) => {
  //* Modules
  const dataUtil = new DataUtil();
  const router = useRouter();
  const theme = useTheme();
  const deliveryAppShopModelName = "DeliveryAppShop";
  const deliveryAppShopController = new DefaultController(
    deliveryAppShopModelName
  );

  //* States
  const [modalKey, setModalKey] = useState<number>(0);
  const [openModal, setOpenModal] = useState(false);

  //* Constants
  const selectablePlatformList: {
    label: string;
    value: string;
    icon: React.ReactElement;
  }[] = [
    {
      label: "배달의 민족",
      value: "BAEMIN_REVIEW_REPLY_SERVICE",
      icon: <DeliveryDiningRoundedIcon />,
    },
    {
      label: "요기요",
      value: "YOGIYO_REVIEW_REPLY_SERVICE",
      icon: <BikeScooterRoundedIcon />,
    },
    {
      label: "쿠팡 이츠",
      value: "COUPANG_EATS_REVIEW_REPLY_SERVICE",
      icon: <TwoWheelerRoundedIcon />,
    },
  ];

  //* Controller
  const modelName = "DeliveryAppAccount";
  const controller = new DefaultController(modelName);

  const botActionLogModelName = "BotActionLog";
  const botActionLogController = new DefaultController(botActionLogModelName);

  //* Let
  let intervalId: any = null;

  //* States
  /**
   * 모델 데이터
   */
  const [modelData, setModelData] = useState<{
    [key: string]: IWrappedData;
  }>();

  /**
   * 회원의 계정에 속한 상점 리스트
   */
  const [shopList, setShopList] = useState<any[]>([]);

  /**
   * 계정 검증 대기 여부
   */
  const [isWaitingValidation, setIsWaitingValidation] =
    useState<boolean>(false);

  /**
   * 폼용 데이터 리스트
   */
  const dataList: IData[] = [
    {
      keys: ["SHOP_PLATFORM_KEY"],
      ui: "custom",
      label: "플랫폼",
      initialValue: "",
      grid: {
        xs: 12,
        md: 12,
      },
      customRenderCallback: (wrappedDataDict) => {
        return (
          <Box>
            <InputCore
              labelConfig={{
                position: "outer",
                label: "플랫폼 선택",
              }}
              inputCaptionConfig={{
                status: wrappedDataDict["SHOP_PLATFORM_KEY"].inputStatus,
                requiredMessage: "플랫폼을 선택해주세요.",
              }}
              inputStatus={wrappedDataDict["SHOP_PLATFORM_KEY"].inputStatus}
            >
              <ToggleButtonGroup
                size="large"
                value={wrappedDataDict["SHOP_PLATFORM_KEY"].state}
                onChange={(
                  event: React.MouseEvent<HTMLElement>,
                  value: string | null
                ) => {
                  if (value !== null) {
                    const setterCallback =
                      wrappedDataDict["SHOP_PLATFORM_KEY"].setter;

                    if (setterCallback !== undefined) {
                      setterCallback(value);
                    }

                    const inputStatusSetterCallback =
                      wrappedDataDict["SHOP_PLATFORM_KEY"].setInputStatus;

                    if (inputStatusSetterCallback !== undefined) {
                      inputStatusSetterCallback({
                        status: "default",
                      });
                    }
                  }
                }}
                exclusive={true}
                aria-label="Large sizes"
              >
                {selectablePlatformList.map((selectablePlatform) => (
                  <ToggleButton
                    value={selectablePlatform.value}
                    key={selectablePlatform.value}
                    sx={{
                      display: "block",
                      width: "90px",
                      height: "90px",
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.primary.main,
                      },
                      "&:hover": {
                        backgroundColor:
                          selectablePlatform.value ===
                          wrappedDataDict["SHOP_PLATFORM_KEY"].state
                            ? `${theme.palette.primary.dark} !important`
                            : "#e0e0e0",
                      },
                    }}
                  >
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      flexDirection={"column"}
                    >
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        mb={"12px"}
                      >
                        {React.cloneElement(selectablePlatform.icon, {
                          style: {
                            fontSize: "large",
                            color:
                              selectablePlatform.value ===
                              wrappedDataDict["SHOP_PLATFORM_KEY"].state
                                ? "white"
                                : theme.palette.grey["600"],
                          },
                        })}
                      </Box>
                      <Typography
                        variant={"subtitle2"}
                        sx={{
                          color:
                            selectablePlatform.value ===
                            wrappedDataDict["SHOP_PLATFORM_KEY"].state
                              ? "#ffffff"
                              : theme.palette.grey[800],
                        }}
                      >
                        {selectablePlatform.label}
                      </Typography>
                    </Box>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </InputCore>
          </Box>
        );
      },
    },
    {
      keys: ["SHOP_USER_NAME"],
      ui: "textarea",
      label: "사장님 아이디",
      disabled: modelData !== undefined,
      grid: {
        xs: 12,
        md: 12,
      },
    },
    {
      keys: ["SHOP_PASSWORD"],
      ui: "textarea",
      type: "password",
      label: "사장님 비밀번호",
      grid: {
        xs: 12,
        md: 12,
      },
    },
    {
      keys: ["DELAY_HOUR"],
      ui: "select",
      label:
        "리뷰가 달린 후, 며칠 이후에 답글을 달까요? (당일 등록한 봇은 다음날부터 업로드 기능이 작동됩니다.",
      grid: {
        xs: 12,
        md: 12,
      },
      initialValue: "0",
      selectableItems: [
        {
          label: "즉시",
          value: "0",
        },
        {
          label: "1일 후",
          value: "1",
        },
        {
          label: "2일 후",
          value: "2",
        },
        {
          label: "3일 후",
          value: "3",
        },
        {
          label: "4일 후",
          value: "4",
        },
        {
          label: "5일 후",
          value: "5",
        },
        {
          label: "6일 후",
          value: "6",
        },
        {
          label: "7일 후",
          value: "7",
        },
      ],
    },
    {
      keys: ["ACTIVATE_HOUR"],
      label: "업로드 활동 시간",
      ui: "select",
      grid: {
        xs: 12,
        md: 12,
      },
      initialValue: "00~12",
      selectableItems: [
        {
          label: "00시 ~ 12시",
          value: "00~12",
        },
        {
          label: "12시 ~ 24시",
          value: "12~24",
        },
      ],
    },
  ];

  //* Functions
  /**
   * 데이터 삭제
   */
  const onClickDeleteButton = () => {
    if (props.deliveryAppAcountId !== undefined) {
      controller.deleteItem(
        {
          [dataUtil.getModelIdentificationCode(modelName)]:
            props.deliveryAppAcountId,
        },
        (res) => {
          alert("삭제가 완료되었습니다.");

          //* 리스트에서 삭제
          props.setDeliveryAppAcountList(
            props.deliveryAppAcountList.filter(
              (deliveryAppAcount) =>
                deliveryAppAcount.DELIVERY_APP_ACCOUNT_IDENTIFICATION_CODE !==
                props.deliveryAppAcountId
            )
          );
        },
        (err) => {
          alert("삭제 중 오류가 발생했습니다.");
        }
      );
    }
  };

  /**
   * 데이터 수정을 위한 모달 열기
   */
  const onClickOpenUpdateModalButton = () => {
    setOpenModal(true);
  };

  /**
   * 계정 중복 확인
   */
  const checkDuplicateAccount = (
    args: { [key: string]: any },
    successCallback: () => void,
    role: "create" | "update"
  ) => {
    controller.getOneItemByKey(
      {
        SHOP_USER_NAME: args.SHOP_USER_NAME,
        SHOP_PASSWORD: args.SHOP_PASSWORD,
        SHOP_PLATFORM_KEY: args.SHOP_PLATFORM_KEY,
        USE_YN: "Y",
      },
      (res) => {
        const account = res.data.result;
        let isDuplicated = false;

        if (role === "create") {
          isDuplicated = account !== null;
        } else if (role === "update") {
          isDuplicated =
            account !== null &&
            account.DELIVERY_APP_ACCOUNT_IDENTIFICATION_CODE !==
              props.deliveryAppAcountId;
        }

        if (isDuplicated) {
          alert("이미 해당 플랫폼 자동화에 등록된 아이디 및 비밀번호 입니다.");
        } else {
          successCallback();
        }
      },
      (err) => {
        alert("중복 확인 중 오류가 발생했습니다.");
      }
    );
  };

  /**
   * 소속 가게 클릭 시
   */
  const handleSelect = (item: any) => {
    const confirmMessage =
      item.ACTIVATE_YN == "Y"
        ? "가게를 비활성화 시킬까요?"
        : "가게를 활성화 시킬까요?";

    if (confirm(confirmMessage)) {
      deliveryAppShopController.updateItem(
        {
          DELIVERY_APP_SHOP_IDENTIFICATION_CODE:
            item.DELIVERY_APP_SHOP_IDENTIFICATION_CODE,
          ACTIVATE_YN: item.ACTIVATE_YN == "Y" ? "N" : "Y",
        },
        (res) => {
          alert("가게가 업데이트 되었습니다.");

          //* 리스트에서 업데이트
          const updatedShopList = shopList.map((shop) => {
            if (
              shop.DELIVERY_APP_SHOP_IDENTIFICATION_CODE ===
              item.DELIVERY_APP_SHOP_IDENTIFICATION_CODE
            ) {
              return {
                ...shop,
                ACTIVATE_YN: item.ACTIVATE_YN == "Y" ? "N" : "Y",
              };
            } else {
              return shop;
            }
          });

          setShopList(updatedShopList);
        },
        (err) => {
          console.log(err);
          alert("가게 업데이트 중 오류가 발생했습니다.");
        }
      );
    }
  };

  /**
   * 소속 가게 선택 여부
   */
  const handleIsSelected = (item: any) => {
    if (item.ACTIVATE_YN == "Y") {
      return true;
    } else {
      return false;
    }
  };

  /**
   * 카드 데이터 생성
   */
  const createCardData = (targetModelData: { [key: string]: IWrappedData }) => {
    //* 계정 상태 체크
    let color = "green";
    let accountStatus = "정상";

    if (shopList.length === 0) {
      accountStatus = "소속 가게 없음 (매일 1회, 00시에 업데이트)";
      color = "grey";
    } else {
      let isActivatedShopExist = false;

      shopList.map((shop) => {
        if (shop.ACTIVATE_YN == "Y") {
          isActivatedShopExist = true;
        }
      });

      if (isActivatedShopExist === false) {
        accountStatus = "활성화된 가게가 없음 (매일 1회, 00시에 업데이트)";
        color = "red";
      }
    }

    //* 카드 데이터 리스트 생성
    const cardDataList: {
      label: string;
      value: string;
      xs: number;
      md: number;
    }[] = [
      {
        label: "플랫폼",
        value: getPlatformTypography(targetModelData.SHOP_PLATFORM_KEY.state),
        xs: 6,
        md: 4,
      },
      {
        label: "아이디",
        value: targetModelData.SHOP_USER_NAME.state,
        xs: 6,
        md: 4,
      },
      {
        label: "계정상태",
        value: accountStatus,
        xs: 12,
        md: 4,
      },
    ];

    return cardDataList;
  };

  /**
   * 플랫폼 타이포그래피 설정
   */
  const getPlatformTypography = (platformKey: string) => {
    switch (platformKey) {
      case "BAEMIN_REVIEW_REPLY_SERVICE":
        return "배달의 민족";
      case "YOGIYO_REVIEW_REPLY_SERVICE":
        return "요기요";
      case "COUPANG_EATS_REVIEW_REPLY_SERVICE":
        return "쿠팡 이츠";
    }

    return "알 수 없음";
  };

  /**
   * 검증 신청
   */
  const validateAccount = (
    accountIdentificationCode: number,
    serviceKey: string
  ) => {
    props.setServiceMemberLoaderKey(props.serviceMemberLoaderKey + 1);

    controller.getData(
      {
        DELIVERY_APP_ACCOUNT_IDENTIFICATION_CODE: accountIdentificationCode,
      },
      `${controller.rootRoute}/common/scraper/service/automation/delivery_app/business/run_crawl_integrated_for_update`,
      (res) => {
        const currentTime = new Date();
        setIsWaitingValidation(true);

        intervalId = setInterval(() => {
          botActionLogController.getAllItems(
            {
              BOT_ID: accountIdentificationCode,
              BOT_TYPE: serviceKey,
              PERIOD_TARGET_KEY: "CREATED_AT",
              PERIOD_START: currentTime,
            },
            (res) => {
              // if (res.data.result.rows.length > 0) {
              // 	console.log('==============');
              // 	console.log(res.data.result.rows);

              // 	let isEnded = false;
              // 	let isSignInFailed = false;

              // 	for (const item of res.data.result.rows) {
              // 		if (item.CODE === 'PROCESS_END') {
              // 			isEnded = true;
              // 		} else if (item.CODE === 'SIGN_IN_FAILED') {
              // 			isSignInFailed = true;
              // 		}
              // 	}

              // 	if (isEnded === true) {
              // 		setIsWaitingValidation(false);

              // 		if (isSignInFailed === true) {
              // 			alert(
              // 				'계정의 아이디 및 비밀번호가 잘못되었습니다.'
              // 			);
              // 		} else {
              // 			alert(
              // 				'검증 및 업데이트가 완료되었습니다.'
              // 			);
              // 		}

              // 		clearInterval(intervalId);
              // 		setOpenModal(false);

              // 		props.setShopLoaderKey(
              // 			props.shopLoaderKey + 1
              // 		);
              // 	}
              // }

              clearInterval(intervalId);
              setOpenModal(false);
              alert(
                "검증 및 업데이트가 완료되었습니다. 약 3분 뒤 계정에 샵인샵 가게들이 노출됩니다. 업로드되지 않을 시, 계정 아이디와 비밀번호를 확인해주세요."
              );
              props.setShopLoaderKey(props.shopLoaderKey + 1);
            },
            (err) => {
              alert("검증 중 오류가 발생했습니다.");
              setIsWaitingValidation(false);
              clearInterval(intervalId);
              setOpenModal(false);
            }
          );
        }, 1500);
      },
      (err) => {
        alert("검증 중 오류가 발생했습니다.");
      }
    );
  };

  //* Hooks
  /**
   * 등록 및 수정이 가능해야함
   * 하위에 등록된 가게들이 보여야함
   */
  /**
   * 계정에 등록된 샵인샵 리스트 가져오는 훅
   */
  useEffect(() => {
    if (props.deliveryAppAcountId !== undefined) {
      deliveryAppShopController.findAllItems(
        {
          DELIVERY_APP_ACCOUNT_IDENTIFICATION_CODE: props.deliveryAppAcountId,
        },
        (res) => {
          setShopList(res.data.result.rows);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }, [props.deliveryAppAcountId, props.shopLoaderKey]);

  /**
   * 생성 모달의 경우, 모달이 닫힐 때마다 데이터 초기화
   */
  useEffect(() => {
    if (openModal === false && props.deliveryAppAcountId === undefined) {
      setModalKey(modalKey + 1);
    }
  }, [openModal]);

  return (
    <Box>
      <Box>
        {/* 모달 */}
        <ModalCore
          modalWidth={
            {
              xs: "360px",
              md: "500px",
            } as any
          }
          keepMounted={true}
          isModalOpen={openModal}
          setIsModalOpen={setOpenModal}
          useModalCloseButton={true}
          disableOpen={true}
          modalButtonElement={
            <Box>
              {props.deliveryAppAcountId !== undefined &&
              modelData !== undefined ? (
                <Box pl={2} pt={1} pr={1} pb={0.75}>
                  {/* 계정 컨트롤 */}
                  <Box display={"flex"} justifyContent={"flex-end"}>
                    <Box display={"flex"} alignItems={"center"}>
                      {/* 업데이트 버튼 */}
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"center"}
                      >
                        <IconButton
                          size={"small"}
                          color={"primary"}
                          onClick={async () => {
                            onClickOpenUpdateModalButton();
                          }}
                        >
                          <EditRoundedIcon />
                        </IconButton>
                        <Box mt={"-10px"}>
                          <Typography variant={"caption"}>수정</Typography>
                        </Box>
                      </Box>

                      {/* 삭제 버튼 */}
                      <Box
                        ml={1}
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"center"}
                      >
                        <IconButton
                          size={"small"}
                          color={"primary"}
                          onClick={() => {
                            onClickDeleteButton();
                          }}
                        >
                          <DeleteForeverRoundedIcon />
                        </IconButton>
                        <Box mt={"-10px"}>
                          <Typography variant={"caption"}>삭제</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Box>
                    {/* 가게 기본 정보 */}
                    <Box mb={1.5}>
                      <Grid container spacing={1.5}>
                        {createCardData(modelData).map((cardData) => (
                          <Grid item xs={cardData.xs} md={cardData.md}>
                            <TextTypeInput
                              fullWidth
                              labelConfig={{
                                label: cardData.label,
                                position: "outer",
                              }}
                              value={cardData.value}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                    {/* 하위 계정 리스트 */}
                    <Box mb={1}>
                      <Typography
                        variant={"caption"}
                        sx={{
                          mb: 1,
                        }}
                      >
                        소속 가게 리스트 (가게 클릭 시 상태 변경 가능)
                      </Typography>
                    </Box>

                    <Box
                      mb={1}
                      p={1.75}
                      borderRadius={1.5}
                      sx={{
                        background: "#e6e6e6",
                      }}
                    >
                      {shopList.length === 0 ? (
                        <EmptyList />
                      ) : (
                        <Grid container spacing={1.75}>
                          {shopList.map((shop, index) => (
                            <Grid item xs={12} md={6}>
                              <Box
                                key={index}
                                onClick={() => {
                                  handleSelect(shop);
                                }}
                                p={1.5}
                                borderRadius={1.5}
                                sx={{
                                  background: handleIsSelected(shop)
                                    ? theme.palette.primary.main
                                    : "#fff",
                                  cursor: "pointer",
                                  "&::-webkit-scrollbar": {
                                    height: "4px",
                                  },

                                  "&::-webkit-scrollbar-track": {
                                    boxShadow: "none",
                                    background: "transparent",
                                  },

                                  "&::-webkit-scrollbar-thumb": {
                                    background: "#DCDDE0",
                                    borderRadius: "4px",
                                    width: "6px",
                                    height: "26px",
                                  },
                                }}
                              >
                                <Grid
                                  container
                                  alignItems={"center"}
                                  spacing={1.5}
                                >
                                  <Grid item xs={2.5}>
                                    <Box
                                      width={"100%"}
                                      height={"100%"}
                                      display={"flex"}
                                      alignItems={"center"}
                                      justifyContent={"center"}
                                    >
                                      <CheckCircleOutlineRoundedIcon
                                        htmlColor={
                                          handleIsSelected(shop)
                                            ? "white"
                                            : "#afafaf"
                                        }
                                        sx={{
                                          fontSize: "x-large",
                                        }}
                                      />
                                    </Box>
                                  </Grid>

                                  <Grid item xs={9.5}>
                                    <Box>
                                      <Typography
                                        variant={"h6"}
                                        color={
                                          handleIsSelected(shop)
                                            ? "white"
                                            : "#afafaf"
                                        }
                                      >
                                        {shop.SHOP_NAME}
                                      </Typography>
                                    </Box>

                                    <Box>
                                      <Typography
                                        variant={"body1"}
                                        color={
                                          handleIsSelected(shop)
                                            ? "white"
                                            : "#afafaf"
                                        }
                                      >
                                        자동화 서비스 :{" "}
                                        {shop.ACTIVATE_YN == "Y"
                                          ? "활성화"
                                          : "비활성화"}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box>
                  {
                    //* 데이터 생성 버튼
                  }
                  <Box
                    display="flex"
                    alignItems={"flex-end"}
                    justifyContent="flex-end"
                  >
                    <Box
                      mt={-1.5}
                      mb={1.5}
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                    >
                      <IconButton
                        size={"small"}
                        color={"primary"}
                        onClick={() => {
                          setOpenModal(true);
                        }}
                      >
                        <AddCircleOutlineIcon
                          style={{
                            fontSize: "larger",
                          }}
                        />
                      </IconButton>
                      <Box mt={"-10px"}>
                        <Typography variant={"caption"}>추가</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          }
          titleElement={
            <Typography
              variant={"h5"}
              sx={{
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              계정 관리
            </Typography>
          }
        >
          <Box
            position={"relative"}
            sx={{
              width: "100%",
              height: "100%",
              overflowX: "clip",
            }}
            mb={-1.5}
            key={modalKey}
          >
            {/* 계정 검증 대기 박스 */}
            {isWaitingValidation && (
              <Box
                width={"100%"}
                height={"100%"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                position={"absolute"}
                zIndex={10}
                bgcolor={"rgba(255, 255, 255, 0.9)"}
              >
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  flexDirection={"column"}
                >
                  <Box mb={1}>
                    <CircularProgress />
                  </Box>

                  <Box mb={0.5}>
                    <Typography variant={"h5"}>
                      계정 검증이 진행중입니다.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant={"body1"}>
                      잠시만 기다려주세요.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            <BaseForm
              outerBoxProps={{
                p: 0,
                borderRadius: 0,
                sx: {},
                mb: 0,
              }}
              pid={props.deliveryAppAcountId}
              pageRole={
                props.deliveryAppAcountId !== undefined ? "edit" : "write"
              }
              setFetchedData={setModelData}
              modelIdKey={
                dataUtil.convertToUpperCasedUnderbarSeparated(modelName) +
                "_IDENTIFICATION_CODE"
              }
              dataList={dataList}
              memory={props.memory}
              createCallback={(args, successCallback, failCallback) => {
                //* 중복 확인 및 생성
                checkDuplicateAccount(
                  args,
                  () => {
                    if (props.appMemberId !== undefined) {
                      args["APP_MEMBER_IDENTIFICATION_CODE"] =
                        props.appMemberId;
                    }

                    args["DELIVERY_APP_SERVICE_MEMBER_IDENTIFICATION_CODE"] =
                      props.deliveryAppServiceMemberId;

                    controller.createItem.bind(controller)(
                      args,
                      (res) => {
                        //* 리스트에 데이터 추가
                        const deliveryAppAccountId =
                          res.data.result[
                            dataUtil.convertToUpperCasedUnderbarSeparated(
                              modelName
                            ) + "_IDENTIFICATION_CODE"
                          ];
                        const serviceKey = res.data.result["SHOP_PLATFORM_KEY"];

                        //* 데이터 검증 신청
                        validateAccount(deliveryAppAccountId, serviceKey);
                      },
                      failCallback
                    );
                  },
                  "create"
                );
              }}
              updateCallback={(args, successCallback, failCallback) => {
                //* 중복 확인 및 업데이트
                checkDuplicateAccount(
                  args,
                  () => {
                    controller.updateItem.bind(controller)(
                      args,
                      () => {
                        const deliveryAppAccountId =
                          args.DELIVERY_APP_ACCOUNT_IDENTIFICATION_CODE;
                        const serviceKey = args.SHOP_PLATFORM_KEY;

                        //* 데이터 검증 신청
                        validateAccount(deliveryAppAccountId, serviceKey);
                      },
                      failCallback
                    );
                  },
                  "create"
                );
              }}
              findOneCallback={controller.getOneItem.bind(controller)}
              deleteCallback={onClickDeleteButton}
            />
          </Box>
        </ModalCore>
      </Box>
    </Box>
  );
};

export default DeliveryAppAccountControlModal;
