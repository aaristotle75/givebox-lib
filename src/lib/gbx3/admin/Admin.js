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
		this.togglePreviewForm = this.togglePreviewForm.bind(this);
		this.state = {
			previewForm: false
		};
	}

	exitAdmin() {
		console.log('execute exitAdmin');
	}

	togglePreviewForm(value) {
		const previewForm = this.state.previewForm ? false : true;
		this.setState({ previewForm });
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

	render() {

		const {
			previewForm
		} = this.state;

		const {
			step,
			openAdmin: open,
			saveStatus,
			editable,
			access,
			hasAccessToEdit,
			breakpoint
		} = this.props;

		if (!hasAccessToEdit) return <></>;

		const mobile = breakpoint === 'mobile' ? true : false;
		const topShowAdminPanelAndPreview = step === 'create' ? false : true;

		return (
			<div className={`gbx3AdminLayout ${editable ? 'editable' : ''}`}>
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
					<div className='topPanelContainer'>
						<div className='leftSide'>
							<GBLink className='link side' onClick={() => this.exitAdmin()}><span className='icon icon-chevron-left'></span>{!mobile ? 'Exit Builder' : ''}</GBLink>
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
									<GBLink className='link side' style={{ marginRight: 10 }} onClick={this.togglePreviewForm}>{mobile ? <span className='icon icon-eye'></span> : 'Preview Form'}</GBLink>
									<Toggle
										icons={false}
										checked={previewForm}
										onChange={this.togglePreviewForm}
									/>
								</>
							: <></> }
						</div>
					</div>
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
