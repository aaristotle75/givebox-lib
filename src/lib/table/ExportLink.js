import React, {Component} from 'react';
import ModalLink from '../modal/ModalLink';
import ModalRoute from '../modal/ModalRoute';
import Export from './Export';

export default class ExportLink extends Component {

  renderExport() {
    return (
      <Export />
    )
  }

  render() {

    const {
      style,
      align
    } = this.props;

    return (
      <div style={style} className={`exportRecordsLink ${align}`}>
        <ModalRoute id='exportRecords' component={() => this.renderExport()} effect='superScaled' style={{minHeight: 200}}  />
        <ModalLink id='exportRecords'>Export Report <span className='icon icon-download'></span></ModalLink>
      </div>
    );
  }
}

ExportLink.defaultProps = {
	align: 'center'
}
