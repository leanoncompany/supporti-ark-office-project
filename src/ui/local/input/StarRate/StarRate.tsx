import { Box, Typography, Grid, Button, useTheme } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { InputCore } from '@leanoncompany/supporti-react-ui';
import { IInputCore_EXTENDED } from '../../../../@types/external/qillieReactUi';

interface IStarRateProps extends IInputCore_EXTENDED {
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
}

const StarRate = (props: IStarRateProps) => {
  //* Modules
  const theme = useTheme();

  return (
    <Box>
      <InputCore
        labelConfig={props.labelConfig}
        inputCaptionConfig={props.inputCaptionConfig}
        inputStatus={props.inputStatus}>
        <Rating
          name="rating"
          defaultValue={props.value}
          value={props.value}
          precision={0.5}
          onChange={(event, newValue) => {
            props.setValue(newValue);
          }}
          emptyIcon={
            <StarIcon
              style={{
                opacity: 0.55,
              }}
              fontSize="inherit"
            />
          }
          sx={{
            '& .MuiRating-iconFilled': {
              color: theme.palette.primary.main,
            },
          }}
        />
      </InputCore>
    </Box>
  );
};

export default StarRate;
