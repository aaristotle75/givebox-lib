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
        <h2 className='center' style={{marginTop: '20px'}}>
          <span style={{ fontSize: 30, display: 'block', marginBottom: 5 }} className='icon icon-alert-circle'></span>
          <strong>A Network Error Occurred</strong>
          <span style={{ fontSize: 16, display: 'block' }}>Please check your internet connection.</span>
        </h2>
        <GBLink style={{ fontSize: 16, display: 'block' }} onClick={() => window.location.reload(true)}>Click Here to Reload Page</GBLink> 
      </div>
    )
  }
}
