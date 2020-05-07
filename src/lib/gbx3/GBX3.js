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
			access,
			globals
		} = this.props;

		const apiName = `org${types.kind(kind).api.item}`;
		const blocks = { ...util.getValue(defaultBlocks, kind, {}) };

		if (kindID) {
			this.props.getResource(apiName, {
				id: [kindID],
				orgID: orgID,
				callback: (res, err) => {
					if (!err && !util.isEmpty(res)) {
						const settings = util.getValue(res, 'giveboxSettings', {});
						const themeColor = util.getValue(settings, 'primaryColor', this.props.defaultPrimaryColor);
						const customTemplate = util.getValue(settings, 'customTemplate', {});

						Object.assign({}, blocks, {
							...util.getValue(customTemplate, 'blocks', {})
						});

						this.props.updateInfo({
							orgID,
							articleID,
							kindID,
							kind,
							apiName
						});
						this.props.updateBlocks(blocks);
						this.props.updateGlobals(
							Object.assign({}, globals, {
								gbxStyle: { themeColor }
							}, {
								...util.getValue(customTemplate, 'globals', {})
							})
						);
						this.props.updateData(res);
						this.props.updateAdmin({
							editable,
							hasAccessToEdit: util.getAuthorizedAccess(access, orgID)
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
	updateGlobals,
	updateData,
	updateAdmin
})(GBX3);
