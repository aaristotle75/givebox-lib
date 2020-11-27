import React, { Component } from 'react';
import { connect } from 'react-redux';
import HelpDesk from '../lib/helpdesk/HelpDesk';
import * as util from '../lib/common/utility';

class HelpDeskDemo extends Component {

  render() {

    const {
      access
    } = this.props;

    const email = util.getValue(access, 'email'); //'buddyteal333@gmail.com';
    const orgName = util.getValue(access, 'orgName');
    const orgID = util.getValue(access, 'orgID');

    return (
      <div>
        <HelpDesk
          orgName={orgName}
          orgID={orgID}
          email={email}
          firstName={util.getValue(access, 'firstName')}
          lastName={util.getValue(access, 'lastName')}
          role={util.getValue(access, 'role')}
          channel={'Nonprofit Admin'}
          category='events'
          kb='faq'
          departmentId='458931000000006907'
          teamId='458931000000192161'
        />
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
    access: util.getValue(state.resource, 'access', {})
  }
}

export default connect(mapStateToProps, {
})(HelpDeskDemo);
