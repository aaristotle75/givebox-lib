import React, {Component} from 'react';
import { connect } from 'react-redux';
import { util, Loader } from '../';
import { getResource } from '../api/helpers';
import FileSaver from 'file-saver';
import has from 'has';
const { detect } = require('detect-browser');
const browser = detect();

class ExportLink extends Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.makeLink = this.makeLink.bind(this);
    this.download = this.download.bind(this);
    this.downloadCallback = this.downloadCallback.bind(this);
    this.state = {
      downloading: false
    };
  }

  makeLink() {
    const resource = this.props.resource;
    if (has(resource.search, 'page')) delete resource.search.page;
    const max = { max: 100000000 };
    const search = { ...resource.search, ...max };
    const link = this.props.getResource(this.props.name, { customName: this.props.customName || null, csv: true, search: search });
    return link;
  }

  onClick() {
    const browserName = util.getValue(browser, 'name');
    if (browserName === 'chrome') window.open(this.makeLink(), '_self');
    else this.setState({ downloading: true }, this.download);
  }

  download() {
    const bindthis = this;
    const url = this.makeLink();
    const filename = `${this.props.name}.csv`;
    const x = new XMLHttpRequest();
    x.onload = function() {
    	if (this.status === 200) {
        bindthis.downloadCallback(url, x.response, filename);
    	}
    }
    x.open('get', url, true);
    x.withCredentials = true;
    x.responseType = 'blob';
    x.send();
  }

  async downloadCallback(url, blob, filename) {
    FileSaver.saveAs(blob, filename);
    this.setState({ downloading: false });
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
        {this.state.downloading ? <Loader msg='Downloading File' /> : ''}
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

  const resource = state.resource[props.customName || props.name] ? state.resource[props.customName || props.name] : {};

  return {
    resource: resource
  }
}

export default connect(mapStateToProps, {
  getResource
})(ExportLink)
