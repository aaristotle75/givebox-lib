import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	CodeBlock
} from '../../';
import GBX from '../../common/GBX';
import {
	updateInfo
} from '../redux/gbx3actions';

const REACT_APP_GBX_URL = process.env.REACT_APP_GBX_URL;

class ShareIframe extends React.Component {

	constructor(props) {
		super(props);
		this.iframeScript = this.iframeScript.bind(this);
		this.toggleAuto = this.toggleAuto.bind(this);
		this.loadGBX = this.loadGBX.bind(this);
		this.state = {
			autoPop: true
		}
	}

	componentDidMount() {
		//window.GIVEBOX.init({ env: 'staging'});
	}

	iframeScript() {
		const {
			articleID: ID
		} = this.props;

		const src = `${REACT_APP_GBX_URL}/${ID}?public=true&noFocus=true`;
		const iframe =
		`<iframe src="${src}" frameBorder="no" scrolling="auto" height="800px" width="100%"></iframe>`;
		return iframe;
	}

	toggleAuto() {
		this.setState({autoPop: this.state.autoPop ? false : true});
	}

	loadGBX() {
		const url = `${REACT_APP_GBX_URL}/${this.props.articleID}?public=true&modal=true&preview=true`;
		GBX.load(url);
		//window.GIVEBOX.load(url);
	}

	render() {

		return (
			<div className='shareWeb'>
				<div style={{ width: '100%' }} className='column'>
					<div className='subText'>Embed iFrame Code</div>
					<p>Copy and paste this code anywhere in your website's HTML where you want the form to show.</p>

					<CodeBlock showCopied={true} style={{ fontSize: '1em' }} className='flexCenter flexColumn' type='javascript' regularText={''} text={this.iframeScript()} name={<div style={{ margin: '20px 0' }} className='copyButton'>Click Here to Copy Code</div>} nameIcon={false} nameStyle={{}} />
				</div>
			</div>
		)
	}
}

ShareIframe.defaultProps = {
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const info = util.getValue(gbx3, 'info', {});
	const kind = util.getValue(info, 'kind');
	const articleID = util.getValue(info, 'articleID');
	const primaryColor = util.getValue(state, 'gbx3.globals.gbxStyle.primaryColor');

	return {
		kind,
		articleID,
		primaryColor
	}
}

export default connect(mapStateToProps, {
	updateInfo
})(ShareIframe);
