import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import Loader from '../../../common/Loader';
import GBLink from '../../../common/GBLink';
import HelpfulTip from '../../../common/HelpfulTip';
import UploadPrivate from '../../../form/UploadPrivate';

class VerifyBusiness extends React.Component {

  constructor(props) {
    super(props);
    this.fileUploadSuccess = this.fileUploadSuccess.bind(this);
    this.state = {
    };
  }

  async componentDidMount() {
    this.props.getDocument('verifyBusiness');
  }

  componentWillUnmount() {
    this.props.removeResource('underwritingDocs');
  }

  fileUploadSuccess(fileName, ID) {
    this.props.getDocument('verifyBusiness', false);
  }

  render() {

    const {
      org,
      orgID,
      underwritingDocsLoading,
      doc,
      signedURL
    } = this.props;

    if (underwritingDocsLoading) return <Loader msg='Loading Business...' />

    const name = util.getValue(org, 'name');
    const taxID = util.getValue(org, 'taxID');

    return (
      <div className='fieldGroup'>
        <div className='flexCenter'>
          <div style={{ marginLeft: 0, marginRight: 0 }}>
            <span><span className='gray'>Organization/Nonprofit:</span> {name} {taxID}</span>
            <div className='gray' style={{ fontSize: 14, fontStyle: 'italic', marginLeft: 20, marginTop: 20, display: 'block' }}>
              Please upload one of the following documents:
            </div>
            <div style={{ marginTop: 5, display: 'block' }}>
              <span className='icon icon-check'></span> A non blurry photo of the IRS Letter issuing your Employer Identification Number (EIN/TaxID).
            </div>
            <div style={{ marginTop: 5, display: 'block' }}>
              <span className='icon icon-check'></span> A non blurry photo of an IRS Tax Document showing your Organization Name and EIN/Tax ID.
            </div>
          </div>
        </div>
        <div className='flexCenter'>
          <UploadPrivate
            id={orgID}
            alt={false}
            fileUploadSuccess={this.fileUploadSuccess}
            uploadLabel={`Add Proof of Tax ID`}
            tag={'proof_of_taxID'}
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

  const org = util.getValue(state, 'resource.gbx3Org.data', {});
  const underwritingDocs = util.getValue(state, 'resource.underwritingDocs', {});
  const underwritingDocsData = util.getValue(underwritingDocs, 'data');
  const doc = util.getValue(underwritingDocsData, 0, {});
  const presignedRequestList = util.getValue(underwritingDocs, 'meta.presignedRequests', []);
  const presignedRequestData = util.getValue(presignedRequestList, 0, {});
  const signedURL = util.getValue(presignedRequestData, 'signedURL');
  const underwritingDocsLoading = util.getValue(state, 'merchantApp.underwritingDocsLoading', false);

  return {
    org,
    doc,
    signedURL,
    underwritingDocsLoading
  }
}

export default connect(mapStateToProps, {
})(VerifyBusiness);
