import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleModal } from '../api/actions';
import {
  GBLink,
  util
} from '../';
import AvatarEditor from 'react-avatar-editor';
const ResizableBox = require('react-resizable').ResizableBox;

class UploadEditorResizer extends Component {

  constructor(props) {
    super(props);
    this.setScale = this.setScale.bind(this);
    this.cancel = this.cancel.bind(this);
    this.save = this.save.bind(this);
    this.saveCallback= this.saveCallback.bind(this);
    this.saveMediaItem = this.saveMediaItem.bind(this);
    this.saveMediaItemCallback = this.saveMediaItemCallback.bind(this);
		this.onResizeStart = this.onResizeStart.bind(this);
		this.onResizeStop = this.onResizeStop.bind(this);
		this.onResize = this.onResize.bind(this);
		this.handleAspectRatio = this.handleAspectRatio.bind(this);
		this.getMeta = this.getMeta.bind(this);
    this.state = {
      image: this.props.image || '',
      allowZoomOut: true,
      position: { x: 0.5, y: 0.5 },
      scale: this.props.defaultScale,
      rotate: 0,
      borderRadius: this.props.borderRadius,
      preview: null,
      width: this.props.width,
      height: this.props.height
    }
  }

	componentDidMount() {
		this.getMeta(this.state.image);
	}

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

	getMeta(url) {
		const bindthis = this;
	  const img = new Image();
    img.onload = function() {
			bindthis.handleAspectRatio(this.src, this.width, this.height);
    };
    img.src = url;
	}

	handleAspectRatio(url, w, h) {
		const maxWidth = this.props.maxWidth;
		const maxHeight = this.props.maxHeight;
		let ratio = 0;
		let width = w;
		let height = h;

		if (width > maxWidth) {
			ratio = maxWidth / width;
			height = parseInt(height * ratio);
			width = parseInt(width * ratio);
		}

		if (height > maxHeight) {
			ratio = maxHeight / height;
			width = parseInt(width * ratio);
			height = parseInt(height * ratio);
		}

		this.setState({
			width,
			height
		});
	}

  cancel() {
    this.props.toggleEditor(false);
  }

  save() {
    const data = this.editor.getImage().toDataURL();
    const file = util.dataURLtoFile(data, `image.png`);
    this.props.handleSave(file, this.saveCallback, this.props.encodeProgress);
    this.props.setLoading('Processing image...');
  }

  saveCallback(url) {
		this.saveMediaItem(url);
  }

  saveMediaItem(url) {
    this.props.sendResource(this.props.super ? 'superOrgMediaItems' : 'orgMediaItems', {
      id: this.props.orgID ? [this.props.orgID] : null,
      data: {
        URL: url
      },
      method: 'post',
      resourcesToLoad: this.props.super ? ['superOrgMediaItems'] : ['orgMediaItems'],
      callback: this.saveMediaItemCallback,
      isSending: false
    });
  }

  saveMediaItemCallback(res, err) {
		this.timeout = setTimeout(() => {
	    this.props.handleSaveCallback(res.URL);
	    this.props.setSelected(res.URL, res.ID, null, true);
	    this.props.toggleEditor(false);
	    this.props.setLoading(false);
			this.timeout = null;
		}, 500 );
  }

  handleScale = e => {
    const scale = parseFloat(e.target.value)
    this.setState({ scale })
  }

  setScale(scale) {
    this.setState({ scale });
  }

  handleAllowZoomOut = ({ target: { checked: allowZoomOut } }) => {
    this.setState({ allowZoomOut })
  }

  rotateLeft = e => {
    //e.preventDefault();
    this.setState({
      rotate: this.state.rotate - 90,
    })
  }

  rotateRight = e => {
    //e.preventDefault()
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

	onResize(e, data) {
		const {
			width,
			height
		} = data.size;

		this.setState({ width, height });
	}

	onResizeStart(e, data) {
		//console.log('execute onResizeStart');
	}


	onResizeStop(e, data) {
		const {
			width,
			height
		} = data.size;

		this.setState({ width, height });
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

		const {
			height,
			width
		} = this.state;

    return (
      <div className='uploadEditorContainer'>
        <div className='uploadResizerContent'>
					<ResizableBox
						width={width}
						height={height}
						minConstraints={[this.props.minWidth, this.props.minHeight]}
						maxConstraints={[this.props.maxWidth, this.props.maxHeight]}
						onResize={this.onResize}
						resizeHandles={['s', 'w', 'n', 'e', 'sw', 'nw', 'se', 'ne']}
					>
	          <AvatarEditor
	            ref={this.setEditorRef}
	            scale={parseFloat(this.state.scale)}
	            width={width || this.props.minWidth}
	            height={height || this.props.minHeight}
	            position={this.state.position}
	            onPositionChange={this.handlePositionChange}
	            rotate={parseFloat(this.state.rotate)}
	            borderRadius={this.state.width / (100 / this.state.borderRadius)}
	            onLoadFailure={this.logCallback.bind(this, 'onLoadFailed')}
	            onLoadSuccess={this.logCallback.bind(this, 'onLoadSuccess')}
	            onImageReady={this.logCallback.bind(this, 'onImageReady')}
	            image={this.state.image}
	            className="editor-canvas"
	            color={[37, 54, 85, .4]}
	            border={[0, 0]}
							disableBoundaryChecks={true}
	          />
					</ResizableBox>
        </div>
        <div className='menu'>
          <div className='rotate'>
            <GBLink onClick={this.rotateLeft}><span className='icon icon-rotate-ccw'></span></GBLink>
            <GBLink onClick={this.rotateRight}><span className='icon icon-rotate-cw'></span></GBLink>
          </div>
          <div className='scale'>
            <GBLink onClick={() => this.setScale(this.props.minScale)}><span className='icon small icon-image'></span></GBLink>
            <input
              name="scale"
              type="range"
              onChange={this.handleScale}
              min={this.props.minScale}
              max={this.props.maxScale}
              step="0.01"
              value={this.state.scale}
            />
            <GBLink onClick={() => this.setScale(this.props.maxScale)}><span className='icon icon-image'></span></GBLink>
          </div>
					{/*
          <div className='scale'>
            <GBLink onClick={() => this.setScale(this.props.minScale)}><span className='icon small icon-image'></span></GBLink>
            <input
              name="borderRadius"
              type="range"
              onChange={this.handleBorderRadius}
              min={this.props.minRadius}
              max={this.props.maxRadius}
              step="0"
              value={this.state.borderRadius}
            />
            <GBLink onClick={() => this.setScale(this.props.maxScale)}><span className='icon icon-image'></span></GBLink>
          </div>
					*/}
	        <div className='button-group'>
	          <GBLink className='link' onClick={() => this.cancel()}>Cancel</GBLink>
	          <GBLink style={{ width: '150px' }} className='button' onClick={() => this.save()}>Upload</GBLink>
	        </div>
        </div>
      </div>
    );
  }
}

UploadEditorResizer.defaultProps = {
  width: 290,
  maxWidth: 500,
  minWidth: 100,
  height: 290,
  maxHeight: 300,
  minHeight: 100,
  minScale: .25,
  maxScale: 2,
	minRadius: 0,
	maxRadius: 50,
  defaultScale: 1,
  borderRadius: 0
}

function mapStateToProps(state, props) {
  return {
  }
}


export default connect(mapStateToProps, {
  toggleModal
})(UploadEditorResizer)
