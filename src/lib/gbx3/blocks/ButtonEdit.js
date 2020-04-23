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
	GBLink,
	ModalLink
} from '../../';
import Button from './Button';
import AnimateHeight from 'react-animate-height';

class ButtonEdit extends Component {

  constructor(props) {
    super(props);
		this.handleBorderRadius = this.handleBorderRadius.bind(this);
		this.setRadius = this.setRadius.bind(this);
		const button = this.props.button;
		const borderRadius = util.getValue(button, 'borderRadius', util.getValue(props.options, 'borderRadius', 5));

    this.state = {
			button,
			borderRadius
    };
  }

	componentDidMount() {
	}

	componentWillUnmount() {
		this.setState({ button: this.props.button });
	}

  handleBorderRadius(e) {
    const borderRadius = parseInt(e.target.value)
    this.setState({ borderRadius })
  }

	setRadius(borderRadius) {
		const button = this.state.button;
		button.borderRadius = borderRadius;
    this.setState({ button, borderRadius })
	}

  render() {

		const {
			button,
			borderRadius
		} = this.state;

		const {
			label,
			primaryColor,
			maxRadius,
			minRadius
		} = this.props;

		const enabled = util.getValue(button, 'enabled', false);
		const textValue = util.getValue(button, 'text');
		const bgColor = util.getValue(button, 'bgColor', primaryColor);
		const width = util.getValue(button, 'width');
		const fontSize = util.getValue(button, 'fontSize');

		const type = util.getValue(button, 'type', 'button');
		const paddingTopBottom = fontSize >= 20 ? 15 : 10;
		const style = {}
		style.borderRadius = `${util.getValue(button, 'borderRadius', 0)}px`;
		style.fontSize = `${fontSize}px`;
		style.width = util.getValue(button, 'width');
		style.padding = `${paddingTopBottom}px 25px`;

    return (
      <>
				{util.getValue(button, 'embedAllowed', false) ?
				<Choice
					type='checkbox'
					name='enabled'
					label={label}
					onChange={(name, value) => {
						const button = this.state.button;
						button.enabled = button.enabled ? false : true;
						this.setState({ button }, this.props.optionsUpdated('button', button));
					}}
					checked={enabled}
					value={enabled}
				/> : <></>}
	      <AnimateHeight
	        duration={500}
	        height={enabled ? 'auto' : 0}
	      >
					<TextField
						name='text'
						label='Button Text'
						fixedLabel={true}
						placeholder='Enter Button Text'
						value={textValue}
						onChange={(e) => {
							const button = this.state.button;
							const value = e.currentTarget.value;
							button.text = value;
							this.setState({ button });
						}}
						onBlur={() => {
							const button = this.state.button;
							this.props.optionsUpdated('buttton', button);
						}}
					/>
					<ColorPicker
						name='bgColor'
						fixedLabel={true}
						label='Button Background Color'
						onAccept={(name, value) => {
							const button = this.state.button;
							button.bgColor = value;
							this.setState({ button }, this.props.optionsUpdated('button', button));
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
							const button = this.state.button;
							button.width = value;
							this.setState({ button });
						}}
						onBlur={() => {
							const button = this.state.button;
							this.props.optionsUpdated('button', button);
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
							const button = this.state.button;
							button.fontSize = value;
							this.setState({ button }, this.props.optionsUpdated('button', button));
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
									const button = this.state.button;
									button.borderRadius = borderRadius;
									this.setState({ button, borderRadius }, this.props.optionsUpdated('button', button));
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
							<ModalLink style={style} customColor={util.getValue(button, 'bgColor', null)} solidColor={type === 'button' ? true : false} allowCustom={true} className={`${type}`} id={'amountsList'}>
								{util.getValue(button, 'text', 'Button Text')}
							</ModalLink>
						</div>
					</div>
	      </AnimateHeight>
      </>
    )
  }
}

ButtonEdit.defaultProps = {
	minRadius: 0,
	maxRadius: 50,
	label: 'Enabled Button'
}

function mapStateToProps(state, props) {

	const primaryColor = util.getValue(state.custom, 'primaryColor');

  return {
		primaryColor
	}
}

export default connect(mapStateToProps, {
	toggleModal
})(ButtonEdit);
