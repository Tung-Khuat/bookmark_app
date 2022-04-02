import React from 'react'
import styled from 'styled-components'
import { Button } from '@mui/material'

const Base = styled(Button)`
	color: ${(props) => props.color ? props.color : getThemeFontColor(props)};
	background: ${(props) => props.bgColor ? props.bgColor : getThemeBackgroundColor(props)};
	&:hover {
		opacity: 0.9;
	}
`
const Transparent = styled(Base)`
	background: transparent !important;
	color: ${(props) => props.color ? props.color : getThemeFontColor(props)};
	&:hover {
		color: ${(props) => props.theme.themeColors.highlight};
	}
`
const Flat = styled(Base)`
	color: ${(props) => props.color ? props.color : getThemeFontColor(props)};
	&:hover {
		color: ${(props) => props.theme.themeColors.highlight};
	}
`
const Disabled = styled(Base)`
	color: ${(props) => props.theme.themeColors.primaryContrastA + '4c'} !important;
	border-color: ${(props) => props.theme.themeColors.primaryContrastA + '4c'} !important;
`
const Contained = styled(Base)`
	background: ${(props) => props.bgColor ? props.bgColor : getThemeBackgroundColor(props)};
	color: ${(props) => props.highlightText ? getThemeFontColor(props) : props.theme.fixedColors.primaryContrastB};
	&:hover {
		background: ${(props) => props.theme.themeColors.highlight};
		color: ${(props) => props.theme.fixedColors.primaryContrastB};
	}
`
const Outlined = styled(Base)`
	border: 1px solid ${(props) => props.color ? props.color : getThemeFontColor(props)};
	color: ${(props) => props.color ? props.color : getThemeFontColor(props)};
	&:hover {
		border: 1px solid ${(props) => props.color ? props.color : getThemeFontColor(props)};
	}
`
const getThemeBackgroundColor = (props) => {
	if (props.primary) return props.theme.primary
	if (props.secondary) return props.theme.secondary
	if (props.neutral) return props.theme.themeColors.neutral
	if (props.highlight) return props.theme.themeColors.highlight
	if (props.destructive) return props.variant === "raised" ? props.theme.destructive : 'transparent'

	return props.theme.themeColors.primaryContrastB ||' #111111'
}
const getThemeFontColor = (props) => {
	if (props.primary) return props.theme.primary
	if (props.secondary) return props.theme.secondary
	if (props.neutral) return props.theme.themeColors.primaryContrastA
	if (props.highlightText) return props.theme.themeColors.highlight
	if (props.highlight) return props.theme.themeColors.primaryContrastA
	if (props.destructive) return props.variant === "raised" ? ' #fff' : props.theme.destructive

	return props.theme.themeColors.primaryContrastA || ' #fff'
}

export const ThemeButton = (props) => {

	if (props.disabled) {
		return <Disabled {...props}>{props.children}</Disabled>
	}

	if (props.variant === "raised") {
		return <Contained {...props}>{props.children}</Contained>
	}

	if (props.variant === "outlined") {
		return <Outlined {...props}>{props.children}</Outlined>
	}

	if (props.transparentBg) {
		return <Transparent {...props}>{props.children}</Transparent>
	}

	return <Outlined {...props}>{props.children}</Outlined>
}
