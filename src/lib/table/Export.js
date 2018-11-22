import React, {Component} from 'react';
import { connect } from 'react-redux';
import { util } from '../';
import { getResource } from '../api/helpers';
import has from 'has';

class ExportLink extends Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.makeLink = this.makeLink.bind(this);
    this.state = {
      link: null
    }
  }

  componentDidMount() {
    this.makeLink();
  }

  componentDidUpdate(prevProps, prevState) {
    if (has(prevProps.resource, 'endpoint')) {
      if (this.props.resource.endpoint !== prevProps.resource.endpoint) {
        this.makeLink();
      }
    }
  }

  makeLink() {
    const resource = this.props.resource;
    const max = { max: 100000000 };
    const search = { ...resource.search, ...max };
    const link = this.props.getResource(this.props.name, { csv: true, search: search });
    this.setState({
      link
    })
  }

  onClick() {
    window.open(this.state.link, '_blank');
  }

  render() {

    const {
      style,
      align
    } = this.props;

    return (
      <div style={style} className={`exportRecordsLink ${align}`}>
        <button onClick={this.onClick} className={`link`}>Export Report</button>
      </div>
    );
  }
}

ExportLink.defaultProps = {
	align: 'center'
}

function mapStateToProps(state, props) {

  const resource = state.resource[props.name] ? state.resource[props.name] : {};
  let sort, order;
  if (!util.isLoading(resource)) {
    sort = has(resource.search, 'sort') ? resource.search.sort : '';
    order = has(resource.search, 'order') ? resource.search.order : '';
  }

  return {
    resource: resource,
    sort: sort,
    order: order
  }
}

export default connect(mapStateToProps, {
  getResource
})(ExportLink)
