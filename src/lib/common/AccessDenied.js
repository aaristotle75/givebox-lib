import React, {Component} from 'react';

export default class AccessDenied extends Component {

  render() {

    return (
      <div className='accessDenied'>
        <h2>Access Denied</h2>
      </div>
    )
  }
}

AccessDenied.defaultProps = {
  label: ''
}
