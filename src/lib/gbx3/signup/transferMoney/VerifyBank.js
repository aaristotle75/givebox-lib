import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import Loader from '../../../common/Loader';
import Image from '../../../common/Image';
import GBLink from '../../../common/GBLink';
import HelpfulTip from '../../../common/HelpfulTip';
import UploadPrivate from '../../../form/UploadPrivate';
import ModalLink from '../../../modal/ModalLink';

class VerifyBank extends React.Component {

  constructor(props) {
    super(props);
    this.fileUploadSuccess = this.fileUploadSuccess.bind(this);
    this.state = {
    };
  }

  async componentDidMount() {
    this.props.getDocument('verifyBank');

    if (util.isEmpty(this.props.bankAccount)) {
      const initLoading = await this.props.setMerchantApp('bankLoading', true);
      if (initLoading) {
        this.props.getResource('orgBankAccounts', {
          reload: true,
          search: {
            sort: 'createdAt',
            order: 'desc'
          },
          callback: (res, err) => {
            this.props.setMerchantApp('bankLoading', false);
          }
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.removeResource('underwritingDocs');
  }

  fileUploadSuccess(fileName, ID) {
    //util.toTop('modalOverlay-stepsForm');
    const bankAccountID = util.getValue(this.props.bankAccount, 'ID', null);
    this.props.sendResource('orgBankAccount', {
      id: [bankAccountID],
      method: 'patch',
      data: {
        voidCheck: true
      },
      callback: (res, err) => {
        if (err) this.props.formProp({error: 'Error updating bank account.'});
        else {
          this.props.getDocument('verifyBank', false);
        }
      },
      reload: true,
      resourcesToLoad: ['orgBankAccounts']
    });
  }

  render() {

    const {
      bankAccount,
      loading,
      orgID,
      underwritingDocsLoading,
      doc,
      signedURL
    } = this.props;

    if (loading || underwritingDocsLoading) return <Loader msg='Loading Bank Account...' />

    const name = util.getValue(bankAccount, 'name');
    const last4 = util.getValue(bankAccount, 'last4');

    return (
      <div className='fieldGroup'>
        <div className='flexCenter'>
          <div className='stepsSubText' style={{ marginLeft: 0, marginRight: 0 }}>
            <span><span className='label'>Bank Account:</span> {name} xxxxxx{last4}</span>
            <ModalLink style={{ marginLeft: 0, marginRight: 0, marginTop: 5 }} className='link' id='voidCheckExample'>Click Here to See an Example of a Voided Check.</ModalLink>
          </div>
        </div>
        <div className='flexCenter'>
          <UploadPrivate
            id={orgID}
            alt={false}
            fileUploadSuccess={this.fileUploadSuccess}
            uploadLabel={`Add Bank Statement or VOID Check`}
            resourceType={'bank_account'}
            resourceID={util.getValue(bankAccount, 'ID', null)}
            tag={'bank_account'}
            previewURL={signedURL}
            docID={util.getValue(doc, 'ID')}
            showPreview={true}
            orgID={orgID}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const orgBankAccounts = util.getValue(state, 'resource.orgBankAccounts', {});
  const orgBankAccountsData = util.getValue(orgBankAccounts, 'data');
  const bankAccount = util.getValue(orgBankAccountsData, 0, {});
  const loading = util.getValue(state, 'merchantApp.bankLoading', false);
  const underwritingDocs = util.getValue(state, 'resource.underwritingDocs', {});
  const underwritingDocsData = util.getValue(underwritingDocs, 'data');
  const doc = util.getValue(underwritingDocsData, 0, {});
  const presignedRequestList = util.getValue(underwritingDocs, 'meta.presignedRequests', []);
  const presignedRequestData = util.getValue(presignedRequestList, 0, {});
  const signedURL = util.getValue(presignedRequestData, 'signedURL');
  const underwritingDocsLoading = util.getValue(state, 'merchantApp.underwritingDocsLoading', false);

  return {
    bankAccount,
    loading,
    doc,
    signedURL,
    underwritingDocsLoading
  }
}

export default connect(mapStateToProps, {
})(VerifyBank);
