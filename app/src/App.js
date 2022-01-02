import Bookmark from './Bookmark'
import { compose } from 'redux'
import { connect } from 'react-redux'

function App(props) {
	console.log(props)
	return (
		<div className="App">
			<Bookmark />
		</div>
	);
}

const mapState = ({
}) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

export default compose(
	connect(mapState, mapDispatchToProps)
)(App)