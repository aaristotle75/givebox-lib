import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	updateAdmin,
	updateInfo
} from '../../../';
import Layout from '../../Layout';
import ArticleMenu from './ArticleMenu';
import ReceiptEmail from '../receipt/ReceiptEmail';
import ReceiptMenu from '../receipt/ReceiptMenu';

const GBX3_URL = process.env.REACT_APP_GBX3_URL;

class Design extends React.Component {

	constructor(props) {
		super(props);
		this.switchCreateType = this.switchCreateType.bind(this);
		this.renderDisplay = this.renderDisplay.bind(this);
		this.state = {
		};
	}

	async switchCreateType(createType) {
		this.props.updateAdmin({ createType });
	}

	renderDisplay() {
		const {
			createType,
			previewDevice,
			previewMode
		} = this.props;

		const items = [];

		switch(createType) {
			case 'receipt': {
				items.push(
					<ReceiptEmail
						key={'receipt'}
					/>
				);
				break;
			}

			case 'article':
			default: {
				if (previewMode) {
					items.push(
						<div
							key={'article'}
							className={`deviceLayoutWrapper ${previewDevice}Wrapper` }>
							<div className='stagePreview'>
								<iframe src={`${GBX3_URL}?public&preview`} title={`${util.toTitleCase(previewDevice)} Preview`} />
							</div>
						</div>
					);
				} else {
					items.push(
						<Layout
							key={'article'}
							loadGBX3={this.props.loadGBX3}
							reloadGBX3={this.props.reloadGBX3}
						/>
					);
				}
				break;
			}
		}
		return items;
	}

	render() {

		const {
			createType,
			openAdmin: open
		} = this.props;

		return (
			<>
				<div className={`leftPanel ${open ? 'open' : 'close'}`}>
					{ createType === 'article' ?
						<ArticleMenu />
					:
						<ReceiptMenu />
					}
				</div>
				<div
					key={'form'}
					className={`stageContainer hasBottom ${open ? 'open' : 'close'}`}
				>
					<div className='stageAligner'>
						{this.renderDisplay()}
					</div>
				</div>
				<div className={`bottomPanel ${open ? 'open' : 'close'}`}>
					<div className='centerAlign adminPanelTabs'>
						<div className='button-group'>
							<GBLink style={{ marginRight: 20 }} className={`ripple link ${createType === 'article' ? 'selected' : ''}`} onClick={() => this.switchCreateType('article')}>Payment Form</GBLink>
							<GBLink style={{ marginLeft: 20 }} className={`ripple link ${createType === 'receipt' ? 'selected' : ''}`} onClick={() => this.switchCreateType('receipt')}>Thank You Email</GBLink>
						</div>
					</div>
				</div>
			</>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const previewMode = util.getValue(admin, 'previewMode');
	const previewDevice = util.getValue(admin, 'previewDevice');
	const openAdmin = util.getValue(admin, 'open');
	const createType = util.getValue(admin, 'createType');

	return {
		previewMode,
		previewDevice,
		openAdmin,
		createType
	}
}

export default connect(mapStateToProps, {
	updateAdmin,
	updateInfo
})(Design);
