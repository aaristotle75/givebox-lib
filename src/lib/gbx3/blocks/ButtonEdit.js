import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	toggleModal,
	Choice,
	TextField,
	ColorPicker,
	_v,
	Dropdown,
	types,
	GBLink
} from '../../';
import AnimateHeight from 'react-animate-height';
import Button from './Button';

class ButtonEdit extends Component {

	constructor(props) {
		super(props);
		this.setRadius = this.setRadius.bind(this);
		this.updateButton = this.updateButton.bind(this);
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	updateButton(name, value, style = false) {
		const button = { ...this.props.button };
		if (style) button.style[name] = value;
		else button[name] = value;
		this.props.optionsUpdated('button', button);
	}

	setRadius(borderRadius) {
		this.updateButton('borderRadius', borderRadius, true);
	}

	render() {

		const {
			label,
			primaryColor,
			maxRadius,
			minRadius,
			modalID,
			button,
			globalButtonStyle,
			globalOption
		} = this.props;

		const enabled = util.getValue(button, 'enabled', false);
		const textValue = util.getValue(button, 'text');

		const buttonStyle = { ...globalButtonStyle, ...util.getValue(button, 'style', {}) };
		const bgColor = util.getValue(buttonStyle, 'bgColor', primaryColor);
		const width = util.getValue(buttonStyle, 'width');
		const fontSize = util.getValue(buttonStyle, 'fontSize');
		const borderRadius = util.getValue(buttonStyle, 'borderRadius', 10);

		return (
			<>
				{util.getValue(button, 'embedAllowed', false) && !globalOption ?
				<Choice
					type='checkbox'
					name='enabled'
					label={label}
					onChange={(name, value) => {
						const enabled = this.props.button.enabled ? false : true;
						this.updateButton('enabled', enabled);
					}}
					checked={enabled}
					value={enabled}
				/> : <></>}
				<AnimateHeight
					duration={500}
					height={enabled || globalOption ? 'auto' : 0}
				>
					<TextField
						name='text'
						label='Button Text'
						fixedLabel={true}
						placeholder='Enter Button Text'
						value={textValue}
						onChange={(e) => {
							const value = e.currentTarget.value;
							this.updateButton('text', value);
						}}
					/>
					<ColorPicker
						name='bgColor'
						fixedLabel={true}
						label='Button Background Color'
						onAccept={(name, value) => {
							this.updateButton('bgColor', value, true);
						}}
						value={bgColor}
						modalID='colorPickerBgColor'
						opts={{
							customOverlay: {
								zIndex: 9999909
							}
						}}
					/>
					<TextField
						name='width'
						value={width}
						onChange={(e) => {
							e.preventDefault();
							const value = parseInt(_v.formatNumber(e.target.value));
							this.updateButton('width', value, true);
						}}
						fixedLabel={true}
						label='Button Width'
						placeholder='Enter Button Width (Leave Blank to Auto Fit)'
						inputMode='numeric'
						maxLength={3}
					/>
					<Dropdown
						label='Button Font Size'
						fixedLabel={true}
						name='fontSize'
						defaultValue={parseInt(fontSize)}
						onChange={(name, value) => {
							this.updateButton('fontSize', value, true);
						}}
						options={types.fontSizeOptions(10, 28)}
						portalID={`button-fontSize-dropdown-portal`}
						portal={true}
						contentWidth={400}
						portalLeftOffset={1}
						rectXY={false}
					/>
					<div className='input-group'>
						<label className='label'>Button Roundness</label>
						<div className='scale'>
							<GBLink onClick={() => this.setRadius(minRadius)}><span className='icon icon-square'></span></GBLink>
							<input
								name="borderRadius"
								type="range"
								onChange={(e) => {
									const borderRadius = parseInt(e.target.value)
									this.setRadius(borderRadius);
								}}
								min={minRadius}
								max={maxRadius}
								step="0"
								value={borderRadius}
							/>
							<GBLink onClick={() => this.setRadius(maxRadius)}><span className='icon icon-circle'></span></GBLink>
						</div>
					</div>
					<div className='input-group'>
						<label className='label'>Button Preview</label>
						<div style={{ marginTop: 10 }} className='flexCenter'>
							<Button
								modalID={modalID}
								button={button}
							/>
						</div>
					</div>
				</AnimateHeight>
			</>
		)
	}
}

ButtonEdit.defaultProps = {
	minRadius: 0,
	maxRadius: 30,
	label: 'Enabled Button'
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const globals = util.getValue(gbx3, 'globals', {});
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});
	const gbxPrimaryColor = util.getValue(gbxStyle, 'primaryColor');
	const globalButton = util.getValue(globals, 'button', {});
	const globalButtonStyle = util.getValue(globalButton, 'style', {});
	const primaryColor = util.getValue(globalButtonStyle, 'bgColor', gbxPrimaryColor);

	return {
		primaryColor,
		globalButton,
		globalButtonStyle
	}
}

export default connect(mapStateToProps, {
	toggleModal
})(ButtonEdit);
