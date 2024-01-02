import { Box, Typography, Grid, Button, useTheme } from '@mui/material';
import { InputCore, SelectTypeInput } from '@leanoncompany/supporti-react-ui';
import React, { useEffect, useState, useRef } from 'react';
import { IInputCore_EXTENDED } from '../../../../@types/external/qillieReactUi';

interface ISelectProps extends IInputCore_EXTENDED {
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  selectableItems?: { value: string; label: string }[];
  disabled?: boolean;
}

const Select = (props: ISelectProps) => {
  //* Modules
  const theme = useTheme();

  return (
    <Box>
      <InputCore
        labelConfig={props.labelConfig}
        inputCaptionConfig={props.inputCaptionConfig}
        inputStatus={props.inputStatus}>
        <SelectTypeInput
          disabled={props.disabled}
          placeHolderConfig={{
            variant: 'subtitle1',
          }}
          selectFieldStyle={{
            borderRadius: '4px',
            '.MuiInputBase-input': {
              fontSize: '11.5px',
              fontWeight: 500,
              py: '30px important!',
              pl: '3px important!',
              pr: '8.5px important!',
            },
            '.MuiOutlinedInput-notchedOutline': {
              border: `1px solid ${theme.palette.grey['200']}`,
            },
            '.MuiSvgIcon-root ': {
              fill: `${theme.palette.grey['400']} !important`,
              right: '3px',
            },
          }}
          fullWidth
          value={props.value}
          setValue={props.setValue}
          onChangeCallback={(args: any) => {
            console.log(args.event);
            console.log(args.event.target.value);
            props.setValue(args.event.target.value);
          }}
          selectDataValueKey={'value'}
          selectDataLabelKey={'label'}
          placeholder={'대상을 선택해주세요'}
          selectableList={props.selectableItems}
        />
      </InputCore>
    </Box>
  );
};

export default Select;
