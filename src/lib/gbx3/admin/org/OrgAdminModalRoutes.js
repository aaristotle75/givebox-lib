import React, { Component } from 'react';
import ModalRoute from '../../../modal/ModalRoute';
import Loadable from 'react-loadable';

export default class OrgAdminModalRoutes extends Component {

  loadComponent(path, props) {
    const ModalComponent = Loadable({
      loader: () => import(`${path}`),
      loading: () => <></>
    });
    return (
      <ModalComponent {...props} />
    )
  }

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
          component={(props) => this.loadComponent('./EditTitle', props)}
        />
        <ModalRoute
          className='gbx3'
          id={'orgEditProfilePic'}
          effect='3DFlipVert' style={{ width: '60%' }}
          draggable={true}
          draggableTitle={`Editing Profile Picture`}
          disallowBgClose={true}
          component={(props) => this.loadComponent('./EditProfilePic', props)}
        />
        <ModalRoute
          className='gbx3'
          id={'orgEditMenu'}
          effect='3DFlipVert' style={{ width: '60%' }}
          draggable={true}
          draggableTitle={`Editing Navigation Menu`}
          disallowBgClose={true}
          component={(props) => this.loadComponent('./EditMenu', props)}
        />
      </div>
    )
  }
}
