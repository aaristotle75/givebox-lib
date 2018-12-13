import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import { msgs } from '../form/formValidate';
export class Alert extends Component {
  constructor(props) {
    super(props);
    this.renderAlert = this.renderAlert.bind(this);
  }

  componentDidMount() {}

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
      // no default
    }
  }

  render() {
    const {
      alert,
      msg,
      display
    } = this.props;
    return React.createElement(CSSTransition, {
      in: display ? true : false,
      timeout: 300,
      classNames: "alertMsg",
      unmountOnExit: true
    }, React.createElement("div", {
      className: "alertMsg"
    }, this.renderAlert(alert, msg)));
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