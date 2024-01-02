import { Box, Typography, Grid, Button, useTheme, IconButton } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { InputCore, ModalCore, TextTypeInput } from '@leanoncompany/supporti-react-ui';
import { IInputCore_EXTENDED } from '../../../../@types/external/qillieReactUi';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Calendar } from 'react-date-range';
import ko from 'date-fns/locale/ko';
import moment from 'moment';

interface IDatePickerProps extends IInputCore_EXTENDED {
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  setInputStatus?: React.Dispatch<React.SetStateAction<any>>;
  disabled?: boolean;
}

const DatePicker = (props: IDatePickerProps) => {
  //* Modules
  const theme = useTheme();

  //* States
  /**
   * 모달
   */
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <Box>
      <InputCore
        labelConfig={props.labelConfig}
        inputCaptionConfig={props.inputCaptionConfig}
        inputStatus={props.inputStatus}>
        {/* 모달 */}
        <ModalCore
          // onModalClose={() => {
          // 	setOpenModal(false);
          // }}
          keepMounted={true}
          isModalOpen={openModal}
          setIsModalOpen={setOpenModal}
          useModalCloseButton={true}
          modalWrapperStyle={{
            width: '100%',
          }}
          modalButtonElement={<Box display={'none'}></Box>}
          titleElement={
            <Typography variant={'h5'} fontWeight={'600'} textAlign={'center'}>
              날짜 선택
            </Typography>
          }>
          <Box>
            <Box display={'flex'} justifyContent={'center'}>
              <Calendar
                locale={ko}
                date={props.value !== undefined && props.value !== null ? props.value : new Date()}
                onChange={(item) => {
                  props.setValue(item);

                  if (props.setInputStatus !== undefined) {
                    props.setInputStatus({
                      status: 'default',
                    });
                  }
                }}
                direction="vertical"
              />
            </Box>
          </Box>
        </ModalCore>

        <Box width={'100%'} position={'relative'}>
          <TextTypeInput
            fullWidth
            labelConfig={undefined}
            disabled={true}
            value={props.value !== undefined && props.value !== null ? moment(props.value).format('YYYY.MM.DD') : ''}
            placeholder={'날짜를 선택하세요.'}
          />
          <Box
            zIndex={1}
            position={'absolute'}
            width={'100%'}
            height={'100%'}
            left={0}
            top={0}
            onClick={() => {
              console.log('====');
              console.log('A');
              console.log(props.disabled);
              console.log(openModal);

              if (props.disabled !== true) {
                setOpenModal(true);
              }
            }}></Box>
        </Box>
      </InputCore>
    </Box>
  );
};

export default DatePicker;
