import React, { Component } from 'react';

class CharacterCount extends Component {
  render() {
    const {
      max,
      count,
      style
    } = this.props;
    return React.createElement("div", {
      style: style,
      className: "characterCount"
    }, React.createElement("span", {
      className: "text"
    }, "Max characters ", React.createElement("strong", null, count, "/", max)));
  }

}

;
export default CharacterCount;