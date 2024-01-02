import { Box, IconButton, useTheme } from '@mui/material';
import React from 'react';
import FileUploadController from '../../../../controller/default/FileUploadController';
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export type TUploadImageCallback = (
	e: any,
	setAttachedFile: React.Dispatch<
		React.SetStateAction<
			{
				file: any;
				imagePreviewUrl: string | ArrayBuffer | null;
			}[]
		>
	>,
	attachedFiles: {
		file: any;
		imagePreviewUrl: string | ArrayBuffer | null;
	}[],
	imagePreviewUrlList: string[],
	setImagePreviewUrlList: React.Dispatch<React.SetStateAction<string[]>>,
	index: number
) => void;

interface IImageUploader {
	disabled?: boolean;
	attachedFileList: {
		file: any;
		imagePreviewUrl: string | ArrayBuffer | null;
	}[];
	setAttachedFileList: React.Dispatch<
		React.SetStateAction<
			{
				file: any;
				imagePreviewUrl: string | ArrayBuffer | null;
			}[]
		>
	>;
	index: number;
	imagePreviewUrlList: string[];
	setImagePreviewUrlList: React.Dispatch<React.SetStateAction<string[]>>;
	uploadImageCallback?: TUploadImageCallback;
	customButtonRenderCallback?: (onClick: (e: any) => void) => React.ReactNode;
}

const ImageUploader = (props: IImageUploader) => {
	//* Modules
	const theme = useTheme();
	const fileUploadController = new FileUploadController();

	//* Refs
	const inputRef = React.useRef<any>(null);

	return (
		<Box>
			{props.customButtonRenderCallback !== undefined ? (
				props.customButtonRenderCallback((e: any) => {
					if (props.disabled != true) {
						if (e.target !== e.currentTarget) return;
						if (inputRef.current !== null) {
							inputRef.current.click();
						}
					}
				})
			) : (
				<Box
					top={0}
					position={'relative'}
					flexDirection={'column'}
					display={
						props.disabled == true &&
						!props.attachedFileList[props.index].imagePreviewUrl
							? 'none'
							: 'flex'
					}
					justifyContent={'center'}
					border={`1px solid ${theme.palette.grey[100]}`}
					borderRadius={'10px'}
					alignItems={'center'}
					width={'94px'}
					height={'94px'}
					sx={{
						cursor: 'pointer',
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
						backgroundImage: `url('${
							props.attachedFileList[props.index].imagePreviewUrl
						}')`,
					}}
					onClick={(e: any) => {
						// e.preventDefault();
						// e.stopPropagation();
						if (props.disabled != true) {
							if (e.target !== e.currentTarget) return;

							if (props.attachedFileList[props.index].imagePreviewUrl === null && inputRef.current !== null)  {
								inputRef.current.click();
							}
						}
					}}
				>
					{props.attachedFileList[props.index].imagePreviewUrl &&
					props.disabled != true ? (
						<Box
							position={'absolute'}
							width={'30px'}
							height={'30px'}
							borderRadius={'50%'}
							display={'flex'}
							alignItems={'center'}
							justifyContent={'center'}
							top={'0px'}
							right={'0px'}
							sx={{ cursor: 'pointer' }}
							onClick={() => {
								const clonedList = [
									...props.imagePreviewUrlList,
								];
								clonedList.splice(props.index, 1);

								props.setImagePreviewUrlList(clonedList);
							}}
						>
							<CancelIcon htmlColor={'rgba(0,0,0,0.8)'} />
						</Box>
					) : (
						<></>
					)}
					{!props.attachedFileList[props.index].imagePreviewUrl ? (
						<IconButton
							disabled={props.disabled}
							onClick={(e: any) => {
								if (inputRef.current !== null) {
									inputRef.current.click();
								}
							}}
						>
							<AddIcon htmlColor={'#e4e4e4'} />
						</IconButton>
					) : (
						<></>
					)}
				</Box>
			)}

			{/* Input */}
			<input
				style={{
					display: 'none',
				}}
				ref={inputRef}
				type="file"
				accept="image/*"
				onChange={(e) => {
					if (props.uploadImageCallback !== undefined) {
						props.uploadImageCallback(
							e,
							props.setAttachedFileList,
							props.attachedFileList,
							props.imagePreviewUrlList,
							props.setImagePreviewUrlList,
							props.index
						);
					} else {
						fileUploadController.uploadImage(
							e,
							props.setAttachedFileList,
							props.attachedFileList,
							props.imagePreviewUrlList,
							props.setImagePreviewUrlList,
							props.index
						);
					}
				}}
			/>
		</Box>
	);
};

export default ImageUploader;
