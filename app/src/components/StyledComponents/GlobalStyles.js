import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
	a {
		text-decoration: none;
		color: inherit;
	}
	
	html {
    	scroll-behavior: smooth;
	}

	* {
		margin: 0; 
		padding: 0;
		&:focus, &:visited {
			outline: none;
		}
	}
`
export default GlobalStyles;