import React, { Component } from 'react';
import { util } from '../';

class StatBlock extends Component {

  constructor(props) {
    super(props);
    this.listOptions = this.listOptions.bind(this);
  }

  componentDidMount() {
  }

  listOptions() {
    const items = [];
    //const bindthis = this;
    if (!util.isEmpty(this.props.options)) {
      this.props.options.forEach(function(value, key) {
        items.push(
          <li key={key}>
            {value}
          </li>
        );
      });
    }
    return items;
  }

  render() {

    const {
      style,
      children
    } = this.props;

    return (
      <div className='statBlock' style={style}>
        {children}
        <ul>
          {this.listOptions()}
        </ul>
      </div>
    );
  }
}

export default StatBlock;
