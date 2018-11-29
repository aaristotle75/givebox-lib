import React, { Component } from 'react';
import { connect } from 'react-redux';
import Routes from './Routes';
import Loadable from 'react-loadable';
import has from 'has';
import { resourceProp, Loader, getResource, reloadResource } from './lib';

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

  /**
  * Action function to set state while keeping current state
  * @params (string) key
  * @params (mixed) value
  */
  setIndexState(key, value) {
    const merge = {...this.state[key], ...value};
    this.setState(Object.assign({
      ...this.state,
      [key]: merge
    }));
  }

  /**
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
      if (!has(res, 'organization')) {
        console.log('redirect to signin');
      } else {
        // Set the selected org
        this.props.resourceProp('orgID', res.organization.ID);
        this.setIndexState('org', { name: res.organization.name });

        // Check if this is a masquerade
        let user;
        if (has(res, 'masker')) user = res.masker;
        else user = res.user;

        this.props.resourceProp('userID', user.ID);

        // Set user info
        this.setIndexState('user', {
          userID: user.ID,
          fullName: user.firstName + ' ' + user.lastName,
          email: user.email,
          role: user.role,
          masker: has(res, 'masker') ? true : false,
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
    this.props.getResource('org');
  }

  loader(msg) {
    return (
      <Loader msg={msg} forceText={process.env.NODE_ENV !== 'production' && true} />
    )
  }

  /**
  * Dynamically load components by module path
  * @param {string} path to component to load
  * @param {object} opt - see options for possible params
  *
  * // Options //
  * @param {object} routeProps props sent by the Router
  * @param {object} props additional props
  * @param {function} callback
  * @param {string} className
  */
  loadComponent(path, opt = {}) {
    const defaults = {
      routeProps: null,
      props: null,
      callback: null,
      className: 'content'
    };
    const options = { ...defaults, ...opt };
    let modal = false;
    let moduleToLoad = path;

    // If module path begins with modal/ display as modal
    if (moduleToLoad.indexOf('modal/') !== -1) {
      modal = true;
      options.className = 'modalWrapper';
      moduleToLoad = moduleToLoad.replace('modal/', '');
    }

    const Component = Loadable({
      loader: () => import(`/${moduleToLoad}`),
      loading: () => modal ? '' : this.loader(`Trying to load component ${moduleToLoad}`)
    });
    return (
      <div id={`root-content`} className={options.className}>
        <Component
          {...options.props}
          loader={this.loader}
          routeProps={options.routeProps}
          mobile={this.state.mobile}
          loadComponent={this.loadComponent}
        />
      </div>
    )
  }

  render() {

    return (
      <div className={this.state.mobile ? 'mobile' : 'desktop'}>
        <div id='app-root'>
          <AppContext.Provider
            value={{
              title: `Givebox lib - ${this.state.org.name}`
            }}
          >
            <Routes
              {...this.props}
              loader={this.loader}
              loadComponent={this.loadComponent}
            />
          </AppContext.Provider>
        </div>
        <div id='modal-root'></div>
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
