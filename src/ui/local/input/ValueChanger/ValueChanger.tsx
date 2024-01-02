import { Typography, Button, Grid, ButtonGroup } from '@mui/material';
import { Box } from '@mui/system';
import { InputCore, TextTypeInput } from '@leanoncompany/supporti-react-ui';
import { RegexManager } from '@leanoncompany/supporti-utility';
import React, { useState } from 'react';
import { IInputCore_EXTENDED } from '../../../../@types/external/qillieReactUi';

interface IPointChangerProps extends IInputCore_EXTENDED {
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
}

const PointChanger = (props: IPointChangerProps) => {
  //* States
  const regexManager = new RegexManager();
  const [valueInputStatus, setValueInputStatus] = useState<{
    status: string;
  }>({ status: 'default' });

  //* Functions
  const handleValue = (money: number) => {
    if (props.value === undefined) {
      props.setValue(money);
    } else if (props.value !== undefined) {
      props.setValue(props.value + money);
    }
  };

  return (
    <InputCore
      labelConfig={props.labelConfig}
      inputCaptionConfig={props.inputCaptionConfig}
      inputStatus={props.inputStatus}>
      <Box display={'flex'} flexDirection={'column'} width={'100%'} mb={0.5}>
        <TextTypeInput
          fullWidth
          placeholder={`${props.labelConfig?.label}을 입력해주세요`}
          value={props.value}
          setValue={props.setValue}
          inputCaptionConfig={{
            status: valueInputStatus,
            errorMessage: `${props.labelConfig?.label}을 입력해주세요`,
          }}
          onChangeCallback={(args: any) => {
            if (args.event.target.value.length > 0) {
              setValueInputStatus({
                status: 'default',
              });
            }
            props.setValue(Number(regexManager.filterNotNumber(args.event.target.value)));
          }}
          adornmentPosition={'end'}
          adornmentElement={
            <Button
              variant={'outlined'}
              onClick={() => {
                props.setValue(0);
              }}
              color={'info'}
              sx={{
                padding: 0,
                color: 'gray',
              }}>
              초기화
            </Button>
          }
        />
      </Box>

      {/*  카드 , 핸드폰, 가상 , 실시간 이체 */}
      <Grid container>
        <Grid item md={12} xs={12}>
          <ButtonGroup
            // size="large"
            color="info"
            disableElevation
            variant="outlined"
            aria-label="Disabled elevation buttons"
            fullWidth>
            <Button
              onClick={() => handleValue(10000)}
              sx={{
                height: '44px',
                color: 'gray',
                // color: theme.palette.grey[900],
              }}>
              +1만
            </Button>
            <Button
              onClick={() => handleValue(50000)}
              sx={{
                height: '44px',
                color: 'gray',
                // color: theme.palette.grey[900],
              }}>
              +5만
            </Button>
            <Button
              onClick={() => handleValue(100000)}
              sx={{
                height: '44px',
                color: 'gray',
                // color: theme.palette.grey[900],
              }}>
              +10만
            </Button>
            <Button
              onClick={() => handleValue(1000000)}
              sx={{
                height: '44px',
                color: 'gray',
                // color: theme.palette.grey[900],
              }}>
              +100만
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </InputCore>
  );
};

export default PointChanger;
