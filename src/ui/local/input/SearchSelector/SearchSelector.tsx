import { Grid, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { InputCore, IUserInputStatus, TextTypeInput } from '@leanoncompany/supporti-react-ui';
import { RegexManager } from '@leanoncompany/supporti-utility';
import React, { useState, useEffect } from 'react';
import { IInputCore_EXTENDED } from '../../../../@types/external/qillieReactUi';
import SearchArea from '../../../../layout/SearchArea';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

interface ISearchSelectorProps extends IInputCore_EXTENDED {
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  selectableItems?: { value: string; label: string }[];
  searchableItems?: { [key: string]: any }[];
  renderCallback?: (item: any, isSelected: boolean) => JSX.Element;
  preventSetValueChangeOnReset?: boolean;
}

const SearchSelector = (props: ISearchSelectorProps) => {
  //* Modules
  const theme = useTheme();

  //* States
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filteredItemList, setFilteredItemList] = useState<any[] | undefined>(undefined);
  const [searchWord, setSearchWord] = useState<string>('');
  const [searchWordInputStatus, setSearchWordInputStatus] = useState<IUserInputStatus>({
    status: 'default',
  });

  //* Functions
  const handleIsSelected = (item: any) => {
    if (props.value !== null) {
      if (JSON.stringify(props.value) === JSON.stringify(item)) {
        return true;
      }
    }

    return false;
  };

  const handleSelect = (item: any) => {
    if (JSON.stringify(props.value) === JSON.stringify(item)) {
      props.setValue(null);
    } else {
      props.setValue(item);
    }
  };

  const handleSearch = () => {
    if (props.searchableItems !== undefined) {
      const tempFilteredItemList = props.searchableItems.filter((item) => {
        if (filterType !== undefined) {
          if (filterType in item) {
            return item[filterType].includes(searchWord);
          }
        }

        return true;
      });

      setFilteredItemList(tempFilteredItemList);
    }
  };

  //* Hooks
  useEffect(() => {
    if (props.searchableItems !== undefined && props.selectableItems !== undefined) {
      setSearchWord('');
      setSearchWordInputStatus({ status: 'default' });
      setFilterType(props.selectableItems[0].value);
      setFilteredItemList([...props.searchableItems]);

      if (props.preventSetValueChangeOnReset !== true) {
        props.setValue(null);
      }
    }
  }, [props.searchableItems]);

  useEffect(() => {
    if (props.selectableItems !== undefined && filterType === undefined) {
      setFilterType(props.selectableItems[0].value);
    }
  }, [props.selectableItems]);

  return (
    <InputCore
      labelConfig={props.labelConfig}
      inputCaptionConfig={props.inputCaptionConfig}
      inputStatus={props.inputStatus}>
      <Box mb={1} p={1.75} borderRadius={1.5} sx={{ background: '#e6e6e6' }}>
        <Box px={1.25} borderRadius={1} sx={{ background: '#fff' }} mb={1.5}>
          <SearchArea
            textFieldWidth={{
              xs: '160px',
              md: '160px',
            }}
            selectFieldWidth={{
              xs: '75px',
              md: '75px',
            }}
            disableWriteBtn={true}
            searchWord={searchWord}
            filter={filterType}
            setFilter={setFilterType}
            filterList={props.selectableItems}
            setSearchWord={setSearchWord}
            searchWordInputStatus={searchWordInputStatus}
            setSearchWordIInputStatus={setSearchWordInputStatus}
            handleSearch={handleSearch}
            disableLabel={true}
          />
        </Box>

        {filteredItemList !== undefined && (
          <Box
            borderRadius={3}
            sx={{
              pt: 1.5,
              pl: 1.5,
              pr: 1.5,
              pb: 1.5,
              position: 'relative',
              background: 'rgb(242, 242, 243)',
              height: '100%',
              width: '100%',
              minHeight: '64px',
            }}>
            {filteredItemList.length !== 0 ? (
              <Box maxHeight={'170px'} sx={{ overflowY: 'auto' }}>
                {filteredItemList.map((item, index) => (
                  <Box
                    key={index}
                    onClick={() => {
                      handleSelect(item);
                    }}
                    p={1.5}
                    borderRadius={1.5}
                    sx={{
                      background: handleIsSelected(item) ? theme.palette.primary.main : '#fff',
                      cursor: 'pointer',
                      '&::-webkit-scrollbar': {
                        height: '4px',
                      },

                      '&::-webkit-scrollbar-track': {
                        boxShadow: 'none',
                        background: 'transparent',
                      },

                      '&::-webkit-scrollbar-thumb': {
                        background: '#DCDDE0',
                        borderRadius: '4px',
                        width: '6px',
                        height: '26px',
                      },
                    }}
                    mb={index == filteredItemList.length - 1 ? 0 : 1}>
                    {props.renderCallback !== undefined && (
                      <Box>
                        <Grid container spacing={1.5}>
                          <Grid item xs={2.5}>
                            <Box
                              width={'100%'}
                              height={'100%'}
                              display={'flex'}
                              alignItems={'center'}
                              justifyContent={'center'}>
                              <CheckCircleOutlineRoundedIcon
                                htmlColor={handleIsSelected(item) ? 'white' : '#afafaf'}
                                sx={{
                                  fontSize: 'x-large',
                                }}
                              />
                            </Box>
                          </Grid>

                          <Grid item xs={9.5}>
                            {props.renderCallback(item, handleIsSelected(item))}
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  position: 'absolute;',
                  top: '50%;',
                  left: '50%',
                  transform: 'translate(-50%, -50%);',
                }}>
                <Typography variant="body1" sx={{ color: '#9f9f9f' }}>
                  Empty
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </InputCore>
  );
};

export default SearchSelector;
