import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import {mime} from 'common/types';
import {formatBytes} from 'common/utility';

class ImageUpload extends Component {

  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.
    this.state = {
      accepted: [],
      rejected: []
    }
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
      name,
      label,
      className,
      style,
      onChange,
      error,
      errorType
    } = this.props;

    let id = `${name}-image-upload`;

    let mimes = mime.image + ',' + mime.text + ',' + mime.applications;

    return (
      <div style={style} className={`input-group ${className || ''}  ${error ? 'error tooltip' : ''}`}>
        {label && <label>{label}</label>}
        <Dropzone
          className="dropzone"
          onDrop={this.onDrop}
          accept={mimes}
        >
          <span className="text">Upload files</span>
        </Dropzone>
        <span>Accepted Files:</span>
        <ul>
          {this.state.accepted.map(f => <li key={f.name}>{f.name} - {formatBytes(f.size, 1)}</li>)}
        </ul>
        <span>Rejected Files:</span>
        <ul>
          {this.state.rejected.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)}
        </ul>
        <div className={`tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`}>
          {this.props.error}
          <i></i>
        </div>
        <div className={`errorMsg ${!error || errorType !== 'normal' && 'displayNone'}`}>{error}</div>
      </div>
    );
  }
}

ImageUpload.defaultProps = {
  name: 'defaultImageUpload',
  label: 'Image Upload'
}

export default ImageUpload;
