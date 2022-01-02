import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Dropzone, { useDropzone } from 'react-dropzone'

const DropzoneContainer = styled.div`
	width: 100%;
	height: 250px;
	border-radius: 8px;
	background-color: #fafafa;
	border: 2px dashed #dbdbdb; 
	display: flex;
	justify-content: center;
	align-items: center;
`
const InstructionText = styled.p`
	font-size: 1.5em;
	color: #dbdbdb;
`
const PreviewsContainer = styled.div`
	display: flex;
	margin-top: 8px;
`
const PreviewOuter = styled.div`
	display: inline-flex;
	border-radius: 8px;
	border: 1px solid #eaeaea;
	margin-bottom: 8px;
	margin-right: 8px;
	width: 175px;
	height: 125px;
	padding: 4px;
	box-sizing: border-box;
`
const PreviewInner = styled.div`
	display: flex;
	overflow: hidden;
	justify-content: center;
	align-items: center;
	margin: 0 auto;
`
const PreviewImage = styled.img`
	display: block;
	width: auto;
	height: 100%;
`

function ImageDropzone({_callbackOnDrop}) {
	const [files, setFiles] = useState([]);
	const {getRootProps, getInputProps, isDragActive} = useDropzone({
		accept: 'image/*',
		onDrop: acceptedFiles => {
			setFiles(acceptedFiles.map(file => Object.assign(file, {
				preview: URL.createObjectURL(file)
			})));
		},
		multiple: true,
	});

	useEffect(() => {
		files.forEach(file => URL.revokeObjectURL(file.preview));
		_callbackOnDrop(files)
	}, [files]);

	const previews = files.map(file => (
		<PreviewOuter key={file.name}>
			<PreviewInner>
				<PreviewImage
					src={file.preview}
				/>
			</PreviewInner>
		</PreviewOuter>
	));

	return (
		<>
			<DropzoneContainer {...getRootProps()}>
				<input {...getInputProps()} />
				{
					isDragActive ?
					<InstructionText>Drop the files here ...</InstructionText> :
					<InstructionText>Drag 'n' drop some files here, or click to select files</InstructionText>
				}
			</DropzoneContainer>
			<PreviewsContainer>{previews}</PreviewsContainer>
		</>
	)
}
export default ImageDropzone

