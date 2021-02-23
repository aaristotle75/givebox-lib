import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import ColorPicker from '../../../form/ColorPicker';
import {
  updateAdmin,
  updateOrgGlobal,
  saveOrg,
  setOrgStyle
} from '../../redux/gbx3actions';
import { toggleModal } from '../../../api/actions';

class AdminMenuStyle extends React.Component {

  constructor(props) {
    super(props);
    this.saveStyle = this.saveStyle.bind(this);
    this.colorPickerCallback = this.colorPickerCallback.bind(this);
    this.state = {
      colorPickerOpen: []
    };
  }

  async saveStyle(style, callback) {
    const globalStyles = {
      ...this.props.globalStyles,
      ...style
    };

    const globalUpdated = await this.props.updateOrgGlobal('globalStyles', globalStyles);
    if (globalUpdated) {
      this.props.saveOrg({
        callback: (res, err) => {
          if (callback) callback();
          this.props.setOrgStyle();
        }
      })
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
      globalStyles
    } = this.props;

    const {
      colorPickerOpen
    } = this.state;

    const colorPickerBackgroundColor = 'colorPickerBackgroundColor';
    const colorPickerPrimaryColor = 'colorPickerPrimaryColor';
    const backgroundColor = util.getValue(globalStyles, 'backgroundColor');
    const primaryColor = util.getValue(globalStyles, 'primaryColor');
    const extraColors = [
      backgroundColor,
      primaryColor
    ];

    return (
      <div className='layoutMenu'>
        <ul>
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
                this.saveStyle({ 'backgroundColor': value });
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
          <li className='listHeader'>Page Styles</li>
          <li onClick={() => this.colorPickerCallback(colorPickerPrimaryColor)} className='stylePanel'>
            Link Color
            <ColorPicker
              open={colorPickerOpen.includes(colorPickerPrimaryColor)}
              name='primaryColor'
              fixedLabel={true}
              label='Link Color'
              onAccept={(name, value) => {
                this.colorPickerCallback(colorPickerPrimaryColor);
                this.saveStyle({ 'primaryColor': value });
              }}
              onCancel={() => this.colorPickerCallback(colorPickerPrimaryColor)}
              value={primaryColor}
              modalID={colorPickerPrimaryColor}
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

  return {
    globalStyles: util.getValue(state, 'gbx3.orgGlobals.globalStyles', {})
  }
}

export default connect(mapStateToProps, {
  toggleModal,
  updateAdmin,
  updateOrgGlobal,
  saveOrg,
  setOrgStyle
})(AdminMenuStyle);
