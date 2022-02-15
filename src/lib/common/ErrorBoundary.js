import React from 'react';
import { connect } from 'react-redux';
import NetworkError from './NetworkError';
import * as util from './utility';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.props.hasNetworkError) {
      return (
        <div style={{ margin: '20px 0' }}>
          <NetworkError />
        </div>
      )
    }

    if (this.state.errorInfo) {
      // Error path
      return (
        <div style={{ padding: '30px'}} className='modalWrapper'>
          <h2 style={{ margin: '20px 0' }} className='flexCenter'>Oops, an error occurred.</h2>
          <details style={{ cursor: 'pointer', whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}


function mapStateToProps(state, props) {
  return {
    hasNetworkError: util.getValue(state, 'resource.networkError', false)
  }
}


export default connect(mapStateToProps, {
})(ErrorBoundary)
