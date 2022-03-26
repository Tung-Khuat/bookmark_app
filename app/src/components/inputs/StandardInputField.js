import React from 'react'
import styled from 'styled-components'
import { TextField } from '@mui/material'

const maxLength = 250

const StyledInputField = styled(TextField)`
	width: 100%;
	margin-bottom: 16px;
`

export default function StandardInputField(props) {
	const { label, inputMaxLength, variant } = props
	return (
		<StyledInputField
			{...props}
			autoComplete='off'
			label={ label || 'Unlabeled' } 
			variant={ variant || "outlined" }
			inputProps={{ maxLength: inputMaxLength || maxLength }}
		/>
	)
}