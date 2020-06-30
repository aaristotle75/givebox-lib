import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	updateAdmin,
	toggleAdminLeftPanel,
	GBLink,
	resetGBX3,
	saveGBX3,
	toggleModal,
	ModalRoute,
	ModalLink
} from '../../';
import Create from './Create';
import Design from './Design';
import Share from './Share';
import AvatarMenu from './AvatarMenu';
import Logo from '../Logo';
import AnimateHeight from 'react-animate-height';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';

class Admin extends React.Component {

	constructor(props) {
		super(props);
		this.renderStep = this.renderStep.bind(this);
		this.exitAdmin = this.exitAdmin.bind(this);
		this.togglePreview = this.togglePreview.bind(this);
		this.renderTopPanel = this.renderTopPanel.bind(this);
	}

	exitAdmin() {
		console.log('execute exitAdmin');
	}

	togglePreview(value) {
		const previewMode = this.props.previewMode ? false : true;
		this.props.updateAdmin({ previewMode, editable: previewMode ? false : true });
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
					<Design />
				)
			}
		}
	}

	renderTopPanel() {
		const {
			step,
			createType,
			breakpoint,
			previewMode
		} = this.props;

		const mobile = breakpoint === 'mobile' ? true : false;
		const topShowAdminPanelAndPreview = step === 'create' ? false : true;

		return (
			<div className='topPanelContainer'>
				<div className='leftSide'>
					<GBLink className='link side' onClick={() => this.exitAdmin()}><span className='icon icon-chevron-left'></span>{!mobile ? 'Exit Form Builder' : ''}</GBLink>
				</div>
				<div className='middle centerAlign adminPanelTabs'>
					{topShowAdminPanelAndPreview ?
					<div className='button-group'>
						<GBLink className={`ripple link ${step === 'design' ? 'selected' : ''}`} onClick={() => this.props.updateAdmin({ step: 'design' })}>DESIGN</GBLink>
						<GBLink className={`ripple link ${step === 'share' ? 'selected' : ''}`} onClick={() => this.props.updateAdmin({ step: 'share' })}>SHARE</GBLink>
					</div>
					: <></> }
				</div>
				<div className='rightSide'>
					{topShowAdminPanelAndPreview ?
						<>
							<GBLink className='link side' style={{ marginRight: 10 }} onClick={this.togglePreview}>{mobile ? <span className='icon icon-eye'></span> : 'Preview Form'}</GBLink>
							<Toggle
								icons={false}
								checked={previewMode}
								onChange={this.togglePreview}
							/>
						</>
					: <></> }
				</div>
			</div>
		)
	}

	render() {

		const {
			previewMode,
			saveStatus,
			editable,
			access,
			hasAccessToEdit,
			openAdmin: open
		} = this.props;

		if (!hasAccessToEdit) return <></>;

		return (
			<div className={`gbx3AdminLayout ${editable ? 'editable' : ''} ${previewMode ? 'previewMode' : ''}`}>
				<ModalRoute
					id='avatarMenu'
					effect='3DFlipVert'
					style={{ width: '40%' }}
					disallowBgClose={false}
					component={(props) => <AvatarMenu />}
				/>
				<AnimateHeight height={saveStatus === 'saving' ? 'auto' : 0 } duration={500}>
					<div className='autoSaved'>Saving...</div>
				</AnimateHeight>
				<GBLink onClick={this.props.toggleAdminLeftPanel} className={`link leftPanelOpen ${open ? 'open' : 'close'}`}>
					<div className='leftPanelOpenGraphic'>
						<span className='icon icon-edit'></span>
					</div>
				</GBLink>
				<div className={`gbx3TopHeader`}>
					<header className={`navbar`}>
						<div className='container'>
							<div className='headerLeftSide'>
								<Logo className='logo' />
							</div>
							<div className='avatarLink'>
								<ModalLink id='avatarMenu' className='link'>
									<span className='orgName'>{util.getValue(access, 'orgName')}</span>
									{access.userImage ? <div className='avatarImage'><img src={util.imageUrlWithStyle(access.userImage, 'small')} alt='Avatar Small Circle' /></div> :
										<div className='defaultAvatarImage'>{access.initial}</div>
									}
								</ModalLink>
							</div>
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
	const admin = util.getValue(gbx3, 'admin', {});
	const step = util.getValue(admin, 'step');
	const createType = util.getValue(admin, 'createType');
	const previewMode = util.getValue(admin, 'previewMode');
	const openAdmin = util.getValue(admin, 'open');
	const access = util.getValue(state.resource, 'access');
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
	const editable = util.getValue(admin, 'editable');

	return {
		breakpoint,
		display,
		articleID,
		openAdmin,
		step,
		createType,
		previewMode,
		saveStatus,
		access,
		hasAccessToEdit,
		admin,
		editable
	}
}

export default connect(mapStateToProps, {
	updateAdmin,
	toggleAdminLeftPanel,
	resetGBX3,
	saveGBX3,
	toggleModal
})(Admin);
