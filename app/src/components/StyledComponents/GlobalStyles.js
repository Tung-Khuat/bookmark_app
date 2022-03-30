import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
	a {
		text-decoration: none;
		color: ${props => props.theme.themeColors.highlight};
	}
	
	html {
    	scroll-behavior: smooth;
	}

	body {
		/* color: #242E4C; */
		color: ${props => props.theme.fontColor};
		font-family: "Muli", sans-serif;
		background: ${props => props.theme.backgroundColor};
	}

	* {
		margin: 0; 
		padding: 0;
		&:focus, &:visited {
			outline: none;
		}
	}

	// Custom scroll bar
	::-webkit-scrollbar {
		width: 12px;
		height: 12px;
	}
	::-webkit-scrollbar-track {
		&:hover {
			background: ${props => props.theme.fixedColors.secondaryContrastA};
		}
	}
	::-webkit-scrollbar-thumb {
		background: ${props => props.theme.fixedColors.secondaryContrastB + 'd4'};
		border: 2px solid rgba(0, 0, 0, 0);
		background-clip: padding-box;
		border-radius: 8px;
		&:hover {
			opacity: 0.7;
		}
	}

	//MUI styles 

	// Inputs and TextFields
	input, label, .Mui-focused, .MuiOutlinedInput-input, .MuiInputLabel-root {
		color: ${props => props.theme.themeColors.primaryContrastA} !important;
		&:focus {
			color: ${props => props.theme.themeColors.primaryContrastA} !important;
		}
	}
	fieldset {
		border-color: ${props => props.theme.themeColors.primaryContrastA} !important;
		&:focus {
			border-color: ${props => props.theme.themeColors.primaryContrastA} !important;
		}
	}

	&:hover fieldset {
		border-color: ${props => props.theme.themeColors.secondaryContrastA} !important;
	}

	.Mui-focused fieldset{
		border-color: ${props => props.theme.themeColors.highlight} !important;
	}

	// Checkbox
	.Mui-checked{
		color: ${props => props.theme.themeColors.highlight} !important;
	}
`
export default GlobalStyles;