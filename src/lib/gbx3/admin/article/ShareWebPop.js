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
	updateInfo,
	updateGlobal,
	updateGlobals,
	saveGBX3
} from '../../redux/gbx3actions';

const REACT_APP_GBX_WIDGET = process.env.REACT_APP_GBX_WIDGET;
const REACT_APP_GBX_URL = process.env.REACT_APP_GBX_URL;

class ShareEmbed extends React.Component {

	constructor(props) {
		super(props);
		this.btnScript = this.btnScript.bind(this);
		this.toggleAuto = this.toggleAuto.bind(this);
		this.loadGBX = this.loadGBX.bind(this);
		this.copyCallback = this.copyCallback.bind(this);
		this.colorPickerCallback = this.colorPickerCallback.bind(this);
		this.updateStyle = this.updateStyle.bind(this);
		this.state = {
			colorPickerOpen: [],
			autoPop: true,
			copied: false
		}
	}

	componentDidMount() {
		//window.GIVEBOX.init({ env: 'staging'});
	}

	colorPickerCallback(modalID) {
		const colorPickerOpen = this.state.colorPickerOpen;
		if (colorPickerOpen.includes(modalID)) {
			colorPickerOpen.splice(colorPickerOpen.indexOf(modalID), 1);
		} else {
			colorPickerOpen.push(modalID);
		}
		this.setState({ colorPickerOpen });
	}

	async updateStyle(name, value) {

		const embedButton = {
			...this.props.embedButton,
			[name]: value
		};
		const globalUpdated = await this.props.updateGlobal('embedButton', embedButton);
		if (globalUpdated) {
			this.props.saveGBX3('article');
		}
	}

	copyCallback() {
		this.setState({ copied: true });
		this.timeout = setTimeout(() => {
			this.setState({ copied: false });
			this.timeout = null;
		}, 1000);
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
			autoPop,
			copied
		} = this.state;

		return (
			<div className='shareWeb'>
				<div className='column'>
					<Choice
						name='swipeApp'
						onChange={this.toggleAuto}
						type='checkbox'
						label='Auto pop on your website'
						value={autoPop}
						checked={autoPop}
						toggle={true}
					/>
				</div>
				<div className='column'>
					<div className='subText'>Popup Widget Code</div>
					<p>Copy and paste this code anywhere in your website's HTML to pop the widget.</p>

					<CodeBlock copyCallback={this.copyCallback} style={{ fontSize: '1em' }} className='flexCenter flexColumn' type='javascript' regularText={''} text={this.btnScript()} name={<div className='copyButton'>Click Here to Copy Code</div>} nameIcon={false} nameStyle={{}} />
					<div className={`codeCopied ${copied ? 'copied' : ''}`}>
						<span className='icon icon-check-circle'></span>
						Copied
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
	const embedButton = util.getValue(state, 'gbx3.globals.embedButton', {});

	return {
		kind,
		articleID,
		primaryColor,
		embedButton
	}
}

export default connect(mapStateToProps, {
	updateInfo,
	updateGlobal,
	updateGlobals,
	saveGBX3
})(ShareEmbed);
