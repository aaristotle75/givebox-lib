import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import GBLink from '../../../common/GBLink';
import Loader from '../../../common/Loader';
import HelpfulTip from '../../../common/HelpfulTip';
import AnimateHeight from 'react-animate-height';

class TransferStatus extends React.Component {

  constructor(props) {
    super(props);
    this.contactRequest = this.contactRequest.bind(this);
    this.state = {
      saving: false,
      showHelp: false
    };
  }

  componentDidMount() {
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
      contactRequestDate
    } = this.props;

    const {
      showHelp
    } = this.state;

    return (
      <div className='fieldGroup'>
        { this.state.saving ? <Loader msg='Saving' /> : null }
        <div style={{ marginLeft: 0, marginRight: 0 }}>
          <div style={{ marginTop: 20 }} className='flexCenter'>
            <GBLink onClick={() => this.setState({ showHelp: showHelp ? false : true })}>Why does it take so long to verify my identity?</GBLink>
          </div>
          <AnimateHeight height={showHelp ? 'auto' : 0 }>
            <div style={{ fontSize: 14, marginTop: 20 }}>
              <div style={{ display: 'block', marginBottom: 20 }}>
                <span style={{ display: 'block', fontWeight: 500, fontSize: 16 }}>We Need to Make Sure It's You and Not Someone Else</span>
                  We thoroughly review everything you submitted to make sure someone else is not using your identity to create a fraudulent account. 
                <span style={{ display: 'block', marginTop: 5 }}>
                  Verifying your Organization and Identity and banking information takes time to get confirmation from the institutions to verify it's actually you. 
                </span>
                <span style={{ display: 'block' , marginTop: 5 }}>
                  Please trust the process, we do this for your protection so your Organization and money is safe and secure and no one else has access to it.
                </span>
              </div>
              <div style={{ display: 'block', marginBottom: 20 }}>
                <span style={{ display: 'block', fontWeight: 500, fontSize: 16 }}>{ contactRequestDate ? 'Your Contact Request has been Received' : 'Do You Still have Questions?' }</span>
                { contactRequestDate ?
                  'Your contact request has been received and you will receive an email from a Customer Service Representative in 1-2 business days.'
                :
                  <GBLink onClick={this.contactRequest}>
                    Click Here to have a Representative Contact You.
                  </GBLink>
                }
              </div>                 
            </div>
          </AnimateHeight>
        </div>
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
