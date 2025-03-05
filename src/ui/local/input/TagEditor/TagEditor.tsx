import { Box, Typography, Grid, Button } from "@mui/material";
import {
  DeletableBadge,
  InputCore,
  SelectTypeInput,
  TextTypeInput,
} from "@leanoncompany/supporti-react-ui";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SaveIcon from "@mui/icons-material/Save";
import React, { useEffect, useState, useRef } from "react";
import { RegexManager } from "@leanoncompany/supporti-utility";
import { IInputCore_EXTENDED } from "../../../../@types/external/qillieReactUi";
import AutoCompleteSelector from "../AutoCompleteSelector";

interface ITagEditorProps extends IInputCore_EXTENDED {
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  selectableItems?: { value: any; label: string }[];
  directInput?: boolean;
  autoSelector?: boolean;
}

const TagEditor = (props: ITagEditorProps) => {
  //* Modules
  const regexManager = new RegexManager();

  //* States
  const isInitiated = useRef<boolean>(false);
  const [label, setLabel] = useState<any>(undefined);
  const [labelList, setLabelList] = useState<any[] | undefined>(undefined);

  //* Functions

  //* Hooks
  useEffect(() => {
    if (isInitiated.current == false) {
      const targetValue =
        typeof props.value == "string" ? JSON.parse(props.value) : props.value;

      setLabelList(targetValue);

      isInitiated.current = true;
    }
  }, [props.value]);

  useEffect(() => {
    if (labelList !== undefined) {
      props.setValue(labelList);
    }
  }, [labelList]);

  const autoSelectorDataFormatterCallback = (value: any) => {
    const formattedData = props.selectableItems?.find(
      (item) => item.value == value
    );

    return formattedData?.label;
  };

  return (
    <Box>
      <InputCore
        labelConfig={props.labelConfig}
        inputCaptionConfig={props.inputCaptionConfig}
        inputStatus={props.inputStatus}
      >
        {labelList !== undefined && (
          <Box
            mb={1}
            p={1.75}
            borderRadius={1.5}
            sx={{ background: "#e6e6e6" }}
          >
            <Box p={1.5} borderRadius={1.5} sx={{ background: "#fff" }}>
              <Box
                borderRadius={3}
                sx={{
                  pt: 2,
                  pl: 2,
                  pr: 2,
                  pb: 1,
                  position: "relative",
                  background: "rgb(242, 242, 243)",
                  height: "100%",
                  width: "100%",
                  minHeight: "64px",
                }}
              >
                {labelList.length == 0 ? (
                  <Box
                    sx={{
                      position: "absolute;",
                      top: "50%;",
                      left: "50%",
                      transform: "translate(-50%, -50%);",
                    }}
                  >
                    <Typography variant="body1" sx={{ color: "#9f9f9f" }}>
                      Empty
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {labelList.map((optionElement, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "inline",
                        }}
                        mr={1}
                      >
                        <DeletableBadge
                          badgeKey={
                            props.autoSelector !== undefined &&
                            props.autoSelector === true
                              ? (autoSelectorDataFormatterCallback(
                                  optionElement
                                ) as string)
                              : optionElement
                          }
                          deleteCallback={() => {
                            const clonedList = [...labelList];
                            clonedList.splice(index, 1);

                            setLabelList(clonedList);
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <Box mt={1.5}>
                <Box>
                  <Grid container spacing={2} alignItems={"flex-end"}>
                    <Grid item xs={12} md={8}>
                      {props.directInput !== undefined &&
                      props.directInput == true ? (
                        <TextTypeInput
                          labelConfig={{
                            position: "outer",
                            label: "직접 입력 후 추가",
                          }}
                          placeholder="직접 입력 후 추가해주세요."
                          fullWidth
                          value={label}
                          setValue={setLabel}
                          regexManager={regexManager}
                          regexKey={"tag"}
                        />
                      ) : props.autoSelector !== undefined &&
                        props.autoSelector === true ? (
                        <AutoCompleteSelector
                          placeholder={"선택해주세요."}
                          selectableItems={props.selectableItems}
                          inputStatus={props.inputStatus}
                          labelConfig={{
                            position: "outer",
                            label: "입력 및 선택 후 추가",
                          }}
                          value={label}
                          setValue={setLabel}
                        />
                      ) : (
                        <SelectTypeInput
                          labelConfig={{
                            position: "outer",
                            label: "태그 선택 후 추가",
                          }}
                          placeholder="태그를 선택 후 추가해주세요."
                          fullWidth
                          value={label}
                          setValue={setLabel}
                          selectableList={
                            props.selectableItems !== undefined
                              ? props.selectableItems
                              : []
                          }
                          selectDataValueKey={"value"}
                          selectDataLabelKey={"label"}
                        />
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Button
                        fullWidth
                        sx={{
                          height: "100%",
                          minHeight: "53px",
                        }}
                        disabled={label === undefined ? true : false}
                        variant="contained"
                        onClick={(e) => {
                          if (label !== undefined) {
                            let isAlreadyIn = false;

                            for (const selectedLabel of labelList) {
                              if (selectedLabel == label) {
                                isAlreadyIn = true;
                                break;
                              }
                            }

                            if (isAlreadyIn) {
                              alert("같은 값은 추가할 수 없습니다!");
                            } else {
                              const clonedList = [...labelList];
                              clonedList.push(label);

                              setLabelList(clonedList);
                            }

                            setLabel("");
                          }
                        }}
                      >
                        <AddCircleIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </InputCore>
    </Box>
  );
};

export default TagEditor;
