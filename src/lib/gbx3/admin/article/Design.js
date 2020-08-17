import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	Icon,
	ModalLink
} from '../../../';
import Layout from '../../Layout';
import Share from './Share';
import ArticleMenu from './ArticleMenu';
import ReceiptEmail from '../receipt/ReceiptEmail';
import ReceiptMenu from '../receipt/ReceiptMenu';
import {
	updateAdmin,
	updateInfo,
	toggleAdminLeftPanel,
	setLoading
} from '../../redux/gbx3actions';
import Toggle from 'react-toggle';
import { FaPalette } from 'react-icons/fa';
import { GoBeaker } from 'react-icons/go';
import { FiPenTool } from 'react-icons/fi';
import { AiOutlineNotification } from 'react-icons/ai';

const GBX3_URL = process.env.REACT_APP_GBX_URL;

class Design extends React.Component {

	constructor(props) {
		super(props);
		this.switchCreateType = this.switchCreateType.bind(this);
		this.renderDisplay = this.renderDisplay.bind(this);
		this.togglePreview = this.togglePreview.bind(this);
		this.renderTopPanel = this.renderTopPanel.bind(this);
		this.changePreviewDevice = this.changePreviewDevice.bind(this);
		this.previewReceipt = this.previewReceipt.bind(this);
		this.previewArticle = this.previewArticle.bind(this);
		this.state = {
		};
		this.iframePreviewRef = React.createRef();
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
				icon: <Icon><AiOutlineNotification /></Icon>
			}
		};

		if (!previewMode) {
			if (open) {
				leftSide.push(
					<GBLink key={'leftSide'} className='link side' onClick={() => this.props.toggleAdminLeftPanel()}>{!mobile ? contentObj[createType].icon : <span className='icon icon-x'></span>}{!mobile ? <span className='flexCenter centerItems'>{contentObj[createType].menuText} Menu <span className='leftPanelClose icon icon-x'></span></span> : ''}</GBLink>
				);
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
					<GBLink className='link side' style={{ marginRight: 10 }} onClick={this.togglePreview}>{ mobile ? <span className='icon icon-eye'></span> : <span>Preview Mode</span> }</GBLink>
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
			middle.push(
				<div key={'middle'} className='button-group middle'>
					<GBLink className={`ripple link ${previewDevice === 'phone' ? 'selected' : ''}`} onClick={() => this.previewArticle('phone')}><span className='icon icon-smartphone'></span><span className='iconText'>Mobile</span></GBLink>
					<GBLink className={`ripple link ${previewDevice === 'desktop' ? 'selected' : ''}`} onClick={() => this.previewArticle('desktop')}><span className='icon icon-monitor'></span><span className='iconText'>Desktop</span></GBLink>
					<ModalLink className={`ripple link ${previewDevice === 'receipt' ? 'selected' : ''}`} onClick={() => this.previewReceipt()}><span className='icon icon-mail'></span><span className='iconText'>Receipt</span></ModalLink>
				</div>
			);
		} else {
			middle.push(
				<div key={'middle'} className='button-group'>
					<GBLink className={`ripple link ${createType === 'article' ? 'selected' : ''}`} onClick={() => this.switchCreateType('article')}><span className='centered'>{contentObj.article.icon}<span className='menuText'>{contentObj.article.menuText}</span></span></GBLink>
					<GBLink className={`ripple link ${createType === 'receipt' ? 'selected' : ''}`} onClick={() => this.switchCreateType('receipt')}><span className='centered'>{contentObj.receipt.icon}<span className='menuText'>{contentObj.receipt.menuText}</span></span></GBLink>
					<ModalLink id='share' className={`ripple link ${createType === 'share' ? 'selected' : ''}`}><span className='centered'>{contentObj.share.icon}<span className='menuText'>{contentObj.share.menuText}</span></span></ModalLink>
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

	togglePreview() {

		const {
			createType
		} = this.props;

		const previewMode = this.props.previewMode ? false : true;
		this.props.updateAdmin({ previewMode, editable: previewMode ? false : true });

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

	async previewReceipt() {
		const createTypeUpdated = await this.props.updateAdmin({ createType: 'receipt', previewDevice: 'receipt' });
	}

	async previewArticle(previewDevice) {
		const createTypeUpdated = await this.props.updateAdmin({ createType: 'article' });
		if (createTypeUpdated) {
			this.changePreviewDevice(previewDevice);
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
				if (previewMode) {
					items.push(
						<div key='receipt' className='gbx3ReceiptLayout'>
							<div className='gbx3ReceiptContainer'>
								<div className='block'>
									<iframe id='emailIframePreview' className='emailIframe' style={{ height: previewMode ? '100vh' : 0 }} ref={this.iframePreviewRef}></iframe>
									<ReceiptEmail iframePreviewRef={this.iframePreviewRef} />
								</div>
							</div>
						</div>
					);
				} else {
					items.push(
						<ReceiptEmail
							key={'receipt'}
						/>
					);
				}
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
	toggleAdminLeftPanel,
	setLoading
})(Design);
