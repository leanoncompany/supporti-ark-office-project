import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import ImageUploader from "../ImageUploader";
import { IInputCore_EXTENDED } from "../../../../@types/external/qillieReactUi";
import { InputCore } from "@leanoncompany/supporti-react-ui";
import { TUploadImageCallback } from "../ImageUploader/ImageUploader";
import DownloadIcon from "@mui/icons-material/Download";
import FileUploadController from "../../../../controller/default/FileUploadController";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

interface IMultiFileUploader extends IInputCore_EXTENDED {
  disabled?: boolean;
  maxLength?: number;
  fileList: IFileType[];
  setFileList: React.Dispatch<React.SetStateAction<IFileType[]>>;
  uploadFileCallback?: (
    e: any,
    setAttachedFile: React.Dispatch<React.SetStateAction<IFileType[]>>,
    attachedFiles: IFileType[]
  ) => void;
}

export interface IFileType {
  FILE_URL: string;
  FILE_NAME: string;
}

const MultiFileUploader = (props: IMultiFileUploader) => {
  //* Modules
  const theme = useTheme();
  const fileUploadController = new FileUploadController();

  //* Refs
  const inputRef = React.useRef<any>(null);

  //* States

  //* Functions

  //* Hooks

  return (
    <Box>
      <InputCore
        labelConfig={props.labelConfig}
        inputCaptionConfig={props.inputCaptionConfig}
        inputStatus={props.inputStatus}
      >
        <Box>
          {/* 업로드 완료 파일 리스트 */}
          <Box>
            {props.fileList.map((attachedFile, index) => (
              <Box
                key={index}
                borderRadius={1}
                boxShadow={"rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;"}
                mb={1.5}
                p={1.5}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                {/* 파일명 */}
                <Box>
                  <Typography variant={"h6"} fontWeight={"bold"}>
                    {attachedFile.FILE_NAME}
                  </Typography>
                </Box>

                {/* 컨트롤러 버튼 */}
                <Box display={"flex"}>
                  {/* 파일 다운로드 버튼 */}
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                  >
                    <IconButton
                      color={"primary"}
                      onClick={() => {
                        window.open(attachedFile.FILE_URL);
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <Box mt={"-10px"}>
                      <Typography variant={"caption"}>다운로드</Typography>
                    </Box>
                  </Box>
                  {/* 삭제 버튼 */}
                  <Box
                    display={props.disabled === true ? "none" : "flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                  >
                    <IconButton
                      disabled={props.disabled}
                      color={"primary"}
                      onClick={() => {
                        const clonedList = [...props.fileList];
                        clonedList.splice(index, 1);

                        props.setFileList(clonedList);
                      }}
                    >
                      <DeleteForeverRoundedIcon />
                    </IconButton>
                    <Box mt={"-10px"}>
                      <Typography variant={"caption"}>삭제</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* 업로드 버튼 */}
          <Box display={props.disabled === true ? "none" : "block"}>
            <Button
              fullWidth
              disabled={(() => {
                if (props.disabled) {
                  return true;
                } else {
                  if (props.maxLength !== undefined) {
                    if (props.fileList.length >= props.maxLength) {
                      return true;
                    } else {
                      return false;
                    }
                  } else {
                    return false;
                  }
                }
              })()}
              variant={"outlined"}
              onClick={(e) => {
                if (props.disabled != true) {
                  if (e.target !== e.currentTarget) return;
                  if (inputRef.current !== null) {
                    inputRef.current.click();
                  }
                }
              }}
            >
              업로드
            </Button>

            <input
              style={{
                display: "none",
              }}
              ref={inputRef}
              type="file"
              onChange={(e) => {
                fileUploadController.uploadFile(
                  e,
                  props.setFileList,
                  props.fileList
                );
              }}
            />
          </Box>
        </Box>
      </InputCore>
    </Box>
  );
};

export default MultiFileUploader;
