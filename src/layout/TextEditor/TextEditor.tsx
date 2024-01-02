import { Box } from '@mui/material';
import React, { LegacyRef, RefObject, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';

type Props = {};

const TextEditor = (props: Props) => {
	const quillRef = useRef<ReactQuill>(null);
	const [content, setContent] = useState('');
	// quill에서 사용할 모듈
	// useMemo를 사용하여 modules가 렌더링 시 에디터가 사라지는 버그를 방지
	const modules = useMemo(() => {
		return {
			toolbar: {
				container: [
					[{ header: [1, 2, 3, false] }],
					['bold', 'italic', 'underline', 'strike'],
					['blockquote'],
					[{ list: 'ordered' }, { list: 'bullet' }],
					[{ color: [] }, { background: [] }],
					[{ align: [] }, 'link', 'image'],
				],
			},
		};
	}, []);
	return (
		<Box display={'flex'} flexDirection={'column'}>
			<button onClick={() => console.log(content)}>Value</button>
			<ReactQuill
				style={{ width: '600px', height: '600px' }}
				placeholder="Quill Content"
				theme="snow"
				ref={quillRef}
				value={content}
				onChange={setContent}
				modules={modules}
			/>
		</Box>
	);
};

export default TextEditor;
