import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Tabs,
	Tab
} from '../../';
import ShareWebPop from './ShareWebPop';
import ShareWebIframe from './ShareWebIframe';

class ShareWeb extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	render() {

		return (
			<div className='formSectionContainer'>
				<div className='formSection'>
					<Tabs
						default={'pop'}
						className='subTabs'
					>
						<Tab id='pop' label={<span className='stepLabel'>Embed Popup Widget</span>}>
							<ShareWebPop />
						</Tab>
						<Tab id='iframe' label={<span className='stepLabel'>Embed iFrame</span>}>
							<ShareWebIframe />
						</Tab>
					</Tabs>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	return {
	}
}

export default connect(mapStateToProps, {
})(ShareWeb);
