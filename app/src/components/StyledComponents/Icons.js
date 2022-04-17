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
	color: ${(props) => props.theme.themeColors.primaryContrastB};
`

const StaticThemeAIcon = styled(Base)`
	color: ${(props) => props.theme.fixedColors.primaryContrastA};
`
const StaticThemeBIcon = styled(Base)`
	color: ${(props) => props.theme.fixedColors.primaryContrastB};
`


export const ThemeIcon = (props) => {

	if (props.linkColor) {
		return <LinkIcon {...props}>{props.children}</LinkIcon>
	}

	if (props.staticThemeA) {
		return <StaticThemeAIcon {...props}>{props.children}</StaticThemeAIcon>
	}

	if (props.staticThemeB) {
		return <StaticThemeBIcon {...props}>{props.children}</StaticThemeBIcon>
	}

	if (props.invertColor) {
		return <InvertColorIcon {...props}>{props.children}</InvertColorIcon>
	}

	return <Base {...props}>{props.children}</Base>
}
