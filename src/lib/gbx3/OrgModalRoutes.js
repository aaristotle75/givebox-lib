import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalRoute from '../modal/ModalRoute';
import Loadable from 'react-loadable';
import Delete from '../common/Delete';
import Steps from './signup/Steps';

export default class OrgModalRoutes extends Component {

  constructor(props) {
    super(props);
    this.loading = this.loading.bind(this);
  }

  loading(props) {
    if (props.error) {
      console.error('loading error -> ', props.error);
      return (
        <div className='modalWrapper'>
          <h2>Oops, an error</h2>
          {props.error}
        </div>
      )
    } else {
      return <></>;
    }
  }

  loadComponent(path, props) {
    const ModalComponent = Loadable({
      loader: () => import(`${path}`),
      loading: this.loading
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
          effect='3DFlipVert' style={{ width: '70%' }}
          draggable={true}
          draggableTitle={`Editing Title`}
          disallowBgClose={true}
          component={(props) => this.loadComponent('./admin/org/EditTitle', props)}
        />
        <ModalRoute
          className='gbx3'
          id={'orgEditProfilePic'}
          effect='3DFlipVert' style={{ width: '70%' }}
          draggable={true}
          draggableTitle={`Editing Profile Picture`}
          disallowBgClose={false}
          component={(props) => this.loadComponent('./admin/org/EditProfilePic', props)}
        />
        <ModalRoute
          className='gbx3 gbx3OrgAdmin'
          id={'orgEditMenu'}
          effect='3DFlipVert' style={{ width: '70%' }}
          draggable={true}
          draggableTitle={`Managing Pages / Navigation Menu`}
          disallowBgClose={false}
          component={(props) => this.loadComponent('./admin/org/EditMenu', props)}
        />
        <ModalRoute
          className='gbx3 gbx3OrgAdmin'
          id={'orgEditPage'}
          effect='3DFlipVert' style={{ width: '80%' }}
          draggable={true}
          draggableTitle={`Editing Page Details`}
          disallowBgClose={true}
          component={(props) => this.loadComponent('./admin/org/EditPage', props)}
        />
        <ModalRoute
          className='gbx3'
          id={'orgEditCoverPhoto'}
          effect='3DFlipVert' style={{ width: '70%' }}
          draggable={true}
          draggableTitle={`Editing Cover Photo`}
          disallowBgClose={false}
          component={(props) => this.loadComponent('./admin/org/EditCoverPhoto', props)}
        />
        <ModalRoute
          className='gbx3'
          id={'orgEditCard'}
          effect='3DFlipVert' style={{ width: '80%' }}
          draggable={true}
          draggableTitle={`Editing Card`}
          disallowBgClose={false}
          component={(props) => this.loadComponent('./admin/org/EditArticleCard', props)}
        />
        <ModalRoute
          className='gbx3'
          id={'orgRemove'}
          effect='3DFlipVert' style={{ width: '60%' }}
          component={(props) => this.loadComponent('./admin/org/Remove', props)}
        />
        <ModalRoute
          className='gbx3'
          id={'deleteArticle'}
          effect='3DFlipVert' style={{ width: '60%' }}
          component={(props) => <Delete {...props} /> }
        />
        <ModalRoute
          className='gbx3'
          id={'orgSignupSteps'}
          effect='3DFlipVert' style={{ width: '70%' }}
          disallowBgClose={true}
          component={(props) => {
            return (
              <Steps>
                {this.loadComponent('./signup/SignupSteps', props)}
              </Steps>
            )
          }}
        />
        <ModalRoute
          className='gbx3'
          id={'orgPostSignupSteps'}
          effect='3DFlipVert' style={{ width: '85%' }}
          disallowBgClose={true}
          component={(props) => {
            return (
              <Steps>
                {this.loadComponent('./signup/PostSignupSteps', props)}
              </Steps>
            )
          }}
        />
      </div>
    )
  }
}
