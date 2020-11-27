import React, { Component } from 'react';
import ModalLink from '../modal/ModalLink';

class ModalField extends Component {

  constructor(props) {
    super(props);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.state = {
      status: 'idle',
      modalLabel: this.props.modalLabel
    }
  }

  componentDidMount() {
    if (this.props.createField) {
      this.props.createField(this.props.name, this.props.params);
    }
  }

  componentDidUpdate(prev) {
    if (prev.modalLabel !== this.props.modalLabel) {
      this.setState({ modalLabel: this.props.modalLabel });
    }
  }

  onMouseEnter(e) {
    e.preventDefault();
    if (!this.props.error) this.setState({status: 'active'});
  }

  onMouseLeave(e) {
    e.preventDefault();
    this.setState({status: 'idle'});
  }

  render() {

    const {
      name,
      style,
      label,
      fixedLabel,
      className,
      error,
      errorType,
      value,
      opts,
      id,
      disallowModalBgClose
    } = this.props;

    return (
      <div style={style} className={`input-group ${className || ''} richtext-group ${error ? 'error tooltip' : ''}`}>
        <div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
        <div className={`floating-label ${this.state.status} ${fixedLabel && 'fixed'}`}>
          <div>
            <ModalLink className={`input ${value ? 'hasValue' : ''}`} id={id} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} opts={{ ...opts, disallowBgClose: disallowModalBgClose} }>{this.state.modalLabel}</ModalLink>
          </div>
          {label && <label htmlFor={name}>{label}</label>}
          <div className={`input-bottom ${error ? 'error' : this.state.status}`}></div>
        </div>
        <div className={`tooltipTop ${errorType !=='tooltip' && 'displayNone'}`}>
          {error}
          <i></i>
        </div>
      </div>
    );
  }
}

ModalField.defaultProps = {
  name: 'defaultModalField',
  modalLabel: 'Open Modal'
}

export default ModalField;
