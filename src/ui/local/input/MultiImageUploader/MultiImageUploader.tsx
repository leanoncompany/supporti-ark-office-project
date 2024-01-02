import { Box, Grid, Modal, Typography, useTheme } from '@mui/material';
import React from 'react';
import ImageUploader from '../ImageUploader';
import { IInputCore_EXTENDED } from '../../../../@types/external/qillieReactUi';
import { InputCore } from '@leanoncompany/supporti-react-ui';
import { TUploadImageCallback } from '../ImageUploader/ImageUploader';

interface IMuiltiImageUploader extends IInputCore_EXTENDED {
  disabled?: boolean;
  label: string;
  numOfUploader: number;
  imagePreviewUrlList: string[];
  setImagePreviewUrlList: React.Dispatch<React.SetStateAction<string[]>>;
  uploadImageCallback?: TUploadImageCallback;
}

const MultiImageUploader = (props: IMuiltiImageUploader) => {
  //* Modules
  const theme = useTheme();

  //* Refs
  const imageRef = React.useRef<any>(null);

  //* States
  const [selectedImage, setSelectedImage] = React.useState<any>('');
  const [imageModalOpen, setImageModalOpen] = React.useState<boolean>(false);
  const [isModuleInitiated, setIsModuleInitiated] = React.useState<boolean>(false);
  const [attachedFileList, setAttachedFileList] = React.useState<
    {
      file: any;
      imagePreviewUrl: string | ArrayBuffer | null;
    }[]
  >([]);
  const [imageModalViewStyle, setImageModalViewStyle] = React.useState<any>({
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { md: 550, xs: 300 },
    bgcolor: 'background.paper',
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  });

  //* Functions
  const handleImageModalClose = () => setImageModalOpen(false);
  const setImageButtonDisplay = (index: number) => {
    let show: boolean = false;

    if (index == 0) {
      show = true;
    } else {
      if (String(attachedFileList[index - 1].imagePreviewUrl).length != 0) {
        show = true;
      }
    }

    return show ? 'block' : 'none';
  };

  //* Hooks
  /**
   * 이미지 리스트 개수 띄우는 훅
   */
  React.useEffect(() => {
    let tempAttachedFiles: {
      file: any;
      imagePreviewUrl: string | ArrayBuffer | null;
    }[] = [];

    for (let i = 0; i < props.numOfUploader; i++) {
      tempAttachedFiles.push({
        file: null,
        imagePreviewUrl: '',
      });
    }

    setAttachedFileList(tempAttachedFiles);
    setIsModuleInitiated(true);
  }, []);

  /**
   * 이미지 초기화 이후
   */
  React.useEffect(() => {
    if (isModuleInitiated == true && props.imagePreviewUrlList) {
      let tempAttachedFiles: {
        file: any;
        imagePreviewUrl: string | ArrayBuffer | null;
      }[] = [];

      for (let i = 0; i < props.numOfUploader; i++) {
        tempAttachedFiles.push({
          file: null,
          imagePreviewUrl: '',
        });
      }

      props.imagePreviewUrlList.map((imagePreviewUrl, index) => {
        tempAttachedFiles[index].imagePreviewUrl = imagePreviewUrl;
      });

      setAttachedFileList(tempAttachedFiles);
    }
  }, [props.imagePreviewUrlList, isModuleInitiated]);

  /**
   * 이미지 비활성화 시 클릭 때 확대 모달 스타일 조정 훅
   */
  React.useEffect(() => {
    if (selectedImage !== '') {
      if (imageRef.current !== null) {
        if (imageRef.current.clientWidth >= imageRef.current.clientHeight) {
          setImageModalViewStyle({
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { md: '70vw', xs: '80vw' },
            bgcolor: 'background.paper',
            // border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          });
        } else {
          setImageModalViewStyle({
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: { md: '70vh', xs: '80vh' },
            maxHeight: '600px',
            bgcolor: 'background.paper',
            // border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          });
        }
      }
    }
  }, [selectedImage]);

  return (
    <Box>
      <InputCore
        labelConfig={props.labelConfig}
        inputCaptionConfig={props.inputCaptionConfig}
        inputStatus={props.inputStatus}>
        <Box>
          <Grid container spacing={1}>
            {attachedFileList.map((attachedFile, index) => (
              <Grid
                key={index}
                item
                sx={{
                  display: setImageButtonDisplay(index),
                  position: 'relative',
                }}>
                <ImageUploader
                  attachedFileList={attachedFileList}
                  setAttachedFileList={setAttachedFileList}
                  imagePreviewUrlList={props.imagePreviewUrlList}
                  setImagePreviewUrlList={props.setImagePreviewUrlList}
                  index={index}
                  disabled={props.disabled}
                  uploadImageCallback={props.uploadImageCallback}
                />

                {
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                    }}
                    flex={1}
                    display={props.disabled === true ? 'block' : 'none'}
                    onClick={() => {
                      setSelectedImage(attachedFile.imagePreviewUrl);
                      setImageModalOpen(true);
                    }}></Box>
                }
              </Grid>
            ))}
          </Grid>
        </Box>
      </InputCore>

      <Box sx={{ opacity: 0, position: 'absolute' }}>
        <img width={10} ref={imageRef} src={selectedImage} />
      </Box>

      <Modal open={imageModalOpen} onClose={handleImageModalClose}>
        <Box sx={imageModalViewStyle}>
          <img style={{ height: '100%' }} src={selectedImage} />
        </Box>
      </Modal>
    </Box>
  );
};

export default MultiImageUploader;
