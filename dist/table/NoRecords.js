import React, { Component } from 'react';
import { GBLink } from '../';
export default class NoRecords extends Component {
  render() {
    const {
      link,
      label,
      align,
      text
    } = this.props;
    return /*#__PURE__*/React.createElement("div", {
      className: `noRecords ${align}`
    }, /*#__PURE__*/React.createElement("span", {
      className: "normalText"
    }, text), link && /*#__PURE__*/React.createElement(GBLink, {
      onClick: link
    }, label));
  }

}
NoRecords.defaultProps = {
  align: 'center',
  label: 'Reload',
  text: 'No records found'
};