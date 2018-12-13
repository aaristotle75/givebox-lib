import React, { Component } from 'react';
import { GBLink } from '../';
export default class NoRecords extends Component {
  render() {
    const {
      link,
      label,
      align
    } = this.props;
    return React.createElement("div", {
      className: `noRecords ${align}`
    }, React.createElement("span", {
      className: "normalText"
    }, "No records found"), link && React.createElement(GBLink, {
      onClick: link
    }, label));
  }

}
NoRecords.defaultProps = {
  align: 'center',
  label: 'Reload'
};