import React from 'react'
import Bookmark from './Bookmark'
import { compose } from 'redux'
import { connect } from 'react-redux'

function App(props) {
	const backup = console.error;

	console.error = function filterWarnings(msg) {
		const supressedWarnings = ['Warning: React does not recognize'];

		if (!supressedWarnings.some(entry => msg.includes(entry))) {
			backup.apply(console, arguments);
		}
	}

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