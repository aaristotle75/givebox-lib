function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { util, Loader, GBLink, ModalLink, ModalRoute, Alert } from '../';
import { toggleModal } from '../api/actions';
import { getResource } from '../api/helpers';
import FileSaver from 'file-saver';
import has from 'has';

const {
  detect
} = require('detect-browser');

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
    const resource = this.props.resource;
    if (has(resource.search, 'page')) delete resource.search.page;
    const max = {
      max: 100000000
    };
    const search = { ...resource.search,
      ...max
    };
    const link = this.props.getResource(this.props.name, {
      customName: this.props.customName || null,
      csv: true,
      search: search,
      callback: chrome ? this.downloadSuccess : null
    });
    return link;
  }

  onClick() {
    const browserName = util.getValue(browser, 'name');
    if (browserName === 'chrome') window.open(this.makeLink(true), '_self');else this.setState({
      downloading: true
    }, this.download);
  }

  download() {
    const bindthis = this;
    const url = this.makeLink();
    const filename = `${this.props.name}.csv`;
    const x = new XMLHttpRequest();

    x.onload = function () {
      if (this.status === 200) {
        bindthis.downloadCallback(url, x.response, filename);
      } else {
        bindthis.setState({
          error: 'Error downloading file'
        });
      }
    };

    x.open('get', url, true);
    x.withCredentials = true;
    x.responseType = 'blob';
    x.send();
  }

  async downloadCallback(url, blob, filename) {
    FileSaver.saveAs(blob, filename);
    this.setState({
      downloading: false
    }, this.downloadSuccess);
  }

  downloadSuccess() {
    this.setState({
      success: 'Downloaded to your device successfully.'
    });
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
      return React.createElement("div", null);
    } else {
      if (util.isEmpty(resource.data)) return React.createElement("div", null);
    }

    return React.createElement("div", {
      className: "modalWrapper"
    }, React.createElement("div", {
      className: "center"
    }, this.state.downloading ? React.createElement(Loader, {
      msg: "Downloading File"
    }) : '', React.createElement(Alert, {
      alert: "success",
      display: success,
      msg: success
    }), React.createElement(Alert, {
      alert: "error",
      display: this.state.error,
      msg: this.state.error
    }), React.createElement("h3", null, `You are about to download ${text || name}.`), React.createElement("div", {
      className: "button-group"
    }, React.createElement(GBLink, {
      className: "link",
      onClick: () => this.props.toggleModal(this.props.modalID, false)
    }, success ? 'Close' : 'Cancel'), React.createElement(GBLink, {
      className: "button",
      onClick: this.onClick
    }, "Download Report ", success ? 'Again' : ''))));
  }

}

function mapStateToProps(state, props) {
  const resource = state.resource[props.customName || props.name] ? state.resource[props.customName || props.name] : {};
  return {
    resource: resource
  };
}

const DownloadFileConnect = connect(mapStateToProps, {
  toggleModal,
  getResource
})(DownloadFile);
export default class ExportLink extends Component {
  render() {
    const {
      style,
      align,
      link,
      name
    } = this.props;
    const modalID = `export${name}`;
    return React.createElement("div", null, React.createElement(ModalRoute, {
      id: modalID,
      className: "flexWrapper",
      component: () => {
        return React.createElement(DownloadFileConnect, _extends({}, this.props, {
          modalID: modalID
        }));
      },
      effect: "3DFlipVert",
      style: {
        width: '50%'
      }
    }), React.createElement("div", {
      style: style,
      className: `exportRecordsLink ${align}`
    }, React.createElement(ModalLink, {
      id: modalID,
      className: "link"
    }, link)));
  }

}
ExportLink.defaultProps = {
  align: 'center',
  link: React.createElement("span", null, React.createElement("span", {
    className: "exportRecordsText"
  }, "Download Report"), " ", React.createElement("span", {
    className: "icon icon-download-cloud"
  })),
  text: ''
};