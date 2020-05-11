import React from 'react';
import { connect } from 'react-redux';
import Layout from './Layout';
import Admin from './Admin';
import {
	types,
	util,
	Loader,
	getResource,
	setCustomProp,
	updateInfo,
	updateBlocks,
	updateDefaults,
	updateGlobals,
	updateData,
	updateAdmin
} from '../';
import { defaultBlocks } from './config';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/gbx3.scss';
import '../styles/gbx3modal.scss';

class GBX3 extends React.Component {

	constructor(props) {
		super(props);
		this.loadGBX3 = this.loadGBX3.bind(this);
		this.state = {
			loading: true
		};
	}

	componentDidMount() {
		const {
			orgID,
			articleID,
			kindID,
			kind,
			editable
		} = this.props;

		this.loadGBX3({
			orgID,
			articleID,
			kindID,
			kind,
			editable
		});
	}

	loadGBX3({
		orgID,
		articleID,
		kindID,
		kind,
		editable
	}) {

		const {
			access
		} = this.props;

		const apiName = `org${types.kind(kind).api.item}`;

		if (kindID) {
			this.props.getResource(apiName, {
				id: [kindID],
				orgID: orgID,
				callback: (res, err) => {
					if (!err && !util.isEmpty(res)) {
						const settings = util.getValue(res, 'giveboxSettings', {});
						const primaryColor = util.getValue(settings, 'primaryColor', this.props.defaultPrimaryColor);
						const customTemplate = util.getValue(settings, 'customTemplate', {});

						this.props.updateInfo({
							orgID,
							articleID,
							kindID,
							kind,
							apiName
						});

						const blocks = {
							...util.getValue(defaultBlocks, kind, {}),
							...util.getValue(customTemplate, 'blocks', {})
						};

						const globals = {
							...this.props.globals,
							...{
								gbxStyle: {
									...this.props.globals.gbxStyle,
									primaryColor
								},
								button: {
									...this.props.globals.button,
									style: {
										...util.getValue(this.props.globals.button, 'style', {}),
										bgColor: primaryColor
									}
								}
							},
							...util.getValue(customTemplate, 'globals', {})
						};

						this.props.updateBlocks(blocks);
						this.props.updateGlobals(globals);
						this.props.updateData(res);
						this.props.updateAdmin({
							editable,
							hasAccessToEdit: util.getAuthorizedAccess(access, orgID)
						});
						this.props.updateDefaults({
							blocks,
							data: res
						});
					}
					this.setState({ loading: false });
				}
			});
		} else {
			this.setState({ loading: false });
		}
	}

	render() {

		if (this.state.loading) return <Loader msg='Initiating GBX3' />;

		return (
			<div className='gbx3'>
				<Admin
					loadGBX3={this.loadGBX3}
				/>
				<Layout
					loadGBX3={this.loadGBX3}
				/>
			</div>
		)
	}

}

GBX3.defaultProps = {
	breakpointWidth: 768,
	defaultPrimaryColor: '#4775f8',
	editable: false
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});

	return {
		access: util.getValue(state.resource, 'access', {}),
		globals: util.getValue(gbx3, 'globals', {})
	}
}

export default connect(mapStateToProps, {
	getResource,
	setCustomProp,
	updateInfo,
	updateBlocks,
	updateDefaults,
	updateGlobals,
	updateData,
	updateAdmin
})(GBX3);
