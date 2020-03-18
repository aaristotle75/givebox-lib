import React, { Component } from 'react';
import { connect } from 'react-redux';
import { util } from '../';

class GBLink extends Component {
  constructor(props) {
    super(props);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
    this.linkRef = React.createRef();
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
      primaryColor,
      disabled,
      ripple,
      disallowCustom
    } = this.props;
    const color = !disallowCustom && primaryColor ? {
      color: primaryColor
    } : {};
    const mergeStyle = { ...color,
      ...style,
      ...this.state.hoverStyle
    };
    return React.createElement("button", {
      ref: this.linkRef,
      disabled: disabled,
      type: "button",
      id: id,
      className: `${ripple ? 'ripple' : ''} ${className || 'link'}`,
      onClick: this.onClick,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      style: mergeStyle
    }, this.props.children);
  }

}

;
GBLink.defaultProps = {
  primaryColor: '',
  style: {},
  disabled: false,
  ripple: false,
  disallowCustom: false
};

function mapStateToProps(state, props) {
  const custom = util.getValue(state, 'custom', {});
  const primaryColor = util.getValue(custom, 'primaryColor');
  const rgb = primaryColor ? util.hexToRgb(primaryColor) : '';
  let rgbColor = null;

  if (rgb) {
    rgbColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .7)`;
  }

  const className = props.className || '';
  const hoverStyle = rgb && !props.disallowCustom ? {
    color: rgbColor
  } : {};
  const style = { ...props.style
  };

  if (className.includes('button') && !props.disallowCustom) {
    hoverStyle.backgroundColor = rgbColor;
    hoverStyle.color = '#ffffff';
    style.border = `1px solid ${rgbColor}`;
  }

  return {
    primaryColor,
    hoverStyle,
    style
  };
}

export default connect(mapStateToProps, {})(GBLink);