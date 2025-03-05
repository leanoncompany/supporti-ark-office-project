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

interface IKeyLabelEditorProps extends IInputCore_EXTENDED {
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  selectableItems?: { value: any; label: string }[];
  useData?: boolean;
}

const KeyLabelEditor = (props: IKeyLabelEditorProps) => {
  //* Modules
  const regexManager = new RegexManager();

  //* States
  const isInitiated = useRef<boolean>(false);
  const [label, setLabel] = useState<string | undefined>(undefined);
  const [key, setKey] = useState<string | undefined>(undefined);
  const [data, setData] = useState<string | undefined>(undefined);

  const [keyLabelList, setKeyLabelList] = useState<
    { key: string; label: string; data?: string }[] | undefined
  >(undefined);

  //* Functions

  //* Hooks
  useEffect(() => {
    if (isInitiated.current == false) {
      const targetValue =
        typeof props.value == "string" ? JSON.parse(props.value) : props.value;

      setKeyLabelList(targetValue);

      isInitiated.current = true;
    }
  }, [props.value]);

  useEffect(() => {
    if (keyLabelList !== undefined) {
      props.setValue(keyLabelList);
    }
  }, [keyLabelList]);

  return (
    <Box>
      <InputCore
        labelConfig={props.labelConfig}
        inputCaptionConfig={props.inputCaptionConfig}
        inputStatus={props.inputStatus}
      >
        {keyLabelList !== undefined && (
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
                {keyLabelList.length == 0 ? (
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
                    {keyLabelList.map((optionElement, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "inline",
                        }}
                        mr={1}
                      >
                        <DeletableBadge
                          badgeKey={`${optionElement.label} : ${
                            optionElement.key
                          } ${props.useData ? `/ ${optionElement.data}` : ""}`}
                          deleteCallback={() => {
                            const clonedList = [...keyLabelList];

                            clonedList.splice(index, 1);

                            setKeyLabelList(clonedList);
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
                    <Grid item xs={6} md={props.useData ? 6 : 4.5}>
                      <TextTypeInput
                        labelConfig={{
                          position: "outer",
                          label: "라벨",
                        }}
                        fullWidth
                        maxLength={20}
                        placeholder={"라벨을 입력하세요."}
                        value={label}
                        setValue={setLabel}
                      />
                    </Grid>

                    <Grid item xs={6} md={props.useData ? 6 : 4.5}>
                      <TextTypeInput
                        labelConfig={{
                          position: "outer",
                          label: "키값",
                        }}
                        fullWidth
                        maxLength={20}
                        placeholder={"키값을 입력하세요."}
                        value={key}
                        setValue={setKey}
                      />
                    </Grid>

                    {props.useData && (
                      <Grid item xs={12} md={12}>
                        <TextTypeInput
                          multiLine={true}
                          labelConfig={{
                            position: "outer",
                            label: "값",
                          }}
                          fullWidth
                          rows={6}
                          placeholder={"값을 입력하세요."}
                          value={data}
                          setValue={setData}
                        />
                      </Grid>
                    )}

                    <Grid item xs={12} md={props.useData ? 12 : 3}>
                      <Button
                        fullWidth
                        sx={{
                          height: "100%",
                          minHeight: "53px",
                          maxWidth: "100%",
                        }}
                        disabled={
                          label === undefined ||
                          label === "" ||
                          key === undefined ||
                          key === "" ||
                          (props.useData
                            ? data === undefined || data === ""
                            : false)
                            ? true
                            : false
                        }
                        variant="contained"
                        onClick={(e) => {
                          if (label !== undefined && key !== undefined) {
                            let isAlreadyIn = false;

                            for (const keyLabel of keyLabelList) {
                              if (
                                keyLabel.key == key ||
                                keyLabel.label == label
                              ) {
                                isAlreadyIn = true;
                                break;
                              }
                            }

                            if (isAlreadyIn) {
                              alert("같은 키나 라벨은 추가할 수 없습니다!");
                            } else {
                              const clonedList = [...keyLabelList];

                              let value: {
                                key: string;
                                label: string;
                                data?: string;
                              } = {
                                key: key,
                                label: label,
                              };

                              if (props.useData) {
                                if (data !== undefined || data !== "") {
                                  value.data = data;
                                } else {
                                  alert("값을 입력해주세요!");
                                }
                              }

                              clonedList.push(value);

                              setKeyLabelList(clonedList);
                            }

                            setKey("");
                            setData("");
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

export default KeyLabelEditor;
