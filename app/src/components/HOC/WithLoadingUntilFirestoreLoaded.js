import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { isLoaded } from 'react-redux-firebase'
import { ThemedCircularProgress } from '../styledComponents/BasicComponents'

const LoadingStateContainer = styled.div`
	width: 100vw;
	height: 100vh;
	display: grid;
	place-items: center;
	position: fixed;
	top: 0;
	background-color: #6a6a6a73;
	z-index: 10;
`

export default ({storeAs, hideLoading, uuidProp}) => (ComponentToWrap) => {
	class WithLoadingUntilFirestoreLoaded extends Component {
		render() {
			const {
				firestoreReducer: { ordered },
			} = this.props
			if (
				this.props.firestoreReducer.errors &&
				this.props.firestoreReducer.errors.allIds &&
				this.props.firestoreReducer.errors.allIds.length > 0
			) {
				console.error(this.props.firestoreReducer)
			}
			if (!ordered) {
				return hideLoading ? null : <LoadingStateContainer><ThemedCircularProgress /></LoadingStateContainer>
			}

			if (uuidProp) {
				if (!isLoaded(ordered[storeAs + this.props[uuidProp]])) {
					return hideLoading ? null : <LoadingStateContainer><ThemedCircularProgress /></LoadingStateContainer>
				}
			} else {
				if (!isLoaded(ordered[storeAs])) {
					return hideLoading ? null : <LoadingStateContainer><ThemedCircularProgress /></LoadingStateContainer>
				}
			}

			return <ComponentToWrap {...this.props} />
		}
	}

	const mapState = ({ firestoreReducer }) => ({
		firestoreReducer,
	})

	const mapDispatchToProps = (dispatch) => ({})

	return compose(connect(mapState, mapDispatchToProps))(
		WithLoadingUntilFirestoreLoaded,
	)
}
