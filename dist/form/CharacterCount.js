import React, { Component } from 'react';

class CharacterCount extends Component {
  render() {
    const {
      max,
      count,
      style
    } = this.props;
    return (/*#__PURE__*/React.createElement("div", {
        style: style,
        className: "characterCount"
      }, /*#__PURE__*/React.createElement("span", {
        className: "text"
      }, "Max characters ", /*#__PURE__*/React.createElement("strong", null, count, "/", max)))
    );
  }

}

;
export default CharacterCount;