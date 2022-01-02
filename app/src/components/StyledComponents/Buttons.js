import styled from 'styled-components'
import {
  Button,
} from 'react-md'

export const DestructiveButton = styled(Button)`
	color: ${(props) => props.color ? props.color : props.theme.destructive};
`
export const PrimaryButton = styled(Button)`
	${(props) => props.flat ? 'color: var(--color-primary);' : ''}
	${(props) => !props.flat ? 'background: var(--color-primary);' : ''}
`

export const SecondaryButton = styled(Button)`
	${(props) => props.flat ? 'color: var(--color-secondary);' : ''}
	${(props) => !props.flat ? 'background: var(--color-secondary);' : ''}
`