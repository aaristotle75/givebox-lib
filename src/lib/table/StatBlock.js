import React, { Component } from 'react';

class StatBlock extends Component {

  componentDidMount() {
  }

  render() {

    const {
      style,
      label
    } = this.props;

    return (
      <div className='statBlock' style={style}>
        <h3>{label}</h3>
      </div>
    );
  }
}

StatBlock.defaultProps = {
  label: 'Stat Block'
}

export default StatBlock;
