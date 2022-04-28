import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalRoute from '../modal/ModalRoute';
import Loadable from 'react-loadable';
import Delete from '../common/Delete';
import GenericOverlay from '../common/GenericOverlay';
import StepsWrapper from './signup/StepsWrapper';

export default class GBX3ModalRoutes extends Component {

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
      <div id='gbx3-modal-routes'>
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
          effect='3DFlipVert' 
          style={{ width: '75%' }}
          disallowBgClose={true}
          closeBtnShow={false}
          component={(props) => {
            return (
              <StepsWrapper>
                {this.loadComponent('./signup/SignupSteps', {
                  ...props,
                  loadGBX3: this.props.loadGBX3
                })}
              </StepsWrapper>
            )
          }}
        />
        <ModalRoute
          className='gbx3'
          id={'bookDemo'}
          effect='3DFlipVert' style={{ width: '75%' }}
          disallowBgClose={false}
          component={(props) => this.loadComponent('./signup/BookDemo', props)}
          closeCallback={() => {
            window.parent.postMessage('closeGivebox', '*');
          }}
        />
        <ModalRoute
          className='gbx3'
          id={'orgPostSignupSteps'}
          effect='3DFlipVert' style={{ width: '75%' }}
          disallowBgClose={true}
          closeBtnShow={false}
          component={(props) => {
            return (
              <StepsWrapper>
                {this.loadComponent('./signup/SignupSteps', props)}
              </StepsWrapper>
            )
          }}
        />
        <ModalRoute
          className='gbx3'
          id={'orgConnectBankSteps'}
          effect='3DFlipVert' style={{ width: '75%' }}
          disallowBgClose={true}
          closeBtnShow={false}
          component={(props) => {
            return (
              <StepsWrapper>
                {this.loadComponent('./signup/ConnectBankSteps', props)}
              </StepsWrapper>
            )
          }}
        />
        <ModalRoute
          className='gbx3'
          id={'orgTransferSteps'}
          effect='3DFlipVert' style={{ width: '75%' }}
          disallowBgClose={true}
          closeBtnShow={false}
          component={(props) => {
            return (
              <StepsWrapper>
                {this.loadComponent('./signup/TransferMoneySteps', props)}
              </StepsWrapper>
            )
          }}
        />
        <ModalRoute
          className='gbx3'
          id={'orgConnectBankManualConfirm'}
          effect='3DFlipVert' style={{ width: '60%' }}
          component={(props) => this.loadComponent('./signup/connectBank/ConnectBankManualConfirm', props)}
        />
        <ModalRoute
          className='gbx3'
          id={'signupConfirmation'}
          effect='3DFlipVert' style={{ width: '60%' }}
          component={(props) => this.loadComponent('./signup/SignupConfirmation', props)}
          forceShowModalGraphic={true}
          disallowBgClose={true}
        />
        <ModalRoute
          className='gbx3'
          id={'voidCheckExample'}
          effect='3DFlipVert' style={{ width: '60%' }}
          component={(props) => this.loadComponent('./signup/transferMoney/VoidCheck', props)}
        />
        <ModalRoute
          modalRootClass='launchpad'
          className='gbx3'
          id={'launchpad'}
          effect='scaleUp' style={{ width: '100%' }}
          component={(props) => this.loadComponent('./Launchpad', props)}
        />
        <ModalRoute
          className='gbx3'
          id={'genericOverlay'}
          effect='3DFlipVert' style={{ width: '80%' }}
          component={(props) => <GenericOverlay {...props} /> }
        />     
      </div>
    )
  }
}
