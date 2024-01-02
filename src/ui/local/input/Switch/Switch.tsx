import { Box, Typography, Grid, Button, useTheme, Switch as MuiSwitch } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { InputCore } from '@leanoncompany/supporti-react-ui';
import { IInputCore_EXTENDED } from '../../../../@types/external/qillieReactUi';

interface ISwitchProps extends IInputCore_EXTENDED {
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  disabled?: boolean;
}

const Switch = (props: ISwitchProps) => {
  //* Functions
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setValue(event.target.checked ? 'Y' : 'N');
  };

  return (
    <Box>
      <InputCore
        labelConfig={props.labelConfig}
        inputCaptionConfig={props.inputCaptionConfig}
        inputStatus={props.inputStatus}>
        <MuiSwitch
          disabled={props.disabled}
          checked={props.value == 'Y'}
          onChange={handleChange}
          color={'primary'}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </InputCore>
    </Box>
  );
};

export default Switch;
