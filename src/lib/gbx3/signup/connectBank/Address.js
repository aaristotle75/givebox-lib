import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import HelpfulTip from '../../../common/HelpfulTip';
import Loader from '../../../common/Loader';
import * as _v from '../../../form/formValidate';
import * as selectOptions from '../../../form/selectOptions';
import AnimateHeight from 'react-animate-height';
import {
  getAddress,
  updateMerchantApp
} from '../../redux/merchantActions';
import Moment from 'moment';

class Address extends React.Component {

  constructor(props) {
    super(props);
    this.updateField = this.updateField.bind(this);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.props.getAddress({
      reload: false,
      callback: () => {
        this.setState({ loading: false });
      }
    });
  }

  updateField(field, value) {
    this.props.updateMerchantApp('address', { [field]: value });
  }

  render() {

    const {
      group,
      address
    } = this.props;

    const {
      line1,
      line2,
      city,
      state,
      zip,
      country
    } = address;

    if (this.state.loading) return <Loader msg='Loading Address...' />

    return (
      <div className='fieldGroup'>
        <div className='where-group'>
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

  const address = util.getValue(state, 'merchantApp.address', {});

  return {
    address
  }
}

export default connect(mapStateToProps, {
  getAddress,
  updateMerchantApp
})(Address);
