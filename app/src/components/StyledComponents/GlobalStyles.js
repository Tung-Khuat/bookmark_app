import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
	a {
		text-decoration: none;
		color: inherit;
	}
	
	html {
    	scroll-behavior: smooth;
	}

	body {
		color: #242E4C;
		font-family: "Muli", sans-serif;
		background: #fcfcff;
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