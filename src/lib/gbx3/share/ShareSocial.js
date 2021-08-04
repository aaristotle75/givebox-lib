import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import HelpfulTip from '../../common/HelpfulTip';
import Icon from '../../common/Icon';
import Social from '../blocks/Social';
import SocialOrg from '../blocks/SocialOrg';
import { VscMegaphone } from 'react-icons/vsc';

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
      shareText,
      data,
      articleID,
      showHelper
    } = this.props;

    return (
      <div className='formSectionContainer'>
        <div className='formSection'>
          {display === 'org' ?
            <SocialOrg
              shareIconSize={40}
              subText={
                showHelper ?
                  <HelpfulTip
                    headerIcon={<Icon><VscMegaphone /></Icon>}
                    headerText={`Don't be shy!`}
                    text={`Share your profile page with your supporters, they will appreciate it! Click a social media icon below.`}
                    style={{ marginTop: 0, marginBottom: 30 }}
                  />
                : null
              }
            />
          :
            <Social
              data={data}
              articleID={articleID}
              shareIconSize={40}
              subText={
                showHelper ?
                  <HelpfulTip
                    headerIcon={<Icon><VscMegaphone /></Icon>}
                    headerText={`Don't be shy!`}
                    text={`The quickest way to start raising money is to share your fundraiser on the social media sites. Click a social media icon below.`}
                    style={{ marginTop: 0, marginBottom: 30 }}
                  />
                : null
              }
            />
          }
        </div>
      </div>
    )
  }
}

Share.defaultProps = {
  showHelper: true
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const info = util.getValue(gbx3, 'info', {});
  const display = props.display || util.getValue(info, 'display');
  const kind = props.kind || util.getValue(info, 'kind');

  return {
    kind,
    display
  }
}

export default connect(mapStateToProps, {
})(Share);
