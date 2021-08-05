import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import GBLink from '../../../common/GBLink';
import Loader from '../../../common/Loader';
import HelpfulTip from '../../../common/HelpfulTip';

class TransferStatus extends React.Component {

  constructor(props) {
    super(props);
    this.contactRequest = this.contactRequest.bind(this);
    this.state = {
      saving: false
    };
  }

  async componentDidMount() {
    const {
      approvedForTransfers,
      completedPhases
    } = this.props;

    if (approvedForTransfers && !completedPhases.includes('transferMoney')) {
      const updated = await this.props.updateOrgSignup({}, 'transferMoney');
      if (updated) this.props.stepCompleted('transferStatus', true);
    }
  }

  contactRequest() {
    this.setState({ saving: true }, () => {
      this.props.sendResource(
        'orgContactRequest', {
          method: 'put',
          resourcesToLoad: ['gbx3Org'],
          callback: (res, err) => {
            this.setState({ saving: false });
          }
      });
    });
  }

  render() {

    const {
      contactRequestDate,
      isCompleted,
      approvedForTransfers
    } = this.props;

    let desc = null;
    if (isCompleted && !approvedForTransfers) {
      desc =
        <div style={{ marginLeft: 0, marginRight: 0 }} className='stepsSubText'>
          { contactRequestDate ?
            <div className='primaryGradientText'>
              Your contact request has been received and you will receive an email from a Customer Service Representative in 1-2 business days.
            </div>
          :
            <div className='primaryGradientText'>
              If you have questions about your approval status, click the link below to have a Givebox Customer Support representative contact you by email.
              <br /><br />
              <GBLink onClick={this.contactRequest}>
                Click Here to Have a Representative Contact You.
              </GBLink>
            </div>
          }
        </div>
      ;
    }

    return (
      <div className='fieldGroup'>
        { this.state.saving ? <Loader msg='Saving' /> : null }
        {desc}
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const contactRequestDate = util.getValue(state, 'resource.gbx3Org.data.contactRequestDate', null);

  return {
    contactRequestDate
  }
}

export default connect(mapStateToProps, {
})(TransferStatus);
