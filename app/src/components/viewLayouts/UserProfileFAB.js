
import { Badge } from '@mui/material'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import Avatar from 'react-avatar'
import styled, { keyframes } from 'styled-components'
import UserPersonalizedSettingsDialog from '../../UserPersonalizedSettings/UserPersonalizedSettingsDialog'
import WithLoggedInUser from '../HOC/auth/WithLoggedInUser'
import { AccountCircle } from '@mui/icons-material'

const pulse = keyframes`
	0% {
		transform: translate(-18px, 5px) scale(0.7);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
	}

	70% {
		transform: translate(-18px, 5px) scale(0.75);
		box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
	}

	100% {
		transform: translate(-18px, 5px) scale(0.7);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	}
`


const PulsingBadge = styled(Badge)`
	.MuiBadge-badge {
		display: ${({badgeContent}) => !badgeContent ? 'none' : undefined};
		transform: translate(-18px, 5px) scale(0.75);
		pointer-events: none;
		user-select: none;
		border-color: rgba(255, 255, 255, 1);
		border-style: solid;
		border-width: 1px;
	
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
		animation: ${pulse} 2s infinite;
	}
`
const BadgeContainer = styled.div`
	width: 48px;
	position: fixed;
	z-index: 9;
	top: 8px;
	right: 12px;
`
const AvatarContainer = styled.div`
	width: 48px;
	height: 48px;
	cursor: pointer;
	padding: 8px;
	user-select: 'none';
`

function UserProfileFAB({loggedInUser}) {
	const [personalizeDialogOpen, setPersonalizeDialogOpen] = useState(false)
	const notificationCount = 0 //TODO: add notifications/mentions

	return (
		<>
			<BadgeContainer>
				<PulsingBadge
					badgeContent={notificationCount}
					color='primary'
					showZero={false}
				>
					<AvatarContainer
						onClick={() => {
							// if (!isDesktop) {
							// 	_setNavDrawerVisible(false)
							// }
							setPersonalizeDialogOpen(true)
						}}
					>
						{
							loggedInUser & loggedInUser.displayName ? (
								<Avatar name={loggedInUser.displayName} size={32} round />
							) : <AccountCircle style={{fontSize: 36}}/>
						}
					</AvatarContainer>
				</PulsingBadge>
			</BadgeContainer>
			{
				personalizeDialogOpen && (
					<UserPersonalizedSettingsDialog open={personalizeDialogOpen} _setOpen={setPersonalizeDialogOpen}/>
				)
			}
		</>
	)
}

const mapStateToProps = ({
	firestoreReducer: { ordered }
}) => ({
	ordered
})

export default compose(
	WithLoggedInUser,
	connect(mapStateToProps)
)(UserProfileFAB)