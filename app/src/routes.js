import Bookmark from "./Bookmark"
import Login from "./Auth/Login"
// import ResetPassword from "./ResetPassword"
import Signup from "./Auth/Signup"

const routes = [
		// Auth 
		{
			title: 'Sign Up',
			component: Signup,
			path: '/signup',
			category: 'auth',
			disabled: false,
			public: true,
		},
		{
			title: 'Login',
			component: Login,
			path: '/login',
			category: 'auth',
			disabled: false,
			public: true,
		},
		// {
		// 	title: 'Reset Password',
		// 	component: ResetPassword,
		// 	path: '/reset-password',
		// 	category: 'auth',
		// 	disabled: false,
		// 	public: true,
		// },

		// Dashboard
		{
			title: 'Dashboard',
			component: Bookmark,
			path: '/',
			category: 'dashboard',
			disabled: false,
			public: false,
			exact: true,
			feature: 'dashboard'
		},
		// {
		// 	title: 'Dashboard2',
		// 	component: Dashboard,
		// 	path: '/d2',
		// 	category: 'dashboard',
		// 	disabled: false,
		// 	public: false,
		// 	exact: true,
		// },
]

export default routes