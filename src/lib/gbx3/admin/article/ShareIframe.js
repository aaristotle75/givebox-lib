import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	types,
	CodeBlock,
	Choice,
	GBLink
} from '../../../';
import GBX from '../../../common/GBX';
import {
	updateInfo
} from '../../redux/gbx3actions';

const REACT_APP_GBX_WIDGET = process.env.REACT_APP_GBX_WIDGET;
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

		const src = `${REACT_APP_GBX_WIDGET}/${ID}?public=true&noFocus=true`;
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

		const {
			kind
		} = this.props;

		return (
			<div className='gbx3Centered'>
				<div className='intro shareAdmin'>
					<h2 style={{ marginBottom: 10 }}>Embed An iFrame of Your {types.kind(kind).name} On Your Website</h2>
					<div className='step'>
						<CodeBlock style={{ fontSize: '1em' }} className='alignCenter' type='javascript' regularText={<h2><span style={{ fontWeight: 300 }}>Step 1:</span> Copy the iFrame Code</h2>} text={this.iframeScript()} name={` Click here to Copy iFrame Code`} nameIcon={false} nameStyle={{}} />

					</div>
					<div style={{ marginTop: 20 }} className='step'>
						<h2 style={{ marginBottom: 0 }}><span style={{ fontWeight: 300 }}>Step 2:</span> Paste into Your Website HTML</h2>
						<div className='confirmation'>
							<div className='successfulText'>
								<span className='group'>
									<span className='icon icon-arrow-right'></span>
									<span className='inlineText'>Copy the code from Step 1 into the body of your website HTML.</span>
								</span>
								<span className='group'>
									<span className='icon icon-arrow-right'></span>
									<span className='inlineText'>Place the code in the HTML where you want it to show.</span>
								</span>
								<span className='group'>
									<span className='icon icon-arrow-right'></span>
									<span className='inlineText'>Style the iFrame to make sure it fits your website.</span>
								</span>
								<span className='group'>
									<span className='icon icon-arrow-right'></span>
									<span className='inlineText'>If you need help contact your web developer or Givebox Support.</span>
								</span>
							</div>
						</div>
					</div>
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
