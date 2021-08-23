import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import * as types from '../../common/types';
import TextField from '../../form/TextField';
import Choice from '../../form/Choice';
import ColorPicker from '../../form/ColorPicker';
import Dropdown from '../../form/Dropdown';
import * as _v from '../../form/formValidate';
import AnimateHeight from 'react-animate-height';
import { toggleModal } from '../../api/actions';

class ButtonEdit extends Component {

  constructor(props) {
    super(props);
    this.setRadius = this.setRadius.bind(this);
  }

  setRadius(borderRadius) {
    this.props.buttonUpdated('style', {
      ...this.props.style,
      borderRadius
    });
  }

  render() {

    const {
      type,
      link,
      text,
      style,
      primaryColor,
      gbxStyle,
      minRadius,
      maxRadius
    } = this.props;

    const backgroundColor = util.getValue(style, 'backgroundColor', primaryColor);
    const textColor = util.getValue(style, 'textColor', '#ffffff');
    const width = util.getValue(style, 'width');
    const fontSize = util.getValue(style, 'fontSize');
    const align = util.getValue(style, 'align');
    const borderRadius = util.getValue(style, 'borderRadius', 10);

    const globalTextColor = util.getValue(gbxStyle, 'textColor', '#000000');
    const pageColor = util.getValue(gbxStyle, 'pageColor', '#ffffff');
    const placeholderColor = util.getValue(gbxStyle, 'placeholderColor', textColor);

    const extraColors = [
      primaryColor,
      textColor,
      globalTextColor,
      pageColor,
      backgroundColor,
      placeholderColor
    ];

    return (
      <div className='orgCustomElements'>
        <TextField
          name='text'
          label='Button Text'
          fixedLabel={true}
          placeholder='Enter Button Text'
          value={text}
          onChange={(e) => {
            const value = e.currentTarget.value;
            this.props.buttonUpdated('text', value);
          }}
          leftBar={true}
          style={{ margin: '0 15px'}}
        />
        <ColorPicker
          name='backgroundColor'
          fixedLabel={true}
          label='Button Background Color'
          onAccept={(name, value) => {
            this.props.buttonUpdated('style', {
              ...style,
              backgroundColor: value
            });
          }}
          value={backgroundColor}
          modalID='colorPickerBgColor'
          opts={{
            customOverlay: {
              zIndex: 9999909
            }
          }}
          extraColors={extraColors}
        />
        <ColorPicker
          name='textColor'
          fixedLabel={true}
          label='Button Text Color'
          onAccept={(name, value) => {
            this.props.buttonUpdated('style', {
              ...style,
              textColor: value
            });
          }}
          value={textColor}
          modalID='colorPickeTextColor'
          opts={{
            customOverlay: {
              zIndex: 9999909
            }
          }}
          extraColors={extraColors}
        />
        <TextField
          name='width'
          value={width}
          onChange={(e) => {
            e.preventDefault();
            const value = parseInt(_v.formatNumber(e.target.value));
            this.props.buttonUpdated('style', {
              ...style,
              width: value
            });
          }}
          fixedLabel={true}
          label='Button Width'
          placeholder='Enter Button Width (Leave Blank to Auto Fit)'
          inputMode='numeric'
          maxLength={3}
          leftBar={true}
          style={{ margin: '0 15px'}}
        />
        <Dropdown
          label='Button Font Size'
          fixedLabel={true}
          name='fontSize'
          defaultValue={parseInt(fontSize)}
          onChange={(name, value) => {
            this.props.buttonUpdated('style', {
              ...style,
              fontSize: value
            });
          }}
          options={types.fontSizeOptions(10, 28)}
          portalID={`button-fontSize-dropdown-portal`}
          portal={true}
          contentWidth={400}
          portalLeftOffset={1}
          rectXY={false}
          leftBar={true}
          style={{ margin: '0 15px'}}
        />
        <Dropdown
          label='Button Alignment'
          fixedLabel={true}
          name='align'
          defaultValue={align}
          onChange={(name, value) => {
            this.props.buttonUpdated('style', {
              ...style,
              align: value
            });
          }}
          options={[
            { primaryText: 'Left', value: 'left' },
            { primaryText: 'Center', value: 'center' },
            { primaryText: 'Right', value: 'right' }
          ]}
          portalID={`button-align-dropdown-portal`}
          portal={true}
          contentWidth={400}
          portalLeftOffset={1}
          rectXY={false}
          leftBar={true}
          style={{ margin: '0 15px'}}
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
            <GBLink style={style} customColor={backgroundColor} solidColor={type === 'button' ? true : false} allowCustom={true} solidTextColor={textColor} className={`${type}`} onClick={() => window.open(link)}>
              {text}
            </GBLink>
          </div>
        </div>
      </div>
    )
  }
}

ButtonEdit.defaultProps = {
  minRadius: 0,
  maxRadius: 30,
  label: 'Enabled Button',
  allowAutopop: false
}

function mapStateToProps(state, props) {

  const gbxStyle = util.getValue(state, 'gbx3.globals.gbxStyle', {});

  return {
    gbxStyle
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(ButtonEdit);
