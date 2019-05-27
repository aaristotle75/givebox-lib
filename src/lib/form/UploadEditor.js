import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { toggleModal } from '../api/actions';
import {
  GBLink
} from '../';
import AvatarEditor from 'react-avatar-editor'
import UploadPreview from './UploadPreview'
import Dropzone from 'react-dropzone'

class UploadEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      image: this.props.image || '',
      allowZoomOut: false,
      position: { x: 0.5, y: 0.5 },
      scale: 1,
      rotate: 0,
      borderRadius: 0,
      preview: null,
      width: 290,
      height: 290
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prev) {
  }

  handleSave = data => {
    const img = this.editor.getImageScaledToCanvas().toDataURL()
    const rect = this.editor.getCroppingRect()

    this.setState({
      preview: {
        img,
        rect,
        scale: this.state.scale,
        width: this.state.width,
        height: this.state.height,
        borderRadius: this.state.borderRadius,
      },
    })
  }

  handleScale = e => {
    const scale = parseFloat(e.target.value)
    this.setState({ scale })
  }

  handleAllowZoomOut = ({ target: { checked: allowZoomOut } }) => {
    this.setState({ allowZoomOut })
  }

  rotateLeft = e => {
    e.preventDefault()

    this.setState({
      rotate: this.state.rotate - 90,
    })
  }

  rotateRight = e => {
    e.preventDefault()
    this.setState({
      rotate: this.state.rotate + 90,
    })
  }

  handleBorderRadius = e => {
    const borderRadius = parseInt(e.target.value)
    this.setState({ borderRadius })
  }

  handleXPosition = e => {
    const x = parseFloat(e.target.value)
    this.setState({ position: { ...this.state.position, x } })
  }

  handleYPosition = e => {
    const y = parseFloat(e.target.value)
    this.setState({ position: { ...this.state.position, y } })
  }

  handleWidth = e => {
    const width = parseInt(e.target.value);
    this.setState({ width: width <= this.props.maxWidth ? width : width ? this.props.maxWidth : '' });
  }

  handleHeight = e => {
    const height = parseInt(e.target.value);
    this.setState({ height: height <= this.props.maxHeight ? height : height ? this.props.maxHeight : '' });
  }

  logCallback(e) {
    // eslint-disable-next-line
    console.log('callback', e)
  }

  setEditorRef = editor => {
    if (editor) this.editor = editor
  }

  handlePositionChange = position => {
    this.setState({ position })
  }

  handleDrop = acceptedFiles => {
    this.setState({ image: acceptedFiles[0] })
  }

  render() {

    return (
      <div className='uploadEditorContainer'>
        <div className='content'>
          <div className='uploadEditor'>
            <AvatarEditor
              ref={this.setEditorRef}
              scale={parseFloat(this.state.scale)}
              width={this.state.width || this.props.minWidth}
              height={this.state.height || this.props.minHeight}
              position={this.state.position}
              onPositionChange={this.handlePositionChange}
              rotate={parseFloat(this.state.rotate)}
              borderRadius={this.state.width / (100 / 50)}
              onLoadFailure={this.logCallback.bind(this, 'onLoadFailed')}
              onLoadSuccess={this.logCallback.bind(this, 'onLoadSuccess')}
              onImageReady={this.logCallback.bind(this, 'onImageReady')}
              image={this.state.image}
              className="editor-canvas"
              color={[37, 54, 85, .3]}
              border={[100, 20]}
            />
            <br />
            Border radius:
            <input
              name="scale"
              type="range"
              onChange={this.handleBorderRadius}
              min="0"
              max="50"
              step="1"
              defaultValue="0"
            />
            {!!this.state.preview && (
              <img
                alt={'Preview'}
                src={this.state.preview.img}
                style={{
                  borderRadius: `${(Math.min(
                    this.state.preview.height,
                    this.state.preview.width
                  ) +
                    10) *
                    (this.state.preview.borderRadius / 2 / 100)}px`,
                }}
              />
            )}
            {/*
            {!!this.state.preview && (
              <UploadPreview
                width={
                  this.state.preview.scale < 1
                    ? this.state.preview.width
                    : this.state.preview.height * 478 / 270
                }
                height={this.state.preview.height}
                image=''
                rect={this.state.preview.rect}
              />
            )}
            */}
          </div>
        </div>
        <div className='menu'>
          <div className='rotate'>
            <GBLink onClick={this.rotateLeft}><span className='icon icon-rotate-ccw'></span></GBLink>
            <GBLink onClick={this.rotateRight}><span className='icon icon-rotate-cw'></span></GBLink>
          </div>
          <div className='scale'>
            <input
              name="scale"
              type="range"
              onChange={this.handleScale}
              min={'0.1'}
              max="2"
              step="0.01"
              defaultValue="1"
            />
          </div>
          <div className='button-group'>
            <input type="button" onClick={this.handleSave} value="Preview" />
            <GBLink className='link secondary' onClick={() => this.props.toggleEditor(false)}>Cancel</GBLink>
            <GBLink onClick={() => this.props.toggleEditor(false)}>Save</GBLink>
          </div>
        </div>
      </div>
    );
  }
}

UploadEditor.defaultProps = {
  maxWidth: 300,
  minWidth: 100,
  maxHeight: 300,
  minHeight: 100
}

function mapStateToProps(state, props) {
  return {
  }
}


export default connect(mapStateToProps, {
  toggleModal
})(UploadEditor)
