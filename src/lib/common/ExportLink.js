import React, {Component} from 'react';
import ModalLink from './ModalLink';

export default class ExportLink extends Component {

  render() {

    const {
      style,
      align
    } = this.props;

    return (
      <div style={style} className={`exportRecordsLink ${align}`}>
        <ModalLink id='exportRecords'>Export Report <span className='icon icon-download'></span></ModalLink>
      </div>
    );
  }
}

ExportLink.defaultProps = {
	align: 'center'
}
