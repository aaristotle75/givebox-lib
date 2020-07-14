import React, { Component } from 'react';
import { connect } from 'react-redux';
import { util } from '../';

class GBLink extends Component {
  constructor(props) {
    super(props);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
    this.linkRef = /*#__PURE__*/React.createRef();
    this.state = {
      hoverStyle: {}
    };
  }

  onClick(e) {
    e.preventDefault();

    if (this.linkRef) {
      this.linkRef.current.blur();
    }

    if (this.props.onClick) this.props.onClick();
  }

  onMouseEnter(e) {
    if (this.props.hoverStyle) this.setState({
      hoverStyle: this.props.hoverStyle
    });
    if (this.props.onMouseEnter) this.props.onMouseEnter(e, util.getValue(this.linkRef, 'current', {}), this.props.id);
  }

  onMouseLeave(e) {
    if (this.props.hoverStyle) this.setState({
      hoverStyle: {}
    });
    if (this.props.onMouseLeave) this.props.onMouseLeave(e, util.getValue(this.linkRef, 'current', {}), this.props.id);
  }

  linkStyle() {
    const style = {
      color: `${this.props.primaryColor}`
    };
    return { ...style,
      ...this.props.style
    };
  }

  render() {
    const {
      id,
      className,
      style,
      disabled,
      ripple
    } = this.props;
    const mergeStyle = { ...style,
      ...this.state.hoverStyle
    };
    return (/*#__PURE__*/React.createElement("button", {
        ref: this.linkRef,
        disabled: disabled,
        type: "button",
        id: id,
        className: `${ripple ? 'ripple' : ''} ${className || 'link'}`,
        onClick: this.onClick,
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
        style: mergeStyle
      }, this.props.children)
    );
  }

}

;
GBLink.defaultProps = {
  primaryColor: '',
  style: {},
  disabled: false,
  ripple: false,
  allowCustom: false,
  customColor: false,
  solidColor: false
};

function mapStateToProps(state, props) {
  const custom = util.getValue(state, 'custom', {});
  const primaryColor = props.customColor || util.getValue(custom, 'primaryColor');
  const rgb = primaryColor ? util.hexToRgb(primaryColor) : '';
  const rgbText = props.solidTextColor ? util.hexToRgb(props.solidTextColor) : '';
  let rgbColor = null;

  if (rgb) {
    rgbColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .7)`;
  }

  let rgbTextColor = null;

  if (rgbText) {
    rgbTextColor = `rgba(${rgbText.r}, ${rgbText.g}, ${rgbText.b}, .7)`;
  }

  const className = props.className || '';
  const hoverStyle = rgb && props.allowCustom ? {
    color: rgbColor
  } : props.hoverStyle || {};
  const customStyle = {};

  if (props.allowCustom && primaryColor) {
    customStyle.color = props.solidColor ? props.solidTextColor || '#ffffff' : primaryColor;
    customStyle.backgroundColor = props.solidColor ? primaryColor : null;
  }

  const style = { ...customStyle,
    ...props.style
  };

  if (className.includes('button') && props.allowCustom) {
    hoverStyle.backgroundColor = rgbColor;
    hoverStyle.color = props.solidTextColor ? rgbTextColor : '#ffffff';
    style.border = `1px solid ${rgbColor}`;
  }

  return {
    primaryColor,
    hoverStyle,
    style
  };
}

export default connect(mapStateToProps, {})(GBLink);