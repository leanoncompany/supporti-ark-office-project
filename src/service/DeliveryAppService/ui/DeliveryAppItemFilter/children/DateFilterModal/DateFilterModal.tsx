import { Box, Button, CardContent, Fade, Grid, Modal, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DefaultController from '../../../../../../controller/default/DefaultController';
import { BadgeFilter } from '../../../../../../ui/local/input/BadgeFilter';
import DataUtil from '../../../../../../utils/data/DataUtil';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { DateSelectPicker } from '../../../../../../ui/local/utils/DateSelectPicker';
import { ModalCore } from '@leanoncompany/supporti-react-ui';
import { DateRangePicker } from 'react-date-range';
import moment from 'moment';
import ko from 'date-fns/locale/ko';

interface IDateFilterModalProps {
  memory: any;
  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  injectedDateRange?: {
    startDate: Date;
    endDate: Date;
    key: string;
  }[];
}

const DateFilterModal = (props: IDateFilterModalProps) => {
  //* Modules
  const theme = useTheme();
  const dataUtil = new DataUtil();

  //* Functions
  const initDateRange = () => {
    return props.injectedDateRange !== undefined
      ? props.injectedDateRange
      : [
          {
            startDate: (() => {
              const currentDate = new Date();

              return moment(currentDate).subtract(1, 'weeks').startOf('day').toDate();
            })(),
            endDate: (() => {
              const currentDate = new Date();

              return moment(currentDate).endOf('day').toDate();
            })(),
            key: 'selection',
          },
        ];
  };

  //* States
  /**
   * 모달
   */
  const [openModal, setOpenModal] = useState<boolean>(false);
  // const [clonedStartDate, setClonedStartDate] = useState<Date | null>(null);
  // const [clonedEndDate, setClonedEndDate] = useState<Date | null>(null);

  const [dateRange, setDateRange] = useState(initDateRange());

  //* Hooks
  useEffect(() => {
    // setClonedStartDate(dateRange[0].startDate);
    // setClonedEndDate(dateRange[0].endDate);
    props.setStartDate(dateRange[0].startDate);
    props.setEndDate(dateRange[0].endDate);
  }, [dateRange]);

  //* Components
  return (
    <Box>
      {/* 모달 */}
      <ModalCore
        // onModalClose={() => {
        // 	setClonedStartDate(props.startDate);
        // 	setClonedEndDate(props.endDate);
        // 	initDateRange();

        // 	setOpenModal(false);
        // }}
        keepMounted={true}
        isModalOpen={openModal}
        setIsModalOpen={setOpenModal}
        useModalCloseButton={true}
        modalWrapperStyle={{
          width: '100%',
        }}
        modalButtonElement={
          <CardContent
            onClick={() => {
              setOpenModal(true);
            }}
            sx={{
              p: '0 !important',
              pb: '0 !important',
            }}>
            <Box
              p={2}
              borderRight={{
                xs: 'none',
                md: '1px solid rgba(0,0,0,.1)',
              }}
              borderBottom={{
                xs: '1px solid rgba(0,0,0,.1)',
                md: 'none',
              }}
              display={'flex'}
              alignItems={'center'}>
              {/* 아이콘 영역 */}
              <Box pr={2} display={'flex'}>
                <CalendarMonthOutlinedIcon fontSize="small" htmlColor={theme.palette.grey['800']} />
              </Box>

              {/* 데이터 영역 */}
              <Box>
                {/* 시작일 ~ 끝일 */}
                <Box>
                  <Box mb={0.5}>
                    <Typography variant={'h6'}>기간 선택</Typography>
                  </Box>

                  <Box mb={0.5}>
                    <Typography variant={'body1'} color={theme.palette.grey['800']}>
                      {moment(props.startDate).format('YYYY년 MM월 DD일')} ~
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant={'body1'} color={theme.palette.grey['800']}>
                      {moment(props.endDate).format('YYYY년 MM월 DD일')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        }
        titleElement={
          <Typography variant={'h5'} fontWeight={'600'} textAlign={'center'}>
            기간
          </Typography>
        }>
        <Box>
          <Box display={'flex'} justifyContent={'center'}>
            <DateRangePicker
              locale={ko}
              onChange={(item) => {
                setDateRange([item.selection] as any);
              }}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={dateRange}
              direction="vertical"
              maxDate={(() => {
                const currentDate = new Date();

                return moment(currentDate).toDate();
              })()}
            />
          </Box>

          {/* <Box>
						<Button
							color={'primary'}
							size={'large'}
							fullWidth
							variant="contained"
							onClick={() => {
								props.setStartDate(clonedStartDate);
								props.setEndDate(clonedEndDate);
								setOpenModal(false);
							}}
						>
							적용하기
						</Button>
					</Box> */}
        </Box>
      </ModalCore>
    </Box>
  );
};

export default DateFilterModal;
