import React, {Component} from 'react';
import { DownloadFileConnect } from '../table/Export';

export default class Export extends Component {

  render() {
    return (
      <DownloadFileConnect {...this.props} />
    )
  }
}
