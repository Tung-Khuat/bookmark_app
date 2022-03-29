import React from 'react'
import styled from 'styled-components'
import { Button } from '@mui/material'

const Base = styled(Button)`
	color: ${(props) => props.theme.themeColors.primaryContrastA};
	background: ${(props) => props.theme.themeColors.primaryContrastB};
	&:hover {
		background: ${(props) => props.theme.themeColors.primaryContrastB};
		opacity: 0.9;
	}
`
const Flat = styled(Base)`
`
const Raised = styled(Base)`
	background: ${(props) => props.theme.themeColors.highlight};
	color: ${(props) => props.theme.themeColors.primaryContrastB};
	&:hover {
		background: ${(props) => props.theme.themeColors.highlight};
		opacity: 0.9;
	}
`
const Outlined = styled(Base)`
	border: 1px solid ${(props) => props.theme.themeColors.primaryContrastA};
	color: ${(props) => props.theme.themeColors.primaryContrastA};
	&:hover {
		opacity: 0.9;
		border: 1px solid ${(props) => props.theme.themeColors.primaryContrastA};
	}
`

export const ThemeButton = (props) => {

	if (props.variant === 'contained') {
		return <Raised {...props}>{props.children}</Raised>
	}

	if (props.variant === 'outlined') {
		return <Outlined {...props}>{props.children}</Outlined>
	}

	return <Flat {...props}>{props.children}</Flat>
}
