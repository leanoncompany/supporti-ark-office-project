import React from 'react';
import { ControllerABC } from '../base/ControllerABC';
import { IFileType } from '../../ui/local/input/MultiFileUploader/MultiFileUploader';

class FileUploadController extends ControllerABC {
	//* 클래스 멤버
	constructor() {
		super();
	}

	/**
	 * 하나의 이지 업로드
	 */
	public uploadSingleFile = (
		setImagePreviewUrl: React.Dispatch<React.SetStateAction<string>>,
		e?: any
	) => {
		if (e !== undefined) {
			e.preventDefault();
		}

		let reader = new FileReader();
		let file = e.target.files[0];

		reader.onloadend = () => {
			//* Save image
			const formData = new FormData();

			formData.append('file', file, file.name);

			this.postData(
				formData,
				`${this.rootRoute}/common/file/upload_image`,
				(response) => {
					//* Get image url
					const imageUrl = response.data.result[0];

					//* Set preview image list
					setImagePreviewUrl(imageUrl);
				},
				(err) => {
					console.log(err);
				}
			);
		};

		reader.readAsDataURL(file);
	};

	/**
	 * 이미지 업로드
	 */
	public uploadImage = (
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
	) => {
		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];

		reader.onloadend = () => {
			//* Save image
			const formData = new FormData();

			formData.append('file', file, file.name);

			this.postData(
				formData,
				`${this.rootRoute}/common/file/upload_image`,
				(response) => {
					//* Get image url
					const imageUrl = response.data.result[0];

					//* Set actual file
					const clonedAttachedFiles = [...(attachedFiles as any)];
					clonedAttachedFiles[index] = {
						file: file,
						imagePreviewUrl: imageUrl,
					};

					setAttachedFile(clonedAttachedFiles);

					//* Set preview image list
					const clonedImagePreviewUrlList = [...imagePreviewUrlList];
					clonedImagePreviewUrlList.push(imageUrl);

					setImagePreviewUrlList(clonedImagePreviewUrlList);
				},
				(err) => {
					console.log(err);
				}
			);
		};

		reader.readAsDataURL(file);
	};

	/**
	 * 파일 업로드
	 */
	public uploadFile = (
		e: any,
		setAttachedFileList: React.Dispatch<React.SetStateAction<IFileType[]>>,
		attachedFileList: IFileType[]
	) => {
		console.log('A');
		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];

		reader.onloadend = () => {
			console.log('B');
			//* Save file
			const formData = new FormData();

			formData.append('file', file, file.name);
			console.log('C');

			this.postData(
				formData,
				`${this.rootRoute}/common/file/upload_image`,
				(response) => {
					console.log(response);

					//* Get file url
					const fileUrl = response.data.result[0];

					//* Set actual file
					const clonedAttachedFiles = [...(attachedFileList as any)];
					clonedAttachedFiles.push({
						FILE_URL: fileUrl,
						FILE_NAME: file.name,
					});
					console.log('D');

					setAttachedFileList(clonedAttachedFiles);
					console.log('E');
				},
				(err) => {
					console.log(err);
				}
			);
		};

		reader.readAsDataURL(file);
	};
}

export default FileUploadController;
