import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { Card, CardActions, CircularProgress } from '@material-ui/core'
import { AccountCircle, Lock } from '@mui/icons-material'
import { LoginStyleInputField, StandardTitle, StyledLink } from '../components/styledComponents/BasicComponents'

import * as authActions from '../state/firebaseActions/auth-actions'
import * as appActions from '../state/appState/authState/auth-app-actions'

import { useAuth } from './AuthContext'
import { getAuth } from "firebase/auth";
import { withSnackbar } from 'notistack'
import HelperTextField from '../components/HelperTextField'
import { useNavigate } from 'react-router-dom'
import { ThemeButton } from '../components/styledComponents/Buttons'

const SignupContainer = styled.div`
	width: 100%;
	min-height: 100vh;
	display: flex;
	align-items: center;
`
const SignupCard = styled(Card)`
	width: 80vw;
	max-width: 500px;
	margin: 0 auto;
	padding: 24px;
`
const SignupActions = styled(CardActions)`
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

function Signup(props) {
	const { enqueueSnackbar, _createUser, _persistLoggedInUser } = props
	const [email, setEmail] = useState()
	const [password, setPassword] = useState()
	const [passwordConfirmation, setPasswordConfirmation] = useState()
	const [helperText, setHelperText] = useState(null)
	const [processing, setProcessing] = useState(false)
	const { signup, login } = useAuth()
	const navigate = useNavigate()

	useEffect(()=>{
		setHelperText(null)
	},[])

	const inputFields = [
		{
			label: 'Email',
			name: 'email',
			value: email,
			type: 'text',
			_onChange: (email) => setEmail(email),
			icon: <AccountCircle />,
			required: true,
		},
		{
			label: 'Password',
			name: 'password',
			value: password,
			type: 'password',
			_onChange: (password) => setPassword(password),
			icon: <Lock />,
			required: true,
		},
		{
			label: 'Password Confirmation',
			name: 'passwordConfirmation',
			value: passwordConfirmation,
			type: 'password',
			_onChange: (password) => setPasswordConfirmation(password),
			required: true,
		},
	]

	const renderInputField = (field) => {
		const { label, name, value, icon, type, required, _onChange } = field
		return (
			<InputFieldContainer key={name}>
				{
					icon ? icon : <div/>
				}
				<LoginStyleInputField  
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
			setHelperText("Please enter a valid email")
			return false 
		}
		if(!password) {
			setHelperText("Please enter a valid password")
			return false 
		}
		if(password !== passwordConfirmation) {
			setHelperText("Password confirmation does not match given password.")
			return false 
		}
		return true
	}

	const handleSubmit = async () => {
		const valid = validateForm()
		if (!valid)
			return false

		try {
			setProcessing(true)
			await signup(email, password)
			enqueueSnackbar('Successfully signed up.', { variant: "success" })
			try {
				await login(email, password)
				const auth = await getAuth();
				const user = auth.currentUser
				if(user){
					const  result = await _createUser(user)
					_persistLoggedInUser(user)
					if(result)
						navigate('/')
				}
			} catch (error) {
				console.log(error)
				enqueueSnackbar('Failed to login.', { variant: "error" })
			}

		} catch (error) {
			setHelperText('Failed to sign up. ' + error.message)
		}
		setProcessing(false)
	}

	return (
		<SignupContainer>
			<SignupCard>

				<StandardTitle color={'rgba(0, 0, 0, 0.87)'} style={{ width: '100%', textAlign: 'center' }}>Sign Up</StandardTitle>
				{ inputFields.map(renderInputField) }

				<SignupActions>
					{ 
						helperText && <HelperTextField helperText={helperText} type={'error'} />								
					}
					<ThemeButton
						fullWidth 
						variant="contained" 
						highlight 
						onClick={ !processing && handleSubmit}
						style={{ margin: '8px 0' }}
						disabled={processing}
					> { processing ? <CircularProgress size={24} /> : 'Sign Up' } </ThemeButton>

					<div>Already signed up? <StyledLink to='/login'> Login to your existing account</StyledLink> </div>
				</SignupActions>

			</SignupCard>
		</SignupContainer>
	)
}

const mapDispatchToProps = (dispatch) => ({
	_createUser: bindActionCreators(authActions._createUser,dispatch),
	_persistLoggedInUser: bindActionCreators(appActions._persistLoggedInUser, dispatch),
})

export default compose(
	withSnackbar,
	connect(null, mapDispatchToProps),
)(Signup)