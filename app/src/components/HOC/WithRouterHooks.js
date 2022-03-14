import React from 'react'
import {
	useParams,
	useLocation,
	useSearchParams,
	useNavigate
} from "react-router-dom";

function WithRouterHooks(ComponentToWrap) {
	const ComponentWithRouterProps = (props) => {
	  const location = useLocation();
	  const navigate = useNavigate();
	  const params = useParams();
	  const [searchParams, setSearchParams] = useSearchParams()
	  const allParams = params['*']
	  let paramList = []
	  if (allParams) {
		paramList = allParams.split('/')
	  }
	  return (
		<ComponentToWrap
			{...props}
			router={{ location, navigate, params, searchParams, setSearchParams }}
			paramList={paramList}
		/>
	  );
	}
  
	return ComponentWithRouterProps;
}
  
export default WithRouterHooks
