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
} from '../../';

class DesignMenuStyle extends React.Component {

	constructor(props) {
		super(props);
		this.updatePrimaryColor = this.updatePrimaryColor.bind(this);
		this.colorPickerCallback = this.colorPickerCallback.bind(this);
		this.updateStyle = this.updateStyle.bind(this);
		this.backgroundOpacityOptions = this.backgroundOpacityOptions.bind(this);
		this.state = {
			colorPickerOpen: [],
			opacityDropdownOpen: false
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
			this.props.saveGBX3(null, false, null);
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
			this.props.saveGBX3(null, false, null);
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

	backgroundOpacityOptions() {
		const items = [];
		for (let i=0; i <= 10; i++) {
			const perc = i * 10;
			//const actualValue = +((perc / 100).toFixed(1));
			items.push({ primaryText: `${perc}%`, value: i });
		}
		return items;
	}

	render() {

		const {
			gbxStyle
		} = this.props;

		const {
			colorPickerOpen,
			opacityDropdownOpen
		} = this.state;

		const colorPickerTheme = 'colorPickerTheme';
		const colorPickerTextColor = 'colorPickerTextColor';
		const colorPickerBackgroundColor = 'colorPickerBackgroundColor';

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
							value={util.getValue(gbxStyle, 'primaryColor')}
							modalID={colorPickerTheme}
							opts={{
								customOverlay: {
									zIndex: 9999909
								}
							}}
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
							value={util.getValue(gbxStyle, 'textColor', '#000000')}
							modalID={colorPickerTextColor}
							opts={{
								customOverlay: {
									zIndex: 9999909
								}
							}}
						/>
					</li>
					<li onClick={() => this.colorPickerCallback(colorPickerBackgroundColor)} className='stylePanel'>
						Background Color
						<ColorPicker
							open={colorPickerOpen.includes(colorPickerBackgroundColor)}
							name='backgroundColor'
							fixedLabel={true}
							label='Background Color'
							onAccept={(name, value) => {
								this.colorPickerCallback(colorPickerBackgroundColor);
								this.updateStyle('backgroundColor', value);
							}}
							onCancel={() => this.colorPickerCallback(colorPickerBackgroundColor)}
							value={util.getValue(gbxStyle, 'backgroundColor', '#ffffff')}
							modalID={colorPickerBackgroundColor}
							opts={{
								customOverlay: {
									zIndex: 9999909
								}
							}}
						/>
					</li>
					<li
						onClick={() => {
							const opacityDropdownOpen = this.state.opacityDropdownOpen ? false : true;
							this.setState({ opacityDropdownOpen });
						}}
						className='stylePanel'
					>
						Background Opacity
						<Dropdown
							open={opacityDropdownOpen}
							portalID={`leftPanel-backgroundOpacity`}
							portal={true}
							name='backgroundOpacity'
							contentWidth={100}
							label={''}
							className='leftPanelDropdown'
							fixedLabel={true}
							defaultValue={+(util.getValue(gbxStyle, 'backgroundOpacity', 1) * 10)}
							onChange={(name, value) => {
								const backgroundOpacity = +(value / 10);
								console.log('execute onChange', value, backgroundOpacity);
								this.updateStyle('backgroundOpacity', backgroundOpacity);
							}}
							options={this.backgroundOpacityOptions()}
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
})(DesignMenuStyle);
