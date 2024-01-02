import { Box, Divider, Grid, IconButton, Typography, useTheme } from '@mui/material';
import { SelectTypeInput, TextTypeInput } from '@leanoncompany/supporti-react-ui';
import React, { useEffect } from 'react';
import { ISearchArea } from '../../@types/layout/searchArea/searchArea';
import { useRouter } from 'next/router';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import usePageLabel from '../../hooks/data/usePageLabel';
// type Props = {}

const SearchArea = (props: ISearchArea) => {
  const router = useRouter();
  const theme = useTheme();

  const { labelTail } = usePageLabel(props.memory);

  return (
    <Box width={'100%'} display={'flex'} alignItems={'center'} flexDirection={{ md: 'row', xs: 'column' }}>
      {/* 제목 */}
      {props.disableLabel !== true && (
        <Box width={{ md: 'auto', xs: '100%' }} mr={{ md: 1, xs: 0 }} mb={{ md: 0, xs: 1 }}>
          <Typography
            variant="h5"
            fontWeight={500}
            sx={{
              display: 'inline-block',
            }}>
            {props.label !== undefined ? props.label : labelTail} 리스트
          </Typography>
        </Box>
      )}
      {/* 검색,필터, 플러스 */}
      <Box
        display={'flex'}
        width={{ md: 'auto', xs: '100%', flex: 1 }}
        justifyContent={props.filterList !== undefined ? 'space-between' : 'end'}
        alignItems={'center'}>
        {/* 검색, 필터 */}
        <Box>
          {props.filterList !== undefined && props.disableSearchArea !== true && (
            <Box display={'flex'} alignItems={'center'}>
              {/* 검색 */}
              <SearchIcon
                fontSize="small"
                style={{
                  color: `${theme.palette.grey['400']}`,
                }}
              />
              <TextTypeInput
                value={props.searchWord}
                setValue={props.setSearchWord}
                placeholder={'검색어를 입력해주세요'}
                textFieldStyle={Object.assign(
                  {
                    pt: 0,
                    pl: 0,
                    mt: 0,
                    border: 'none',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  },
                  props.textFieldWidth !== undefined
                    ? { width: props.textFieldWidth }
                    : {
                        width: {
                          md: '200px',
                          xs: '100%',
                        },
                      }
                )}
                onEnter={() => {
                  props.handleSearch(props.searchWord);
                }}
              />
              {/* 디바이더 */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(90deg)',
                  height: '100%',
                }}>
                <Divider
                  flexItem
                  sx={{
                    width: '20px',
                  }}
                />
              </Box>
              {/* 필터 */}
              <SelectTypeInput
                placeholder={'필터 선택'}
                value={props.filter}
                setValue={props.setFilter}
                selectDataValueKey={'value'}
                selectDataLabelKey={'label'}
                selectableList={props.filterList}
                selectFieldStyle={Object.assign(
                  {
                    borderRadius: '8px',
                    // '.MuiInputBase-input': {
                    // 	fontSize: '12px',
                    // 	fontWeight: 500,
                    // 	py: '10px',
                    // },
                    mt: 0,
                    color: `${theme.palette.grey['500']}`,
                    '.MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '.MuiSvgIcon-root ': {
                      fill: `${theme.palette.grey['400']} !important`,
                    },
                  },
                  props.selectFieldWidth !== undefined
                    ? { width: props.selectFieldWidth }
                    : {
                        width: {
                          md: '75px',
                          xs: '100%',
                        },
                      }
                )}></SelectTypeInput>
            </Box>
          )}
        </Box>
        <Box display={'flex'} alignItems={'center'}>
          {/* 커스텀 랜더링 */}
          {props.customControllerButton !== undefined && <Box mr={1.5}>{props.customControllerButton}</Box>}

          {props.disableWriteBtn !== true && (
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
              <IconButton
                color={'primary'}
                onClick={() => {
                  router.push(`${router.pathname}/write`);
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
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchArea;
