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

class ShareEmbed extends React.Component {

	constructor(props) {
		super(props);
		this.btnScript = this.btnScript.bind(this);
		this.toggleAuto = this.toggleAuto.bind(this);
		this.loadGBX = this.loadGBX.bind(this);
		this.state = {
			autoPop: true
		}
	}

	componentDidMount() {
		//window.GIVEBOX.init({ env: 'staging'});
	}

	btnScript() {
		const {
			articleID: ID,
			kind
		} = this.props;

		const src = REACT_APP_GBX_WIDGET;
		const auto = this.state.autoPop ? true : false;
		const autoParam = 'auto:'+ID;
		const script =
		`<script type='text/javascript' src='${src}'></script>
		<script type='text/javascript'>document.addEventListener('DOMContentLoaded',GIVEBOX.init([{${auto ? autoParam : ''}}]));</script>
		<button type='button' class='givebox-btn gb-style' data-givebox='${ID}'>${types.kind(kind).cta}</button>`;

		return script;
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
			kind,
			primaryColor
		} = this.props;

		const {
			autoPop
		} = this.state;

		return (
			<div className='gbx3Centered'>
				<div className='intro shareAdmin'>
					<h2 style={{ marginBottom: 10 }}>Embed Your {types.kind(kind).name} On Your Website</h2>
					<div className='step'>
						<CodeBlock style={{ fontSize: '1em' }} className='alignCenter' type='javascript' regularText={<h2><span style={{ fontWeight: 300 }}>Step 1:</span> Copy the Embed Code</h2>} text={this.btnScript()} name={` Click Here to Copy Embed Code`} nameIcon={false} nameStyle={{}} />
						<Choice
							name='swipeApp'
							onChange={this.toggleAuto}
							type='checkbox'
							label='Auto pop on your website'
							value={autoPop}
							checked={autoPop}
						/>
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
									<span className='inlineText'>Style the button with CSS or inline Styles.</span>
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

ShareEmbed.defaultProps = {
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
})(ShareEmbed);