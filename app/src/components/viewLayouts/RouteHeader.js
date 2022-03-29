import React from 'react'
import styled from 'styled-components'
import { Subtext } from '../styledComponents/BasicComponents'

const Container = styled.div`
	width: 100%;
	padding: 8px 0 16px;
	position: sticky;
    top: 0;
    background: ${props => props.theme.fixedColors.secondaryContrastB};
    color: ${props => props.theme.fixedColors.primaryContrastA};
    z-index: 20;
`
const HeaderSection = styled.div`
	margin: 0 32px;
	div {
		font-weight: 400;
    	font-size: 1.5em;
	}
`

export default function RouteHeader ({ header,  subheader }) {

	return (
		<Container>
			<HeaderSection>
				<div>{header}</div>
				<Subtext>{subheader}</Subtext>
			</HeaderSection>
		</Container>
	)
}