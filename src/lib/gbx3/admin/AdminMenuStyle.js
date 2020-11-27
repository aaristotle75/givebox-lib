import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import ColorPicker from '../../form/ColorPicker';
import Dropdown from '../../form/Dropdown';
import AdminMenuStyleImage from './AdminMenuStyleImage';
import {
  setStyle,
  updateGlobal,
  updateGlobals,
  saveGBX3
} from '../redux/gbx3actions';
import { toggleModal } from '../../api/actions';

class AdminMenuStyle extends React.Component {

  constructor(props) {
    super(props);
    this.updatePrimaryColor = this.updatePrimaryColor.bind(this);
    this.colorPickerCallback = this.colorPickerCallback.bind(this);
    this.updateStyle = this.updateStyle.bind(this);
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
      gbxStyle,
      blockType
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
      this.props.saveGBX3(blockType);
    }
  }

  async updateStyle(name, value) {

    const {
      blockType
    } = this.props;

    const gbxStyle = {
      ...this.props.gbxStyle,
      [name]: value
    };
    const globalUpdated = await this.props.updateGlobal('gbxStyle', gbxStyle);
    if (globalUpdated) {
      this.props.setStyle({ [name]: value });
      this.props.saveGBX3(blockType);
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

  render() {

    const {
      gbxStyle,
      blockType
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
          <li className='listHeader'>Form Style</li>
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
          <li onClick={() => this.colorPickerCallback(colorPickerPlaceholderColor)} className='stylePanel'>
            Placeholder Color
            <ColorPicker
              open={colorPickerOpen.includes(colorPickerPlaceholderColor)}
              name='placeholderColor'
              fixedLabel={true}
              label='Placeholder Color'
              onAccept={(name, value) => {
                this.colorPickerCallback(colorPickerPlaceholderColor);
                this.updateStyle('placeholderColor', value);
              }}
              onCancel={() => this.colorPickerCallback(colorPickerPlaceholderColor)}
              value={placeholderColor}
              modalID={colorPickerPlaceholderColor}
              opts={{
                customOverlay: {
                  zIndex: 9999909
                }
              }}
              extraColors={extraColors}
            />
          </li>
          <li className='listHeader'>Page Style</li>
          <li onClick={() => this.colorPickerCallback(colorPickerPageColor)} className='stylePanel'>
            Page Color
            <ColorPicker
              open={colorPickerOpen.includes(colorPickerPageColor)}
              name='pageColor'
              fixedLabel={true}
              label='Page Color'
              onAccept={(name, value) => {
                this.colorPickerCallback(colorPickerPageColor);
                this.updateStyle('pageColor', value);
              }}
              onCancel={() => this.colorPickerCallback(colorPickerPageColor)}
              value={pageColor}
              modalID={colorPickerPageColor}
              opts={{
                customOverlay: {
                  zIndex: 9999909
                }
              }}
              extraColors={extraColors}
            />
          </li>
          <li
            onClick={() => {
              const opacityDropdownOpen = this.state.opacityDropdownOpen ? false : true;
              this.setState({ opacityDropdownOpen });
            }}
            className='stylePanel'
          >
            Page Opacity
            <Dropdown
              open={opacityDropdownOpen}
              portalID={`leftPanel-pageOpacity`}
              portal={true}
              name='pageOpacity'
              contentWidth={100}
              label={''}
              className='leftPanelDropdown'
              fixedLabel={true}
              defaultValue={pageOpacity}
              onChange={(name, value) => {
                const pageOpacity = +(value / 100);
                this.updateStyle('pageOpacity', pageOpacity);
              }}
              options={util.opacityOptions()}
            />
          </li>
          <li
            onClick={() => {
              const roundnessDropdownOpen = this.state.roundnessDropdownOpen ? false : true;
              this.setState({ roundnessDropdownOpen });
            }}
            className='stylePanel'
          >
            Page Roundness
            <Dropdown
              open={roundnessDropdownOpen}
              portalID={`leftPanel-pageRadius`}
              portal={true}
              name='pageRadius'
              contentWidth={100}
              label={''}
              className='leftPanelDropdown'
              fixedLabel={true}
              defaultValue={pageRadius}
              onChange={(name, value) => {
                this.updateStyle('pageRadius', value);
              }}
              options={util.pageRadiusOptions()}
            />
          </li>
          <li className='listHeader'>Background Style</li>
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
              value={backgroundColor}
              modalID={colorPickerBackgroundColor}
              opts={{
                customOverlay: {
                  zIndex: 9999909
                }
              }}
              extraColors={extraColors}
            />
          </li>
          <li
            onClick={() => {
              const backgroundOpacityDropdownOpen = this.state.backgroundOpacityDropdownOpen ? false : true;
              this.setState({ backgroundOpacityDropdownOpen });
            }}
            className='stylePanel'
          >
            Background Opacity
            <Dropdown
              open={backgroundOpacityDropdownOpen}
              portalID={`leftPanel-backgroundOpacity`}
              portal={true}
              name='backgroundOpacity'
              contentWidth={100}
              label={''}
              className='leftPanelDropdown'
              fixedLabel={true}
              defaultValue={backgroundOpacity}
              onChange={(name, value) => {
                const backgroundOpacity = +(value / 100);
                this.updateStyle('backgroundOpacity', backgroundOpacity);
              }}
              options={util.opacityOptions()}
            />
          </li>
          <AdminMenuStyleImage
            blockType={blockType}
            imageURL={backgroundImage}
            selectedCallback={(imageURL, changed) => {
              if (changed) this.updateStyle('backgroundImage', imageURL);
            }}
            removeImage={() => {
              this.props.toggleModal('designMenuStyleBackgroundImage', false);
              this.updateStyle('backgroundImage', '');
            }}
          />
          <li
            onClick={() => {
              const backgroundBlurDropdownOpen = this.state.backgroundBlurDropdownOpen ? false : true;
              this.setState({ backgroundBlurDropdownOpen });
            }}
            className='stylePanel'
          >
            Background Image Blur
            <Dropdown
              open={backgroundBlurDropdownOpen}
              portalID={`leftPanel-backgroundBlur`}
              portal={true}
              name='backgroundBlur'
              contentWidth={100}
              label={''}
              selectLabel='Select'
              className='leftPanelDropdown'
              fixedLabel={true}
              defaultValue={backgroundBlur}
              onChange={(name, value) => {
                this.updateStyle('backgroundBlur', +(value));
              }}
              options={util.blurOptions()}
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
})(AdminMenuStyle);
