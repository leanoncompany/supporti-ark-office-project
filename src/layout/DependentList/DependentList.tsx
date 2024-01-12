import { Box, Typography, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import BaseList from '../List/base/BaseList/BaseList';
import { useRouter } from 'next/router';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DataUtil from '../../utils/data/DataUtil';
import { IListHeader } from '../../@types/layout/list/list';
import Memory from '../../utils/data/Memory';
import DefaultController from '../../controller/default/DefaultController';

interface IDependentListProps {
  dependentModelName: string;
  modelData: any;
  modelName: string;
  tableHeader: IListHeader[];
  linkDomain: string;
  title: string;
  memory: Memory;
  contentChild?: { [key: string]: (el: any) => any };
  injectedParamsCallback?: (modelData?: any) => {
    [key: string]: any;
  };
  disableWriteBtn?: boolean;
  disablePeriodSetter?: boolean;
}

const DependentList = (props: IDependentListProps) => {
  //* Modules
  const dataUtil = new DataUtil();
  const router = useRouter();

  const controller = new DefaultController(props.modelName);

  return (
    <Box>
      {props.modelData !== undefined && (
        <Box>
          <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            {/* 제목 */}
            <Box mr={{ md: 1, xs: 0 }} mb={{ md: 0, xs: 1 }}>
              <Typography
                variant="h5"
                fontWeight={500}
                sx={{
                  display: 'inline-block',
                }}>
                {props.title}
              </Typography>
            </Box>

            {props.disableWriteBtn !== true && (
              <Box display={'flex'} alignItems={'center'}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                  <IconButton
                    color={'primary'}
                    onClick={() => {
                      router.push(
                        `${props.linkDomain}/write?${
                          dataUtil.convertToUpperCasedUnderbarSeparated(props.dependentModelName) +
                          '_IDENTIFICATION_CODE'
                        }=${
                          props.modelData[
                            dataUtil.convertToUpperCasedUnderbarSeparated(props.dependentModelName) +
                              '_IDENTIFICATION_CODE'
                          ].state
                        }`
                      );
                    }}
                    size="small"
                    sx={{}}>
                    <AddCircleOutlineIcon
                      style={{
                        fontSize: 'larger',
                      }}
                    />
                  </IconButton>
                  <Box mt={'-10px'}>
                    <Typography variant={'caption'}>생성</Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          <BaseList
            injectedParams={
              props.injectedParamsCallback !== undefined ? props.injectedParamsCallback(props.modelData) : undefined
            }
            disableTotal={true}
            disableWriteBtn={true}
            disableLabel={true}
            contentChild={props.contentChild}
            disableSearchArea={true}
            modelIdKey={dataUtil.convertToUpperCasedUnderbarSeparated(props.modelName) + '_IDENTIFICATION_CODE'}
            memory={props.memory}
            getAllCallback={(args, successCallback, failCallback) => {
              controller.getAllItems(
                Object.assign(args, {
                  [dataUtil.convertToUpperCasedUnderbarSeparated(props.dependentModelName) + '_IDENTIFICATION_CODE']:
                    props.modelData[
                      dataUtil.convertToUpperCasedUnderbarSeparated(props.dependentModelName) + '_IDENTIFICATION_CODE'
                    ].state,
                }),
                successCallback,
                failCallback
              );
            }}
            disablePeriodSetter={props.disablePeriodSetter}
            tableHeader={props.tableHeader}
            linkCallback={(item) => {
              router.push(
                `${props.linkDomain}/${
                  item[dataUtil.convertToUpperCasedUnderbarSeparated(props.modelName) + '_IDENTIFICATION_CODE']
                }`
              );
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default DependentList;
