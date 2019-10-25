import React, {Component} from 'react';
import { DownloadFileConnect } from '../lib';

export default class Export extends Component {

  render() {
    return (
      <DownloadFileConnect {...this.props} />
    )
  }
}
