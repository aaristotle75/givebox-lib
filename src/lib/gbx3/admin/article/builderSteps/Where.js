import React from 'react';
import { connect } from 'react-redux';

class Where extends React.Component {

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
        Where Fields
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(Where);
