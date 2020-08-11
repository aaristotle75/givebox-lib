import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	Icon
} from '../../../';
import Layout from '../../Layout';
import Share from './Share';
import ArticleMenu from './ArticleMenu';
import ReceiptEmail from '../receipt/ReceiptEmail';
import ReceiptMenu from '../receipt/ReceiptMenu';
import {
	updateAdmin,
	updateInfo,
	toggleAdminLeftPanel
} from '../../redux/gbx3actions';
import Toggle from 'react-toggle';
import { FaMagic, FaPalette, FaDraftingCompass } from 'react-icons/fa';
import { IoMdMegaphone, IoIosAirplane } from 'react-icons/io';
import { GoMegaphone, GoBeaker } from 'react-icons/go';
import { FiPenTool } from 'react-icons/fi';

const GBX3_URL = process.env.REACT_APP_GBX_URL;

class Design extends React.Component {

	constructor(props) {
		super(props);
		this.switchCreateType = this.switchCreateType.bind(this);
		this.renderDisplay = this.renderDisplay.bind(this);
		this.togglePreview = this.togglePreview.bind(this);
		this.renderTopPanel = this.renderTopPanel.bind(this);
		this.changePreviewDevice = this.changePreviewDevice.bind(this);
		this.state = {
		};
	}

	renderTopPanel() {
		const {
			createType,
			breakpoint,
			previewMode,
			previewDevice,
			openAdmin: open
		} = this.props;

		const mobile = breakpoint === 'mobile' ? true : false;
		const leftSide = [];
		const middle = [];
		const rightSide = [];

		const contentObj = {
			article: {
				menuText: !mobile ? 'Design Form' : 'Design',
				icon: <Icon><FaPalette /></Icon>
			},
			receipt: {
				menuText: !mobile ? 'Customize Receipt' : 'Receipt',
				icon: <Icon><FiPenTool /></Icon>
			},
			share: {
				menuText: !mobile ? 'Share Form' : 'Share',
				icon: <Icon><GoMegaphone /></Icon>
			}
		};

		if (!previewMode) {
			if (open) {
				leftSide.push(
					<GBLink key={'leftSide'} className='link side' onClick={() => this.props.toggleAdminLeftPanel()}>{!mobile ? contentObj[createType].icon : <span className='icon icon-x'></span>}{!mobile ? <span>{contentObj[createType].menuText} Menu <span className='icon icon-x'></span></span> : ''}</GBLink>
				);
				/*
				leftSide.push(
					<GBLink key={'leftSide'} className='link side' onClick={() => this.props.toggleAdminLeftPanel()}>{!mobile ? <span>{contentObj[createType].icon}{contentObj[createType].menuText} Menu</span> : ''}<span className='leftPanelClose icon icon-x'></span></GBLink>
				);
				*/
			} else {
				leftSide.push(
					<GBLink key={'leftSide'} className='link side' onClick={() => this.props.toggleAdminLeftPanel()}><Icon><GoBeaker /></Icon>{!mobile ? 'Advanced Settings' : ''}</GBLink>
				);
			}
		}

		if (!mobile) {
			rightSide.push(
				<div
					className='rightSide'
					key='rightSide'
				>
					<GBLink className='link side' style={{ marginRight: 10 }} onClick={this.togglePreview}>{ mobile ? <span className='icon icon-eye'></span> : <span>Preview {createType === 'article' ? 'Form' : 'Email' }</span> }</GBLink>
					<Toggle
						icons={false}
						checked={previewMode}
						onChange={this.togglePreview}
					/>
				</div>
			);
		} else {
			rightSide.push(<div className='rightSide' key='rightSide'>&nbsp;</div>)
		}

		if (previewMode) {
			switch (createType) {
				case 'receipt': {

					break;
				}

				case 'form':
				default: {
					middle.push(
						<div key={'middle'} className='button-group middle'>
							<GBLink className={`ripple link ${previewDevice === 'phone' ? 'selected' : ''}`} onClick={() => this.changePreviewDevice('phone')}><span className='icon icon-smartphone'></span><span className='iconText'>Mobile</span></GBLink>
							<GBLink className={`ripple link ${previewDevice === 'desktop' ? 'selected' : ''}`} onClick={() => this.changePreviewDevice('desktop')}><span className='icon icon-monitor'></span><span className='iconText'>Desktop</span></GBLink>
							<GBLink className={`ripple link ${previewDevice === 'public' ? 'selected' : ''}`} onClick={async () => {
								const infoUpdated = await this.props.updateInfo({ stage: 'public' });
								if (infoUpdated) this.props.updateAdmin({ publicView: true });
							}}><span className='icon icon-external-link'></span><span className='iconText'>Public View</span></GBLink>
						</div>
					);
					break;
				}
			}
		} else {
			middle.push(
				<div key={'middle'} className='button-group'>
					<GBLink className={`ripple link ${createType === 'article' ? 'selected' : ''}`} onClick={() => this.switchCreateType('article')}><span className='centered'>{contentObj.article.icon}{contentObj.article.menuText}</span></GBLink>
					<GBLink className={`ripple link ${createType === 'receipt' ? 'selected' : ''}`} onClick={() => this.switchCreateType('receipt')}><span className='centered'>{contentObj.receipt.icon}{contentObj.receipt.menuText}</span></GBLink>
					<GBLink className={`ripple link ${createType === 'share' ? 'selected' : ''}`} onClick={() => this.props.updateAdmin({ step: 'share', createType: 'article' })}><span className='centered'>{contentObj.share.icon}{contentObj.share.menuText}</span></GBLink>
				</div>
			);
		}

		return (
			<div className='topPanelContainer'>
				<div className='leftSide'>
					{leftSide}
				</div>
				<div className='middle centerAlign adminPanelTabs'>
					{middle}
				</div>
				{rightSide}
			</div>
		)
	}

	togglePreview(value) {
		const {
			createType
		} = this.props;

		const previewMode = this.props.previewMode ? false : true;
		let step = this.state.referrerStep || this.props.step;
		if (previewMode) {
			step = 'design';
			this.setState({ referrerStep: this.props.step });
		}
		this.props.updateAdmin({ previewMode, step, editable: previewMode ? false : true });
		if (createType === 'receipt' && this.props.previewMode) {
			const iframeEl = document.getElementById('emailIframePreview');
			if (iframeEl) {
				iframeEl.contentWindow.location.replace('about:blank');
			}
		}
	}

	async changePreviewDevice(previewDevice) {
		this.props.setLoading(true);
		const adminUpdated = await this.props.updateAdmin({ previewDevice });
		if (adminUpdated) {
			this.timeout = setTimeout(() => {
				this.props.setLoading(false);
				this.timeout = null;
			}, 0);
		}
	}

	async switchCreateType(createType) {
		this.props.updateAdmin({ createType });
	}

	renderDisplay() {
		const {
			createType,
			previewDevice,
			previewMode,
			articleID
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

			case 'share': {
				items.push(
					<Share
						key={'share'}
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
								<iframe src={`${GBX3_URL}/${articleID}/?public&preview`} title={`${util.toTitleCase(previewDevice)} Preview`} />
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
				<div className={`topPanel`}>
					{this.renderTopPanel()}
				</div>
				<div className={`leftPanel ${open ? 'open' : 'close'}`}>
					{ createType === 'article' ?
						<ArticleMenu />
					:
						<ReceiptMenu />
					}
				</div>
				<div
					key={'form'}
					className={`stageContainer ${open ? 'open' : 'close'}`}
				>
					<div className='stageAligner'>
						{this.renderDisplay()}
					</div>
				</div>
			</>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const breakpoint = util.getValue(gbx3, 'info.breakpoint');
	const admin = util.getValue(gbx3, 'admin', {});
	const articleID = util.getValue(gbx3, 'info.articleID');
	const previewMode = util.getValue(admin, 'previewMode');
	const previewDevice = util.getValue(admin, 'previewDevice');
	const openAdmin = util.getValue(admin, 'open');
	const createType = util.getValue(admin, 'createType');

	return {
		breakpoint,
		articleID,
		previewMode,
		previewDevice,
		openAdmin,
		createType
	}
}

export default connect(mapStateToProps, {
	updateAdmin,
	updateInfo,
	toggleAdminLeftPanel
})(Design);
