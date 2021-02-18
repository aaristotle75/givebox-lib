import React, { Component } from 'react';
import ModalRoute from '../../../modal/ModalRoute';
import EditTitle from './EditTitle';

export default class OrgAdminModalRoutes extends Component {

  render() {

    return (
      <div id='orgadmin-edit-modal-routes'>
        <ModalRoute
          className='gbx3'
          id={'orgEditTitle'}
          effect='3DFlipVert' style={{ width: '60%' }}
          draggable={true}
          draggableTitle={`Editing Title`}
          disallowBgClose={true}
          component={(props) =>
            <EditTitle {...props} />
          }
        />
      </div>
    )
  }
}
