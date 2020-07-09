import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	updateGlobal,
	updateGlobals,
	saveGBX3,
	toggleModal,
	ColorPicker,
	setStyle,
	Dropdown
} from '../../../';

class ReceiptMenuStyle extends React.Component {

	constructor(props) {
		super(props);
		this.updatePrimaryColor = this.updatePrimaryColor.bind(this);
		this.colorPickerCallback = this.colorPickerCallback.bind(this);
		this.updateStyle = this.updateStyle.bind(this);
		this.opacityOptions = this.opacityOptions.bind(this);
		this.blurOptions = this.blurOptions.bind(this);
		this.pageRadiusOptions = this.pageRadiusOptions.bind(this);
		this.state = {
			colorPickerOpen: [],
			opacityDropdownOpen: false,
			roundnessDropdownOpen: false,
			backgroundOpacityDropdownOpen: false,
			backgroundBlurDropdownOpen: false
		}
	}

	async updatePrimaryColor(value) {

		const {
			gbxStyle
		} = this.props;

		const {
			button
		} = this.props.globals;

		const globals = {
			gbxStyle: {
				...gbxStyle,
				primaryColor: value
			},
			button: {
				...button,
				style: {
					...button.style,
					bgColor: value
				}
			}
		};
		const globalsUpdated = await this.props.updateGlobals(globals);
		if (globalsUpdated) {
			this.props.saveGBX3('receipt');
		}
	}

	async updateStyle(name, value) {

		const gbxStyle = {
			...this.props.gbxStyle,
			[name]: value
		};
		const globalUpdated = await this.props.updateGlobal('gbxStyle', gbxStyle);
		if (globalUpdated) {
			this.props.setStyle({ [name]: value });
			this.props.saveGBX3('receipt');
		}
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

	opacityOptions() {
		const items = [];
		for (let i=0; i <= 20; i++) {
			const perc = i * 5;
			items.push({ primaryText: `${perc}%`, value: perc });
		}
		return util.sortByField(items, 'value');
	}

	pageRadiusOptions() {
		const items = [];
		for (let i=0; i <= 10; i++) {
			const value = +(i * 5);
			items.push({ primaryText: `${value}px`, value});
		}
		return items;
	}

	blurOptions() {
		const items = [];
		for (let i=0; i <= 20; i++) {
			const perc = i * 5;
			items.push({ primaryText: `${perc}%`, value: perc});
		}
		return items;
	}

	render() {

		const {
			gbxStyle
		} = this.props;

		const {
			colorPickerOpen,
			opacityDropdownOpen,
			roundnessDropdownOpen,
			backgroundOpacityDropdownOpen,
			backgroundBlurDropdownOpen
		} = this.state;

		const colorPickerTheme = 'colorPickerTheme';
		const colorPickerTextColor = 'colorPickerTextColor';
		const colorPickerPageColor = 'colorPickerPageColor';
		const colorPickerBackgroundColor = 'colorPickerBackgroundColor';
		const colorPickerPlaceholderColor = 'colorPickerPlaceholderColor';

		const primaryColor = util.getValue(gbxStyle, 'primaryColor');
		const textColor = util.getValue(gbxStyle, 'textColor', '#000000');
		const pageColor = util.getValue(gbxStyle, 'pageColor', '#ffffff');
		const pageOpacity = +(util.getValue(gbxStyle, 'pageOpacity', 1) * 100);
		const pageRadius = +(util.getValue(gbxStyle, 'pageRadius', 0));
		const backgroundColor = util.getValue(gbxStyle, 'backgroundColor', util.getValue(gbxStyle, 'primaryColor'));
		const placeholderColor = util.getValue(gbxStyle, 'placeholderColor', textColor);
		const backgroundImage = util.getValue(gbxStyle, 'backgroundImage');
		const backgroundOpacity = +(util.getValue(gbxStyle, 'backgroundOpacity', 1) * 100);
		const backgroundBlur = util.getValue(gbxStyle, 'backgroundBlur', 0);

		const extraColors = [
			primaryColor,
			textColor,
			pageColor,
			backgroundColor,
			placeholderColor
		];

		return (
			<div className='layoutMenu'>
				<ul>
					<li onClick={() => this.colorPickerCallback(colorPickerTheme)} className='stylePanel'>
						Theme Color
						<ColorPicker
							open={colorPickerOpen.includes(colorPickerTheme)}
							name='primaryColor'
							fixedLabel={true}
							label='Theme Color'
							onAccept={(name, value) => {
								this.colorPickerCallback(colorPickerTheme);
								this.updatePrimaryColor(value);
							}}
							onCancel={() => this.colorPickerCallback(colorPickerTheme)}
							value={primaryColor}
							modalID={colorPickerTheme}
							opts={{
								customOverlay: {
									zIndex: 9999909
								}
							}}
							extraColors={extraColors}
						/>
					</li>
					<li onClick={() => this.colorPickerCallback(colorPickerTextColor)} className='stylePanel'>
						Text Color
						<ColorPicker
							open={colorPickerOpen.includes(colorPickerTextColor)}
							name='textColor'
							fixedLabel={true}
							label='Text Color'
							onAccept={(name, value) => {
								this.colorPickerCallback(colorPickerTextColor);
								this.updateStyle('textColor', value);
							}}
							onCancel={() => this.colorPickerCallback(colorPickerTextColor)}
							value={textColor}
							modalID={colorPickerTextColor}
							opts={{
								customOverlay: {
									zIndex: 9999909
								}
							}}
							extraColors={extraColors}
						/>
					</li>
				</ul>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const globals = util.getValue(gbx3, 'globals', {});
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});

	return {
		globals,
		gbxStyle
	}
}

export default connect(mapStateToProps, {
	updateGlobal,
	updateGlobals,
	saveGBX3,
	toggleModal,
	setStyle
})(ReceiptMenuStyle);
