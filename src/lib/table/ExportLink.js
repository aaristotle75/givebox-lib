import React, {Component} from 'react';
import ModalLink from '../modal/ModalLink';
import ModalRoute from '../modal/ModalRoute';
import Export from './Export';

export default class ExportLink extends Component {

  renderExport(desc, name, id) {
    return (
      <Export desc={desc} name={name} id={id} />
    )
  }

  render() {

    const {
      desc,
      style,
      align,
      name
    } = this.props;

    const id = `exportRecords-${name}`;

    return (
      <div style={style} className={`exportRecordsLink ${align}`}>
        <ModalRoute id={id} component={() => this.renderExport(desc, name, id)} effect='superScaled' style={{ minHeight: 200 }}  />
        <ModalLink id={id}>Export Report <span className='icon icon-download'></span></ModalLink>
      </div>
    );
  }
}

ExportLink.defaultProps = {
	align: 'center'
}
