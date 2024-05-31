import { IData, IWrappedData } from "../../base/data";

export interface IUpdateButtonProps {
  data?: { [key: string]: any };
  dependentModelData?: { [key: string]: any };
  pageRole?: string;
  injectedData?: { [key: string]: any };
  dependentModelIdKey?: string | string[];
  modelIdKey: string;
  buttonType?: "icon" | "text";
  createCallback?: (
    args: { [key: string]: any },
    successCallback?: (response: any) => void,
    failCallback?: (err: any) => void
  ) => void;
  updateCallback?: (
    args: { [key: string]: any },
    successCallback?: (response: any) => void,
    failCallback?: (err: any) => void
  ) => void;
  validationCallback?: (wrappedDataDict: {
    [key: string]: IWrappedData;
  }) => Promise<boolean>;
  dataList: IData[];
  wrappedDataDict: { [key: string]: IWrappedData };
  disableNavigateAfterAction?: boolean;
  pid?: string | string[];
  disableUpdate?: boolean;
}

export interface IDeleteButtonProps {
  data?: { [key: string]: any };
  pageRole?: string;
  injectedData?: { [key: string]: any };
  modelIdKey: string;
  buttonType?: "icon" | "text";
  pid?: string | string[];
  disableDelete?: boolean;
  deleteCallback?: (
    args: { [key: string]: any },
    successCallback?: (response: any) => void,
    failCallback?: (err: any) => void
  ) => void;
}
