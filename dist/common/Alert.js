import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import { msgs } from '../form/formValidate';
import GBLink from './GBLink';
export class Alert extends Component {
  constructor(props) {
    super(props);
    this.renderAlert = this.renderAlert.bind(this);
    this.close = this.close.bind(this);
    this.state = {
      display: this.props.display ? 'show' : 'hide'
    };
  }

  componentDidMount() {}

  componentDidUpdate(nextProps) {
    if (this.props.display !== nextProps.display) {
      this.timeout = setTimeout(() => {
        this.setState({
          display: this.props.display ? 'show' : 'hide'
        });
        this.timeout = null;
      }, 0);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  renderAlert(alert, msg) {
    switch (alert) {
      case 'error':
        return React.createElement(Error, {
          msg: msg
        });

      case 'success':
        return React.createElement(Success, {
          msg: msg
        });

      case 'warning':
        return React.createElement(Warning, {
          msg: msg
        });
      // no default
    }
  }

  close() {
    this.setState({
      display: 'hide'
    });
  }

  render() {
    const {
      alert,
      msg,
      display,
      closeBtn
    } = this.props;
    const showAlert = display && this.state.display !== 'hide' ? true : false;
    return React.createElement(CSSTransition, {
      in: showAlert ? true : false,
      timeout: 300,
      classNames: "alertMsg",
      unmountOnExit: true
    }, React.createElement("div", {
      className: "alertMsg"
    }, closeBtn && React.createElement(GBLink, {
      onClick: this.close,
      className: "close"
    }, React.createElement("span", {
      className: "icon icon-close"
    })), this.renderAlert(alert, msg)));
  }

}
export const Error = ({
  msg
}) => {
  return React.createElement("div", {
    className: `error`
  }, React.createElement("span", {
    className: "msgText"
  }, React.createElement("span", {
    className: "icon icon-error-circle"
  }), " ", msg || msgs.error));
};
export const Success = ({
  msg
}) => {
  return React.createElement("div", {
    className: `success`
  }, React.createElement("span", {
    className: "msgText"
  }, React.createElement("span", {
    className: "icon icon-checkmark-circle"
  }), " ", msg));
};
export const Warning = ({
  msg
}) => {
  return React.createElement("div", {
    className: `warning`
  }, React.createElement("span", {
    className: "msgText"
  }, React.createElement("span", {
    className: "icon icon-error-circle"
  }), " ", msg));
};