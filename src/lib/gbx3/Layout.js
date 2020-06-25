import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	ModalRoute
} from '../';
import Shop from './Shop';
import Article from './Article';

class Layout extends React.Component {

	constructor(props) {
		super(props);
		this.renderDisplay = this.renderDisplay.bind(this);
		this.state = {
		}
	}

	componentDidMount() {
	}

	renderDisplay() {
		const {
			display
		} = this.props;

		const items = [];

		switch (display) {
			case 'shop': {
				items.push(
					<Shop
						key={'shop'}
						reloadGBX3={this.props.reloadGBX3}
					/>
				)
				break;
			}

			case 'article':
			default: {
				items.push(
					<Article
						key={'article'}
						loadGBX3={this.props.loadGBX3}
						primaryColor={this.props.primaryColor}
					/>
				)
				break;
			}
		}
		return items;
	}

	render() {
		const {
			editable,
			globals,
			hasAccessToEdit
		} = this.props;

		const isEditable = hasAccessToEdit && editable ? true : false;
		const style = { maxWidth: '850px' };
		return (
			<div id='gbx3Layout' className='gbx3Layout'>
				<div style={style} className={`gbx3Container ${isEditable ? 'editable' : ''}`}>
					{this.renderDisplay()}
					<ModalRoute
						id='shop'
						className='gbx3 givebox-paymentform'
						effect='3DFlipVert'
						style={{ width: '70%' }}
						disallowBgClose={true}
						component={(props) => <Shop {...props} reloadGBX3={this.props.reloadGBX3} />}
					/>
				</div>
			</div>
		)
	}

}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const info = util.getValue(gbx3, 'info', {});
	const display = util.getValue(info, 'display');
	const admin = util.getValue(gbx3, 'admin', {});
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
	const editable = util.getValue(admin, 'editable');

	return {
		display,
		hasAccessToEdit,
		editable,
		globals: util.getValue(gbx3, 'globals', {})
	}
}

export default connect(mapStateToProps, {
})(Layout);
