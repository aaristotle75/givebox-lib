import React, {Component} from 'react';
import Portal from './Portal';
import * as util from './utility';

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
    this.setState({rootEl: document.getElementById('app-root')}, this.stopLoader);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.setState({ end: true });
  }

  stopLoader() {
    this.timeout = setTimeout(() => {
      this.setState({ showLoader: false });
    }, 30000);
  }

  createSVG() {
    const svg = <img alt='Givebox loader' className={`loaderSVG ${this.state.end ? 'fadeOut' : ''}`} src='https://s3-us-west-1.amazonaws.com/givebox/public/gb-logo3.svg' type='image/svg+xml' />
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
          <div className={`loader ${className}`} />
          <div className='loaderContent'>
            <div className='loadingText'>
               <div>{this.createSVG()}</div>
              <span className={`${showMsg ? '' : 'displayNone'}`} style={{color: `${textColor ? textColor : '#fff'}` }}>{msg}</span>
            </div>
          </div>
        </div>
      </Portal>
      : <div></div>
    )
  }
}
