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
      doc
    } = this.props;

    if (underwritingDocsLoading) return <Loader msg='Loading Business...' />

    const name = util.getValue(org, 'name');
    const taxID = util.getValue(org, 'taxID');

    return (
      <div className='fieldGroup'>
        <div className='stepsSubText' style={{ marginTop: 20, marginLeft: 0, marginRight: 0 }}>Business/Nonprofit: {name} {taxID}</div>
        <HelpfulTip
          headerIcon={<span className='icon icon-shield'></span>}
          headerText={`Secure and Private File Upload`}
          text={'We keep your documents on an encrypted PCI compliant server. We value your privacy and your documents are never shared with third party marketing or social media companies.'}
          style={{ marginTop: 30 }}
        />
        <div className='flexCenter'>
          <UploadPrivate
            id={orgID}
            alt={false}
            fileUploadSuccess={this.fileUploadSuccess}
            uploadLabel={`Add Proof of Tax ID`}
            tag={'proof_of_taxID'}
            previewURL={util.getValue(doc, 'URL')}
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
  const underwritingDocsLoading = util.getValue(state, 'merchantApp.underwritingDocsLoading', false);

  return {
    org,
    doc,
    underwritingDocsLoading
  }
}

export default connect(mapStateToProps, {
})(VerifyBusiness);
