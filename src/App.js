import React, { Component } from 'react';
import { connect } from 'react-redux';
import Routes from './Routes';
import Loadable from 'react-loadable';
import has from 'has';
import * as util from './lib/common/utility';
import { resourceProp, setAppRef, setModalRef, setPrefs, setAccess } from './lib/api/actions';
import { getMerchantVitals } from './lib/api/merchantActions';
import { getResource, sendResource, reloadResource } from './lib/api/helpers';
import Loader from './lib/common/Loader';
import queryString from 'query-string';

export const AppContext = React.createContext();

class App extends Component {

  constructor(props) {
    super(props);
    this.loading = this.loading.bind(this);
    this.loadComponent = this.loadComponent.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.initResources = this.initResources.bind(this);
    this.setIndexState = this.setIndexState.bind(this);
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      mobile: window.innerWidth < props.mobileBreakpoint ? true : false,
      org: {},
      user: {},
      authenticated: false
    }
    this.appRef = React.createRef();
    this.modalRef = React.createRef();
  }

  componentDidMount() {
    // Entry point - check if session exists and authenticate
    this.props.getResource('session', {callback: this.authenticate});
    if (this.appRef) this.props.setAppRef(this.appRef);
    if (this.modalRef) this.props.setModalRef(this.modalRef);
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
      this.props.setAccess(res, this.initResources);
    }
    // Authenticate
    this.setState({authenticated: true});
  }

  initResources(access) {
    const {
      orgID,
      role
    } = access;

    if (orgID && (role === 'super' || role === 'admin')) {
      this.props.getMerchantVitals();
    }
    // Get the org
    /*
    this.props.getResource('org', {
      orgID: orgID || 185
    });
    */
  }

  loading(props) {
    if (props.error) {
      console.error('loading error -> ', props.error);
      return (
        <div id={`content-root`}>
          <h2>Oops, an error</h2>
          {props.error}
        </div>
      )
    } else {
      return <></>;
    }
  }

  loader(msg, className = '') {
    return (
      <Loader className={className} msg={msg} forceText={process.env.NODE_ENV !== 'production' && true} />
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
      className: ''
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
      loading: this.loading
    });

    const routeProps = options.routeProps;
    const location = util.getValue(routeProps, 'location', {});
    const match = util.getValue(routeProps, 'match', {});
    const search = util.getValue(location, 'search', {});
    const routeParams = util.getValue(match, 'params', {});
    const queryParams = queryString.parse(search);

    return (
      <div id={`content-root`} className={options.className}>
        <Component
          {...options.props}
          loader={this.loader}
          routeProps={options.routeProps}
          routeParams={routeParams}
          mobile={this.state.mobile}
          loadComponent={this.loadComponent}
          queryParams={queryParams}
        />
      </div>
    )
  }

  render() {

    return (
      <>
        <div id='app-root' ref={this.appRef}>
          <AppContext.Provider
            value={{
              title: `Givebox lib - ${this.state.org.name}`
            }}
          >
            <Routes
              {...this.props}
              loader={this.loader}
              loadComponent={this.loadComponent}
              authenticated={this.state.authenticated}
            />
          </AppContext.Provider>
        </div>
        <div id='dropdown-root'></div>
        <div id='modal-root' ref={this.modalRef}></div>
        <div id='calendar-root'></div>
        <div id='help-center'></div>
        <div id='gbx-form-root'></div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps, {
  getResource,
  reloadResource,
  resourceProp,
  setAppRef,
  setModalRef,
  setPrefs,
  sendResource,
  setAccess,
  getMerchantVitals
})(App);
