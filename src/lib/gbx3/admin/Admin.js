import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	updateAdmin,
	GBLink,
	Fade,
	resetGBX3,
	saveGBX3,
	toggleModal,
	ModalRoute,
	ModalLink
} from '../../';
import CreateNewMenu from './CreateNewMenu';
import LayoutMenu from './LayoutMenu';
import AvatarMenu from './AvatarMenu';
import ReceiptEdit from './ReceiptEdit';
import Logo from '../Logo';
import AnimateHeight from 'react-animate-height';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';

class Admin extends React.Component {

	constructor(props) {
		super(props);
		this.toggleOpen = this.toggleOpen.bind(this);
		this.renderMenu = this.renderMenu.bind(this);
		this.exitAdmin = this.exitAdmin.bind(this);
		this.switchCreateType = this.switchCreateType.bind(this);
		this.togglePreviewForm = this.togglePreviewForm.bind(this);
		this.state = {
			createType: 'form',
			previewForm: false
		};
	}

	toggleOpen() {
		this.props.updateAdmin({ open: this.props.openAdmin ? false : true });
	}

	exitAdmin() {
		console.log('execute exitAdmin');
	}

	switchCreateType(createType) {
		console.log('execute switchCreateType', createType);
		this.setState({ createType });
	}

	togglePreviewForm(value) {
		const previewForm = this.state.previewForm ? false : true;
		this.setState({ previewForm });
	}

	renderMenu() {
		const {
			display
		} = this.props;

		switch (display) {
			case 'createNew': {
				return (
					<CreateNewMenu />
				)
			}

			case 'layout':
			default: {
				return (
					<LayoutMenu />
				)
			}
		}
	}

	render() {

		const {
			createType,
			previewForm
		} = this.state;

		const {
			openAdmin: open,
			saveStatus,
			editable,
			access,
			hasAccessToEdit,
			breakpoint
		} = this.props;

		if (!hasAccessToEdit) return <></>;

		const mobile = breakpoint === 'mobile' ? true : false;

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
				<GBLink onClick={this.toggleOpen} className={`link leftPanelOpen ${open ? 'open' : 'close'}`}>
					<div className='leftPanelOpenGraphic'>
						<span className='icon icon-layout'></span>
					</div>
				</GBLink>
				<GBLink onClick={this.toggleOpen} className={`link leftPanelClose ${open ? 'open' : 'close'}`}><span className='icon icon-x'></span></GBLink>
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
							<div className='button-group'>
								<GBLink className={`ripple link ${createType === 'form' ? 'selected' : ''}`} onClick={() => this.switchCreateType('form')}>CREATE</GBLink>
								<GBLink className={`ripple link ${createType === 'receipt' ? 'selected' : ''}`} onClick={() => this.switchCreateType('receipt')}>SHARE</GBLink>
							</div>
						</div>
						<div className='rightSide'>
							<GBLink className='link side' style={{ marginRight: 10 }} onClick={this.togglePreviewForm}>{mobile ? <span className='icon icon-eye'></span> : 'Preview Form'}</GBLink>
							<Toggle
								icons={false}
								checked={previewForm}
								onChange={this.togglePreviewForm}
							/>
						</div>
					</div>
				</div>
				<div className={`leftPanel ${open ? 'open' : 'close'}`}>
					<div className={`adminCustomArea ${editable ? 'editable' : ''}`}>
						<Fade in={open ? true : false} >
							<div className='adminSectionContainer'>
								{this.renderMenu()}
							</div>
						</Fade>
					</div>
				</div>
				<div className={`stageContainer ${open ? 'open' : 'close'}`}>
					<div className='stageAligner'>
						{createType === 'form' ? this.props.children : <ReceiptEdit />}
					</div>
				</div>
				<div className={`bottomPanel ${open ? 'open' : 'close'}`}>
					<div className='centerAlign adminPanelTabs'>
						<div className='button-group'>
							<GBLink style={{ marginRight: 20 }} className={`ripple link ${createType === 'form' ? 'selected' : ''}`} onClick={() => this.switchCreateType('form')}>Payment Form</GBLink>
							<GBLink style={{ marginLeft: 20 }} className={`ripple link ${createType === 'receipt' ? 'selected' : ''}`} onClick={() => this.switchCreateType('receipt')}>Thank You Receipt</GBLink>
						</div>
					</div>
				</div>
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
	const openAdmin = util.getValue(admin, 'open');
	const access = util.getValue(state.resource, 'access');
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
	const editable = util.getValue(admin, 'editable');

	return {
		breakpoint,
		display,
		articleID,
		openAdmin,
		saveStatus,
		access,
		hasAccessToEdit,
		admin,
		editable
	}
}

export default connect(mapStateToProps, {
	updateAdmin,
	resetGBX3,
	saveGBX3,
	toggleModal
})(Admin);
