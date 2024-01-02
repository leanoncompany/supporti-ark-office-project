import { Box, Button, Grid, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { TextTypeInput } from '@leanoncompany/supporti-react-ui';
import { useRouter } from 'next/router';
import { IMenu, IMenuSet } from '../../../../@types/layout/sideBar/sideBar';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import usePageLabel from '../../../../hooks/data/usePageLabel';
import Memory from '../../../../utils/data/Memory';

interface IBreadCrumbProps {
  memory: Memory;
}

const BreadCrumb = (props: IBreadCrumbProps) => {
  //* Modules
  const theme = useTheme();

  //* States
  const { labelCombination } = usePageLabel(props.memory);

  return (
    <Box>
      <Box display={'flex'} alignItems={'center'}>
        {labelCombination.map((label, index) => (
          <Box key={index} display={'flex'} alignItems={'center'} mr={0.25}>
            <Typography
              variant={'body2'}
              color={index !== labelCombination.length - 1 ? theme.palette.grey['800'] : undefined}>
              {label}
            </Typography>

            {index !== labelCombination.length - 1 && (
              <Box display={'flex'} alignItems={'center'} ml={0.25}>
                <NavigateNextIcon
                  htmlColor={theme.palette.grey['800']}
                  sx={{
                    fontSize: 'larger',
                  }}
                />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BreadCrumb;
