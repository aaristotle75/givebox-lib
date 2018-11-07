import React, {Component} from 'react';
import { connect } from 'react-redux';
import CalendarRange from '../form/CalendarRange';
import { Alert, Dropdown } from '../';
import { getResource } from '../api/helpers';
import { toggleModal } from '../api/actions';
import Moment from 'moment';

class Export extends Component {

  constructor(props) {
    super(props);
    this.setOptions = this.setOptions.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeRange1 = this.onChangeRange1.bind(this);
    this.onChangeRange2 = this.onChangeRange2.bind(this);
    this.state = {
      link: null,
      error: '',
      all: true,
      range1: Moment().subtract(3, 'month').unix(),
      range2: Moment().unix()
    }
  }

  componentDidMount() {
    this.makeLink();
  }

  onChange(name, value) {
    this.makeLink(null, null, value === 'all' ? true : false);
  }

  onChangeRange1(ts) {
    this.makeLink(ts/1000, null, false);
  }

  onChangeRange2(ts) {
    this.makeLink(null, ts/1000, false);
  }

  setOptions() {
    var items = [
      { primaryText: 'All Records', value: 'all' },
      { primaryText: 'Specific date range', value: 'daterange' }
    ];
    return items;
  }

  makeLink(range1, range2, all = true) {
    const range1utc = Moment.unix(range1 || this.state.range1).startOf('day').unix();
    const range2utc = Moment.unix(range2 || this.state.range2).endOf('day').unix();
    let filter = '';
    if (!all) {
      filter = `createdAt:>d${range1utc}%3BcreatedAt:<d${range2utc}`;
    }
    const link = this.props.getResource(this.props.name, { csv: true, search: { filter, max: 100000000 } });

    this.setState({
      all: all,
      range1: range1 || this.state.range1,
      range2: range2 || this.state.range2,
      link
    })
  }

  render() {

    const {
      style,
      desc
    } = this.props;

    return (
      <div id='exportRecords' style={style} className={`exportRecords`}>
        <Alert alert='error' msg={this.state.error} />
        <div className='row'>
          <h3>{desc}</h3>
          <div className='col center' style={{ width: '50%' }}>
            <Dropdown options={this.setOptions()} defaultValue={'all'} onChange={this.onChange} />
          </div>
        </div>
        <div className={`row ${this.state.all && 'displayNone'}`}>
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
            <a href={this.state.link} rel='noopener noreferrer' target='_blank' className="button">Download Report</a>
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
