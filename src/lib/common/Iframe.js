import React, { Component } from 'react';

export default class Iframe extends Component {

  constructor(props) {
    super(props);
    this.iframeLoaded = this.iframeLoaded.bind(this);
    this.state = {
      iframeLoading: true
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
      ref,
      className,
      scrolling
    } = this.props;

    return (
      <div className={`iframeWrapper ${className || ''}`}>
        {this.state.iframeLoading &&
        <div className='iframeLoader'>
          <img src='https://cdn.givebox.com/givebox/public/images/spinner-loader.svg' alt='Loader' />
        </div>}
        <iframe
          id={id}
          src={src}
          title={title}
          scrolling={scrolling}
          frameBorder='no'
          ref={ref}
          onLoad={this.iframeLoaded}
        />
      </div>
    )
  }
}

Iframe.defaultProps = {
  id: 'iframeID',
  title: 'Default iframe title',
  scrolling: 'no'
}
