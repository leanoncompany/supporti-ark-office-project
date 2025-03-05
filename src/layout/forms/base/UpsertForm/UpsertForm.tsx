import { Box, Typography, Grid } from "@mui/material";
import React from "react";
import DeleteButton from "../../../../ui/local/utils/DeleteButton";
import UpdateButton from "../../../../ui/local/utils/UpdateButton";
import { InputRenderer } from "../../../../utils/render/InputRenderer";
import useUpsertDataControl from "../../../../hooks/data/useUpsertDataControl";
import usePageRole from "../../../../hooks/pages/usePageRole";
import { IUpsertFormProps } from "../../../../@types/layout/forms/base";
import usePageLabel from "../../../../hooks/data/usePageLabel";

const UpsertForm = (props: IUpsertFormProps) => {
  //* Modules
  const inputRenderer = new InputRenderer();

  //* Constant
  const buttonType: "icon" | "text" = "icon";

  //* States
  const { labelTail } = usePageLabel(props.memory);
  const { wrappedDataDict } = useUpsertDataControl(
    props.modelIdKey,
    props.dataList,
    props.findOneCallback,
    props.createCallback,
    props.setFetchedData
  );

  return (
    <Box p={1.75} borderRadius={2} sx={{ background: "#f3f3f3" }} mb={1.5}>
      <Box p={1.5} pt={1.25} borderRadius={1.75} sx={{ background: "#fff" }}>
        {/* Header */}
        <Box
          display={props.hideHeader == true ? "none" : "flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          {/* Label */}
          <Typography variant={"h6"}>
            {props.label !== undefined ? props.label : `${labelTail} 관리`}
          </Typography>

          {/* Buttons */}
          <Box
            display={props.disableEdit == true ? "none" : "flex"}
            alignItems={"center"}
          >
            {/* Update Button */}
            <Box>
              <UpdateButton
                pageRole={"upsert"}
                modelIdKey={props.modelIdKey}
                dataList={props.dataList}
                createCallback={props.createCallback}
                updateCallback={props.updateCallback}
                wrappedDataDict={wrappedDataDict}
                buttonType={buttonType}
                validationCallback={props.validationCallback}
                disableNavigateAfterAction={props.disableNavigateAfterAction}
              />
            </Box>
          </Box>
        </Box>

        {/* Contents */}
        <Box>
          <Grid container spacing={1.5} alignItems={"flex-end"}>
            {Object.keys(wrappedDataDict).length != 0 &&
              props.dataList.map((data) => {
                return (
                  <Grid item {...data.grid} key={JSON.stringify(data.keys)}>
                    {inputRenderer.render(
                      data,
                      wrappedDataDict,
                      props.disableEdit
                    )}
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default UpsertForm;
