import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import Social from '../blocks/Social';
import SocialOrg from '../blocks/SocialOrg';

class Share extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    const {
      kind,
      display,
      shareText
    } = this.props;

    return (
      <div className='formSectionContainer'>
        <div className='formSection'>
          {display === 'org' ?
            <SocialOrg
              shareIconSize={40}
              subText={
                <div className='subText'>
                  { shareText || `Select Where You'd Like to Share Your Page` }
                </div>
              }
            />
          :
          <Social
            shareIconSize={40}
            subText={
              <div className='subText'>
                { shareText || `Select Where You'd Like to Share Your ${types.kind(kind).name}` }
              </div>
            }
          />
          }
        </div>
      </div>
    )
  }
}

Share.defaultProps = {
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const info = util.getValue(gbx3, 'info', {});
  const display = util.getValue(info, 'display');
  const kind = util.getValue(info, 'kind');

  return {
    kind,
    display
  }
}

export default connect(mapStateToProps, {
})(Share);
