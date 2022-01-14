import React, { Component } from 'react'
import queryString from 'query-string'
import { connect } from 'react-redux'
import { compose } from 'redux'

export default (ComponentToWrap) => {
	class QueryParamsComponent extends Component {
		render() {
			if (!this.props.router || !this.props.router.location) {
				return (
					<ComponentToWrap {...this.props} queryParams={{}} hashParams={{}} />
				)
			}
			const sanitizedQueryString = this.props.router.location.search.replace(
				'?',
				'',
			)
			const parsedSearch = queryString.parse(sanitizedQueryString)
			const hashes = this.props.router.location.hash.split('#')
			const parsedHash = {}
			hashes.forEach((el) => {
				const sanitized = el.replace('#', '')
				parsedHash[sanitized] = true
			})
			return (
				<ComponentToWrap
					{...this.props}
					queryParams={parsedSearch}
					hashParams={parsedHash}
				/>
			)
		}
	}

	const mapState = ({ router }) => ({ router })

	const mapDispatchToProps = (dispatch) => ({})

	return compose(connect(mapState, mapDispatchToProps))(QueryParamsComponent)
}
