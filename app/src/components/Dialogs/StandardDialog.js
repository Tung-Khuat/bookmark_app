import React from 'react'
import styled from 'styled-components'
import { Dialog, DialogContent } from '@mui/material'
import { Close } from '@mui/icons-material';
import config from './config'
import { StandardDialogTitle } from '../styledComponents/BasicComponents'

const DialogTitleWithActions = styled(StandardDialogTitle)`
	display: grid;
	grid-template-columns: auto minmax(80px, 1fr) auto;
	background-color:  ${(props) => props.theme.fixedColors.secondaryContrastB};
	color: ${(props) => props.theme.fixedColors.primaryContrastA};
	align-items: center;
`
const ActionContainer = styled.div`
	display: grid;
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
	button {
		padding: 8px;
		font-size: 16px;
		border-radius: 0;
	}
`
const ThemedDialogContent = styled(DialogContent)`
	color: ${(props) => props.theme.themeColors.primaryContrastA};
	background-color:  ${(props) => props.theme.themeColors.primaryContrastB};
`

function StandardDialog (props) {
	const { _setOpen, dialogTitle, leftTitleActions, rightTitleActions, dialogActions, noTitle, dialogSize, children } = props
	const defaultCloseButton = (
		<div 
			style={{ padding: '8px 16px', cursor: 'pointer', display: 'flex', placeItems: 'center' }} 
			onClick={()=>_setOpen(false)}
		>
			<Close />
		</div>)

	const renderActionWithKey = (action, index) => {
		return (
			<ActionContainer key={index}>
				{action}
			</ActionContainer>
		)
	}

	const renderTitleAction = () => {
		if(noTitle)
			return null

		return (
			<DialogTitleWithActions>
				<div>{leftTitleActions ? [defaultCloseButton, ...leftTitleActions].map(renderActionWithKey) : defaultCloseButton}</div>
				<div style={{ width: '100%' }}>{dialogTitle}</div>
				<div>{rightTitleActions?.map(renderActionWithKey)}</div>
			</DialogTitleWithActions>
		)
	}

	return (
		<Dialog
			{...props}
			maxWidth={false}
		>
			{renderTitleAction()}
			<ThemedDialogContent style={{ width: config.dialogContentTypeWidth[dialogSize || 'large'] }}>
				<div style={{ marginTop: '24px' }}>
					{children}
				</div>
			</ThemedDialogContent>
			{
				dialogActions?.map(renderActionWithKey)
			}
		</Dialog>

	)
}

export default StandardDialog