import React, { useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { Card, CardActions, Button, TextField, CircularProgress } from '@mui/material'
import { useAuth } from './AuthContext'
import HelperTextField from '../components/HelperTextField'
import { StandardTitle, StyledLink } from '../components/styledComponents/BasicComponents'
import { AccountCircle } from '@mui/icons-material'


const ResetPasswordContainer = styled.div`
	width: 100%;
	min-height: 100vh;
	display: flex;
	align-items: center;
`
const ResetPasswordCard = styled(Card)`
	width: 80vw;
	max-width: 500px;
	margin: 0 auto;
	padding: 24px;
`
const ResetPasswordActions = styled(CardActions)`
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

function ResetPassword() {
	const [email, setEmail] = useState('')
	const [errorText, setErrorText] = useState(null)
	const [successText, setSuccessText] = useState(null)
	const [processing, setProcessing] = useState(false)
	const { resetPassword } = useAuth()

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

	const renderHelperText = () => {
		if(successText) {
			return <HelperTextField helperText={successText} type={'success'} /> 
		} else if (errorText) {
			return <HelperTextField helperText={errorText} type={'error'} />
		}
	}
	const validateForm = () => {
		if(!email) {
			setErrorText("Please enter your account email")
			return false 
		}
		return true
	}

	const handleSubmit = async () => {
		const valid = validateForm()
		if (!valid)
			return false

		setErrorText('')
		setSuccessText('')

		try {
			setProcessing(true)
			await resetPassword(email)
			setSuccessText('Your password has successfully been reset. Please check your inbox for further instructions.')
		} catch (error) {
			setErrorText('Failed to reset password. ' + error.message)
		}
		setProcessing(false)
	}

	return (
		<ResetPasswordContainer>
			<ResetPasswordCard>

				<StandardTitle style={{ width: '100%', textAlign: 'center' }}>Password Reset</StandardTitle>
				{ inputFields.map(renderInputField) }

				<ResetPasswordActions>
					{ renderHelperText() }
					<Button 
						fullWidth 
						variant="contained" 
						color="primary" 
						onClick={ !processing && handleSubmit}
						style={{ margin: '8px 0' }}
						disabled={processing}
					> { processing ? <CircularProgress /> : 'Reset Password' } </Button>

					<StyledLink to='/login'> Back to login.</StyledLink>
				</ResetPasswordActions>

			</ResetPasswordCard>
		</ResetPasswordContainer>
	)
}

const mapDispatchToProps = (dispatch) => ({
})

export default compose(
	connect(null, mapDispatchToProps),
)(ResetPassword)