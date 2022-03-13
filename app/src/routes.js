import React, { lazy } from 'react'

const Bookmark = lazy(() => import("./Bookmark"))
const Login = lazy(() => import("./auth/Login"))
const ResetPassword = lazy(() => import("./auth/ResetPassword"))
const Signup = lazy(() => import("./auth/Signup"))


const routes = [
		// Auth 
		{
			title: 'Sign Up',
			component: <Signup />,
			path: '/signup',
			category: 'auth',
			disabled: false,
			public: true,
		},
		{
			title: 'Login',
			component: <Login />,
			path: '/login',
			category: 'auth',
			disabled: false,
			public: true,
		},
		{
			title: 'Reset Password',
			component: <ResetPassword />,
			path: '/reset-password',
			category: 'auth',
			disabled: false,
			public: true,
		},

		// Dashboard
		{
			title: 'Dashboard',
			component: <Bookmark />,
			path: '/',
			category: 'dashboard',
			disabled: false,
			public: false,
			exact: true,
			feature: 'dashboard'
		},

		//Bookmark
		{
			title: 'Bookmark',
			component: <Bookmark />,
			path: '/bookmark',
			category: 'bookmark',
			disabled: false,
			public: false,
			feature: 'bookmark'
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