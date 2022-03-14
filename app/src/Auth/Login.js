import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'

import * as appActions from '../state/appState/authState/auth-app-actions'

import { Card, CardActions, Button, TextField, CircularProgress } from '@material-ui/core'
import { AccountCircle, Lock } from '@mui/icons-material'
import HelperTextField from '../components/HelperTextField'
import { StandardTitle, StyledLink } from '../components/styledComponents/BasicComponents'
import WithLoggedInUser from '../components/HOC/auth/WithLoggedInUser'
import { useAuth } from './AuthContext'
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom'


const LoginContainer = styled.div`
	width: 100%;
	min-height: 100vh;
	display: flex;
	align-items: center;
`
const LoginCard = styled(Card)`
	width: 80vw;
	max-width: 500px;
	margin: 0 auto;
	padding: 24px;
`
const LoginActions = styled(CardActions)`
	flex-direction: column;
	padding: 8px 0;
	align-items: unset;
`
const InputFieldContainer = styled.div`
	width: 100%;
	display: grid;
	align-items: center;
	grid-template-columns: 40px 1fr;
	margin-bottom: 16px;
`

function Login(props) {
	const { _persistLoggedInUser, loggedInUser, persistedLoginUser } = props
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [helperText, setHelperText] = useState(null)
	const [processing, setProcessing] = useState(false)
	const { login } = useAuth()
	const navigate = useNavigate()

	useEffect(()=>{
		setHelperText(null)
	},[])

	useEffect(()=>{
		if(loggedInUser && persistedLoginUser && !processing){
			navigate('/')
		}
	},[loggedInUser, persistedLoginUser])

	const inputFields = [
		{
			label: 'Email',
			name: 'email',
			value: email,
			type: 'text',
			_onChange: (email) => setEmail(email),
			icon: <AccountCircle />,
			required: false,
		},
		{
			label: 'Password',
			name: 'password',
			value: password,
			type: 'password',
			_onChange: (password) => setPassword(password),
			icon: <Lock />,
			required: false,
		},
	]

	const renderInputField = (field) => {
		const { label, name, value, icon, type, required, _onChange } = field
		return (
			<InputFieldContainer key={name}>
				{
					icon ? icon : <div/>
				}
				<TextField  
					label={label}
					value={value} 
					onChange={(e) => _onChange(e.target.value)}
					variant="outlined"
					type={type}
					autoComplete="off"
					required={required}
				/>
			</InputFieldContainer>
		)
	}

	const validateForm = () => {
		if(!email) {
			setHelperText("Please enter your account email")
			return false 
		}
		if(!password) {
			setHelperText("Please enter your password")
			return false 
		}
		return true
	}

	const handleSubmit = async () => {
		const valid = validateForm()
		if (!valid)
			return false

		setHelperText('')

		try {
			setProcessing(true)

			await login(email, password)
			const auth = await getAuth();
			const user = auth.currentUser
			_persistLoggedInUser(user)

		} catch (error) {
			setHelperText(error.message)
		}
		setProcessing(false)
	}

	return (
		<LoginContainer>
			<LoginCard>

				<StandardTitle style={{ width: '100%', textAlign: 'center' }}>Login</StandardTitle>
				{ inputFields.map(renderInputField) }

				<LoginActions>
					{ 
						helperText && <HelperTextField helperText={helperText} type={'error'} />								
					}
					<Button 
						fullWidth 
						variant="contained" 
						color="primary" 
						onClick={ !processing ? handleSubmit : ()=>{}}
						style={{ margin: '8px 0' }}
						disabled={processing}
					> { processing ? <CircularProgress /> : 'Login' } </Button>

					<StyledLink to='/reset-password'>Forgot your password?</StyledLink>
					<div>Don't have an account? <StyledLink to='/signup'> Sign up here.</StyledLink></div>
				</LoginActions>

			</LoginCard>
		</LoginContainer>
	)
}

const mapState = ({
	auth: { persistedLoginUser }
}) => ({ 
	persistedLoginUser
 })

const mapDispatchToProps = (dispatch) => ({
	_persistLoggedInUser: bindActionCreators(appActions._persistLoggedInUser, dispatch),
})

export default compose(
	WithLoggedInUser,
	connect(mapState, mapDispatchToProps),
)(Login)