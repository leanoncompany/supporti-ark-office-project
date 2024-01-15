import { IUserInputCaption, IUserInputStatus } from '@leanoncompany/supporti-react-ui';
import { Dispatch, SetStateAction } from 'react';
import { TUploadImageCallback } from '../../ui/local/input/ImageUploader/ImageUploader';
import { SxProps, Theme } from '@mui/material';

export interface IData {
  keys: string[];
  ui: string;
  type?: string;
  label: string;
  link?: string;
  placeholder?: string;
  captionMessages?: IUserInputCaption;
  maxLength?: number;
  rows?: number;
  isOptional?: boolean;
  valueFormatterCallback?: (value: any) => any;
  grid?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  initialValue?: any;
  selectableItems?: { value: string; label: string }[];
  callbacks?: {
    doubleCheckUserName?: (
      args: { USER_NAME: string; ID?: string },
      successCallback: (response: any) => void,
      failCallback?: (err: any) => void
    ) => void;
    getAllCallback?: (
      args: { [key: string]: any },
      successCallback?: (response: any) => void,
      failCallback?: (err: any) => void
    ) => void;
    receivedSelectableDataFormatterCallback?: (value: any) => { label: string; value: any }[];
  };
  customRenderCallback?: (wrappedDataDict: IWrappedDataDict) => React.ReactElement;
  disabled?: boolean;
  uploadImageCallback?: TUploadImageCallback;
  gridStyleCallback?: (wrappedDataDict: { [key: string]: IWrappedData }) => SxProps<Theme>;
  directInput?: boolean;
  timePickerType?: 'datetimepicker' | 'timepicker';
}

export interface IWrappedData {
  state: any;
  setter?: Dispatch<SetStateAction<any>>;
  inputStatus?: IUserInputStatus;
  setInputStatus?: Dispatch<SetStateAction<IUserInputStatus>>;
  extendedStates?: {
    [key: string]: {
      state: any;
      setter: Dispatch<SetStateAction<any>>;
    };
  };
}

export interface IWrappedDataDict {
  [key: string]: IWrappedData;
}
