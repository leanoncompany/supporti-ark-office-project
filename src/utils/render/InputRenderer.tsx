import { Box, Button, Grid, Typography } from "@mui/material";
import {
  IUserInputStatus,
  TextTypeInput,
} from "@leanoncompany/supporti-react-ui";
import { RegexManager } from "@leanoncompany/supporti-utility";
import React, { useState } from "react";
import { IData, IWrappedData, IWrappedDataDict } from "../../@types/base/data";
import CategorySelector from "../../ui/local/input/CategorySelector";
import MultiImageUploader from "../../ui/local/input/MultiImageUploader";
import OptionEditor from "../../ui/local/input/OptionEditor/OptionEditor";
import TagEditor from "../../ui/local/input/TagEditor";
import StarRate from "../../ui/local/input/StarRate/StarRate";
import Select from "../../ui/local/input/Select/Select";
import Address from "../../ui/local/input/AddressPicker/AddressPicker";
import Switch from "../../ui/local/input/Switch/Switch";
import Shortcut from "../../ui/local/utils/Shortcut/Shortcut";
import RegistBankAccount from "../../layout/RegistBankAccount";
import KeyLabelEditor from "../../ui/local/input/KeyLabelEditor";
import { PasswordInput } from "../../ui/local/input/PasswordInput";
import DatePicker from "../../ui/local/input/DatePicker/DatePicker";
import AutoCompleteSelector from "../../ui/local/input/AutoCompleteSelector";
import TimePicker from "../../ui/local/input/TimePicker/TimePicker";
import MultiFileUploader from "../../ui/local/input/MultiFileUploader";

export class InputRenderer {
  public regexManager = new RegexManager();

  public render = (
    data: IData,
    wrappedDataDict: IWrappedDataDict,
    disableEdit?: boolean,
    pageRole?: string,
    disableUpdate?: boolean
  ) => {
    const wrappedDatas: IWrappedData[] = [];

    Object.keys(wrappedDataDict).map((key) => {
      if (data.keys.includes(key)) {
        wrappedDatas.push(wrappedDataDict[key]);
      }
    });

    let ui: React.ReactElement = <></>;
    const defaultSetInputStatus = wrappedDatas[0].setInputStatus;
    const defaultSetter = wrappedDatas[0].setter;
    const subSetter = wrappedDatas[1]?.setter;
    const disabled =
      data.disabled !== undefined
        ? data.disabled
        : disableEdit !== undefined
        ? disableEdit
        : disableUpdate !== undefined
        ? pageRole === "write"
          ? false
          : disableUpdate
        : disableUpdate;

    switch (data.ui) {
      case "textarea":
        const commonTextAreaConfigs = {
          disabled: disabled,
          labelConfig: {
            position: "outer",
            label: data.label,
            typograhpyVariant: "body1",
          },
          rows: data.rows,
          multiline: data.rows !== undefined ? true : false,
          fullWidth: true,
          maxLength: data.maxLength,
          placeholder:
            data.placeholder !== undefined
              ? data.placeholder
              : `${data.label}(을)를 입력해주세요.`,
          value:
            data.valueFormatterCallback !== undefined
              ? data.valueFormatterCallback(wrappedDatas[0].state)
              : wrappedDatas[0].state,
          setValue: wrappedDatas[0].setter,
          inputCaptionConfig: Object.assign(
            { status: wrappedDatas[0].inputStatus },
            {
              requiredMessage: `${data.label}(은)는 필수값입니다.`,
            },
            data.captionMessages
          ),
          onChangeCallback: (args: any) => {
            if (args.event.target.value.length > 0) {
              if (defaultSetInputStatus !== undefined) {
                defaultSetInputStatus({
                  status: "default",
                });
              }
            }
          },
        };

        switch (data.type) {
          case "username":
            ui = (
              <TextTypeInput
                {...commonTextAreaConfigs}
                adornmentPosition={"end"}
                adornmentElement={
                  <Button
                    variant="text"
                    onClick={() => {
                      const callback = data.callbacks?.doubleCheckUserName;

                      if (callback !== undefined) {
                        callback(
                          {
                            USER_NAME: wrappedDatas[0].state,
                          },
                          (response: any) => {
                            if (response.data.result == true) {
                              wrappedDatas[0].extendedStates?.[
                                "doubleCheckPassed"
                              ].setter(true);

                              if (defaultSetInputStatus !== undefined) {
                                defaultSetInputStatus({
                                  status: "passed",
                                });
                              }
                            } else {
                              alert("이미 사용중인 아이디입니다.");
                            }
                          }
                        );
                      } else {
                        alert("콜백이 선언되어 있지 않습니다.");
                      }
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ textDecoration: "underline" }}
                      color={"black"}
                    >
                      중복확인
                    </Typography>
                  </Button>
                }
                inputCaptionConfig={Object.assign(
                  { status: wrappedDatas[0].inputStatus },
                  {
                    errorMessage:
                      "최소 5자, 최대 19자 알파벳과 숫자의 조합만 가능합니다.",
                    requiredMessage: "아이디 중복 확인을 해주세요.",
                    passedMessage: "사용 가능한 아이디입니다.",
                  }
                )}
                onChangeCallback={(args: any) => {
                  if (defaultSetInputStatus !== undefined) {
                    defaultSetInputStatus({
                      status: "default",
                    });
                  }

                  wrappedDatas[0].extendedStates?.["doubleCheckPassed"].setter(
                    false
                  );
                }}
              />
            );

            break;

          case "password":
            if (pageRole === "write") {
              ui = (
                <PasswordInput
                  commonTextAreaConfigs={commonTextAreaConfigs}
                  passwordInputStatus={wrappedDatas[0].inputStatus}
                  setPasswordInputStatus={defaultSetInputStatus}
                  passwordConfirm={
                    wrappedDatas[0].extendedStates?.["passwordConfirm"].state
                  }
                  setPasswordConfirm={
                    wrappedDatas[0].extendedStates?.["passwordConfirm"].setter
                  }
                  passwordConfirmInputStatus={
                    wrappedDatas[0].extendedStates?.[
                      "passwordConfirmInputStatus"
                    ].state
                  }
                  setPasswordConfirmInputStatus={
                    wrappedDatas[0].extendedStates?.[
                      "passwordConfirmInputStatus"
                    ].setter
                  }
                />
              );
            } else {
              ui = <Typography></Typography>;
            }

            break;

          case "number":
            ui = (
              <TextTypeInput
                {...commonTextAreaConfigs}
                onChangeCallback={(args: any) => {
                  if (defaultSetInputStatus !== undefined) {
                    defaultSetInputStatus({
                      status: "default",
                    });
                  }

                  if (defaultSetter !== undefined) {
                    const targetString = args.event.target.value
                      .replace(/[^-\d.]|\.(?=.*\.)/g, "")
                      .replace(/-{2,}/g, "-")
                      .replace(/(?<=.)-+/g, "");

                    defaultSetter(targetString);
                  }
                }}
              />
            );

            break;

          default:
            ui = <TextTypeInput {...commonTextAreaConfigs} />;
        }

        break;

      case "fileUpload":
        switch (data.type) {
          default:
            ui =
              defaultSetter !== undefined ? (
                <Box>
                  <MultiFileUploader
                    disabled={disableEdit || disabled}
                    inputStatus={wrappedDatas[0].inputStatus}
                    labelConfig={{
                      position: "outer",
                      label: data.label,
                    }}
                    inputCaptionConfig={Object.assign(
                      {
                        status: wrappedDatas[0].inputStatus,
                      },
                      {
                        requiredMessage: "파일을 1개 이상 선택해주세요.",
                      },
                      data.captionMessages
                    )}
                    fileList={wrappedDatas[0].state}
                    setFileList={defaultSetter}
                    maxLength={
                      data.maxLength !== undefined ? data.maxLength : 20
                    }
                  />
                </Box>
              ) : (
                <Typography color="red">Need default setter</Typography>
              );
        }

        break;

      case "imageUpload":
        switch (data.type) {
          default:
            ui =
              defaultSetter !== undefined ? (
                <Box>
                  <MultiImageUploader
                    uploadImageCallback={data.uploadImageCallback}
                    disabled={disableEdit || disabled}
                    inputStatus={wrappedDatas[0].inputStatus}
                    labelConfig={{
                      position: "outer",
                      label: data.label,
                    }}
                    inputCaptionConfig={Object.assign(
                      {
                        status: wrappedDatas[0].inputStatus,
                      },
                      {
                        requiredMessage: "이미지를 1개 이상 선택해주세요.",
                      },
                      data.captionMessages
                    )}
                    imagePreviewUrlList={wrappedDatas[0].state}
                    setImagePreviewUrlList={defaultSetter}
                    label={"이미지"}
                    numOfUploader={
                      data.maxLength !== undefined ? data.maxLength : 20
                    }
                  />
                </Box>
              ) : (
                <Typography color="red">Need default setter</Typography>
              );
        }

        break;

      case "optionEditor":
        ui =
          defaultSetter !== undefined ? (
            <OptionEditor
              inputStatus={wrappedDatas[0].inputStatus}
              labelConfig={{
                position: "outer",
                label: data.label,
              }}
              inputCaptionConfig={Object.assign(
                { status: wrappedDatas[0].inputStatus },
                {
                  requiredMessage: "옵션을 선택해주세요.",
                },
                data.captionMessages
              )}
              value={wrappedDatas[0].state}
              setValue={defaultSetter}
            />
          ) : (
            <Typography color="red">Need default setter</Typography>
          );

        break;

      case "tagEditor":
        ui =
          defaultSetter !== undefined ? (
            <TagEditor
              inputStatus={wrappedDatas[0].inputStatus}
              labelConfig={{
                position: "outer",
                label: data.label,
              }}
              inputCaptionConfig={Object.assign(
                { status: wrappedDatas[0].inputStatus },
                {
                  requiredMessage: "태그를 선택해주세요.",
                },
                data.captionMessages
              )}
              value={wrappedDatas[0].state}
              setValue={defaultSetter}
              selectableItems={data.selectableItems}
              directInput={data.directInput}
              autoSelector={data.useAutoSelector}
            />
          ) : (
            <Typography color="red">Need default setter</Typography>
          );
        break;

      case "categorySelector":
        ui =
          defaultSetter !== undefined && subSetter ? (
            <CategorySelector
              inputStatus={wrappedDatas[0].inputStatus}
              labelConfig={{
                position: "outer",
                label: data.label,
              }}
              inputCaptionConfig={Object.assign(
                { status: wrappedDatas[0].inputStatus },
                {
                  requiredMessage: "카테고리를 선택해주세요.",
                },
                data.captionMessages
              )}
              primeValue={wrappedDatas[0].state}
              subValue={wrappedDatas[1].state}
              setPrimeValue={defaultSetter}
              setSubValue={subSetter}
            />
          ) : (
            <Typography color="red">Need default and sub setters</Typography>
          );
        break;

      case "rating":
        ui =
          defaultSetter !== undefined ? (
            <StarRate
              inputStatus={wrappedDatas[0].inputStatus}
              labelConfig={{
                position: "outer",
                label: data.label,
              }}
              inputCaptionConfig={Object.assign(
                { status: wrappedDatas[0].inputStatus },
                {
                  requiredMessage: "평점을 선택해주세요.",
                },
                data.captionMessages
              )}
              value={wrappedDatas[0].state}
              setValue={defaultSetter}
            />
          ) : (
            <Typography color="red">Need default setter</Typography>
          );
        break;

      case "select":
        ui =
          defaultSetter !== undefined ? (
            <Select
              disabled={disabled}
              inputStatus={wrappedDatas[0].inputStatus}
              labelConfig={{
                position: "outer",
                label: data.label,
              }}
              inputCaptionConfig={Object.assign(
                { status: wrappedDatas[0].inputStatus },
                {
                  requiredMessage: "값을 선택해주세요.",
                },
                data.captionMessages
              )}
              value={wrappedDatas[0].state}
              setValue={defaultSetter}
              selectableItems={data.selectableItems}
            />
          ) : (
            <Typography color="red">Need default setter</Typography>
          );

        break;

      case "datePicker":
        ui =
          defaultSetter !== undefined ? (
            <DatePicker
              inputStatus={wrappedDatas[0].inputStatus}
              labelConfig={{
                position: "outer",
                label: data.label,
              }}
              inputCaptionConfig={Object.assign(
                { status: wrappedDatas[0].inputStatus },
                {
                  requiredMessage: "옵션을 선택해주세요.",
                },
                data.captionMessages
              )}
              setInputStatus={defaultSetInputStatus}
              value={wrappedDatas[0].state}
              setValue={defaultSetter}
              disabled={disabled}
            />
          ) : (
            <Typography color="red">Need default setter</Typography>
          );

        break;

      case "dateTimePicker":
        ui =
          defaultSetter !== undefined ? (
            <TimePicker
              inputStatus={wrappedDatas[0].inputStatus}
              labelConfig={{
                position: "outer",
                label: data.label,
              }}
              inputCaptionConfig={Object.assign(
                { status: wrappedDatas[0].inputStatus },
                {
                  requiredMessage: "옵션을 선택해주세요.",
                },
                data.captionMessages
              )}
              setInputStatus={defaultSetInputStatus}
              value={wrappedDatas[0].state}
              setValue={defaultSetter}
              disabled={disabled}
              type={"datetimepicker"}
            />
          ) : (
            <Typography color="red">Need default setter</Typography>
          );

        break;

      case "timePicker":
        ui =
          defaultSetter !== undefined ? (
            <TimePicker
              inputStatus={wrappedDatas[0].inputStatus}
              labelConfig={{
                position: "outer",
                label: data.label,
              }}
              inputCaptionConfig={Object.assign(
                { status: wrappedDatas[0].inputStatus },
                {
                  requiredMessage: "옵션을 선택해주세요.",
                },
                data.captionMessages
              )}
              setInputStatus={defaultSetInputStatus}
              value={wrappedDatas[0].state}
              setValue={defaultSetter}
              disabled={disabled}
              type={"timepicker"}
            />
          ) : (
            <Typography color="red">Need default setter</Typography>
          );

        break;

      case "autoCompleteSelector":
        ui =
          defaultSetter !== undefined ? (
            <AutoCompleteSelector
              placeholder={data.placeholder}
              getAllCallback={data.callbacks?.getAllCallback}
              receivedSelectableDataFormatterCallback={
                data.callbacks?.receivedSelectableDataFormatterCallback
              }
              inputStatus={wrappedDatas[0].inputStatus}
              labelConfig={{
                position: "outer",
                label: data.label,
              }}
              inputCaptionConfig={Object.assign(
                { status: wrappedDatas[0].inputStatus },
                {
                  requiredMessage: "옵션을 선택해주세요.",
                },
                data.captionMessages
              )}
              value={wrappedDatas[0].state}
              setValue={defaultSetter}
              disabled={disabled}
            />
          ) : (
            <Typography color="red">Need default setter</Typography>
          );

        break;

      case "custom":
        ui =
          data.customRenderCallback !== undefined ? (
            data.customRenderCallback(wrappedDataDict)
          ) : (
            <Typography color="red">
              Need default customRenderCallback
            </Typography>
          );

        break;

      case "keyLabelEditor":
        switch (data.type) {
          case "useData":
            ui =
              defaultSetter !== undefined ? (
                <KeyLabelEditor
                  useData={true}
                  inputStatus={wrappedDatas[0].inputStatus}
                  labelConfig={{
                    position: "outer",
                    label: data.label,
                  }}
                  inputCaptionConfig={Object.assign(
                    { status: wrappedDatas[0].inputStatus },
                    {
                      requiredMessage: "값을 입력해주세요.",
                    },
                    data.captionMessages
                  )}
                  value={wrappedDatas[0].state}
                  setValue={defaultSetter}
                />
              ) : (
                <Typography color="red">Need default setter</Typography>
              );
            break;

          default:
            ui =
              defaultSetter !== undefined ? (
                <KeyLabelEditor
                  inputStatus={wrappedDatas[0].inputStatus}
                  labelConfig={{
                    position: "outer",
                    label: data.label,
                    typograhpyVariant: "body1",
                  }}
                  inputCaptionConfig={Object.assign(
                    { status: wrappedDatas[0].inputStatus },
                    {
                      requiredMessage: "값을 입력해주세요.",
                    },
                    data.captionMessages
                  )}
                  value={wrappedDatas[0].state}
                  setValue={defaultSetter}
                />
              ) : (
                <Typography color="red">Need default setter</Typography>
              );
            break;
        }

        break;

      case "address":
        // eslint-disable-next-line @typescript-eslint/no-redeclare

        const thirdSetter = wrappedDatas[2].setter;
        const subInputStatusSetter = wrappedDatas[1].setInputStatus;
        const thirdInputStatusSetter = wrappedDatas[2].setInputStatus;

        ui =
          defaultSetter !== undefined &&
          subSetter !== undefined &&
          thirdSetter !== undefined &&
          defaultSetInputStatus !== undefined &&
          subInputStatusSetter !== undefined &&
          thirdInputStatusSetter !== undefined ? (
            <Address
              postCode={wrappedDatas[0].state}
              setPostCode={defaultSetter}
              postCodeInputStatus={wrappedDatas[0].inputStatus}
              setPostCodeInputStatus={defaultSetInputStatus}
              basicAddress={wrappedDatas[1].state}
              setBasicAddress={subSetter}
              basicAddressInputStatus={wrappedDatas[1].inputStatus}
              setBasicAddressInputStatus={subInputStatusSetter}
              detailAddress={wrappedDatas[2].state}
              setDetailAddress={thirdSetter}
              detailAddressInputStatus={wrappedDatas[2].inputStatus}
              setDetailAddressInputStatus={thirdInputStatusSetter}
              label={data.label}
            />
          ) : (
            <Typography color="red">Need default setter</Typography>
          );
        break;

      case "switch":
        ui =
          defaultSetter !== undefined ? (
            <Switch
              disabled={disabled}
              inputStatus={wrappedDatas[0].inputStatus}
              labelConfig={{
                position: "outer",
                label: data.label,
                typograhpyVariant: "body1",
              }}
              inputCaptionConfig={Object.assign(
                { status: wrappedDatas[0].inputStatus },
                data.captionMessages
              )}
              value={wrappedDatas[0].state}
              setValue={defaultSetter}
            />
          ) : (
            <Typography color="red">Need default setter</Typography>
          );

        break;

      case "shortcut":
        ui = (
          <Shortcut
            value={wrappedDatas[0].state}
            label={data.label}
            link={data.link}
          />
        );
        break;

      case "bankSelector":
        ui =
          defaultSetter !== undefined && subSetter !== undefined ? (
            <RegistBankAccount
              bankType={wrappedDatas[0].state}
              setBankType={defaultSetter}
              bankAccount={wrappedDatas[1].state}
              setBankAccount={subSetter}
              bankAccountInputStatus={wrappedDatas[0].inputStatus}
              setBankAccountInputStatus={defaultSetInputStatus}
              disabled={
                data.disabled !== undefined ? data.disabled : disableEdit
              }
            />
          ) : (
            <Typography color="red">Need default and sub setter</Typography>
          );

        break;

      default:
        ui = <></>;
    }

    const wrapper: React.ReactElement = <Box>{ui}</Box>;

    return wrapper;
  };
}
