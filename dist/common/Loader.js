import React, { Component } from 'react';
import Portal from './Portal';
import { util } from '../';
export default class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      end: false,
      rootEl: null
    };
  }

  componentDidMount() {
    this.setState({
      rootEl: document.getElementById('app-root')
    });
  }

  componentWillUnmount() {
    this.setState({
      end: true
    });
  }

  createSVG() {
    const svg = React.createElement("img", {
      alt: "Givebox loader",
      className: `loaderSVG ${this.state.end ? 'fadeOut' : ''}`,
      src: "https://s3-us-west-1.amazonaws.com/givebox/public/gb-logo3.svg",
      type: "image/svg+xml"
    });
    return svg;
  }

  render() {
    const {
      msg,
      textColor,
      forceText,
      className
    } = this.props;
    if (!this.state.rootEl) return React.createElement("div", null);
    const showMsg = !!forceText;
    return React.createElement(Portal, {
      id: "loadingPortal",
      rootEl: this.state.rootEl
    }, React.createElement("div", {
      className: `loader ${className}`
    }), React.createElement("div", {
      className: "loaderContent"
    }, React.createElement("div", {
      className: "loadingText"
    }, React.createElement("div", null, this.createSVG()), React.createElement("span", {
      className: `${showMsg ? '' : 'displayNone'}`,
      style: {
        color: `${textColor ? textColor : '#fff'}`
      }
    }, msg))));
  }

}