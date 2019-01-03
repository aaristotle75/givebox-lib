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
          msg: msg,
          icon: this.props.iconError
        });

      case 'success':
        return React.createElement(Success, {
          msg: msg,
          icon: this.props.iconSuccess
        });

      case 'warning':
        return React.createElement(Warning, {
          msg: msg,
          icon: this.props.iconWarning
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
      closeBtn,
      iconClose
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
    }, iconClose), this.renderAlert(alert, msg)));
  }

}
Alert.defaultProps = {
  iconClose: React.createElement("span", {
    className: "icon icon-x"
  }),
  iconError: React.createElement("span", {
    className: "icon icon-alert-circle"
  }),
  iconSuccess: React.createElement("span", {
    className: "icon icon-check-circle"
  }),
  iconWarning: React.createElement("span", {
    className: "icon icon-alert-circle"
  })
};
export const Error = ({
  msg,
  icon
}) => {
  return React.createElement("div", {
    className: `error`
  }, React.createElement("span", {
    className: "msgText"
  }, icon, " ", msg || msgs.error));
};
export const Success = ({
  msg,
  icon
}) => {
  return React.createElement("div", {
    className: `success`
  }, React.createElement("span", {
    className: "msgText"
  }, icon, " ", msg));
};
export const Warning = ({
  msg,
  icon
}) => {
  return React.createElement("div", {
    className: `warning`
  }, React.createElement("span", {
    className: "msgText"
  }, icon, " ", msg));
};