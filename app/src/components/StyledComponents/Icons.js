import React from 'react'
import styled from 'styled-components'
import { Icon } from '@mui/material'

const Base = styled(Icon)`
	color: ${(props) => props.theme.themeColors.primaryContrastA};
	margin-inline: 8px;
`
const LinkIcon = styled(Base)`
	color: ${(props) => props.theme.themeColors.highlight};
	cursor: pointer;
	&:hover {
		opacity: 0.9
	}
`
const InvertColorIcon = styled(Base)`
	color: ${(props) => props.theme.themeColors.PrimaryContrastB};
`


export const ThemeIcon = (props) => {

	if (props.linkColor) {
		return <LinkIcon {...props}>{props.children}</LinkIcon>
	}

	if (props.invertColor) {
		return <InvertColorIcon {...props}>{props.children}</InvertColorIcon>
	}

	return <Base {...props}>{props.children}</Base>
}
