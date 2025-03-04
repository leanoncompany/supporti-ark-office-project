import { Box, Grid, Typography, useTheme } from "@mui/material";
import {
  SelectTypeInput,
  TextTypeInput,
} from "@leanoncompany/supporti-react-ui";
import React, { useState } from "react";
import { IUserInputStatus } from "../../@types/external/qillieReactUi";
import Grid2 from "@mui/material/Unstable_Grid2";

type Props = {
  bankType: string | undefined;
  setBankType: React.Dispatch<React.SetStateAction<string | undefined>>;
  bankAccount: string;
  setBankAccount: React.Dispatch<React.SetStateAction<string>>;
  bankAccountInputStatus: IUserInputStatus;
  setBankAccountInputStatus?: React.Dispatch<
    React.SetStateAction<IUserInputStatus>
  >;
  disableLabel?: boolean;
  disabled?: boolean;
};

const RegistBankAccount = (props: Props) => {
  const theme = useTheme();
  const [bankName, setBankName] = useState<{ label: string; value: string }[]>([
    {
      label: "카카오뱅크",
      value: "카카오뱅크",
    },
    {
      label: "농협",
      value: "농협",
    },
    {
      label: "신한",
      value: "신한",
    },
    {
      label: "IBK기업",
      value: "IBK기업",
    },
    {
      label: "하나",
      value: "하나",
    },
    {
      label: "우리",
      value: "우리",
    },
    {
      label: "국민",
      value: "국민",
    },
    {
      label: "SC제일",
      value: "SC제일",
    },
    {
      label: "대구",
      value: "대구",
    },
    {
      label: "부산",
      value: "부산",
    },
    {
      label: "광주",
      value: "광주",
    },
    {
      label: "새마을금고",
      value: "새마을금고",
    },
    {
      label: "경남",
      value: "경남",
    },
    {
      label: "전북",
      value: "전북",
    },
    {
      label: "제주",
      value: "제주",
    },
    {
      label: "산업",
      value: "산업",
    },
    {
      label: "우체국",
      value: "우체국",
    },
    {
      label: "신협",
      value: "신협",
    },
    {
      label: "수협",
      value: "수협",
    },
    {
      label: "시티",
      value: "시티",
    },
    {
      label: "케이뱅크",
      value: "케이뱅크",
    },
    {
      label: "토스뱅크",
      value: "토스뱅크",
    },
    {
      label: "도이치",
      value: "도이치",
    },
    {
      label: "BOA",
      value: "BOA",
    },
    {
      label: "BNP",
      value: "BNP",
    },
    {
      label: "중국공상",
      value: "중국공상",
    },
    {
      label: "HSBC",
      value: "HSBC",
    },
    {
      label: "JP모간",
      value: "JP모간",
    },
    {
      label: "산림조합",
      value: "산림조합",
    },
    {
      label: "저축은행",
      value: "저축은행",
    },
  ]);

  const [bankType, setBankType] = useState<string | undefined>();

  const [bankAccount, setBankAccount] = useState<string>("");
  const [bankAccountInputStatus, setBankAccountInputStatus] =
    useState<IUserInputStatus>({ status: "default" });

  return (
    <Box mt={1}>
      {props.disableLabel !== true && (
        <Box mb={1}>
          <Typography variant={"subtitle2"}>계좌 정보</Typography>
        </Box>
      )}

      <Box>
        <Grid2 container spacing={1}>
          <Grid2 item xs={4}>
            <SelectTypeInput
              disabled={props.disabled}
              placeHolderConfig={{
                variant: "subtitle1",
              }}
              selectFieldStyle={{
                borderRadius: "8px",
                height: "44.25px !important",
                ".MuiSelect-root": {
                  height: "44.25px !important",
                },
                ".MuiInputBase-root": {
                  height: "44.25px !important",
                },
                ".MuiInputBase-input": {
                  fontSize: "12px",
                  fontWeight: 500,
                  py: "10px",
                },
                ".MuiOutlinedInput-notchedOutline": {
                  border: `1px solid ${theme.palette.grey["200"]}`,
                },
                ".MuiSvgIcon-root ": {
                  fill: `${theme.palette.grey["400"]} !important`,
                  right: "3px",
                },
              }}
              fullWidth
              value={props.bankType}
              setValue={props.setBankType}
              selectDataValueKey={"value"}
              selectDataLabelKey={"label"}
              placeholder={"은행"}
              selectableList={bankName}
            ></SelectTypeInput>
          </Grid2>

          <Grid2 item xs={8}>
            <TextTypeInput
              disabled={props.disabled}
              fullWidth
              maxLength={20}
              placeholder={"계좌번호를 입력해주세요"}
              value={props.bankAccount}
              setValue={props.setBankAccount}
              inputCaptionConfig={{
                status: props.bankAccountInputStatus,
                errorMessage: "계좌번호를 입력해주세요",
              }}
              onChangeCallback={(args: any) => {
                if (args.event.target.value.length > 0) {
                  if (props.setBankAccountInputStatus !== undefined) {
                    props.setBankAccountInputStatus({
                      status: "default",
                    });
                  }
                }
              }}
            />
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default RegistBankAccount;
