import React from 'react'
import styled from 'styled-components'
import { CircularProgress } from '@material-ui/core'

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
			<CircularProgress />
		</LoadingContainer>
	)
}
