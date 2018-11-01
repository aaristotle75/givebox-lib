import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { util } from './lib';
import Sidebar from "./common/Sidebar";
import Header from "./common/Header";

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
        <Router>
          <Route
            render={({ location }) => (
              <div className="wrapper">
                <Route
                  exact
                  path="/"
                  render={() => <Redirect to="/dashboard" />}
                />
                <Header />
                <Sidebar />
                <div className="contentContainer">
                  <TransitionGroup>
                    <CSSTransition key={location.key} classNames="fade" timeout={300}>
                      <Switch location={location}>
                        <Route path="/dashboard" render={(props) => loadComponent('pages/Dashboard')}  />
                        <Route exact path="/list" render={(props) => loadComponent('pages/ItemsList', {routeProps: props})}  />
                        <Route exact path="/list/:itemID" render={(props) => loadComponent('pages/Item', {routeProps: props})} />
                        <Route exact path={`/list/:itemID/:action`} render={(props) => loadComponent('pages/Item', {routeProps: props})} />
                        <Route path="/about" render={(props) => loadComponent('pages/About')}  />
                        <Route path="/contact" render={(props) => loadComponent('pages/Contact')}  />
                        <Route render={() => <div>Error</div>} />
                      </Switch>
                    </CSSTransition>
                  </TransitionGroup>
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
