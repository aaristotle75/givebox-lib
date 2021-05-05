import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import HelpfulTip from '../../../common/HelpfulTip';
import Loader from '../../../common/Loader';
import * as _v from '../../../form/formValidate';
import * as selectOptions from '../../../form/selectOptions';
import AnimateHeight from 'react-animate-height';
import {
  setMerchantApp
} from '../../redux/merchantActions';
import {
  getResource
} from '../../../api/helpers';
import Moment from 'moment';

class Address extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount() {
    if (util.isEmpty(this.props.address)) {
      const initLoading = await this.props.setMerchantApp('addressLoading', true);
      if (initLoading) {
        this.props.getResource('orgAddresses', {
          reload: true,
          search: {
            sort: 'createdAt',
            order: 'desc'
          },
          callback: (res, err) => {
            this.props.setMerchantApp('addressLoading', false);
          }
        });
      }
    }
  }

  render() {

    const {
      group,
      address,
      loading,
      addressPlaid
    } = this.props;

    if (loading) return <Loader msg='Loading Address...' />

    const ID = util.getValue(address, 'ID');
    const line1 = util.getValue(address, 'line1', util.getValue(addressPlaid, 'line1'));
    const line2 = util.getValue(address, 'line2');
    const city = util.getValue(address, 'city', util.getValue(addressPlaid, 'city'));
    const state = util.getValue(address, 'state', util.getValue(addressPlaid, 'state'));
    const zip = util.getValue(address, 'zip', util.getValue(addressPlaid, 'zip'));

    return (
      <div className='fieldGroup'>
        <div className='where-group'>
          {this.props.textField('ID', {
            group,
            type: 'hidden',
            value: ID,
            required: false
          })}
          {this.props.textField('line1', {
            group,
            fixedLabel: true,
            label: 'Street Address',
            placeholder: 'Enter Street Address',
            value: line1,
            validate: 'address',
            maxLength: 50,
            count: true,
            required: true
          })}
          <div className='cityStateZip'>
            <div className='part city'>
              {this.props.textField('city', {
                group,
                fixedLabel: true,
                label: 'City',
                placeholder: 'Enter City',
                value: city,
                required: true
              })}
            </div>
            <div className='part state'>
              {this.props.dropdown('state', {
                group,
                dropdownClass: 'articleCardDropdown selectCategory',
                direction: 'top',
                fixedLabel: true,
                label: 'State',
                options: selectOptions.states,
                value: state,
                required: true
              })}
            </div>
            <div className='part zip'>
              {this.props.textField('zip', {
                group,
                fixedLabel: true,
                label: 'Zip',
                placeholder: 'Enter Zip',
                maxLength: 5,
                value: zip ? zip.substring(0, 5) : '',
                required: true
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Address.defaultProps = {
  group: 'address'
}

function mapStateToProps(state, props) {

  const orgAddresses = util.getValue(state, 'resource.orgAddresses', {});
  const orgAddressesData = util.getValue(orgAddresses, 'data');
  const address = util.getValue(orgAddressesData, 0, {});
  const loading = util.getValue(state, 'merchantApp.addressLoading', false);
  const extractIdentity = util.getValue(state, 'merchantApp.extractIdentity', {});
  const addressPlaid = util.getValue(extractIdentity, 'address', {});

  return {
    address,
    loading,
    addressPlaid
  }
}

export default connect(mapStateToProps, {
  getResource,
  setMerchantApp
})(Address);
