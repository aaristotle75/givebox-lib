import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import * as util from '../common/utility';
import has from 'has';
import {
  updateData,
  updateInfo,
  setStyle,
  updateAdmin
} from './redux/gbx3actions';
import Footer from './Footer';

class Org extends React.Component {

  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
  }

  componentDidMount() {
  }

  render() {

    const {
      editable,
      hasAccessToEdit,
      breakpoint,
      stage
    } = this.props;

    const isEditable = hasAccessToEdit && editable ? true : false;

    return (
      <div className='gbx3Org'>
        New Org Page
        {breakpoint === 'mobile' ? <div className='bottomOffset'>&nbsp;</div> : <></>}
      </div>
    )
  }

}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const admin = util.getValue(gbx3, 'admin', {});
  const info = util.getValue(gbx3, 'info', {});
  const stage = util.getValue(info, 'stage');
  const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
  const editable = util.getValue(admin, 'editable');
  const breakpoint = util.getValue(info, 'breakpoint');

  return {
    stage,
    hasAccessToEdit,
    editable,
    breakpoint
  }
}

export default connect(mapStateToProps, {
  updateData,
  updateInfo,
  setStyle,
  updateAdmin
})(Org);
