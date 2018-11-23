import React, { Component } from 'react';
import { util } from '../';

class ActionBar extends Component {

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
      const width = `${parseFloat(100/this.props.options.length).toFixed(0)}%`;
      this.props.options.forEach(function(value, key) {
        items.push(
          <li style={{ width }} key={key}>
            {value}
          </li>
        );
      });
    }
    return items;
  }

  render() {

    const {
      style
    } = this.props;

    return (
      <ul style={style} className='actionBar'>
        {this.listOptions()}
      </ul>
    );
  }
}

export default ActionBar;
