import React, { Component } from 'react';
import { connect } from 'react-redux';
import Routes from './Routes';
import Loadable from 'react-loadable';
import { resourceProp, Loader, getResource, reloadResource, util } from './lib';

export const AppContext = React.createContext();

class App extends Component {

  constructor(props) {
    super(props);
    this.loadComponent = this.loadComponent.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.initResources = this.initResources.bind(this);
    this.setIndexState = this.setIndexState.bind(this);
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      mobile: window.innerWidth < props.mobileBreakpoint ? true : false,
      org: {},
      user: {}
    }
  }

  componentDidMount() {
    // Entry point - check if session exists and authenticate
    this.props.getResource('session', {callback: this.authenticate});
  }

  /* Action function to set state while keeping current state
  * @params (string) key
  * @params (mixed) value
  */
  setIndexState(key, value) {
    const merged = Object.assign({}, this.state[key], value);
    this.setState(Object.assign({}, this.state, {
      ...this.state,
      [key]: merged
    }));
  }


  /*
  * A callback from getting the session to authenticate the user
  * and set the selected org ID to either the user's default org or
  * if a masquerade set it to the mask org ID
  *
  * @param (object) res Response from the session requeset
  * @param (object) err Error from the request
  */
  authenticate(res, err) {
    if (err) {
      // If no session is found redirect the user to sign in
      console.log('Err No session found', err);
    } else {
      // Check if an organization has been returned, if not redirect to main signin
      if (!res.hasOwnProperty('organization')) {
        console.log('redirect to signin');
      } else {
        // Set the selected org
        this.props.resourceProp('orgID', res.organization.ID);
        this.setIndexState('org', { name: res.organization.name });

        let user;
        // Check if this is a masquerade
        if (res.hasOwnProperty('masker')) user = res.masker;
        else user = res.user;

        this.props.resourceProp('userID', user.ID);
        // Set user info
        this.setIndexState('user', {
          userID: user.ID,
          fullName: user.firstName + ' ' + user.lastName,
          email: user.email,
          role: user.role,
          masker: res.hasOwnProperty('masker') ? true : false,
          theme: user.preferences ? user.preferences.cloudTheme : 'light',
          animations: user.preferences ? user.preferences.animations : false
        });

        // Get init collection of resources
        this.initResources();
      }
    }
  }

  initResources() {
    // Get the org
    this.props.getResource('org', {id: ['org']});
  }

  loader(msg) {
    return (
      <Loader msg={msg} forceText={process.env.NODE_ENV !== 'production' && true} />
    )
  }

  loadComponent(module, customParams = {}) {
    const defaultParams = { routeProps: null, props: null, callback: null, className: 'content' };
    const params = Object.assign({}, defaultParams, customParams);
    let modal = false;
    let moduleToLoad = module;

    // If module path begins with modal/ display as modal
    if (module.indexOf('modal/') !== -1) {
      modal = true;
      params.className = 'modalWrapper';
      moduleToLoad = moduleToLoad.replace('modal/', '');
    }

    const Component = Loadable({
      loader: () => import(`/${moduleToLoad}`),
      loading: () => modal ? '' : this.loader(`Trying to load component ${moduleToLoad}`)
    });
    return (
      <div id={`root-${params.className}`} className={params.className}>
        <Component
          {...params.props}
          loader={this.loader}
          routeProps={params.routeProps}
          mobile={this.state.mobile}
        />
      </div>
    )
  }

  render() {

    return (
      <div className={this.state.mobile ? 'mobile' : 'desktop'}>
        <div id="app-root">
          <AppContext.Provider
            value={{
              title: "Givebox Lib - Tests"
            }}
          >
            <Routes
              {...this.props}
              loader={this.loader}
              loadComponent={this.loadComponent}
            />
          </AppContext.Provider>
        </div>
        <div id="modal-root"></div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    session: state.resource.session ? state.resource.session : {},
    org: state.resource.org ? state.resource.org : {}
  }
}

export default connect(mapStateToProps, {
  getResource,
  reloadResource,
  resourceProp
})(App);
