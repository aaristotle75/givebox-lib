import React, { Component } from 'react';
import { util } from '../';

class StatBlock extends Component {
  constructor(props) {
    super(props);
    this.listOptions = this.listOptions.bind(this);
  }

  componentDidMount() {}

  listOptions() {
    const items = []; //const bindthis = this;

    if (!util.isEmpty(this.props.options)) {
      this.props.options.forEach(function (value, key) {
        items.push(React.createElement("li", {
          key: key
        }, value));
      });
    }

    return items;
  }

  render() {
    const {
      style,
      children
    } = this.props;
    return React.createElement("div", {
      className: "statBlock",
      style: style
    }, children, React.createElement("ul", null, this.listOptions()));
  }

}

export default StatBlock;