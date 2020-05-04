import React from 'react';
import { connect } from 'react-redux';
import Layout from './Layout';
import {
	types,
	util,
	Loader,
	getResource,
	setCustomProp
} from '../';


class GBX3 extends React.Component {

	constructor(props) {
		super(props);
		this.state = {

		};
	}

	componentDidMount() {
		if (util.isEmpty(this.props.article) && this.props.kindID) {
			this.props.getResource(this.props.resourceName, {
				id: [this.props.kindID],
				orgID: this.props.orgID,
				callback: (res, err) => {
					if (!err && !util.isEmpty(res)) {
						const settings = util.getValue(res, 'giveboxSettings', {});
						const color = util.getValue(settings, 'primaryColor', this.props.defaultPrimaryColor);
						this.props.setCustomProp('primaryColor', color);
					}
				}
			});
		}
	}

	render() {

		if (this.props.kindID && util.isEmpty(this.props.article)) return <Loader msg='Loading article resource...' />

		return (
			<div className='gbx3'>
				<Layout
					{...this.props}
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
	const resourceName = `org${types.kind(props.kind).api.item}`;
	const resource = util.getValue(state.resource, resourceName, {});
	const isFetching = util.getValue(resource, 'isFetching', false);
	const article = util.getValue(resource, 'data', {});

	return {
		resourceName,
		resource,
		isFetching,
		article,
		access: util.getValue(state.resource, 'access', {})
	}
}

export default connect(mapStateToProps, {
	getResource,
	setCustomProp
})(GBX3);
