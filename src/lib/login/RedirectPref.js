import React from 'react';
import { connect } from 'react-redux';
import * as util from '../common/utility';
import GBLink from '../common/GBLink';
import ModalRoute from '../modal/ModalRoute';
import ModalLink from '../modal/ModalLink';
import RedirectPrefModal from './RedirectPrefModal';

class RedirectPref extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      content
    } = this.props;

    return (
      <div className='redirectPref'>
        <ModalRoute
          className='gbx3'
          id={'redirectPref'}
          effect='3DFlipVert' style={{ width: '50%' }}
          component={(props) => <RedirectPrefModal {...props} /> }
          forceShowModalGraphic={true}
        />
        <ModalLink 
          id='redirectPref'
          {...this.props}
        >
          {content}
        </ModalLink>
      </div>
    )
  }
}

RedirectPref.defaultProps = {
  content: <span>Set the Page You Go After Login</span>
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(RedirectPref);
