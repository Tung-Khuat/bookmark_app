import React, { Component } from "react"
import { connect } from 'react-redux'
import { compose } from 'redux'

export default (ComponentToWrap) => {
	class WithLoggedInUser extends Component {
		render() {
			const { loggedInUser } = this.props

			return (
				<ComponentToWrap {...this.props} loggedInUser={loggedInUser} />
			)
		}
	}

	const mapState = ({ app: {loggedInUser } }) => ({ loggedInUser })

	const mapDispatchToProps = () => ({})

	return compose(
		connect(mapState, mapDispatchToProps),
	)(WithLoggedInUser)
}
