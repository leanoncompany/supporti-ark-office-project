import { IDropdownLeafNode } from '@leanoncompany/supporti-react-ui';
import React from 'react';
import { IAlarm } from './alarm';

type TToolbarContentKey =
  | 'customMenu'
  | 'drawer'
  | 'logo'
  | 'basicMenu'
  | 'dropDownMenu'
  | 'customDrawer'
  | 'spacing'
  | 'alarm'
  | 'rightMenu';

export interface INavigatorProps {
  logoPath?: string;
  logoImage?: React.ReactElement;
  useDropDown?: boolean;
  order: {
    xs?: TToolbarContentKey[];
    sm?: TToolbarContentKey[];
    md?: TToolbarContentKey[];
    lg?: TToolbarContentKey[];
    xl?: TToolbarContentKey[];
  };
  useContainer?: boolean;
  menu: IDropdownLeafNode[];
  dropDownMenus?: React.ReactElement;
  customDrawerMenus?: React.ReactElement;
  sideBar?: React.ReactElement;
  alarm?: IAlarm;
  rightMenus?: React.ReactElement[];
  subMenu?: React.ReactElement;
  containerMaxWidth?: string;
  containerDisableGutters?: boolean;
  containerPaddingX?: string;
  disableHeader?: boolean;
}
