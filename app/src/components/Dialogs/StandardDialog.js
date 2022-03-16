import React from 'react'
import styled from 'styled-components'
import { Dialog, DialogContent } from '@mui/material'
import { Close } from '@mui/icons-material';
import config from './config'
import { StandardDialogTitle } from '../styledComponents/BasicComponents'

const DialogTitleWithActions = styled(StandardDialogTitle)`
	display: grid;
	grid-template-columns: auto minmax(80px, 1fr) auto;
	background-color:  #273b6b;
	color: #fff;
	align-items: center;
`
const ActionContainer = styled.div`
	display: grid;
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
`

function StandardDialog (props) {
	const { _setOpen, dialogTitle, leftTitleActions, rightTitleActions, dialogActions, noTitle, dialogSize, children } = props
	const defaultCloseButton = (
		<div 
			style={{ padding: '8px 16px', cursor: 'pointer', display: 'flex', placeItems: 'center' }} 
			onClick={()=>_setOpen(false)}
		>
			<Close style={{color: '#fff'}} />
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
			<DialogContent style={{ width: config.dialogContentTypeWidth[dialogSize || 'large'] }}>
				<div style={{ marginTop: '24px' }}>
					{children}
				</div>
			</DialogContent>
			{
				dialogActions?.map(renderActionWithKey)
			}
		</Dialog>

	)
}

export default StandardDialog