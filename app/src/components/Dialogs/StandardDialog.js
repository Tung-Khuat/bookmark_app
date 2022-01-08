import React, { useState } from 'react'
import styled from 'styled-components'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'
import { Close } from '@mui/icons-material';
import config from './config'
import { StandardDialogTitle } from '../StyledComponents/BasicComponents'

const DialogTitleWithActions = styled(StandardDialogTitle)`
	display: grid;
	grid-template-columns: auto 1fr minmax(auto, 40vw);
	background-color:  #273b6b;
	color: #fff;
	align-items: center;
`

function StandardDialog (props) {
	const { _setOpen, title, leftTitleActions, rightTitleActions, dialogActions, noTitle, children } = props
	const defaultCloseButton = <Button onClick={()=>_setOpen(false)}><Close style={{color: '#fff'}} /></Button>

	const renderTitleAction = () => {
		if(noTitle)
			return null

		return (
			<DialogTitleWithActions>
				<div>{leftTitleActions ? [defaultCloseButton, ...leftTitleActions] : defaultCloseButton}</div>
				<div style={{ width: '100%', margin: '0 16px' }}>{title}</div>
				<div>{rightTitleActions}</div>
			</DialogTitleWithActions>
		)
	}

	return (
		<Dialog
			{...props}
			maxWidth={false}
		>
			{renderTitleAction()}
			<DialogContent style={{ width: config.dialogContentTypeWidth.large }}>
				<div style={{ marginTop: '24px' }}>
					{children}
				</div>
			</DialogContent>
			{
				dialogActions && dialogActions
			}
		</Dialog>

	)
}

export default StandardDialog