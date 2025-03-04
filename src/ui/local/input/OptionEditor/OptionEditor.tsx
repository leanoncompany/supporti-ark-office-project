import {
  Box,
  Typography,
  IconButton,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import {
  DeletableBadge,
  InputCore,
  IUserInputStatus,
  TextTypeInput,
} from "@leanoncompany/supporti-react-ui";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React, { useEffect, useState, useRef } from "react";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { RegexManager } from "@leanoncompany/supporti-utility";
import { IInputCore_EXTENDED } from "../../../../@types/external/qillieReactUi";
import Grid2 from "@mui/material/Unstable_Grid2";

interface IOptionEditorProps extends IInputCore_EXTENDED {
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
}

const OptionEditor = (props: IOptionEditorProps) => {
  //* Modules
  const regexManager = new RegexManager();

  //* States
  const isInitiated = useRef<boolean>(false);
  const [optionList, setOptionList] = useState<
    | {
        optionKey: string;
        selectableOptions: { key: string; additionalPrice: number }[];
        currentValue: string;
        currentPrice: string;
      }[]
    | undefined
  >(undefined);
  const [optionName, setOptionName] = useState<string>("");
  const [optionNameInputStatus, setOptionNameInputStatus] =
    useState<IUserInputStatus>({
      status: "default",
    });

  //* Functions
  const addOption = () => {
    //* Validate
    let isValidated = true;

    if (optionName.length == 0) {
      isValidated = false;
      setOptionNameInputStatus({ status: "required" });
    }

    if (isValidated == true && optionList !== undefined) {
      const targetOptionName = optionName;

      const clonedList = [...optionList];
      clonedList.push({
        optionKey: targetOptionName,
        selectableOptions: [],
        currentValue: "",
        currentPrice: "",
      });

      setOptionList(clonedList);

      setOptionName("");
      setOptionNameInputStatus({
        status: "default",
      });
    }
  };

  //* Hooks
  useEffect(() => {
    if (isInitiated.current == false) {
      const targetValue =
        typeof props.value == "string" ? JSON.parse(props.value) : props.value;

      setOptionList(
        targetValue.map((optionElement: any) => {
          return Object.assign(optionElement, {
            currentValue: "",
          });
        })
      );

      isInitiated.current = true;
    }
  }, [props.value]);

  useEffect(() => {
    if (optionList !== undefined) {
      props.setValue(
        optionList.map((option) => {
          return {
            optionKey: option.optionKey,
            selectableOptions: option.selectableOptions,
          };
        })
      );
    }
  }, [optionList]);

  return (
    <Box>
      <InputCore
        labelConfig={props.labelConfig}
        inputCaptionConfig={props.inputCaptionConfig}
        inputStatus={props.inputStatus}
      >
        <Box mb={1} p={1.75} borderRadius={1.5} sx={{ background: "#e6e6e6" }}>
          {optionList !== undefined &&
            optionList.map((targetOption, optionIndex) => (
              <Box
                key={optionIndex}
                mb={optionIndex === optionList.length - 1 ? 0 : 1}
                p={1.5}
                borderRadius={1.5}
                sx={{ background: "#fff" }}
              >
                <Box
                  mb={1}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Typography variant={"caption"}>
                    {targetOption.optionKey}
                  </Typography>

                  <IconButton
                    onClick={() => {
                      const clonedList = [...optionList];
                      clonedList.splice(optionIndex, 1);

                      setOptionList(clonedList);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Grid2 container spacing={2} alignItems="flex-end">
                  <Grid2 item xs={12} sm={6}>
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
                        width: "80%",
                        minHeight: "64px",
                      }}
                    >
                      {targetOption.selectableOptions.length == 0 ? (
                        <Box
                          sx={{
                            position: "absolute;",
                            top: "50%;",
                            left: "50%",
                            transform: "translate(-50%, -50%);",
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#9f9f9f",
                            }}
                          >
                            Empty
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          {targetOption.selectableOptions.map(
                            (optionElement, index) => (
                              <Box
                                key={index}
                                sx={{
                                  display: "inline",
                                }}
                                mr={1}
                              >
                                <DeletableBadge
                                  badgeKey={`${optionElement.key} / +${optionElement.additionalPrice}`}
                                  deleteCallback={() => {
                                    const clonedList = [...optionList];
                                    clonedList[
                                      optionIndex
                                    ].selectableOptions.splice(index, 1);

                                    setOptionList(clonedList);
                                  }}
                                />
                              </Box>
                            )
                          )}
                        </Box>
                      )}
                    </Box>
                  </Grid2>

                  <Grid2 item xs={12} sm={6}>
                    <Box>
                      <Grid2 container spacing={2} alignItems={"flex-end"}>
                        <Grid2 item xs={12} md={8}>
                          <Grid2 container spacing={1}>
                            <Grid2 item xs={6}>
                              <Box mb={1}>
                                <Typography variant={"caption"}>
                                  선택 가능한 옵션명
                                </Typography>
                              </Box>
                              <TextField
                                placeholder="선택 가능한 옵션명"
                                value={targetOption.currentValue}
                                onChange={(e) => {
                                  const clonedList = [...optionList];

                                  clonedList[optionIndex].currentValue =
                                    e.target.value;

                                  setOptionList(clonedList);
                                }}
                              />
                            </Grid2>

                            <Grid2 item xs={6}>
                              <Box mb={1}>
                                <Typography variant={"caption"}>
                                  추가 금액
                                </Typography>
                              </Box>
                              <TextField
                                placeholder="추가 금액"
                                value={targetOption.currentPrice}
                                onChange={(e) => {
                                  const clonedList = [...optionList];

                                  clonedList[optionIndex].currentPrice =
                                    regexManager.filterNotNumber(
                                      e.target.value
                                    );

                                  setOptionList(clonedList);
                                }}
                              />
                            </Grid2>
                          </Grid2>
                        </Grid2>

                        <Grid2 item xs={12} md={4}>
                          <Button
                            fullWidth
                            sx={{
                              height: "100%",
                              minHeight: "53px",
                            }}
                            disabled={targetOption.currentValue.length == 0}
                            variant="contained"
                            onClick={(e) => {
                              let isAlreadyIn = false;

                              for (const selectedOption of targetOption.selectableOptions) {
                                if (
                                  selectedOption.key ==
                                  targetOption.currentValue
                                ) {
                                  isAlreadyIn = true;
                                  break;
                                }
                              }

                              if (isAlreadyIn) {
                                alert("같은 값은 추가할 수 없습니다!");
                              } else {
                                const clonedList = [...optionList];
                                clonedList[optionIndex].selectableOptions.push({
                                  key: targetOption.currentValue,
                                  additionalPrice:
                                    targetOption.currentPrice.length == 0
                                      ? 0
                                      : Number(targetOption.currentPrice),
                                });
                                clonedList[optionIndex].currentValue = "";
                                clonedList[optionIndex].currentPrice = "";

                                setOptionList(clonedList);
                              }
                            }}
                          >
                            <AddCircleIcon />
                          </Button>
                        </Grid2>
                      </Grid2>
                    </Box>
                  </Grid2>
                </Grid2>
              </Box>
            ))}

          <Box
            mt={optionList !== undefined ? (optionList.length > 0 ? 1 : 0) : 0}
            p={1.5}
            borderRadius={1.5}
            sx={{ background: "#fff" }}
          >
            <Grid2 container spacing={1.5} alignItems={"flex-end"}>
              <Grid2 item xs={12} md={9}>
                <TextTypeInput
                  labelConfig={{
                    position: "outer",
                    label: "옵션 추가",
                  }}
                  fullWidth
                  maxLength={40}
                  placeholder={"옵션명을 입력해주세요."}
                  value={optionName}
                  setValue={setOptionName}
                  inputCaptionConfig={{
                    status: optionNameInputStatus,
                    requiredMessage: "옵션명을 입력해야 합니다",
                  }}
                  onChangeCallback={(args: any) => {
                    setOptionNameInputStatus({
                      status: "default",
                    });
                  }}
                />
              </Grid2>

              <Grid2 item xs={12} md={3}>
                <Button
                  disabled={optionName.length == 0}
                  fullWidth
                  sx={{
                    height: "100%",
                    minHeight: "53px",
                  }}
                  variant="contained"
                  onClick={addOption}
                >
                  <PlaylistAddIcon />
                </Button>
              </Grid2>
            </Grid2>
          </Box>
        </Box>
      </InputCore>
    </Box>
  );
};

export default OptionEditor;
