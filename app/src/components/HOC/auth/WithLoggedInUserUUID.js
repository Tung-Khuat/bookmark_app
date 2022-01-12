import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { isLoaded, isEmpty } from 'react-redux-firebase'
import FullViewLoading from '../../loadingIndicators/FullViewLoading'

export default (ComponentToWrap) => {
	class WithLoggedInUserUUID extends Component {
		render() {
			const { auth } = this.props
			if (!isLoaded(auth)) {
				return <FullViewLoading />
			}
			if (isEmpty(auth)) {
				return <ComponentToWrap {...this.props} loggedInUserUUID={null} />
			}
			return <ComponentToWrap {...this.props} loggedInUserUUID={auth.uid} />
		}
	}

	const mapState = ({ firebaseReducer: { auth } }) => ({ auth })

	const mapDispatchToProps = (dispatch) => ({})

	return compose(connect(mapState, mapDispatchToProps))(WithLoggedInUserUUID)
}
