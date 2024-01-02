import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import React, { useEffect, useRef, useState } from 'react';
import { IAlarm, IAlarmList } from '../../../@types/ui/global/alarm';
import NotificationController from '../../../controller/default/NotificationController';
import useNotification from '../../../hooks/data/useNotification';
import { useRouter } from 'next/router';
import moment from 'moment';
import useCheckLogin from '../../../hooks/data/useCheckLogin';
import { CookieManager } from '@leanoncompany/supporti-utility';
import useSound from 'use-sound';

import { Howl, Howler } from 'howler';

// type Props = {};

const Alarm = (props: IAlarm) => {
  const theme = useTheme();
  const router = useRouter();
  const cookieManager = new CookieManager();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [contentPerPage, setContentPerPage] = useState<number>(20);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const countMaxPage = (count: number, selectedContentPerPage: number) => {
    return count < selectedContentPerPage ? 1 : Math.ceil(count / selectedContentPerPage);
  };

  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const notificationController = new NotificationController();

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const [userExchangeAlarm] = useSound(props.soundDict.marketChargeSfx);
  // const [marketExchangeAlarm] = useSound('/sounds/marketCharge.m4a');

  const [alarmList, setAlarmList] = useState<IAlarmList[]>([]);

  let firstAlarm: IAlarmList | undefined = undefined;

  const [isInitiated, setIsInitiated] = useState<boolean>(false);
  let howlDict: { [key: string]: any } = {};

  // 1. 처음 데이터를 불러와서 담는다. 첫번째꺼 담는 스테이트, 리스트 담는 스테이트
  // 2. 다시 불러올때 첫번째꺼보다 늦게 생긴애들 담는 데이터, 늦게생긴애들에서 첫번째꺼를 또 담는다.
  // 3. 늦게생긴애들 하나씩 알림 띄움
  // 4. 반복

  // eslint-disable-next-line react-hooks/exhaustive-deps

  // let howlDict: { [key: string]: any } = {};

  // if (props.soundDict !== undefined) {
  // 	Object.keys(props.soundDict).forEach((key) => {
  // 		howlDict[key] = new Howl({
  // 			src: [props.soundDict![key]],
  // 		});
  // 	});
  // }

  const setHowlDict = () => {
    if (props.soundDict !== undefined) {
      Object.keys(props.soundDict).forEach((key) => {
        const soundSrc = [props.soundDict![key]];

        if (howlDict[key] !== undefined) {
          howlDict[key] = new Howl({
            src: soundSrc,
            autoplay: false,
            html5: true,
            loop: false,

            format: ['m4a', 'webm', 'opus', 'mp3', 'aac'],
            onload: () => {},
          });
        }
      });
    }
  };

  const getNoti2 = () => {
    //* 클릭 해봄
    if (ref.current) {
      ref.current?.click();
    }

    //* Howl dict 설정
    setHowlDict();

    const accessToken = cookieManager.getItemInCookies('ACCESS_TOKEN');

    if (accessToken !== undefined) {
      notificationController.getNotificationList(
        {
          CONNECTED_USER_MODEL_NAME: props.modelName,
          LIMIT: contentPerPage,
          PAGE: selectedPage,
        },
        (response: any) => {
          let clonedList: IAlarmList[] = [];
          // let firstArrayData: date = response.data.result[0].CREATED_AT;
          let tempFirstAlarm: undefined | IAlarmList = firstAlarm !== undefined ? { ...firstAlarm } : undefined;

          // eslint-disable-next-line array-callback-return
          //* 알림 데이터 가져옴

          response.data.result.map((resEl: any, resIndex: number) => {
            clonedList.push({
              title: resEl.TITLE !== undefined ? resEl.TITLE : undefined,
              description: resEl.CONTENT !== undefined ? resEl.CONTENT : undefined,
              hoverColor: 'skyblue',
              date: timeAgo(new Date(resEl.CREATED_AT)),
              link: resEl.WEB_LINK !== undefined ? resEl.WEB_LINK : undefined,
              createdAt: new Date(resEl.CREATED_AT),
            });
          });

          //* 최신 알림 기준으로 이보다 생성 시간 늦은 애들 저장
          let newAlarmList: IAlarmList[] = [];

          for (const element of clonedList) {
            if (firstAlarm !== undefined) {
              // console.log('엘리먼트 생성');
              // console.log(element.createdAt);
              // console.log('퍼스트 알람 생성');
              // console.log(firstAlarm.createdAt);
              // console.log('비교');
              // console.log(
              // 	element.createdAt > firstAlarm.createdAt
              // );
              // console.log(
              // 	element.createdAt >= firstAlarm.createdAt
              // );
              // console.log(
              // 	element.createdAt < firstAlarm.createdAt
              // );
              // console.log('----------------');

              if (element.createdAt > firstAlarm.createdAt) {
                newAlarmList.push({ ...element });
              }
            } else {
              newAlarmList.push({ ...element });
            }
          }

          // console.log('하울');
          // console.log(howlDict);
          // console.log('퍼스트 알람');
          // console.log(firstAlarm);
          // console.log('뉴알람');
          // console.log(newAlarmList);
          // console.log('템프 퍼스트 알람');
          // console.log(tempFirstAlarm);

          //* 새롭게 추가된 알림들 소리 알림 울리기
          if (newAlarmList.length !== 0) {
            if (howlDict[newAlarmList[0].title] !== undefined) {
              // console.log('하울 딕트 [뉴알람 0번쨰 타이틀]');
              // console.log(howlDict[newAlarmList[0].title]);

              howlDict[newAlarmList[0].title].stop();
              howlDict[newAlarmList[0].title].unload();
              howlDict[newAlarmList[0].title].play();
            }
            //  else if (
            // 	howlDict['확인 안한 알림'] !== undefined
            // ) {
            // 	howlDict['확인 안한 알림'].play();
            // }
            // newAlarmList.map((ele: any, index: number) => {
            // 	if (howlDict !== undefined && index === 0) {
            // 		if (howlDict[ele.title] !== undefined) {
            // 			howlDict[ele.title].play();
            // 		} else if (
            // 			howlDict['확인 안한 알림'] !== undefined
            // 		) {
            // 			howlDict['확인 안한 알림'].play();
            // 		} else {
            // 			console.log('알림 에러 발생');
            // 		}
            // 	}
            // });

            // userExchangeAlarm();
          }

          if (tempFirstAlarm !== undefined) {
          } else {
            // if (clonedList.length > 0) {
            // 	// if (howlDict !== undefined) {
            // 	if (howlDict['확인 안한 알림'] !== undefined) {
            // 		howlDict['확인 안한 알림'].play();
            // 	}
            // 	// }
            // }
          }

          //* 최신 알림 업데이트
          // console.log('클론드 리스트');
          // console.log(clonedList);
          let isFirstAlarmUpdated: boolean = false;

          if (firstAlarm === undefined) {
            if (clonedList.length > 0) {
              // console.log('여기');
              tempFirstAlarm = clonedList[0];
              isFirstAlarmUpdated = true;
            } else {
              // tempFirstAlarm = {
              // 	title: '더미 알람',
              // 	description: '더미 알람',
              // 	hoverColor: 'skyblue',
              // 	date: '더미 알람',
              // 	link: 'dummy',
              // 	createdAt: new Date(),
              // };
            }
          } else {
            for (const element of clonedList) {
              if (tempFirstAlarm !== undefined && element.createdAt > tempFirstAlarm.createdAt) {
                tempFirstAlarm = { ...element };
                isFirstAlarmUpdated = true;

                break;
              }
            }
          }
          firstAlarm = tempFirstAlarm;
          setAlarmList(clonedList);
        },
        (err: any) => {
          alert(err);
        }
      );
    }
  };

  const getNoti = () => {
    if (ref.current) {
      ref.current?.click();
    }
    let howlDict: { [key: string]: any } = {};
    if (Object.keys(howlDict).length === 0) {
      if (props.soundDict !== undefined) {
        Object.keys(props.soundDict).forEach((key) => {
          howlDict[key] = new Howl({
            src: [props.soundDict![key]],
            autoplay: false,
            html5: true,
            loop: false,

            format: ['m4a', 'webm', 'opus', 'mp3', 'aac'],
            onload: () => {},
          });
        });
      }
    }

    const accessToken = cookieManager.getItemInCookies('ACCESS_TOKEN');

    if (accessToken !== undefined) {
      notificationController.getNotificationList(
        {
          CONNECTED_USER_MODEL_NAME: props.modelName,
          LIMIT: contentPerPage,
          PAGE: selectedPage,
        },
        (response: any) => {
          let clonedList: IAlarmList[] = [];
          // let firstArrayData: date = response.data.result[0].CREATED_AT;
          let tempFirstAlarm: undefined | IAlarmList = firstAlarm !== undefined ? { ...firstAlarm } : undefined;

          // eslint-disable-next-line array-callback-return
          //* 알림 데이터 가져옴

          response.data.result.map((resEl: any, resIndex: number) => {
            clonedList.push({
              title: resEl.TITLE !== undefined ? resEl.TITLE : undefined,
              description: resEl.CONTENT !== undefined ? resEl.CONTENT : undefined,
              hoverColor: 'skyblue',
              date: timeAgo(new Date(resEl.CREATED_AT)),
              link: resEl.WEB_LINK !== undefined ? resEl.WEB_LINK : undefined,
              createdAt: resEl.CREATED_AT,
            });
          });

          //* 최신 알림 기준으로 이보다 생성 시간 늦은 애들 저장
          let newAlarmList: IAlarmList[] = [];

          for (const element of clonedList) {
            if (firstAlarm !== undefined) {
              // console.log('엘리먼트 생성');
              // console.log(element.createdAt);
              // console.log('퍼스트 알람 생성');
              // console.log(firstAlarm.createdAt);
              // console.log('비교');
              // console.log(
              // 	element.createdAt > firstAlarm.createdAt
              // );
              // console.log(
              // 	element.createdAt >= firstAlarm.createdAt
              // );
              // console.log(
              // 	element.createdAt < firstAlarm.createdAt
              // );
              // console.log('----------------');

              if (element.createdAt > firstAlarm.createdAt) {
                newAlarmList.push({ ...element });
              }
            } else {
              newAlarmList.push({ ...element });
            }
          }

          // console.log('하울');
          // console.log(howlDict);
          // console.log('퍼스트 알람');
          // console.log(firstAlarm);
          // console.log('뉴알람');
          // console.log(newAlarmList);
          // console.log('템프 퍼스트 알람');
          // console.log(tempFirstAlarm);

          //* 새롭게 추가된 알림들 소리 알림 울리기
          if (newAlarmList.length !== 0) {
            if (howlDict[newAlarmList[0].title] !== undefined) {
              // console.log('하울 딕트 [뉴알람 0번쨰 타이틀]');
              // console.log(howlDict[newAlarmList[0].title]);

              howlDict[newAlarmList[0].title].stop();
              howlDict[newAlarmList[0].title].unload();
              howlDict[newAlarmList[0].title].play();
            }
            //  else if (
            // 	howlDict['확인 안한 알림'] !== undefined
            // ) {
            // 	howlDict['확인 안한 알림'].play();
            // }
            // newAlarmList.map((ele: any, index: number) => {
            // 	if (howlDict !== undefined && index === 0) {
            // 		if (howlDict[ele.title] !== undefined) {
            // 			howlDict[ele.title].play();
            // 		} else if (
            // 			howlDict['확인 안한 알림'] !== undefined
            // 		) {
            // 			howlDict['확인 안한 알림'].play();
            // 		} else {
            // 			console.log('알림 에러 발생');
            // 		}
            // 	}
            // });

            // userExchangeAlarm();
          }

          if (tempFirstAlarm !== undefined) {
          } else {
            // if (clonedList.length > 0) {
            // 	// if (howlDict !== undefined) {
            // 	if (howlDict['확인 안한 알림'] !== undefined) {
            // 		howlDict['확인 안한 알림'].play();
            // 	}
            // 	// }
            // }
          }

          //* 최신 알림 업데이트
          // console.log('클론드 리스트');
          // console.log(clonedList);
          let isFirstAlarmUpdated: boolean = false;

          if (firstAlarm === undefined) {
            if (clonedList.length > 0) {
              // console.log('tempFirstAlarm = clonedList[0];');
              tempFirstAlarm = clonedList[0];
              isFirstAlarmUpdated = true;
            } else {
              // tempFirstAlarm = {
              // 	title: '더미 알람',
              // 	description: '더미 알람',
              // 	hoverColor: 'skyblue',
              // 	date: '더미 알람',
              // 	link: 'dummy',
              // 	createdAt: new Date(),
              // };
            }
          } else {
            for (const element of clonedList) {
              if (tempFirstAlarm !== undefined && element.createdAt > tempFirstAlarm.createdAt) {
                tempFirstAlarm = { ...element };
                isFirstAlarmUpdated = true;

                break;
              }
            }
          }
          firstAlarm = tempFirstAlarm;
          setAlarmList(clonedList);
        },
        (err: any) => {
          alert(err);
        }
      );
    }
  };

  // 시간 몇분전 등등 함수
  const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    // 초 단위로 차이를 계산하여 적절한 문자열을 반환합니다.
    if (seconds < 10) {
      return '방금 전';
    } else if (seconds < 60) {
      return `${seconds}초 전`;
    } else {
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) {
        return `${minutes}분 전`;
      } else {
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
          return `${hours}시간 전`;
        } else if (hours < 168) {
          const days = Math.floor(hours / 24);
          return `${days}일 전`;
        } else {
          return moment(date).format('YYYY-MM-DD');
        }
      }
    }
  };

  const { readNotification } = useNotification(getNoti, (err: any) => {
    console.log(err);
  });

  useEffect(() => {
    const accessToken = cookieManager.getItemInCookies('ACCESS_TOKEN');

    if (accessToken !== undefined) {
      setIsInitiated(true);
      // setInterval(getNoti, 3000);
    } else {
      setIsInitiated(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isInitiated === true) {
      setInterval(getNoti, 3500);
    }
  }, [isInitiated]);

  // 1. 데이터 2개에 담음
  // 2. 또 불러옴.
  // 3. 여기서 데이터가

  return (
    <Box>
      <Box display={'none'} ref={ref} id="alarms"></Box>
      <Box>
        <Tooltip title="알림">
          <Box>
            <IconButton
              onClick={(e: any) => {
                if (alarmList.length > 0) {
                  handleClick(e);
                } else {
                  return;
                }
              }}
              size="small"
              sx={{}}
              aria-controls={open ? 'alarm' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}>
              <Badge
                badgeContent={alarmList.length > 9 ? '9+' : alarmList.length}
                // badgeContent={'9+'}
                color="primary"
                overlap="circular"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: 6,
                    width: 10,
                  },
                }}>
                {/* <Avatar sx={{ width: 32, height: 32 }}> */}
                <NotificationsNoneIcon fontSize="medium" />
                {/* </Avatar> */}
              </Badge>
            </IconButton>
          </Box>
        </Tooltip>
      </Box>
      {/* <Button
				sx={{
					display: 'none',
				}}
				id="alarmButton"
				onClick={(e: any) => {
					howlDict['확인 안한 알림'].play();
				}}
			></Button> */}
      <Box>
        <Menu
          anchorEl={anchorEl}
          id="alarm"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              height: 'auto',
              // props.height !== undefined
              // 	? props.height
              // 	: 'auto',
              width: '350px',
              // props.width !== undefined
              // 	? props.width
              // 	: 'auto',
              // overflowY:
              // 	props.height !== undefined ? 'auto' : 'visible',
              // overflowX: 'auto',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1,
              '& li': {
                whiteSpace: 'break-spaces',
              },
              position: 'relative',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
          <Box
            py={1.5}
            borderBottom={`1px solid ${theme.palette.grey[300]}`}
            position={'sticky'}
            top={0}
            sx={{
              backgroundColor: 'white',
              zIndex: '1000',
            }}>
            <Typography
              variant={'body1'}
              fontWeight={600}
              sx={{
                pl: 2.5,
              }}>
              알림
            </Typography>
          </Box>
          <Box
            sx={{
              height: '250px',
              overflowY: 'auto',
            }}>
            {alarmList.map((alarm, index) => (
              <Box key={index}>
                <MenuItem onClick={() => router.push(alarm.link)}>
                  <Box display={'flex'} pt={'5px'}>
                    <Box position={'relative'}>
                      <Box
                        position={'relative'}
                        top={'3px'}
                        left={'-5px'}
                        width={'5px'}
                        height={'5px'}
                        borderRadius={'50%'}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                        }}></Box>
                    </Box>
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      justifyContent={'center'}
                      // sx={{
                      // 	overFlowX: 'auto',
                      // }}
                    >
                      <Box mb={0.5}>
                        <Typography
                          variant={
                            props.titleSize !== undefined
                              ? (props.titleSize as
                                  | 'button'
                                  | 'caption'
                                  | 'h1'
                                  | 'h2'
                                  | 'h3'
                                  | 'h4'
                                  | 'h5'
                                  | 'h6'
                                  | 'inherit'
                                  | 'subtitle1'
                                  | 'subtitle2'
                                  | 'body1'
                                  | 'body2'
                                  | 'overline'
                                  | undefined)
                              : 'h6'
                          }
                          fontWeight={props.titleWeight !== undefined ? props.titleWeight : '600'}
                          color={props.titleColor !== undefined ? props.titleColor : '#000000'}
                          lineHeight={'1'}>
                          {alarm.title}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant={
                            props.descriptionSize !== undefined
                              ? (props.descriptionSize as
                                  | 'button'
                                  | 'caption'
                                  | 'h1'
                                  | 'h2'
                                  | 'h3'
                                  | 'h4'
                                  | 'h5'
                                  | 'h6'
                                  | 'inherit'
                                  | 'subtitle1'
                                  | 'subtitle2'
                                  | 'body1'
                                  | 'body2'
                                  | 'overline'
                                  | undefined)
                              : 'h6'
                          }
                          fontWeight={props.descriptionWeight !== undefined ? props.descriptionWeight : '400'}
                          color={props.descriptionColor !== undefined ? props.descriptionColor : '#000000'}>
                          {alarm.description.length > 15 ? alarm.description.slice(0, 20) + '...' : alarm.description}
                        </Typography>
                      </Box>
                      <Box mt={0.25}>
                        <Typography variant={'body1'} color={theme.palette.grey[600]}>
                          {alarm.date}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </MenuItem>
                {/* {index !== alarmList.length - 1 && ( */}
                <Divider
                  sx={{
                    '&.MuiDivider-root': {
                      marginTop: '0 !important',
                      marginBottom: '0 !important',
                    },
                  }}
                />
                {/* )} */}
              </Box>
            ))}
          </Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} mt={1.5}>
            <Pagination
              count={maxPage}
              page={selectedPage}
              onChange={(event, page) => {
                setSelectedPage(page);
              }}
              showFirstButton
              showLastButton
            />
          </Box>
        </Menu>
      </Box>
    </Box>
  );
};

export default Alarm;
