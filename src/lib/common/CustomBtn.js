import React, {Component} from 'react';
import * as util from './utility';

class CustomBtn extends Component {

  constructor(props) {
    super(props);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.idleStyle = this.idleStyle.bind(this);
    this.hoverStyle = this.hoverStyle.bind(this);
    this.onClick = this.onClick.bind(this);
    this.linkRef = React.createRef();
    this.state = {
      hoverStyle: {}
    };
  }

  componentDidMount() {
    this.idleStyle();
  }

  onClick(e) {
    e.preventDefault();
    if (this.linkRef) {
      this.linkRef.current.blur();
    }
    if (this.props.onClick) this.props.onClick();
  }

  onMouseEnter(e) {
    this.hoverStyle();
  }

  onMouseLeave(e) {
    this.idleStyle();
  }

  idleStyle() {
    const ref = util.getValue(this.linkRef, 'current', {});
    ref.style.setProperty('color', this.props.color ? '#ffffff' : '');
    ref.style.setProperty('background', this.props.color || '');
  }

  hoverStyle() {
    const ref = util.getValue(this.linkRef, 'current', {});
    ref.style.setProperty('color', this.props.color || '');
    ref.style.setProperty('background', this.props.color ? '#ffffff' : '');
  }

  render() {
    const {
      id,
      className,
      style,
      disabled,
      ripple
    } = this.props;

    const mergeStyle = { ...style };

    return (
      <button ref={this.linkRef} disabled={disabled} type='button' id={id} className={`${ripple ? 'ripple' : ''} ${className || 'link'}`} onClick={this.onClick} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={mergeStyle}>
        {this.props.children}
      </button>
    )
  }
};

CustomBtn.defaultProps = {
  primaryColor: '',
  style: {},
  disabled: false,
  ripple: true
}

export default CustomBtn;
