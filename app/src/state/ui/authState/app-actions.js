export const _persistLoggedInUser = (user) => ({
	type: 'PERSIST_LOGGED_IN_USER',
	user: user,
})

export const _logout = () => ({
	type: 'LOGOUT',
})