import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const FieldContainer = styled.div`
	padding: 24px;
	background-color: ${({bgColor}) => bgColor ? bgColor : 'transparent'};
	color: ${({textColor}) => textColor ? textColor : '#000'};
	border-radius: 4px;
	font-size: 1.1em;
`

export default function HelperTextField ({ helperText,  type }) {
	const [currentFieldType, setCurrentFieldType] = useState(null)

	useEffect(()=>{
		const fieldType = checkType()
		setCurrentFieldType(fieldType)
	},[type])

	const FieldTypes = {
		success: {
			color: '#00521a',
			bgColor: '#12a50861',
		},
		error: {
			color: '#960101',
			bgColor: '#ff46464d',
		},
		default: {
			color: '#000',
			bgColor: '#a9a9a973',
		},
	}

	const checkType = () => {
		if(type === 'success')
			return FieldTypes.success

		if(type === 'error')
			return FieldTypes.error

		return FieldTypes.default
	}

	if(!currentFieldType)
		return <div/>

	return (
		<FieldContainer bgColor={currentFieldType.bgColor} textColor={currentFieldType.color}>
			{helperText}
		</FieldContainer>
	)
}