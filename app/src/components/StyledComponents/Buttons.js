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
const Transparent = styled(Base)`
	background: transparent;
	&:hover {
		background: ${(props) => props.theme.themeColors.primaryContrastB + 'd4'};
	}
`
const Flat = styled(Base)`
`
const Disabled = styled(Base)`
	color: ${(props) => props.theme.themeColors.primaryContrastA + '4c'} !important;
	border-color: ${(props) => props.theme.themeColors.primaryContrastA + '4c'} !important;
`
const Contained = styled(Base)`
	background: ${(props) => props.theme.themeColors.neutral};
	color: ${(props) => props.theme.fixedColors.primaryContrastB};
	&:hover {
		background: ${(props) => props.theme.themeColors.neutral};
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

	if (props.disabled) {
		return <Disabled {...props}>{props.children}</Disabled>
	}

	if (props.variant === 'contained') {
		return <Contained {...props}>{props.children}</Contained>
	}

	if (props.variant === 'outlined') {
		return <Outlined {...props}>{props.children}</Outlined>
	}

	if (props.transparentBg) {
		return <Transparent {...props}>{props.children}</Transparent>
	}

	return <Flat {...props}>{props.children}</Flat>
}
