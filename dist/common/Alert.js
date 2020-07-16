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
        return /*#__PURE__*/React.createElement(Error, {
          msg: msg,
          icon: this.props.iconError
        });

      case 'success':
        return /*#__PURE__*/React.createElement(Success, {
          msg: msg,
          icon: this.props.iconSuccess
        });

      case 'warning':
        return /*#__PURE__*/React.createElement(Warning, {
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
    if (this.props.callback) this.props.callback();
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
    return /*#__PURE__*/React.createElement(CSSTransition, {
      in: showAlert ? true : false,
      timeout: 300,
      classNames: "alertMsg",
      unmountOnExit: true
    }, /*#__PURE__*/React.createElement("div", {
      className: "alertMsg"
    }, closeBtn && /*#__PURE__*/React.createElement(GBLink, {
      onClick: this.close,
      className: "close"
    }, iconClose), this.renderAlert(alert, msg)));
  }

}
Alert.defaultProps = {
  iconClose: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-x"
  }),
  iconError: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-alert-circle"
  }),
  iconSuccess: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-check-circle"
  }),
  iconWarning: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-alert-circle"
  })
};
export const Error = ({
  msg,
  icon
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: `error`
  }, /*#__PURE__*/React.createElement("span", {
    className: "msgText"
  }, icon, " ", msg || msgs.error));
};
export const Success = ({
  msg,
  icon
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: `success`
  }, /*#__PURE__*/React.createElement("span", {
    className: "msgText"
  }, icon, " ", msg));
};
export const Warning = ({
  msg,
  icon
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: `warning`
  }, /*#__PURE__*/React.createElement("span", {
    className: "msgText"
  }, icon, " ", msg));
};