import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'
import { Button } from '@mui/material'
import { v4 as uuid } from 'uuid'

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
	overflow: scroll;
	width: 100%;
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
	const [files, setFiles] = useState([])
	const [filePreviews, setFilePreviews] = useState([])
	const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
		accept: 'image/*',
		onDrop: acceptedFiles => {
			setFiles(acceptedFiles)
			setFilePreviews(acceptedFiles.map(file => Object.assign(file, {
				preview: URL.createObjectURL(file)
			})))
		},
		multiple: true,
		noClick: true,
		noKeyboard: true,
	})

	useEffect(() => {
		_callbackOnDrop(files)
	}, [files])

	useEffect(() => {
		filePreviews.forEach(file => URL.revokeObjectURL(file.preview))
	}, [filePreviews])

	const previews = filePreviews.map(file => (
		<PreviewOuter key={file.name}>
			<PreviewInner>
				<PreviewImage
					src={file.preview}
				/>
			</PreviewInner>
		</PreviewOuter>
	))

	const handlePaste = (e) => {
		if(e.clipboardData.files.length) {
			const fileObject = e.clipboardData.files[0]
			const fileUUID = uuid()
			const newFileName = `${fileObject.name}-${fileUUID}`
			const renamedFile = new File([fileObject], newFileName)
	
			const fileMetaDataWithPreview = {
				getRawFile: () => fileObject,
				name: renamedFile.name,
				size: fileObject.size,
				preview: URL.createObjectURL(fileObject),
			}
			setFiles([...files, renamedFile])
			setFilePreviews([...filePreviews, fileMetaDataWithPreview])
		}
	}

	return (
		<div onPaste={handlePaste}>
			<DropzoneContainer {...getRootProps()}>
				<input {...getInputProps()} />
				{
					isDragActive ?
					<InstructionText>Drop the files here ...</InstructionText> :
					<InstructionText>Drag 'n' drop some files here, or click and paste.</InstructionText>
				}
			</DropzoneContainer>
			<Button style={{marginTop: 4}} variant='outlined' onClick={open}>Select files...</Button>
			<PreviewsContainer>{previews}</PreviewsContainer>
		</div>
	)
}
export default ImageDropzone

