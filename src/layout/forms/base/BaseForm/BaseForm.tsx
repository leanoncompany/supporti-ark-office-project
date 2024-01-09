import { Box, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import DeleteButton from '../../../../ui/local/utils/DeleteButton';
import UpdateButton from '../../../../ui/local/utils/UpdateButton';
import { InputRenderer } from '../../../../utils/render/InputRenderer';
import useDataControl from '../../../../hooks/data/useDataControl';
import usePageRole from '../../../../hooks/pages/usePageRole';
import { IBaseFormProps } from '../../../../@types/layout/forms/base';
import { IWrappedData } from '../../../../@types/base/data';
import usePageLabel from '../../../../hooks/data/usePageLabel';

const BaseForm = (props: IBaseFormProps) => {
  //* Modules
  const inputRenderer = new InputRenderer();

  //* Constant
  const buttonType: 'icon' | 'text' = 'icon';

  //* States
  const { labelTail } = usePageLabel(props.memory);
  const { pageRole, pid } = usePageRole();
  const [labelSuffix, setLabelSuffix] = React.useState<string>('');
  const { wrappedDataDict } = useDataControl(
    props.modelIdKey,
    props.pageRole || pageRole,
    props.pid || pid,
    props.dataList,
    props.findOneCallback,
    props.setFetchedData
  );

  //* Hooks
  /**
   * Hook to set label's suffix
   */
  React.useEffect(() => {
    if ((props.pageRole || pageRole) == 'write') {
      setLabelSuffix('등록');
    } else if ((props.pageRole || pageRole) == 'edit') {
      setLabelSuffix('상세');
    }
  }, [pageRole, props.pageRole]);

  return (
    <Box p={1.75} borderRadius={2} sx={{ background: '#f3f3f3' }} mb={1.5} {...props.outerBoxProps}>
      <Box
        p={1.5}
        pt={props.disableEdit == true ? 0.5 : 1.25}
        borderRadius={1.75}
        sx={{ background: '#fff' }}
        {...props.innerBoxProps}>
        {/* Header */}
        <Box
          display={props.hideHeader == true ? 'none' : 'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}>
          {/* Label */}
          <Typography variant={'h6'} fontWeight={500}>
            {props.label !== undefined ? props.label : `${labelTail} ${labelSuffix}`}
          </Typography>
          {/* disableEdit 이면 둘다 불가 disableUpdate 면 수정불가 생성가능 하게 수정.. */}
          {/* Buttons */}
          <Box display={props.disableEdit == true ? 'none' : 'flex'} alignItems={'center'}>
            {/* Update Button */}
            <Box>
              <UpdateButton
                pid={props.pid}
                pageRole={props.pageRole}
                modelIdKey={props.modelIdKey}
                dataList={props.dataList}
                createCallback={props.createCallback}
                updateCallback={props.updateCallback}
                wrappedDataDict={wrappedDataDict}
                buttonType={buttonType}
                validationCallback={props.validationCallback}
                disableNavigateAfterAction={props.disableNavigateAfterAction}
                disableUpdate={props.disableUpdate}
              />
            </Box>

            {/* Delete button */}
            <Box>
              {props.disableDelete !== true &&
                (props.renderCustomDeleteButton !== undefined ? (
                  props.renderCustomDeleteButton(wrappedDataDict)
                ) : (
                  <DeleteButton
                    pid={props.pid}
                    pageRole={props.pageRole}
                    modelIdKey={props.modelIdKey}
                    buttonType={buttonType}
                    deleteCallback={props.deleteCallback}
                  />
                ))}
            </Box>
          </Box>
        </Box>

        {/* Contents */}
        <Box>
          <Grid container spacing={1.5} alignItems={'flex-end'}>
            {Object.keys(wrappedDataDict).length != 0 &&
              props.dataList.map((data) => {
                return (
                  <Grid
                    item
                    {...data.grid}
                    key={JSON.stringify(data.keys)}
                    sx={data.gridStyleCallback !== undefined ? data.gridStyleCallback(wrappedDataDict) : undefined}>
                    {inputRenderer.render(
                      data,
                      wrappedDataDict,
                      props.disableEdit,
                      props.pageRole || pageRole,
                      props.disableUpdate
                    )}
                  </Grid>
                );
              })}

            {/* 커스텀 랜더링 */}
            {props.injectedComponent}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default BaseForm;
