import React from 'react';
import { connect } from 'react-redux';

class SignupSteps extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      stepName
    } = this.props;

    return (
      <div className='modalWrapper'>
        SignupSteps {stepName}
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
})(SignupSteps);
