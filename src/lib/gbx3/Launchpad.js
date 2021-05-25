import React from 'react';
import { connect } from 'react-redux';

class Launchpad extends React.Component {

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
      <>
        <div className='launchpadScreen'></div>
        <div className='launchpadContent'>
          Launchpad
        </div>
      </>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(Launchpad);
