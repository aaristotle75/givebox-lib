import React from 'react';
import { connect } from 'react-redux';

class When extends React.Component {

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
      <div className='fieldGroup'>
        When Fields
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(When);
