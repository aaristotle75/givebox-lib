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
          disallowBgClose={false}
          component={(props) => this.loadComponent('./EditProfilePic', props)}
        />
        <ModalRoute
          className='gbx3 gbx3OrgAdmin'
          id={'orgEditMenu'}
          effect='3DFlipVert' style={{ width: '60%' }}
          draggable={true}
          draggableTitle={`Editing Navigation Menu`}
          disallowBgClose={false}
          component={(props) => this.loadComponent('./EditMenu', props)}
        />
        <ModalRoute
          className='gbx3 gbx3OrgAdmin'
          id={'orgEditPage'}
          effect='3DFlipVert' style={{ width: '70%' }}
          draggable={true}
          draggableTitle={`Editing Page`}
          disallowBgClose={false}
          component={(props) => this.loadComponent('./EditPage', props)}
        />
        <ModalRoute
          className='gbx3 gbx3OrgAdmin'
          id={'orgEditCustomPage'}
          effect='3DFlipVert' style={{ width: '60%' }}
          draggable={true}
          draggableTitle={`Editing Custom Page`}
          disallowBgClose={false}
          component={(props) => this.loadComponent('./EditCustomPage', props)}
        />
        <ModalRoute
          className='gbx3'
          id={'orgEditCoverPhoto'}
          effect='3DFlipVert' style={{ width: '60%' }}
          draggable={true}
          draggableTitle={`Editing Cover Photo`}
          disallowBgClose={false}
          component={(props) => this.loadComponent('./EditCoverPhoto', props)}
        />
        <ModalRoute
          className='gbx3'
          id={'orgEditCard'}
          effect='3DFlipVert' style={{ width: '60%' }}
          draggable={true}
          draggableTitle={`Editing Card`}
          disallowBgClose={false}
          component={(props) => this.loadComponent('./EditArticleCard', props)}
        />
        <ModalRoute
          className='gbx3'
          id={'orgRemove'}
          effect='3DFlipVert' style={{ width: '60%' }}
          component={(props) => this.loadComponent('./Remove', props)}
        />
      </div>
    )
  }
}
