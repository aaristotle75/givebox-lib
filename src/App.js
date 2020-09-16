import React, { Component } from 'react';
import { connect } from 'react-redux';
import Routes from './Routes';
import Loadable from 'react-loadable';
import has from 'has';
import { resourceProp, Loader, getResource, reloadResource, setAppRef, setModalRef, util, setPrefs, sendResource } from './lib';
import queryString from 'query-string';

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

			const org = util.getValue(res, 'organization', {});
			const orgID = util.getValue(org, 'ID', null);
			const orgName = util.getValue(org, 'name');
			const orgImage = util.getValue(org, 'imageURL');
			const orgSlug = util.getValue(org, 'slug');
			const underwritingStatus = util.getValue(org, 'underwritingStatus');
			const status = util.getValue(org, 'status');

			// Set the selected org
			this.props.resourceProp('orgID', orgID);
			this.setIndexState('org', { name: orgName });

			// Check if this is a masquerade
			let user;
			if (has(res, 'masker')) user = res.masker;
			else user = res.user;

			this.props.resourceProp('userID', user.ID);

			// set access
			const access = {
				isOwner: false,
				role: util.getValue(user, 'role'),
				permissions: [],
				type: 'organization',
				is2FAVerified: true,
				userID: user.ID,
				initial: user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase(),
				firstName: user.firstName,
				lastName: user.lastName,
				fullName: user.firstName + ' ' + user.lastName,
				email: user.email,
				userImage: user.imageURL,
				masker: has(res, 'masker') ? true : false,
				theme: user.preferences ? user.preferences.cloudTheme : 'light',
				animations: user.preferences ? user.preferences.animations : false,
				orgName,
				orgImage,
				orgID,
				orgSlug,
				underwritingStatus,
				status
			};

			// Check member for access
			if (has(res, 'member')) {
				access.isOwner = util.getValue(res.member, 'isOwner');
				access.permissions = util.getValue(res.member, 'permissions');
			}
			this.props.resourceProp('access', access);

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

			// Set preferences
			if (has(user, 'preferences')) {
				this.props.setPrefs(util.getValue(user.preferences, 'cloudUI', {}));
			}

			// Get init collection of resources
			this.initResources(orgID);
		}
		// Authenticate
		this.setState({authenticated: true});
	}

	initResources(orgID) {
		// Get the org
		/*
		this.props.getResource('org', {
			orgID: orgID || 185
		});
		*/
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
			loading: () => modal ? '' : this.loader(`Trying to load component ${moduleToLoad}`)
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
	sendResource
})(App);
