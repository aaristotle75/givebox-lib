import React from 'react';
import GBLink from './GBLink';

export default class NetworkError extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
    } = this.props;

    return (
      <div className='flexColumn flexCenter'>
        <h2 className='center'>
          <span style={{ fontSize: 30, display: 'block', marginBottom: 5 }} className='icon icon-alert-circle'></span>
          <strong>A Network Error Occurred</strong>
          <span style={{ fontSize: 16, display: 'block' }}>Please check your internet connection and reload the page.</span>
        </h2>
      </div>
    )
  }
}
