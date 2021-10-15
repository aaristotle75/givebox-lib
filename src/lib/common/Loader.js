import React, {Component} from 'react';
import Portal from './Portal';
import * as util from './utility';
import Lottie from 'lottie-react';
import * as universalLoader from './loader.json';

export default class Loader extends Component {

  constructor(props) {
    super(props);
    this.stopLoader = this.stopLoader.bind(this);
    this.state = {
      end: false,
      rootEl: null,
      showLoader: true
    };
  }

  componentDidMount() {
    this.setState({rootEl: document.getElementById('root')}, this.stopLoader);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.setState({ end: true });
  }

  stopLoader() {
    if (!this.props.infinite) {
      this.timeout = setTimeout(() => {
        this.setState({ showLoader: false });
      }, 30000);
    }
  }

  createSVG() {
    const svg = <img alt='Givebox loader' className={`loaderSVG ${this.state.end ? 'fadeOut' : ''}`} src='https://cdn.givebox.com/givebox/public/gb-logo3.svg' type='image/svg+xml' />
    return svg;
  }

  render() {

    const { msg, textColor, forceText, className } = this.props;

    if (!this.state.rootEl) return ( <div></div> );
    const showMsg = process.env.REACT_APP_ENV === 'local' || forceText ? true : false;

    return (
      this.state.showLoader ?
      <Portal id='loadingPortal' rootEl={this.state.rootEl}>
        <div>
          {this.props.children}
          <div className={`loader ${className}`} />
          <div className='loaderContent'>
            <div className='loadingText'>
              <Lottie
               style={{
                 width: 45,
                 height: 45
               }}
                animationData={universalLoader.default}
              />
              {/*
              <img src='https://cdn.givebox.com/givebox/public/universal-loader-60fps.png' alt='Loading' />
              */}
              <span className={`${showMsg ? '' : 'displayNone'}`} style={{color: `${textColor ? textColor : '#fff'}` }}>{msg}</span>
            </div>
          </div>
        </div>
      </Portal>
      : null
    )
  }
}

Loader.defaultProps = {
  infinite: false
};
