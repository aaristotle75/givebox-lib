import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	ModalLink
} from '../../';
import Design from './article/Design';
import Create from './article/Create';
import Share from './article/Share';
import Logo from '../Logo';
import AnimateHeight from 'react-animate-height';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { toggleModal } from '../../api/actions';
import {
	updateInfo,
	updateAdmin,
	toggleAdminLeftPanel,
	resetGBX3,
	saveGBX3,
	setLoading
} from '../redux/gbx3actions';
import AvatarMenuButton from './AvatarMenuButton';

class Admin extends React.Component {

	constructor(props) {
		super(props);
		this.renderStep = this.renderStep.bind(this);
		this.exitAdmin = this.exitAdmin.bind(this);
		this.togglePreview = this.togglePreview.bind(this);
		this.renderTopPanel = this.renderTopPanel.bind(this);
		this.changePreviewDevice = this.changePreviewDevice.bind(this);
		this.state = {
			referrerStep: ''
		};
	}

	componentDidMount() {
		this.props.updateInfo({ stage: 'admin' });
	}

	async exitAdmin() {
		const {
			project
		} = this.props;

		if (project === 'share') {
			const infoUpdated = await this.props.updateInfo({ stage: 'public' });
			if (infoUpdated) this.props.updateAdmin({ publicView: true });
		} else {
			if (this.props.exitCallback) this.props.exitCallback();
		}
	}

	goBack(articleID) {
		this.props.loadGBX3(articleID);
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

	renderStep() {
		const {
			step
		} = this.props;

		switch (step) {
			case 'create': {
				return (
					<Create />
				)
			}

			case 'share': {
				return (
					<Share />
				)
			}

			case 'design':
			default: {
				return (
					<Design
						reloadGBX3={this.props.reloadGBX3}
						loadGBX3={this.props.loadGBX3}
					/>
				)
			}
		}
	}

	renderTopPanel() {
		const {
			step,
			createType,
			breakpoint,
			previewMode,
			previewDevice
		} = this.props;

		const mobile = breakpoint === 'mobile' ? true : false;
		const leftSide = [];
		const middle = [];
		const rightSide = [];

		if (previewMode) {
			leftSide.push(
				<GBLink key={'leftSide'} className='link side' onClick={() => this.togglePreview()}><span className='icon icon-chevron-left'></span>{!mobile ? 'Exit Preview' : ''}</GBLink>
			);
		} else {
			leftSide.push(
				<GBLink key={'leftSide'} className='link side' onClick={() => this.exitAdmin()}><span className='icon icon-chevron-left'></span>{!mobile ? 'Exit Form Builder' : ''}</GBLink>
			);
		}

		if (step !== 'create') {
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
						<GBLink className={`ripple link ${step === 'design' ? 'selected' : ''}`} onClick={() => this.props.updateAdmin({ step: 'design' })}>DESIGN</GBLink>
						<GBLink className={`ripple link ${step === 'share' ? 'selected' : ''}`} onClick={() => this.props.updateAdmin({ step: 'share', createType: 'article' })}>SHARE</GBLink>
					</div>
				);
			}
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

	render() {

		const {
			step,
			articleID,
			previewMode,
			saveStatus,
			editable,
			access,
			isVolunteer,
			hasAccessToEdit,
			hasAccessToCreate,
			openAdmin: open
		} = this.props;

		if (!hasAccessToEdit && !hasAccessToCreate) return  <div className='flexCenter flexColumn centeritems'>You do not have access.</div>;

		return (
			<div className={`gbx3AdminLayout ${editable ? 'editable' : ''} ${previewMode ? 'previewMode' : ''}`}>
				<AnimateHeight height={saveStatus === 'saving' ? 'auto' : 0 } duration={500}>
					<div className='autoSaved'>Saving...</div>
				</AnimateHeight>
				<GBLink onClick={this.props.toggleAdminLeftPanel} className={`link leftPanelOpen ${open ? 'open' : 'close'}`}>
					<div className='editGraphic'>
						<span className='icon icon-edit'></span>
					</div>
				</GBLink>
				<div className={`gbx3TopHeader`}>
					<header className={`navbar`}>
						<div className='container'>
							<div className='headerLeftSide'>
								<Logo className='logo' />
								{ articleID && !isVolunteer?
									step === 'create' ?
										<GBLink onClick={() => this.goBack(articleID)}><span className='icon icon-chevron-left'></span> Go Back</GBLink>
									:
										<GBLink className='button' onClick={() => this.props.loadCreateNew()}>Create New</GBLink>
								: '' }
							</div>
							<AvatarMenuButton />
						</div>
					</header>
				</div>
				<div className={`topPanel`}>
					{this.renderTopPanel()}
				</div>
				{this.renderStep()}
			</div>
		)
	}
}

Admin.defaultProps = {
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const saveStatus = util.getValue(gbx3, 'saveStatus');
	const info = util.getValue(gbx3, 'info', {});
	const breakpoint = util.getValue(info, 'breakpoint');
	const display = util.getValue(info, 'display');
	const articleID = util.getValue(info, 'articleID');
	const project = util.getValue(info, 'project');
	const admin = util.getValue(gbx3, 'admin', {});
	const step = util.getValue(admin, 'step');
	const isVolunteer = util.getValue(admin, 'volunteer');
	const previewDevice = util.getValue(admin, 'previewDevice');
	const createType = util.getValue(admin, 'createType');
	const previewMode = util.getValue(admin, 'previewMode');
	const openAdmin = util.getValue(admin, 'open');
	const access = util.getValue(state.resource, 'access');
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
	const hasAccessToCreate = util.getValue(admin, 'hasAccessToCreate');
	const editable = util.getValue(admin, 'editable');

	return {
		project,
		breakpoint,
		display,
		articleID,
		openAdmin,
		step,
		isVolunteer,
		createType,
		previewDevice,
		previewMode,
		saveStatus,
		access,
		hasAccessToEdit,
		hasAccessToCreate,
		admin,
		editable
	}
}

export default connect(mapStateToProps, {
	updateInfo,
	updateAdmin,
	toggleAdminLeftPanel,
	resetGBX3,
	saveGBX3,
	toggleModal,
	setLoading
})(Admin);
