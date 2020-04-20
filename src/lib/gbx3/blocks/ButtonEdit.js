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
	types
} from '../../';
import AnimateHeight from 'react-animate-height';

class Button extends Component {

  constructor(props) {
    super(props);
		this.handleBorderRadius = this.handleBorderRadius.bind(this);
		this.setRadius = this.setRadius.bind(this);
		const borderRadius = util.getValue(props.options, 'borderRadius', 5);
		const button = this.props.button;

    this.state = {
			button,
			borderRadius
    };
  }

	componentDidMount() {
	}

  handleBorderRadius(e) {
    const borderRadius = parseInt(e.target.value)
    this.setState({ borderRadius })
  }

	setRadius(borderRadius) {
    this.setState({ borderRadius })
	}

  render() {

		const {
			button
		} = this.state;

		const {
			label,
			primaryColor
		} = this.props;

		const enabled = util.getValue(button, 'enabled', false);
		const textValue = util.getValue(button, 'text');
		const bgColor = util.getValue(button, 'bgColor', primaryColor);
		const width = util.getValue(button, 'width');
		const fontSize = util.getValue(button, 'fontSize');

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
						this.setState({ button }, this.props.update(button));
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
							this.props.update(button);
						}}
					/>
					<ColorPicker
						name='bgColor'
						fixedLabel={true}
						label='Button Background Color'
						onAccept={(name, value) => {
							const button = this.state.button;
							button.bgColor = value;
							this.setState({ button }, this.props.update(button));
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
							this.props.update(button);
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
							this.setState({ button }, this.props.update(button));
						}}
            options={types.fontSizeOptions(10, 28)}
          />
	      </AnimateHeight>
      </>
    )
  }
}

Button.defaultProps = {
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
})(Button);
