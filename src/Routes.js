import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import * as util from './lib/common/utility';
import ModalRoute from './lib/modal/ModalRoute';
import HelpDeskButton from './lib/helpdesk/HelpDeskButton';
import Sidebar from './demo/Sidebar';
import Header from './demo/Header';
import Test from './demo/Test';
import EditorTest from './demo/EditorTest';

class Routes extends Component {

  render() {

    const {
      loadComponent,
      authenticated
    } = this.props;

    if (!authenticated) return ( this.props.loader('Authenticating', 'authenticating') );

    /*
    if (util.isLoading(session)) {
      return this.props.loader('Trying to load initial resources: session');
    }
    */

    return (
      <div>
        <ModalRoute  id='accessDenied' component={() => this.props.loadComponent('modal/lib/common/AccessDenied', { useProjectRoot: false })} effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalRoute id='feesGlossary' draggable={true} component={() => loadComponent('modal/lib/glossary/Fees', {useProjectRoot: false})} effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalRoute id='timezone' component={() => loadComponent('modal/lib/glossary/Timezone', {useProjectRoot: false})} effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalRoute id='financeGlossary' component={() => loadComponent('modal/lib/glossary/Finance', {useProjectRoot: false})} effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalRoute id='bankDelete' component={(props) => loadComponent('modal/lib/common/Delete', { useProjectRoot: false, props: props })} effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalRoute id='delete' optsProps={{ customOverlay: { zIndex: 10000001 } }} component={(props) => loadComponent('modal/lib/common/Delete', { useProjectRoot: false, props: props })} effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalRoute  id='testModal' component={() => this.props.loadComponent('modal/demo/ModalForm', { useProjectRoot: false })} effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalRoute 
          closeBtnShow={false}
          disallowBgClose={true}
          id='networkError' 
          component={() => this.props.loadComponent('modal/lib/common/NetworkError', { useProjectRoot: false })} 
          className='modalPreview' 
          effect='3DFlipVert' 
          style={{ width: '50%' }} 
        />
        <ModalRoute  id='downloadReport' component={(props) => this.props.loadComponent('modal/lib/common/Export', { useProjectRoot: false, props: props })} effect='3DFlipVert' style={{ width: '50%' }} />
        <Router>
          <Route
            render={({ location }) => (
              <div className='wrapper'>
                <Route
                  exact
                  path='/'
                  render={() => <Redirect to='/dashboard' />}
                />
                <div id='contentContainer' className=''>
                  <Switch location={location}>
                    <Route path='/upload' render={(props) => loadComponent('demo/UploadEditorTest')} />
                    <Route path='/dashboard' render={(props) => loadComponent('demo/Dashboard')}  />
                    <Route path='/images' render={(props) => loadComponent('demo/UpdateImages')}  />
                    <Route path='/permissions' render={(props) => loadComponent('demo/Permissions')}  />
                    <Route exact path='/gbx3' render={(props) => loadComponent('demo/GBX3Test', { routeProps: props })}  />
                    <Route exact path='/gbx3/:articleID' render={(props) => loadComponent('demo/GBX3Test', { routeProps: props })}  />
                    <Route render={() => <div>Error</div>} />
                  </Switch>
                </div>
              </div>
            )}
          />
        </Router>
      </div>
    )
  }
}

export default Routes;
