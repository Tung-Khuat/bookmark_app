import React from 'react'
import { compose } from 'redux'
import WithRouterHooks from './WithRouterHooks'

function WithDirectoryParentUUID(ComponentToWrap) {
	const ComponentWithProps = (props) => {
		const { paramList } = props
		let directoryUUID = null
		let parentUUID = null
		if(paramList && paramList.length !== 0){
			const FilteredParamList = paramList.filter(t=>t)
			directoryUUID = FilteredParamList[FilteredParamList.length - 1] 
			if(FilteredParamList.length > 1 && FilteredParamList[FilteredParamList.length - 2]) {
				parentUUID = FilteredParamList[FilteredParamList.length - 2] 
			}
		}
		return (
			<ComponentToWrap
				{...props}
				directoryUUID={directoryUUID}
				directoryParentUUID={parentUUID}
			/>
		);
	}
  
	return compose(WithRouterHooks)(ComponentWithProps);
}
  
export default WithDirectoryParentUUID
