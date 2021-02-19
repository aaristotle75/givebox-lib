import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';

class EditArticleCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      item
    } = this.props;

    return (
      <div className='modalWrapper'>
        Edit Card....<br />
        {util.getValue(item, 'title')}
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(EditArticleCard);
