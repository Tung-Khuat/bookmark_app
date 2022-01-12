import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'
import { v4 as uuid } from 'uuid'
import { StyledAnchor } from './styledComponents/BasicComponents'
import { Close } from '@mui/icons-material'

const DropzoneContainer = styled.div`
	width: 100%;
	height: 200px;
	border-radius: 8px;
	background-color: #fafafa;
	border: 2px dashed #dbdbdb; 
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`
const InstructionText = styled.p`
	font-size: 1.5em;
	color: #adacac;
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
	position: relative;
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
const DropzoneAnchor = styled(StyledAnchor)`
	opacity: 0.7;
	&:hover {
		opacity: 1;
	}
`
const RemoveIconButton = styled.div`
	border-radius: 50%;
	cursor: pointer;
	position: absolute;
	top: 0;
	right: 0;
	background-color: #323232;
	opacity: 0.5;
	display: grid;
	place-items: center;
	&:hover {
		opacity: 0.8;
	}
`

function ImageDropzone({_callbackOnDrop}) {
	const [files, setFiles] = useState([])
	const [filePreviews, setFilePreviews] = useState([])
	const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
		accept: 'image/*',
		onDrop: async acceptedFiles => {
			setFiles(acceptedFiles)
		},
		multiple: true,
		noClick: true,
		noKeyboard: true,
	})

	useEffect(() => {
		_callbackOnDrop(files)
		if(files) {
			const filesWithPreview = files.map(file => Object.assign(file, {
				preview: URL.createObjectURL(file)
			}))
			setFilePreviews(filesWithPreview)
		}
	}, [files])

	useEffect(() => {
		return () => filePreviews.forEach(file => URL.revokeObjectURL(file.preview))
	}, [])

	const handlePaste = (e) => {
		if(e.clipboardData.files.length) {
			const fileObject = e.clipboardData.files[0]
			const fileUUID = uuid()
			const newFileName = `${fileObject.name}-${fileUUID}`
			const renamedFile = new File([fileObject], newFileName)

			setFiles([...files, renamedFile])
		}
	}
	const handleRemoveFile = (index) => {
		if(index > 0){
			const updatedFiles = [...files]
			updatedFiles.splice(index, 1)
			setFiles(updatedFiles)
		} else if (index === 0) {
			setFiles([])
		}
	}

	const renderPreview = (file, index) => {
		return (
			<PreviewOuter key={index} >
				<RemoveIconButton onClick={()=>handleRemoveFile(index)}>
					<Close style={{ fontSize: '1.2em', color: "fff", opacity: 1 }} />
				</RemoveIconButton>
				<PreviewInner>
					<PreviewImage
						src={file.preview}
					/>
				</PreviewInner>
			</PreviewOuter>
		)
	}
	
	return (
		<div onPaste={handlePaste}>
			<DropzoneContainer {...getRootProps()}>
				<input {...getInputProps()} />
				{
					isDragActive ?
					<InstructionText>Drop the files here ...</InstructionText> : (
						<>
							<InstructionText>Drag 'n' drop or click and paste some files here...</InstructionText>
							<InstructionText>or <DropzoneAnchor onClick={open}>browse files</DropzoneAnchor></InstructionText>
						</>
					)
				}
			</DropzoneContainer>
			<PreviewsContainer>{filePreviews.map(renderPreview)}</PreviewsContainer>
		</div>
	)
}
export default ImageDropzone

