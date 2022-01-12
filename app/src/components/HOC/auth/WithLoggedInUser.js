import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, isEmpty } from 'react-redux-firebase'
import WithLoggedInUserUUID from './WithLoggedInUserUUID'

export default (ComponentToWrap) => {
	class WithLoggedInUser extends Component {
		render() {
			const { user, storedUser } = this.props
			const users = user

			// Don't check isLoaded by design, because unauthenticated users can't load
			if (isEmpty(users) || !storedUser) {
				return <ComponentToWrap {...this.props} loggedInUser={null} />
			}
			
			return <ComponentToWrap {...this.props} loggedInUser={users[0]} />
		}
	}

	const mapState = ({
		firestoreReducer: {
			ordered: { user },
		},
		auth: { persistedLoginUser }
	}) => ({ 
		user,
		storedUser: persistedLoginUser
	 })

	const mapDispatchToProps = (dispatch) => ({})

	return compose(
		WithLoggedInUserUUID,
		firestoreConnect(({ loggedInUserUUID }) => {
			if (!loggedInUserUUID) {
				return []
			}
			return [
				{
					collection: 'user',
					where: [['uid', '==', loggedInUserUUID || '']],
					limit: 1,
				},
			]
		}),
		connect(mapState, mapDispatchToProps),
	)(WithLoggedInUser)
}
