import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import Loader from '../../../common/Loader';
import HelpfulTip from '../../../common/HelpfulTip';
import UploadPrivate from '../../../form/UploadPrivate';

class Identity extends React.Component {

  constructor(props) {
    super(props);
    this.fileUploadSuccess = this.fileUploadSuccess.bind(this);
    this.state = {
    };
  }

  async componentDidMount() {
    this.props.getDocument('identity');

    if (util.isEmpty(this.props.principal)) {
      const initLoading = await this.props.setMerchantApp('principalLoading', true);
      if (initLoading) {
        this.props.getResource('orgPrincipals', {
          reload: true,
          search: {
            sort: 'createdAt',
            order: 'desc'
          },
          callback: (res, err) => {
            this.props.setMerchantApp('principalLoading', false);
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
    const principalID = util.getValue(this.props.principal, 'ID', null);
    this.props.sendResource('orgPrincipal', {
      id: [principalID],
      method: 'patch',
      data: {
        driversLicenseUploaded: true
      },
      callback: (res, err) => {
        if (err) this.props.formProp({error: 'Error updating account holder.'});
        else {
          this.props.getDocument('identity', false);
        }
      },
      reload: true,
      resourcesToLoad: ['orgPrincipals']
    });
  }

  render() {

    const {
      principal,
      loading,
      orgID,
      underwritingDocsLoading,
      doc,
      signedURL
    } = this.props;

    if (loading || underwritingDocsLoading) return <Loader msg='Loading Principal...' />

    const firstName = util.getValue(principal, 'firstName');
    const lastName = util.getValue(principal, 'lastName');

    return (
      <div className='fieldGroup'>
        <div className='flexCenter'>
          <div className='stepsSubText' style={{ marginLeft: 0, marginRight: 0 }}><span className=''><span className='label'>Account Holder:</span> {firstName} {lastName}</span></div>
        </div>
        <div className='flexCenter'>
          <UploadPrivate
            id={orgID}
            alt={false}
            fileUploadSuccess={this.fileUploadSuccess}
            uploadLabel={`Add a Driver's License or U.S. Passport`}
            resourceType={'principal'}
            resourceID={util.getValue(principal, 'ID', null)}
            tag={'proof_of_id'}
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

  const orgPrincipals = util.getValue(state, 'resource.orgPrincipals', {});
  const orgPrincipalsData = util.getValue(orgPrincipals, 'data');
  const principal = util.getValue(orgPrincipalsData, 0, {});
  const loading = util.getValue(state, 'merchantApp.principalLoading', false);
  const underwritingDocs = util.getValue(state, 'resource.underwritingDocs', {});
  const underwritingDocsData = util.getValue(underwritingDocs, 'data', []);
  const doc = util.getValue(underwritingDocsData, 0, {});
  const presignedRequestList = util.getValue(underwritingDocs, 'meta.presignedRequests', []);
  const presignedRequestData = util.getValue(presignedRequestList, 0, {});
  const signedURL = util.getValue(presignedRequestData, 'signedURL');
  const underwritingDocsLoading = util.getValue(state, 'merchantApp.underwritingDocsLoading', false);

  return {
    principal,
    loading,
    doc,
    signedURL,
    underwritingDocsLoading
  }
}

export default connect(mapStateToProps, {
})(Identity);
