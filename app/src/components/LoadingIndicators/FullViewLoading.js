import React from 'react'
import styled from 'styled-components'
import { ThemedCircularProgress } from '../styledComponents/BasicComponents'

const LoadingContainer = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
`

export default function FullViewLoading() {
	return (
		<LoadingContainer>
			<ThemedCircularProgress />
		</LoadingContainer>
	)
}
