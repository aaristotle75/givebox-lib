import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { mime } from '../common/types';
import { formatBytes } from '../common/utility';

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.state = {
      accepted: [],
      rejected: []
    };
  }

  componentDidMount() {
    if (this.props.createField) this.props.createField(this.props.name, this.props.params);
  }

  onDrop(accepted, rejected) {
    console.log('onDrop', accepted, rejected);
    this.setState({
      accepted: accepted,
      rejected: rejected
    });
  }

  render() {
    const {
      label,
      className,
      style,
      error,
      errorType
    } = this.props;
    const mimes = mime.image + ',' + mime.text + ',' + mime.applications;
    return React.createElement("div", {
      style: style,
      className: `input-group ${className || ''}  ${error ? 'error tooltip' : ''}`
    }, label && React.createElement("label", null, label), React.createElement(Dropzone, {
      className: "dropzone",
      onDrop: this.onDrop,
      accept: mimes
    }, React.createElement("span", {
      className: "text"
    }, "Upload files")), React.createElement("span", null, "Accepted Files:"), React.createElement("ul", null, this.state.accepted.map(f => React.createElement("li", {
      key: f.name
    }, f.name, " - ", formatBytes(f.size, 1)))), React.createElement("span", null, "Rejected Files:"), React.createElement("ul", null, this.state.rejected.map(f => React.createElement("li", {
      key: f.name
    }, f.name, " - ", f.size, " bytes"))), React.createElement("div", {
      className: `tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`
    }, this.props.error, React.createElement("i", null)), React.createElement("div", {
      className: `errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`
    }, error));
  }

}

ImageUpload.defaultProps = {
  name: 'defaultImageUpload',
  label: 'Image Upload'
};
export default ImageUpload;