import styled, { keyframes } from 'styled-components'
import { DialogTitle } from '@mui/material'
import { Link } from 'react-router-dom'
import StandardInputField from '../inputs/StandardInputField'
import { CircularProgress } from '@mui/material'
import { getThemeFontColor } from './Buttons'

export const StandardDialogTitle = styled(DialogTitle)`
	background-color: ${(props) => props.theme.primary};
	padding: 12px 4px;
`
export const FullWidthCenteredContent = styled.div`
	width: 100%;
	display: grid;
	place-items: center;
`
export const DividedListItem = styled.div`
	border-bottom: 1px solid ${props => props.theme.lightGrey};
	&:last-child {
		border-bottom: none;
	}
`
export const NoWrapTextSpan = styled.span`
	max-width: ${({maxWidth})=> maxWidth ? maxWidth : "100%"};
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`
export const StandardDialogContent = styled.section`
	padding: 24px;
	.md-panel-header {
		padding: 0;
	}
`
export const StandardTitle = styled.p`
	font-size: 2em;
	color: ${(props) => props.color ? props.color : props.theme.themeColors.primaryContrastB};
	margin-bottom: 16px;
`
export const StandardLabel = styled.p`
	font-size: 16.8px;
	color: rgba(0,0,0,0.6);
`
export const Subtext = styled.span`
	font-size: 0.7em;
	color: ${(props) => props.color ? props.color : props.theme.themeColors.primaryContrastB} + '4c';
`
export const StyledAnchor = styled.a`
	cursor: pointer;
	color: ${(props) => props.theme.linkColor};
`
export const StyledLink = styled(Link)`
	cursor: pointer;
	color: ${(props) => props.theme.linkColor};
`
export const LoginStyleInputField = styled(StandardInputField)`
	margin: 0;
	color: rgba(0, 0, 0, 0.87) !important;
	input, label {
		color: rgba(0, 0, 0, 0.87) !important;
		&:focus {
			color: rgba(0, 0, 0, 0.87) !important;
		}
	}
`
export const ThemedCircularProgress = styled(CircularProgress)`
	color: ${(props) => props.highlightText ? getThemeFontColor(props) : props.theme.fixedColors?.primaryContrastB};
`
const slideIn = keyframes`
	from {
		margin-top: 100%;
		height: 300%; 
	}

	to {
		margin-top: 0%;
		height: 100%;
	}
`
export const SlideInField = styled.div`
  	animation: ${slideIn} 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
`