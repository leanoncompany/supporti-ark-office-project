import { Box, Button, Typography } from '@mui/material';
import { ModalCore, TextTypeInput } from '@leanoncompany/supporti-react-ui';
import { IUserInputStatus } from '@leanoncompany/supporti-react-ui';
import React from 'react';

type Props = {
  headerLabel: string;
  categoryName: string;
  setCategoryName: React.Dispatch<React.SetStateAction<string>>;
  categoryNameInputStatus: IUserInputStatus;
  setCategoryNameInputStatus: React.Dispatch<React.SetStateAction<IUserInputStatus>>;
  createCategory?: (name: string) => void;
  updateCategory?: (id: number) => void;
  isModal: boolean;
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
  categoryId?: number;
  modalButtonElement?: any;
};

const CreateCategoryModal = (props: Props) => {
  return (
    <ModalCore
      isModalOpen={props.isModal}
      setIsModalOpen={props.setIsModal}
      useModalCloseButton={true}
      modalButtonElement={props.modalButtonElement !== undefined ? props.modalButtonElement : <></>}
      titleElement={
        <Typography variant={'body1'} fontWeight={'600'} textAlign={'center'}>
          카테고리 {props.headerLabel}
        </Typography>
      }>
      <Box px={2}>
        <Box mb={1.25}>
          <TextTypeInput
            fullWidth
            labelConfig={{
              position: 'outer',
              label: '카테고리 제목',
            }}
            placeholder={'카테고리 제목을 입력해주세요.'}
            value={props.categoryName}
            setValue={props.setCategoryName}
            inputCaptionConfig={{
              status: props.categoryNameInputStatus,
              requiredMessage: '1자 이상의 카테고리 제목을 입력해주세요.',
            }}
            onChangeCallback={(args: any) => {
              if (args.event.target.value.length > 0) {
                props.setCategoryNameInputStatus({
                  status: 'default',
                });
              }
            }}
          />
        </Box>
        <Box width={'100%'}>
          <Button
            variant={'contained'}
            fullWidth
            onClick={() => {
              if (props.categoryName.length === 0) {
                props.setCategoryNameInputStatus({
                  status: 'required',
                });
              } else {
                if (props.createCategory !== undefined) {
                  props.createCategory(props.categoryName);
                  return;
                }
                if (props.categoryId !== undefined && props.updateCategory !== undefined) {
                  props.updateCategory(props.categoryId);
                }
              }
            }}>
            {props.headerLabel}
          </Button>
        </Box>
      </Box>
    </ModalCore>
  );
};

export default CreateCategoryModal;
