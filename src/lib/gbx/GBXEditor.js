import React, { Component } from 'react';
import {
  util
} from '../../';

export default class Title extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
    };
  }

  onBlur(name, value, hasText) {
    const content = hasText ? value : '';
    this.setState({ content });
    if (this.props.propertyCallback) this.props.propertyCallback(this.props.name, hasText ? value : '');
  }

  onChange(name, value, hasText) {
    const content = hasText ? value : '';
    this.setState({ content });
    if (this.props.propertyCallback) this.props.propertyCallback(this.props.name, hasText ? value : '');
  }

  render() {

    return (
      <>
      </>
    )
  }
}
