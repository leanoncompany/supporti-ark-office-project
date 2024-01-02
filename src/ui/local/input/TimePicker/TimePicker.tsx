import { Box, Typography, Grid, Button, useTheme, IconButton } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { InputCore, ModalCore, TextTypeInput } from '@leanoncompany/supporti-react-ui';
import { IInputCore_EXTENDED } from '../../../../@types/external/qillieReactUi';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ReactTimePicker from 'react-time-picker';

interface ITimePickerProps extends IInputCore_EXTENDED {
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  setInputStatus?: React.Dispatch<React.SetStateAction<any>>;
  disabled?: boolean;
}

const TimePicker = (props: ITimePickerProps) => {
  //* Modules
  const theme = useTheme();

  //* States
  /**
   * 모달
   */

  return (
    <Box>
      <InputCore
        labelConfig={props.labelConfig}
        inputCaptionConfig={props.inputCaptionConfig}
        inputStatus={props.inputStatus}>
        <ReactTimePicker
          disableClock={true}
          clearIcon={null}
          onChange={(item) => {
            props.setValue(item);

            if (props.setInputStatus !== undefined) {
              props.setInputStatus({
                status: 'default',
              });
            }
          }}
          value={props.value}
        />
      </InputCore>
    </Box>
  );
};

export default TimePicker;
