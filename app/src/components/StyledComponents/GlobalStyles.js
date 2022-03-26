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

	// Custom scroll bar
	::-webkit-scrollbar {
		width: 12px;
		height: 12px;
	}
	::-webkit-scrollbar-track {
		&:hover {
			opacity: 0.2;
			background:  #e8e8e8;
		}
	}
	::-webkit-scrollbar-thumb {
		background:  #14141475;
		border: 2px solid rgba(0, 0, 0, 0);
		background-clip: padding-box;
		border-radius: 8px;
		&:hover {
			opacity: 0.7;
		}
	}

`
export default GlobalStyles;