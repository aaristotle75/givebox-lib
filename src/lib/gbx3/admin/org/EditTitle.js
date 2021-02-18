import React from 'react';
import { connect } from 'react-redux';

class EditTitle extends React.Component {

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
        Edit Title....
      </div>
    )
  }
}

EditTitle.defaultProps = {
};

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(EditTitle);
