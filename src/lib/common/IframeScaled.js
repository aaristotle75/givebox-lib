import React, { Component } from 'react';

export default class IframeScaled extends Component {

  constructor(props) {
    super(props);
    this.iframeLoaded = this.iframeLoaded.bind(this);
    this.ref = React.createRef();
    this.state = {
      iframeLoading: true
    }
  }

  componentDidMount() {
    const {
      width,
      height,
      scale,
      zoom
    } = this.props;

    const iframe = this.ref.current;
    const iframeStyle = `
      zoom: ${zoom};
      width: ${width}px;
      height: ${height}px;
      -moz-transform: scale(${scale});
      -moz-transform-origin: 0 0;
      -o-transform: scale(${scale});
      -o-transform-origin: 0 0;
      -webkit-transform: scale(${scale});
      -webkit-transform-origin: 0 0;      
    `;
    if (iframe) {
      iframe.style = iframeStyle;
    }
  }

  iframeLoaded() {
    this.setState({ iframeLoading: false });
    if (this.props.onLoad) this.props.onLoad();
  }

  render() {

    const {
      id,
      src,
      title,
      scrolling,
      scale,
      shield,
      shieldOnClick
    } = this.props;

    const height = parseInt(this.props.height * scale);
    const width = parseInt(this.props.width * scale);

    const wrapperStyle = {
      width: `${width}px`,
      height: `${height}px`,
      ...this.props.wrapperStyle
    };

    const shieldStyle = {
      width: `${width}px`,
      height: `${height}px`,
      ...this.props.shieldStyle
    };

    return (
      <div style={wrapperStyle} className='iframeScaledWrapper'>
        {this.state.iframeLoading &&
        <div className='iframeLoader'>
          <img src='https://cdn.givebox.com/givebox/public/images/spinner-loader.svg' alt='Loader' />
        </div>}
        { shield ? 
          <div 
            onClick={() => {
              if (shieldOnClick) shieldOnClick();
              else window.location.href = src;
            }}
            style={shieldStyle} 
            className='iframeShield'>
          </div>
        : null }
        <iframe
          id={id}
          src={src}
          title={title}
          scrolling={scrolling}
          frameBorder='no'
          ref={this.ref}
          onLoad={this.iframeLoaded}
        />
      </div>
    )
  }
}

IframeScaled.defaultProps = {
  id: 'iframeScaledID',
  title: 'Default iframe title',
  scrolling: 'yes',
  iframeStyle: {},
  wrapperStyle: {},
  width: 1000,
  height: 1000,
  scale: 0.25,
  zoom: 1,
  shield: true,
  shieldStyle: {},
  shieldOnClick: null
}
