import React from 'react';
import { connect } from 'react-redux';
import Layout from './Layout';
import {
	types,
	util,
	Loader,
	getResource,
	setCustomProp,
	updateInfo,
	updateBlocks,
	updateGlobals,
	updateData
} from '../';
import { defaultGlobals, defaultBlocks } from './config';
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
			kind
		} = this.props;

		this.loadGBX3({
			orgID,
			articleID,
			kindID,
			kind
		});
	}

	loadGBX3({
		orgID,
		articleID,
		kindID,
		kind
	}) {

		const apiName = `org${types.kind(kind).api.item}`;
		const globals = { ...defaultGlobals };
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
						Object.assign({}, globals, {
							gbxStyle: { themeColor }
						}, {
							...util.getValue(customTemplate, 'globals', {})
						});
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
						this.props.updateGlobals(globals);
						this.props.updateData(res);
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

		console.log('execute', this.props.access);

		return (
			<div className='gbx3'>
				<Layout
					{...this.props}
					loadGBX3={this.loadGBX3}
				/>
			</div>
		)
	}

}

GBX3.defaultProps = {
	breakpointWidth: 768,
	defaultPrimaryColor: '#4775f8'
}

function mapStateToProps(state, props) {

	return {
	}
}

export default connect(mapStateToProps, {
	getResource,
	setCustomProp,
	updateInfo,
	updateBlocks,
	updateGlobals,
	updateData
})(GBX3);
