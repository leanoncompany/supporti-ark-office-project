import { Box, Pagination, Typography } from '@mui/material';
import { IListContent, IListHeader, IRendering } from '../../../../@types/layout/list/list';
import SearchArea from '../../../SearchArea';
import { useEffect, useState } from 'react';
import React from 'react';
import { IUserInputStatus } from '@leanoncompany/supporti-react-ui';
import moment from 'moment';
import List from '../../List';
import { DateRangePicker } from '../../../../ui/local/utils/DateRangePicker';
import usePageLabel from '../../../../hooks/data/usePageLabel';
import Memory from '../../../../utils/data/Memory';
import { useRouter } from 'next/router';
import { UrlManager } from '@leanoncompany/supporti-utility';

interface IBaseListProps {
  allData?: any;
  setAllData?: React.Dispatch<any>;
  getAllCallback?: (
    args: { [key: string]: any },
    successCallback?: (response: any) => void,
    failCallback?: (err: any) => void
  ) => void;
  getFixedAllCallback?: (
    args: { [key: string]: any },
    successCallback?: (response: any) => void,
    failCallback?: (err: any) => void
  ) => void;
  tableHeader: IListHeader[];
  contentChild?: { [key: string]: (el: any) => any };
  fixedRender?: { [key: string]: (el: any) => any };
  disableSearchArea?: boolean;
  disablePagination?: boolean;
  disablePeriodSetter?: boolean;
  disableTotal?: boolean;
  disableWriteBtn?: boolean;
  disableOnClick?: boolean;

  modelIdKey: string;
  filterList?: {
    label: string;
    value: string;
  }[];
  memory: Memory;
  injectedParams?: { [key: string]: any };
  pointHistoryType?: string;
  exchangePointType?: string;
  disableLabel?: boolean;
  disableRoute?: boolean;
  linkCallback?: (args: { [key: string]: any }) => any;
  customListItemRenderCallback?: (
    element: any,
    index: number,
    listHeader: IListHeader[],
    wrappedRenderColumnCallback: (columnKey: string, element: any) => any
  ) => React.ReactElement;
  useBackendFiltering?: boolean;
  customControllerButton?: React.ReactElement;

  useNumber?: boolean;

  minWidth?: string;
  contentPerPage?: number;
}

const BaseList = (props: IBaseListProps) => {
  const urlManager = new UrlManager();

  const router = useRouter();
  const [searchWord, setSearchWord] = useState<string>('');
  const [searchWordInputStatus, setSearchWordInputStatus] = useState<IUserInputStatus>({
    status: 'default',
  });

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // const moveToDetail = (id: number) => {
  // 	router.push(`./${id}`);
  // };
  const [maxPage, setMaxPage] = useState<number>(1);
  const [selectedPage, setSelectedPage] = useState<number>(1);

  const [allData, setAllData] = useState<any>([]);
  const [fixedData, setFixedData] = useState<any>([]);

  const [filterType, setFilterType] = useState<string | undefined>('');

  const isEmptyObj = (obj: any) => {
    if (obj.constructor !== Object) {
      return false;
    }

    // property 체크
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return true;
  };

  //* Functions
  const countMaxPage = (count: number, selectedContentPerPage: number) => {
    return count < selectedContentPerPage ? 1 : Math.ceil(count / selectedContentPerPage);
  };

  const callData = () => {
    let params: { [key: string]: any } = props.injectedParams !== undefined ? props.injectedParams : {};

    let query = urlManager.getQuery();
    if (router.pathname !== router.asPath) {
      for (let [key, value] of Object.entries(query)) {
        if (query.pid !== undefined || key === '' || value === '') {
        } else {
          if (isNaN(Number(value)) === true) {
            params[key] = value;
          } else {
            params[key] = Number(value);
          }
        }
      }
    }

    if (props.filterList !== undefined) {
      const keywordArgs = { columnKey: filterType, keyword: searchWord };

      if (keywordArgs.columnKey === '' && props.filterList.length > 0) {
        keywordArgs.columnKey = props.filterList[0].value;
      }

      params.KEYWORD = keywordArgs;
    }

    if (props.disablePeriodSetter !== true) {
      params.PERIOD_START = startDate;
      params.PERIOD_END = endDate;
      params.PERIOD_TARGET_KEY = 'CREATED_AT';
    }

    if (props.disablePagination !== true && props.useBackendFiltering == true) {
      params.PAGE = selectedPage - 1;
      params.LIMIT = props.contentPerPage || 10;
    }

    if (props.getAllCallback !== undefined) {
      props.getAllCallback(
        params,
        (response: any) => {
          // let clonedArray: IListContent[] = [];

          let clonedAllData: any = [];

          // eslint-disable-next-line array-callback-return
          response.data.result.rows.map((el: any, index: any) => {
            if (props.useNumber === true) {
              Object.assign(el, {
                num: index + 1,
              });
              clonedAllData.push(el);
            } else {
              clonedAllData.push(el);
            }
            // let pushData: any = {

            // 	contentChild: props.contentChild,
            // };
            // clonedArray.push(pushData);
          });
          // setCount(response.data.result.count);
          if (props.setAllData !== undefined && props.allData !== undefined) {
            props.setAllData(clonedAllData);
          } else {
            setAllData(clonedAllData);
          }

          // props.setTableContent(clonedArray);
          setMaxPage(countMaxPage(response.data.result.count, props.contentPerPage || 10));
        },
        (err: any) => {
          alert('실패');
        }
      );
    }
  };

  useEffect(() => {
    if (props.getFixedAllCallback !== undefined) {
      props.getFixedAllCallback(
        (response: any) => {
          // let clonedArray: IListContent[] = [];

          let clonedAllData: any = [];
          // eslint-disable-next-line array-callback-return
          response.data.result.rows.map((el: any) => {
            clonedAllData.push(el);
            // let pushData: any = {
            // 	// id: el[props.idKey],
            // 	contentChild: props.contentChild,
            // };
            // clonedArray.push(pushData);
          });
          // setCount(response.data.result.count);
          setFixedData(clonedAllData);

          // props.setTableContent(clonedArray);
        },
        (err: any) => {
          alert('실패');
        }
      );
    }
  }, []);

  useEffect(() => {
    if (props.filterList !== undefined) {
      setFilterType(props.filterList[0].value);
    }
  }, [props.filterList]);

  useEffect(
    () => {
      if (router.asPath) {
        let executeCallback: boolean = false;

        if (props.disablePeriodSetter === true) {
          executeCallback = true;
        } else {
          if (startDate !== null && endDate !== null) {
            executeCallback = true;
          }
        }

        if (executeCallback) {
          callData();
        }
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    (() => {
      if (props.useBackendFiltering == true) {
        return [selectedPage, startDate, endDate, router.asPath];
      } else {
        return [startDate, endDate, router.asPath];
      }
    })()
  );

  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Box mb={1.5}>
        <SearchArea
          disableSearchArea={props.disableSearchArea}
          memory={props.memory}
          disableWriteBtn={props.disableWriteBtn}
          searchWord={searchWord}
          filter={filterType}
          setFilter={setFilterType}
          filterList={props.filterList}
          setSearchWord={setSearchWord}
          searchWordInputStatus={searchWordInputStatus}
          setSearchWordIInputStatus={setSearchWordInputStatus}
          handleSearch={callData}
          disableLabel={props.disableLabel}
          customControllerButton={props.customControllerButton}
        />
      </Box>
      {props.disablePeriodSetter !== true && (
        <Box mb={1.5}>
          <DateRangePicker
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </Box>
      )}
      <List
        minWidth={props.minWidth !== undefined ? props.minWidth : undefined}
        allData={props.allData !== undefined && props.setAllData !== undefined ? props.allData : allData}
        setAllData={props.allData !== undefined && props.setAllData !== undefined ? props.allData : setAllData}
        disableTotal={props.disableTotal}
        disableRoute={props.disableRoute}
        total={props.allData !== undefined && props.setAllData !== undefined ? props.allData.length : allData.length}
        listHeader={props.tableHeader}
        fixedData={fixedData !== undefined ? fixedData : undefined}
        fixedRender={props.fixedRender !== undefined ? props.fixedRender : undefined}
        modelIdKey={props.modelIdKey}
        disableOnClick={props.disableOnClick}
        data={
          props.useBackendFiltering
            ? props.allData !== undefined && props.setAllData !== undefined
              ? props.allData
              : allData
            : (() => {
                const limit = props.contentPerPage || 10;

                let targetAllData =
                  props.allData !== undefined && props.setAllData !== undefined ? props.allData : allData;
                let clonedAllData: any = [];

                //* Filter by page
                let startIndex: number = (selectedPage - 1) * limit;
                let endIndex: number = startIndex + limit;

                for (let i = startIndex; i < endIndex; i++) {
                  if (targetAllData[i] !== undefined) {
                    clonedAllData.push(targetAllData[i]);
                  }
                }

                return clonedAllData;
              })()
        }
        render={props.contentChild}
        linkCallback={props.linkCallback}
        customListItemRenderCallback={props.customListItemRenderCallback}
      />
      {props.disablePagination !== true && (
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} mt={3}>
          <Pagination
            count={maxPage}
            page={selectedPage}
            onChange={(event, page) => {
              setSelectedPage(page);
            }}
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default BaseList;
