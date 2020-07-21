import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	ModalRoute
} from '../';
import Shop from './Shop';
import Article from './Article';
import Confirmation from './payment/Confirmation';
import {
	updateAdmin
} from './redux/gbx3actions';

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
						reloadGBX3={this.props.reloadGBX3}
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
			access,
			preview,
			stage,
			hasAccessToEdit
		} = this.props;

		const style = { maxWidth: '850px' };

		const avatar =
			<div className='hasAccessToEditPublic'>
				<div onClick={() => this.props.updateAdmin({ publicView: false })} className='avatarLink'>
					{access.userImage ? <div className='avatarImage'><img src={util.imageUrlWithStyle(access.userImage, 'small')} alt='Avatar Small Circle' /></div> :
						<div className='defaultAvatarImage'>{access.initial}</div>
					}
				</div>
			</div>
		;

		const showAvatar = (stage !== 'admin') && !preview && hasAccessToEdit ? true : false;

		return (
			<>
			<div className='gbx3LayoutBackground'></div>
			<div id='gbx3Layout' className='gbx3Layout'>
				{showAvatar ? avatar : '' }
				<div style={style} className={`gbx3Container`}>
					{this.renderDisplay()}
					<ModalRoute
						id='shop'
						className='gbx3 givebox-paymentform'
						effect='3DFlipVert'
						style={{ width: '70%' }}
						disallowBgClose={true}
						component={(props) => <Shop {...props} reloadGBX3={this.props.reloadGBX3} />}
					/>
					<ModalRoute
						id='paymentConfirmation'
						effect='scaleUp'
						style={{ width: '60%' }}
						className='gbx3'
						component={() =>
							<Confirmation primaryColor={this.props.primaryColor} />
						}
					/>
				</div>
			</div>
			</>
		)
	}

}

function mapStateToProps(state, props) {

	const access = util.getValue(state, 'resource.access');
	const gbx3 = util.getValue(state, 'gbx3', {});
	const info = util.getValue(gbx3, 'info', {});
	const stage = util.getValue(info, 'stage');
	const preview = util.getValue(info, 'preview');
	const display = util.getValue(info, 'display');
	const hasAccessToEdit = util.getValue(gbx3, 'admin.hasAccessToEdit');

	return {
		access,
		display,
		stage,
		preview,
		hasAccessToEdit,
		globals: util.getValue(gbx3, 'globals', {})
	}
}

export default connect(mapStateToProps, {
	updateAdmin
})(Layout);
