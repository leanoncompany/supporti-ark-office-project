import { Box, Button, Grid, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { TextTypeInput } from '@leanoncompany/supporti-react-ui';
import { AddressPicker } from '@leanoncompany/supporti-react-ui';

interface IAddressProps {
  postCode: any;
  setPostCode: React.Dispatch<React.SetStateAction<any>>;
  postCodeInputStatus: any;
  setPostCodeInputStatus: React.Dispatch<React.SetStateAction<any>>;
  basicAddress: any;
  setBasicAddress: React.Dispatch<React.SetStateAction<any>>;
  basicAddressInputStatus: any;
  setBasicAddressInputStatus: React.Dispatch<React.SetStateAction<any>>;
  detailAddress: any;
  setDetailAddress: React.Dispatch<React.SetStateAction<any>>;
  detailAddressInputStatus: any;
  setDetailAddressInputStatus: React.Dispatch<React.SetStateAction<any>>;
  label: string;
}

const Address = (props: IAddressProps) => {
  //* Modules
  const theme = useTheme();

  return (
    <Box>
      <Grid container mb={2.5}>
        <Grid item md={12} xs={12} mb={1}>
          <Box mb={1}>
            <Typography variant={'caption'}>{props.label}</Typography>
          </Box>

          <Grid spacing={1} container alignItems={'flex-start'}>
            <Grid item md={9} xs={8}>
              <TextTypeInput
                value={props.postCode}
                setValue={props.setPostCode}
                fullWidth
                maxLength={20}
                disabled
                placeholder={'우편번호'}
                inputCaptionConfig={{
                  status: props.postCodeInputStatus,
                  errorMessage: '우편번호를 선택해주세요',
                }}
              />
            </Grid>

            <Grid
              item
              md={3}
              xs={4}
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              <AddressPicker
                buttonWrapperProps={{
                  sx: {
                    width: '100%',
                  },
                }}
                addressPickerButtonElement={
                  <Button
                    color={'primary'}
                    variant={'outlined'}
                    fullWidth
                    sx={{
                      height: '44px',
                    }}>
                    <Typography variant="subtitle1" color={theme.palette.primary.main}>
                      주소 검색
                    </Typography>
                  </Button>
                }
                addressSetterCallback={(fullAddress: string, postcode: string) => {
                  props.setPostCode(postcode);
                  props.setBasicAddress(fullAddress);
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={12} xs={12} mb={'8px'}>
          <TextTypeInput
            value={props.basicAddress}
            setValue={props.setBasicAddress}
            fullWidth
            maxLength={20}
            disabled
            placeholder={'기본주소'}
            inputCaptionConfig={{
              status: props.basicAddressInputStatus,
              errorMessage: '기본 주소를 선택해주세요',
            }}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <TextTypeInput
            fullWidth
            maxLength={20}
            placeholder={'상세주소를 입력해주세요'}
            value={props.detailAddress}
            setValue={props.setDetailAddress}
            inputCaptionConfig={{
              status: props.detailAddressInputStatus,
              errorMessage: '상세주소를 입력해주세요',
            }}
            onChangeCallback={(args: any) => {
              if (args.event.target.value.length > 0) {
                props.setDetailAddressInputStatus({
                  status: 'default',
                });
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Address;
