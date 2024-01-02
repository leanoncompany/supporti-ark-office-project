import { IUserInputStatus } from '@leanoncompany/supporti-react-ui';
import Memory from '../../../utils/data/Memory';

export interface ISearchArea {
  selectFieldWidth?: {
    xs?: string;
    md?: string;
  };
  textFieldWidth?: {
    xs?: string;
    md?: string;
  };
  memory?: Memory;
  disableWriteBtn?: boolean;
  buttons?: {
    label: string;
    onClicked: () => void;
    icon?: JSX.Element;
  }[];
  filterList?: {
    label: string;
    value: string | number;
  }[];
  setFilter?: React.Dispatch<React.SetStateAction<any>>;
  filter?: string | number;
  searchWord: string;
  setSearchWord: React.Dispatch<React.SetStateAction<string>>;
  searchWordInputStatus: IUserInputStatus;
  setSearchWordIInputStatus: React.Dispatch<React.SetStateAction<IUserInputStatus>>;
  label?: string;
  disableLabel?: boolean;
  handleSearch: (search: string) => void;
  disableSearchArea?: boolean;
  customControllerButton?: React.ReactElement;
}
