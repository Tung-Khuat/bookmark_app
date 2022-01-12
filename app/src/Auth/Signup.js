import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { useHistory } from 'react-router-dom'

import { Card, CardActions, Button, TextField, CircularProgress } from '@material-ui/core'
import { useAuth } from './AuthContext'

import { withSnackbar } from 'notistack'
import HelperTextField from '../components/HelperTextField'
import { StandardTitle, StyledLink } from '../components/styledComponents/BasicComponents'
import { AccountCircle, Lock } from '@mui/icons-material'

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
	const { enqueueSnackbar } = props
	const [email, setEmail] = useState()
	const [password, setPassword] = useState()
	const [passwordConfirmation, setPasswordConfirmation] = useState()
	const [helperText, setHelperText] = useState(null)
	const [processing, setProcessing] = useState(false)
	const { signup } = useAuth()
	const history = useHistory()

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

			history.push('/login')
			enqueueSnackbar('Successfully signed up.', { variant: "success" })
		} catch (error) {
			setHelperText('Failed to sign up. ' + error.message)
		}
		setProcessing(false)
	}

	return (
		<SignupContainer>
			<SignupCard>

				<StandardTitle style={{ width: '100%', textAlign: 'center' }}>Sign Up</StandardTitle>
				{ inputFields.map(renderInputField) }

				<SignupActions>
					{ 
						helperText && <HelperTextField helperText={helperText} type={'error'} />								
					}
					<Button 
						fullWidth 
						variant="contained" 
						color="primary" 
						onClick={ !processing && handleSubmit}
						style={{ margin: '8px 0' }}
						disabled={processing}
					> { processing ? <CircularProgress /> : 'Sign Up' } </Button>

					<div>Already signed up? <StyledLink to='/login'> Login to your existing account</StyledLink> </div>
				</SignupActions>

			</SignupCard>
		</SignupContainer>
	)
}

const mapState = ({
}) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

export default compose(
	withSnackbar,
	connect(mapState, mapDispatchToProps),
)(Signup)