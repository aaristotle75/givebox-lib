import React from 'react';
import { connect } from 'react-redux';

class ConnectStatus extends React.Component {

  constructor(props) {
    super(props);
    this.getStatus = this.getStatus.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  getStatus() {

    return (
      <span style={{ display: 'block' }}>You must complete the previous steps to connect a bank account.</span>
    )
  }

  render() {

    const {
    } = this.props;

    return (
      <div>
        <span style={{ display: 'block', fontStyle: 'italic', fontSize: 13 }}>Your Connection Status:</span>
        {this.getStatus()}
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
})(ConnectStatus);
