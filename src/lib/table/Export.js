import React, {Component} from 'react';
import { connect } from 'react-redux';
import CalendarRange from '../form/CalendarRange';
import { Alert, Dropdown } from '../';
import { getResource } from '../api/helpers';
import { toggleModal } from '../api/actions';
import Moment from 'moment';
const browser = require('detect-browser');
const browserName = browser.name;

class Export extends Component {

  constructor(props) {
    super(props);
    this.setOptions = this.setOptions.bind(this);
    this.onChange = this.onChange.bind(this);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
    this.onChangeRange1 = this.onChangeRange1.bind(this);
    this.onChangeRange2 = this.onChangeRange2.bind(this);
    this.state = {
      link: null,
      error: 'Please fix errors to continue',
      all: true,
      range1: Moment().subtract(3, 'months').unix(),
      range2: Moment().unix()
    }
  }

  componentDidMount() {
    const link = this.props.getResource('orgCustomers', { csv: true });
    this.setState({ link });
  }

  confirm() {
    const endpoint = this.props.getResource('orgCustomers', { csv: true });
    console.log('confirm', endpoint);
  }

  cancel() {
    this.props.toggleModal('exportRecords', false);
  }

  onChange(name, value) {
    console.log(name, value);
    this.setState({ all: value === 'all' ? true : false });
  }

  onChangeRange1(ts) {
    console.log('onChangeRange1', ts);
    this.setState({ range1: ts });
  }

  onChangeRange2(ts) {
    console.log('onChangeRange2', ts);
    this.setState({ range2: ts });
  }

  setOptions() {
    var items = [
      { primaryText: 'All Transactions', value: 'all' },
      { primaryText: 'Specific date range', value: 'daterange' }
    ];
    return items;
  }

  makeLink() {
    let filter = '';
    if (!this.state.all) {
      filter = 'createdAt:>d'+this.state.range1+'%3BcreatedAt:<d'+this.state.range2;
    }
    return this.props.getResource('orgCustomers', { csv: true, search: { filter } });
  }

  render() {

    const {
      style
    } = this.props;

    console.log(this.state.range1, this.state.range2);

    return (
      <div id='exportRecords' style={style} className={`exportRecords`}>
        <Alert alert='error' msg={this.state.error} />
        <div className='row'>
          <div className='col center' style={{ width: '50%' }}>
            <Dropdown options={this.setOptions()} defaultValue={'all'} onChange={this.onChange} />
          </div>
        </div>
        <div className={`row ${this.state.all && 'displayNone'}`}>
          <div className='col'>
            <label className='side'>Date</label>
          </div>
          <div className='col'>
            <CalendarRange
              enableTime={false}
              nameFrom='exportRange1'
              labelFrom={'From'}
              nameTo='exportRange2'
              labelTo={'To'}
              onChangeRange1={this.onChangeRange1}
              range1Value={this.state.range1}
              onChangeRange2={this.onChangeRange2}
              range2Value={this.state.range2}
            />
          </div>
        </div>
        <div className='row'>
          <div className='button-group'>
            <button className="button secondary" type="button" onClick={this.cancel}>Cancel</button>
            <a href={this.state.link} className="button">Download Report</a>
          </div>
        </div>
      </div>
    );
  }
}

Export.defaultProps = {
}

function mapStateToProps(state, props) {
	let resource = state.resource[props.name] ? state.resource[props.name] : {};

  return {
    resource: resource
  }
}

export default connect(mapStateToProps, {
	toggleModal,
  getResource
})(Export)
