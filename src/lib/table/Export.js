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
  }

  makeLink() {
    const resource = this.props.resource;
    const max = { max: 100000000 };
    const search = { ...resource.search, ...max };
    const link = this.props.getResource(this.props.name, { csv: true, search: search });
    return link;
  }

  onClick() {
    window.open(this.makeLink(), '_blank');
  }

  render() {

    const {
      style,
      align,
      desc,
      resource
    } = this.props;

    if (util.isLoading(resource)) {
      return <div></div>;
    } else {
      if (util.isEmpty(resource.data)) return <div></div>;
    }

    return (
      <div style={style} className={`exportRecordsLink ${align}`}>
        <button onClick={this.onClick} className={`link`}>{desc}</button>
      </div>
    );
  }
}

ExportLink.defaultProps = {
	align: 'center',
  desc: 'Export Report'
}

function mapStateToProps(state, props) {

  const resource = state.resource[props.name] ? state.resource[props.name] : {};

  return {
    resource: resource
  }
}

export default connect(mapStateToProps, {
  getResource
})(ExportLink)
