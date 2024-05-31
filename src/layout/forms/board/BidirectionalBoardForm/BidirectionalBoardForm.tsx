import { Box, Divider } from "@mui/material";
import React from "react";
// import { IData } from '../../../../@types/base/data';
import { IBidirectionalBoardFormProps } from "../../../../@types/layout/board";
import BaseForm from "../../base/BaseForm/BaseForm";
import BoardController from "../../../../controller/default/BoardController";
import DataUtil from "../../../../utils/data/DataUtil";
import { IData, IWrappedData } from "../../../../@types/base/data";
import DependentForm from "../../base/DependentForm/DependentForm";

const BidirectionalBoardForm = (props: IBidirectionalBoardFormProps) => {
  //* Modules
  const dataUtil = new DataUtil();

  //* States
  const [mainModelData, setMainModelData] = React.useState<{
    [key: string]: IWrappedData;
  }>({});

  //* Controller
  const mainModelController = new BoardController(props.mainModelName);
  const subModelController = new BoardController(props.subModelName);

  const mainSectionDataList: IData[] = [
    {
      keys: ["CATEGORY"],
      ui: "textarea",
      label: "카테고리",
      grid: { xs: 12, md: 8 },
    },
    {
      keys: ["TITLE"],
      ui: "textarea",
      label: "제목",
      captionMessages: {
        requiredMessage: "제목을 입력해야합니다",
      },
      grid: {
        xs: 12,
        md: 8,
      },
    },
    {
      keys: ["CONTENT"],
      ui: "textarea",
      label: "내용",
      captionMessages: {
        requiredMessage: "내용을 입력해야합니다",
      },
      rows: 8,
      grid: {
        xs: 12,
        md: 12,
      },
    },
    {
      keys: ["QUESTIONER"],
      ui: "textarea",
      label: "질문자",
      grid: {
        xs: 12,
        md: 6,
      },
    },
    {
      keys: ["PRIVATE_YN"],
      ui: "switch",
      label: "비공개여부",
      grid: { xs: 12, md: 6 },
    },
  ];

  const subSectionDataList: IData[] = [
    {
      keys: ["TITLE"],
      ui: "textarea",
      label: "제목",
      captionMessages: {
        requiredMessage: "제목을 입력해야합니다",
      },
      grid: {
        xs: 12,
        md: 8,
      },
    },
    {
      keys: ["CONTENT"],
      ui: "textarea",
      label: "내용",
      captionMessages: {
        requiredMessage: "내용을 입력해야합니다",
      },
      rows: 8,
      grid: {
        xs: 12,
        md: 12,
      },
    },
    {
      keys: ["IMAGE_LIST"],
      ui: "imageUpload",
      label: "이미지",
      isOptional: true,
      captionMessages: {
        requiredMessage: "이미지를 골라야합니다",
      },
      grid: {
        xs: 12,
        md: 12,
      },
    },
  ];

  return (
    <Box>
      <Box>
        <BaseForm
          setFetchedData={setMainModelData}
          modelIdKey={
            dataUtil.convertToUpperCasedUnderbarSeparated(props.mainModelName) +
            "_IDENTIFICATION_CODE"
          }
          dataList={
            props.mainSectionDataList !== undefined
              ? props.mainSectionDataList
              : mainSectionDataList
          }
          memory={props.memory}
          label={props.mainLabel}
          createCallback={mainModelController.createItem.bind(
            mainModelController
          )}
          updateCallback={mainModelController.updateItem.bind(
            mainModelController
          )}
          findOneCallback={mainModelController.getOneItem.bind(
            mainModelController
          )}
          deleteCallback={mainModelController.deleteItem.bind(
            mainModelController
          )}
        />
      </Box>

      <Box my={2.5}>
        <Divider />
      </Box>

      <Box>
        <DependentForm
          dependentModelData={mainModelData}
          dependentModelIdKey={
            dataUtil.convertToUpperCasedUnderbarSeparated(props.mainModelName) +
            "_IDENTIFICATION_CODE"
          }
          modelIdKey={
            dataUtil.convertToUpperCasedUnderbarSeparated(props.subModelName) +
            "_IDENTIFICATION_CODE"
          }
          disableEdit={props.disableEdit ? true : false}
          hideHeader={false}
          dataList={
            props.subSectionDataList !== undefined
              ? props.subSectionDataList
              : subSectionDataList
          }
          memory={props.memory}
          label={props.subLabel}
          createCallback={subModelController.createItem.bind(
            subModelController
          )}
          updateCallback={subModelController.updateItem.bind(
            subModelController
          )}
          findOneByKeyCallback={subModelController.getOneItemByKey.bind(
            subModelController
          )}
          deleteCallback={subModelController.deleteItem.bind(
            subModelController
          )}
        />
      </Box>
    </Box>
  );
};

export default BidirectionalBoardForm;
