import {
  Box,
  Button,
  CircularProgress,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  Modal,
  Pagination,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import { IData, IWrappedData } from '../../../../@types/base/data';
import DefaultController from '../../../../controller/default/DefaultController';
import DataUtil from '../../../../utils/data/DataUtil';
import BaseForm from '../../../../layout/forms/base/BaseForm/BaseForm';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Memory from '../../../../utils/data/Memory';
import DeliveryAppAccountControlModal from '../../ui/DeliveryAppAccountControlModal/DeliveryAppAccountControlModal';
import DeliveryAppProfitViewer from '../profit/DeliveryAppProfitViewer';
import { TabPanel, TextTypeInput } from '@leanoncompany/supporti-react-ui';
import EmptyList from '../../../../ui/local/display/EmptyList';
import DeliveryAppAdvertisementViewer from '../advertisement/DeliveryAppAdvertismentViewer';
import DeliveryAppReviewViewer from '../review/DeliveryAppReviewViewer';

interface IDeliveryAppReportDetailProps {
  memory: Memory;
  isAdmin?: boolean;
}

const DeliveryAppReportDetail = (props: IDeliveryAppReportDetailProps) => {
  //* Modules
  const dataUtil = new DataUtil();
  const router = useRouter();
  const theme = useTheme();

  //* Controller

  //* States
  const [deliveryAppServiceMemberId, setDeliveryAppServiceMemberId] = useState<string>();

  //* Functions

  //* Hooks

  //* Contants
  /**
   * 탭 정보
   */
  const tabContents = [
    {
      title: '수익 관리',
      element: (
        <Box>
          {/* 수익 관련 정보 */}
          {deliveryAppServiceMemberId !== undefined && (
            <DeliveryAppProfitViewer memory={props.memory} deliveryAppServiceMemberId={deliveryAppServiceMemberId} />
          )}
        </Box>
      ),
    },
    // noAvailable
    // noPastReview
    {
      title: '광고 관리',
      element: (
        <Box>
          {/* 광고 관련 정보 */}
          {deliveryAppServiceMemberId !== undefined && (
            <DeliveryAppAdvertisementViewer
              memory={props.memory}
              deliveryAppServiceMemberId={deliveryAppServiceMemberId}
            />
          )}
        </Box>
      ),
    },
    {
      title: '리뷰 관리',
      element: (
        <Box>
          {/* 리뷰 관련 정보 */}
          {deliveryAppServiceMemberId !== undefined && (
            <DeliveryAppReviewViewer memory={props.memory} deliveryAppServiceMemberId={deliveryAppServiceMemberId} />
          )}
        </Box>
      ),
    },
  ];

  useEffect(() => {
    const userId = router.query.phone_number;

    if (userId !== undefined) {
      setDeliveryAppServiceMemberId(String(userId));
    }
  }, [router.query]);

  return (
    <Box pb={10}>
      {deliveryAppServiceMemberId !== undefined && (
        <Box>
          {deliveryAppServiceMemberId !== undefined && (
            <DeliveryAppAdvertisementViewer
              memory={props.memory}
              deliveryAppServiceMemberId={deliveryAppServiceMemberId}
            />
          )}
          {/* <TabPanel
						tabSelectionSectionConfig={{
							tabWrapperProps: {
								variant: 'scrollable',
								scrollButtons: 'auto',
								allowScrollButtonsMobile: true,
							},
							tabLabelTypographyProps: {
								color: theme.palette.grey['500'],
								variant: 'h6',
								sx: {
									whiteSpace: 'nowrap',
								},
							},
							boxProps: {
								sx: {
									mb: 3,
									borderBottom: `1px solid ${theme.palette.grey['300']}`,
								},
							},
						}}
						tabContents={tabContents}
					/> */}
        </Box>
      )}
    </Box>
  );
};

export default DeliveryAppReportDetail;
