import React, {Component} from 'react';
import { connect } from 'react-redux';
import Loader from '../common/Loader';
import GBLink from '../common/GBLink';
import { Alert } from '../common/Alert';
import ModalLink from '../modal/ModalLink';
import * as util from '../common/utility';
import { toggleModal } from '../api/actions';
import { getResource } from '../api/helpers';
import FileSaver from 'file-saver';
import has from 'has';
const { detect } = require('detect-browser');
const browser = detect();

class DownloadFile extends Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.makeLink = this.makeLink.bind(this);
    this.download = this.download.bind(this);
    this.downloadCallback = this.downloadCallback.bind(this);
    this.downloadSuccess = this.downloadSuccess.bind(this);
    this.state = {
      downloading: false,
      error: '',
      success: ''
    };
  }

  makeLink(chrome = false) {
    const {
      id
    } = this.props;

    const resource = this.props.resource;
    if (has(resource.search, 'page')) delete resource.search.page;
    const max = { max: 100000000 };
    const search = { ...resource.search, ...max };
    const link = this.props.getResource(this.props.name, {
      id: id ? [id] : null,
      customName: this.props.customName || null,
      csv: true,
      search: search,
      callback: chrome ? this.downloadSuccess : null
    });
    return link;
  }

  onClick() {
    const browserName = util.getValue(browser, 'name');
    if (browserName === 'chrome') window.open(this.makeLink(true), '_self');
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
      } else {
        bindthis.setState({ error: 'Error downloading file' });
      }
    }
    x.open('get', url, true);
    x.withCredentials = true;
    x.responseType = 'blob';
    x.send();
  }

  async downloadCallback(url, blob, filename) {
    FileSaver.saveAs(blob, filename);
    this.setState({ downloading: false }, this.downloadSuccess);
  }

  downloadSuccess() {
    this.setState({ success: 'Downloaded to your device successfully.' });
  }

  render() {

    const {
      resource,
      name,
      text
    } = this.props;

    const {
      success
    } = this.state;

    if (util.isLoading(resource)) {
      return <div></div>;
    } else {
      if (util.isEmpty(resource.data)) return <div></div>;
    }

    return (
      <div className='center'>
        {this.state.downloading ? <Loader msg='Downloading File' /> : ''}
        <Alert alert='success' display={success} msg={success} />
        <Alert alert='error' display={this.state.error} msg={this.state.error} />
        <h3>{`You are about to download ${text || name}.`}</h3>
        <div className='button-group'>
          <GBLink className='link' onClick={() => this.props.toggleModal(this.props.modalID, false)}>{success ? 'Close' : 'Cancel'}</GBLink>
          <GBLink className="button" onClick={this.onClick}>Download Report {success ? 'Again' : ''}</GBLink>
        </div>
      </div>
    );
  }
}

DownloadFile.defaultProps = {
  id: null
}

function mapStateToProps(state, props) {

  const resource = state.resource[props.customName || props.name] ? state.resource[props.customName || props.name] : {};

  return {
    resource: resource
  }
}

export const DownloadFileConnect = connect(mapStateToProps, {
  toggleModal,
  getResource
})(DownloadFile)


export default class ExportLink extends Component {

  render() {

    const {
      style,
      align,
      link,
      name,
      customName,
      resource,
      text,
      id
    } = this.props;

    const modalID = 'downloadReport'; //`export${name}`;

    return (
      <div style={style} className={`exportRecordsLink ${align}`}>
        <ModalLink id={modalID} className='link' opts={{ id, name, customName, link, resource, text, modalID }}>{link}</ModalLink>
      </div>
    );
  }
}

ExportLink.defaultProps = {
  align: 'center',
  link: <span><span className='exportRecordsText'>Download Report</span> <span className='icon icon-download-cloud'></span></span>,
  text: ''
}
