import { Box } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { RegexManager } from '@leanoncompany/supporti-utility';
import useCategory from '../../../../hooks/ecommerce/useCategory';
import DropdownListItem from '../DropdownListItem/DropdownListItem';
import { IInputCore_EXTENDED } from '../../../../@types/external/qillieReactUi';
import { InputCore } from '@leanoncompany/supporti-react-ui';

interface ICategorySelectorProps extends IInputCore_EXTENDED {
  primeValue: any;
  subValue: any;
  setPrimeValue: React.Dispatch<React.SetStateAction<any>>;
  setSubValue: React.Dispatch<React.SetStateAction<any>>;
}

const CategorySelector = (props: ICategorySelectorProps) => {
  //* Modules

  //* States
  const { categoryTree, setCategoryTree } = useCategory();

  //* Functions
  const setSelectedValues = (values: any[]) => {
    if (values.length == 1) {
      if (props.primeValue == values[0] && props.subValue === undefined) {
        props.setPrimeValue(undefined);
        props.setSubValue(undefined);
      } else {
        props.setPrimeValue(values[0]);
        props.setSubValue(undefined);
      }
    } else if (values.length == 2) {
      if (props.primeValue == values[0] && props.subValue === values[1]) {
        props.setPrimeValue(undefined);
        props.setSubValue(undefined);
      } else {
        props.setPrimeValue(values[0]);
        props.setSubValue(values[1]);
      }
    }
  };

  const getSelectedValues = (primeValue: any, subValue: any) => {
    const selectedValues = [];

    if (primeValue !== undefined) {
      selectedValues.push(primeValue);

      if (subValue !== undefined) {
        selectedValues.push(subValue);
      }
    }

    return selectedValues;
  };

  return (
    <Box>
      <InputCore
        labelConfig={props.labelConfig}
        inputCaptionConfig={props.inputCaptionConfig}
        inputStatus={props.inputStatus}>
        <Box mb={1} p={1.75} borderRadius={1.5} sx={{ background: '#e6e6e6' }}>
          {categoryTree.map((branch, index) => (
            <Box
              key={index}
              p={1.5}
              borderRadius={1.5}
              sx={{ background: '#fff' }}
              mb={index == categoryTree.length - 1 ? 0 : 1}>
              <DropdownListItem
                selectedValues={getSelectedValues(props.primeValue, props.subValue)}
                setSelectedValues={setSelectedValues}
                data={{
                  label: branch.category.NAME,
                  value: branch.category.PRODUCT_PRIMARY_CATEGORY_IDENTIFICATION_CODE,
                }}
                children={branch.children.map((leaf) => {
                  return {
                    label: leaf.NAME,
                    value: leaf.PRODUCT_SUB_CATEGORY_IDENTIFICATION_CODE,
                  };
                })}
                useCheckBox={true}
              />
            </Box>
          ))}
        </Box>
      </InputCore>
    </Box>
  );
};

export default CategorySelector;
