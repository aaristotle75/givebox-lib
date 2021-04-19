import React from 'react';
import { connect } from 'react-redux';

class ConnectBankSteps extends React.Component {

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
      <div className='modalWrapper'>
        Connect Bank Steps
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
})(ConnectBankSteps);
