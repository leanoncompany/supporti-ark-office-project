import { Box, Typography, IconButton, Grid, TextField, Button } from '@mui/material';
import { DeletableBadge, InputCore, IUserInputStatus, TextTypeInput } from '@leanoncompany/supporti-react-ui';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import React, { useEffect, useState, useRef } from 'react';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { RegexManager } from '@leanoncompany/supporti-utility';
import { IInputCore_EXTENDED } from '../../../../@types/external/qillieReactUi';
import { AutoCompleteTypeFilter } from '../AutoCompleteTypeFilter';
import { IAutoCompleteTypeFilterSelectableOption } from '../AutoCompleteTypeFilter/AutoCompleteTypeFilter';

interface IAutoCompleteSelectorProps extends IInputCore_EXTENDED {
  value: any;
  setValue: any;
  placeholder?: string;
  getAllCallback?: (
    args: { [key: string]: any },
    successCallback?: (response: any) => void,
    failCallback?: (err: any) => void
  ) => void;
  receivedSelectableDataFormatterCallback?: (value: any) => any;
  selectableItems?: { value: any; label: string }[];
  disabled?: boolean;
}

const AutoCompleteSelector = (props: IAutoCompleteSelectorProps) => {
  //* States
  /**
   * 선택 가능한 지역 리스트
   */
  const [selectableDataList, setSelectableDataCenterList] = useState<{ label: string; value: any }[]>([]);

  //* Hooks
  /**
   * 선택 가능한 지역 리스트 불러오기
   */
  useEffect(() => {
    const receivedSelectableDataFormatterCallback = props.receivedSelectableDataFormatterCallback;

    if (props.selectableItems !== undefined) {
      setSelectableDataCenterList(props.selectableItems);
    } else if (props.getAllCallback !== undefined && receivedSelectableDataFormatterCallback !== undefined) {
      props.getAllCallback(
        {},
        (res) => {
          setSelectableDataCenterList(receivedSelectableDataFormatterCallback(res.data.result.rows));
        },
        (err) => {
          alert('자동 완성 데이터 리스트를 불러오는데 실패했습니다');
        }
      );
    }
  }, []);

  return (
    <Box>
      <InputCore
        labelConfig={props.labelConfig}
        inputCaptionConfig={props.inputCaptionConfig}
        inputStatus={props.inputStatus}>
        <AutoCompleteTypeFilter
          disabled={props.disabled}
          value={(() => {
            /**
             * 선택된 지역 찾기
             */
            const foundResult = selectableDataList.find((item) => {
              return item.value === props.value;
            });

            return foundResult ? foundResult : null;
          })()}
          setValue={(newValue: IAutoCompleteTypeFilterSelectableOption | null) => {
            props.setValue(newValue ? newValue.value : null);
          }}
          selectableOptionList={selectableDataList}
          placeholder={props.placeholder}
        />
      </InputCore>
    </Box>
  );
};

export default AutoCompleteSelector;
