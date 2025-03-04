import { Box, Button, Typography } from "@mui/material";
import { ModalCore, TextTypeInput } from "@leanoncompany/supporti-react-ui";
import { IUserInputStatus } from "@leanoncompany/supporti-react-ui";
import React from "react";

type Props = {
  headLabel: string;
  categoryName: string;
  setCategoryName: React.Dispatch<React.SetStateAction<string>>;
  categoryNameInputStatus: IUserInputStatus;
  setCategoryNameInputStatus: React.Dispatch<
    React.SetStateAction<IUserInputStatus>
  >;
  createSubCategory?: (id: number) => void;
  updateSubCategory?: (id: number, subId: number) => void;
  isModal: boolean;
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
  categoryId: number | undefined;
  subCategoryId?: number | undefined;
};

const CreateSubCategoryModal = (props: Props) => {
  return (
    <ModalCore
      isModalOpen={props.isModal}
      setIsModalOpen={props.setIsModal}
      useModalCloseButton={true}
      modalButtonElement={<></>}
      titleElement={
        <Typography
          variant={"body1"}
          sx={{
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          서브 카테고리 {props.headLabel}
        </Typography>
      }
    >
      <Box px={2}>
        <Box mb={1.25}>
          <TextTypeInput
            fullWidth
            labelConfig={{
              position: "outer",
              label: "서브 카테고리 제목",
            }}
            placeholder={"서브 카테고리 제목을 입력해주세요."}
            value={props.categoryName}
            setValue={props.setCategoryName}
            inputCaptionConfig={{
              status: props.categoryNameInputStatus,
              requiredMessage: "1자 이상의 카테고리 제목을 입력해주세요.",
            }}
            onChangeCallback={(args: any) => {
              if (args.event.target.value.length > 0) {
                props.setCategoryNameInputStatus({
                  status: "default",
                });
              }
            }}
          />
        </Box>
        <Box width={"100%"}>
          <Button
            variant={"contained"}
            fullWidth
            onClick={() => {
              if (
                props.categoryId !== undefined &&
                props.createSubCategory !== undefined
              ) {
                props.createSubCategory(props.categoryId);
                return;
              }
              if (
                props.categoryId !== undefined &&
                props.subCategoryId !== undefined &&
                props.updateSubCategory !== undefined
              ) {
                props.updateSubCategory(props.categoryId, props.subCategoryId);
              }
            }}
          >
            {props.headLabel}
          </Button>
        </Box>
      </Box>
    </ModalCore>
  );
};

export default CreateSubCategoryModal;
