import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { util, ModalRoute, Alert } from './lib';
import Sidebar from './demo/Sidebar';
import Header from './demo/Header';

class Routes extends Component {

  render() {

    const {
      loadComponent,
      session,
      org
    } = this.props;

    if (util.isLoading(session) || util.isLoading(org)) {
      return this.props.loader('Trying to load initial resources: session and org');
    }

    return (
      <div>
        <ModalRoute  id='accessDenied' component={() => this.props.loadComponent('modal/lib/common/AccessDenied', { useProjectRoot: false })} effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalRoute id='feesGlossary' draggable={true} component={() => loadComponent('modal/lib/glossary/Fees', {useProjectRoot: false})} effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalRoute id='timezone' component={() => loadComponent('modal/lib/glossary/Timezone', {useProjectRoot: false})} effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalRoute id='financeGlossary' component={() => loadComponent('modal/lib/glossary/Finance', {useProjectRoot: false})} effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalRoute id='bankDelete' component={(props) => loadComponent('modal/lib/common/Delete', { useProjectRoot: false, props: props })} effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalRoute id='delete' component={(props) => loadComponent('modal/lib/common/Delete', { useProjectRoot: false, props: props })} effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalRoute  id='testModal' component={() => this.props.loadComponent('modal/demo/ModalForm', { useProjectRoot: false })} effect='3DFlipVert' style={{ width: '50%' }} />
        <Router>
          <Route
            render={({ location }) => (
              <div className='wrapper'>
                <Route
                  exact
                  path='/'
                  render={() => <Redirect to='/dashboard' />}
                />
                <Header />
                <Sidebar />
                <div id='contentContainer' className='contentContainer'>
                  <Switch location={location}>
                    <Route path='/dashboard' render={(props) => loadComponent('demo/Dashboard')}  />
                    <Route exact path='/list' render={(props) => loadComponent('demo/ItemsList', {routeProps: props})}  />
                    <Route exact path='/list/:itemID' render={(props) => loadComponent('demo/Item', {routeProps: props})} />
                    <Route exact path={`/list/:itemID/:action`} render={(props) => loadComponent('demo/Item', {routeProps: props})} />
                    <Route path='/charts' render={(props) => loadComponent('demo/Charts')}  />
                    <Route exact path='/transactions' render={(props) => loadComponent('demo/Transactions', {routeProps: props})}  />
                    <Route path='/about' render={(props) => loadComponent('demo/About')}  />
                    <Route path='/contact' render={(props) => loadComponent('demo/Contact')}  />
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
