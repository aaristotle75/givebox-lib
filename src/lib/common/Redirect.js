import React, { Component } from 'react';

class Redirect extends Component {

  componentDidMount() {
    window.location.replace(this.props.href);
  }

  render() {

    return (
      <div className='flexCenter'>
        <h3>Redirecting....</h3>
      </div>
    )
  }
}

Redirect.defaultProps = {
  href: 'https://www.givebox.com'
}

export default Redirect;
