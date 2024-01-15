import { Box, Typography, Grid, Button, useTheme, IconButton } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { InputCore, ModalCore, TextTypeInput } from '@leanoncompany/supporti-react-ui';
import { IInputCore_EXTENDED } from '../../../../@types/external/qillieReactUi';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ReactTimePicker from 'react-time-picker';
import DateTimePicker from 'react-datetime-picker';

interface ITimePickerProps extends IInputCore_EXTENDED {
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  setInputStatus?: React.Dispatch<React.SetStateAction<any>>;
  disabled?: boolean;
  type?: 'datetimepicker' | 'timepicker';
}

const TimePicker = (props: ITimePickerProps) => {
  //* Modules
  const theme = useTheme();

  //* States

  return (
    <Box>
      <InputCore
        labelConfig={props.labelConfig}
        inputCaptionConfig={props.inputCaptionConfig}
        inputStatus={props.inputStatus}>
        {props.type === 'timepicker' ? (
          <ReactTimePicker
            onChange={(item) => {
              props.setValue(item);
              if (props.setInputStatus !== undefined) {
                props.setInputStatus({
                  status: 'default',
                });
              }
            }}
            value={props.value}
            disableClock={true}
            clearIcon={null}
          />
        ) : (
          <DateTimePicker
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
        )}
      </InputCore>
    </Box>
  );
};

export default TimePicker;
