import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import Loader from '../../../common/Loader';
import HelpfulTip from '../../../common/HelpfulTip';
import UploadPrivate from '../../../form/UploadPrivate';
import {
  setMerchantApp
} from '../../redux/merchantActions';
import {
  getResource,
  sendResource
} from '../../../api/helpers';


class Identity extends React.Component {

  constructor(props) {
    super(props);
    this.fileUploadSuccess = this.fileUploadSuccess.bind(this);
    this.getDocument = this.getDocument.bind(this);
    this.state = {
    };
  }

  async componentDidMount() {
    this.getDocument();

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

  async getDocument(showLoading = true) {
    const initLoading = showLoading ? await this.props.setMerchantApp('underwritingDocsLoading', true) : true;
    if (initLoading) {
      this.props.getResource('underwritingDocs', {
        id: [this.props.orgID],
        reload: true,
        search: {
          filter: `tag:"proof_of_id"`,
          sort: 'createdAt',
          order: 'desc'
        },
        callback: (res, err) => {
          const data = util.getValue(res, 'data', []);
          const item = util.getValue(data, 0, {});
          this.props.setMerchantApp('underwritingDocsLoading', false);
        }
      });
    }
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
        if (err) this.props.formProp({error: 'Error updating principal.'});
        else {
          this.getDocument(false);
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
      doc
    } = this.props;

    if (loading || underwritingDocsLoading) return <Loader msg='Loading Principal...' />

    const firstName = util.getValue(principal, 'firstName');
    const lastName = util.getValue(principal, 'lastName');

    console.log('execute doc -> ', doc);

    return (
      <div className='fieldGroup'>
        <div className='stepsSubText' style={{ marginLeft: 0, marginRight: 0 }}>Account Holder: {firstName} {lastName}</div>
        <HelpfulTip
          headerIcon={<span className='icon icon-alert-circle'></span>}
          headerText={`You Will Only Have to Verify Account Holder Identity Once`}
          text={null}
          style={{ marginTop: 30 }}
        />
        <div className='flexCenter'>
          <UploadPrivate
            id={orgID}
            alt={false}
            fileUploadSuccess={this.fileUploadSuccess}
            uploadLabel={`Add a Driver's License or U.S. Passport`}
            resourceType={'principal'}
            resourceID={util.getValue(principal, 'ID', null)}
            tag={'proof_of_id'}
            previewURL={util.getValue(doc, 'URL')}
            showPreview={true}
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
  const orgID = util.getValue(state, 'gbx3.info.orgID');
  const underwritingDocs = util.getValue(state, 'resource.underwritingDocs', {});
  const underwritingDocsData = util.getValue(underwritingDocs, 'data');
  const doc = util.getValue(underwritingDocsData, 0, {});
  const underwritingDocsLoading = util.getValue(state, 'merchantApp.underwritingDocsLoading', false);


  return {
    principal,
    loading,
    orgID,
    doc,
    underwritingDocsLoading
  }
}

export default connect(mapStateToProps, {
  setMerchantApp,
  getResource,
  sendResource
})(Identity);
