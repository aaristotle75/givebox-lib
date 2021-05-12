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
    this.state = {
    };
  }

  async componentDidMount() {
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

  fileUploadSuccess(res) {
    util.toTop('modalOverlay-merchantForm');
    const principals = util.getValue(this.props.orgPrincipals, 'data', {});
    const principal = util.getValue(principals, 0, {});
    const principalID = util.getValue(principal, 'ID', null);
    this.props.sendResource('orgPrincipal', {
      id: [principalID],
      method: 'patch',
      data: {
        driversLicenseUploaded: true
      },
      callback: (res, err) => {
        if (err) this.props.formProp({error: 'Error updating principal.'});
        else this.props.setFileUploaded(true);
      },
      reload: true,
      resourcesToLoad: ['orgPrincipals']
    });
  }

  render() {

    const {
      principal,
      loading,
      orgID
    } = this.props;

    if (loading) return <Loader msg='Loading Principal...' />

    const firstName = util.getValue(principal, 'firstName');
    const lastName = util.getValue(principal, 'lastName');

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

  return {
    principal,
    loading,
    orgID
  }
}

export default connect(mapStateToProps, {
  setMerchantApp,
  getResource,
  sendResource
})(Identity);
