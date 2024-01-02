import { Box, Typography, Grid, Button, useTheme } from '@mui/material';
import { InputCore } from '@leanoncompany/supporti-react-ui';
import React, { useEffect, useState, useRef } from 'react';
import { IInputCore_EXTENDED } from '../../../../@types/external/qillieReactUi';

interface IShortcutProps {
  label?: string;
  link?: string;
  value: any;
}

const Shortcut = (props: IShortcutProps) => {
  //* Modules
  const theme = useTheme();

  return (
    <Button
      fullWidth
      variant={'outlined'}
      color={'primary'}
      onClick={() => {
        const ask = confirm(`${props.label} 링크로 이동하시겠습니까?`);

        if (ask) {
          if (props.link !== undefined && props.value !== undefined) {
            window.open(`${props.link}/${props.value}`, '_blank');
          } else {
            alert('링크가 없습니다.');
          }
        }
      }}>
      바로가기
    </Button>
  );
};

export default Shortcut;
