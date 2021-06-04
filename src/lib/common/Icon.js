import React, { PureComponent } from 'react';
import { IconContext } from 'react-icons';

export default class Icon extends PureComponent {

  render() {

    const {
      color,
      size,
      className,
      style,
      attr,
      title
    } = this.props;

    return (
      <IconContext.Provider
        value={{
          color,
          size,
          className,
          style,
          attr,
          title
        }}
      >
        {this.props.children}
      </IconContext.Provider>
    )
  }
}

Icon.defaultProps = {
  color: null,
  size: '1em',
  className: 'icon',
  style: {},
  attr: {},
  title: ''
}
