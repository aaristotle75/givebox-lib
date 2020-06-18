import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	updateAdmin,
	GBLink,
	Portal,
	Fade,
	resetGBX3,
	saveGBX3,
	toggleModal
} from '../../';
import CreateNewMenu from './CreateNewMenu';
import LayoutMenu from './LayoutMenu';
import AnimateHeight from 'react-animate-height';

class Admin extends React.Component {

	constructor(props) {
		super(props);
		this.toggleOpen = this.toggleOpen.bind(this);
		this.renderMenu = this.renderMenu.bind(this);
	}

	toggleOpen() {
		this.props.updateAdmin({ open: this.props.openAdmin ? false : true });
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
			openAdmin: open,
			saveStatus,
			editable,
			access,
			hasAccessToEdit
		} = this.props;

		if (!hasAccessToEdit) return <></>;

		return (
			<div className={`gbx3AdminLayout ${editable ? 'editable' : ''}`}>
				<AnimateHeight height={saveStatus === 'saving' ? 'auto' : 0 } duration={500}>
					<div className='autoSaved'>Saving...</div>
				</AnimateHeight>
				<GBLink onClick={this.toggleOpen} className={`link leftPanelOpen ${open ? 'open' : 'close'}`}><span className='icon icon-menu'></span></GBLink>
				<GBLink onClick={this.toggleOpen} className={`link leftPanelClose ${open ? 'open' : 'close'}`}><span className='icon icon-x'></span></GBLink>
				<div className={`gbx3TopHeader`}>

				</div>
				<div className={`topPanel`}>

				</div>
				<div className={`leftPanel ${open ? 'open' : 'close'}`}>
					<div className={`adminCustomArea ${editable ? 'editable' : ''}`}>
						<div className='logo'>
							<img src={util.imageUrlWithStyle('https://givebox.s3-us-west-1.amazonaws.com/public/gb-logo5.png', 'small')} alt='Givebox Logo' onClick={() => window.open('https://admin.givebox.com', '_blank')} />
						</div>
						<Fade in={open ? true : false} >
							<div className='adminSectionContainer'>
								{this.renderMenu()}
							</div>
						</Fade>
						<div className='loggedInGroup'>
							<span className='loggedInAs'>Logged in as {util.getValue(access, 'userRole')}</span>
							<GBLink className='link show' onClick={() => window.open('https://admin.givebox.com', '_blank')}>{util.getValue(this.props.access, 'fullName')}</GBLink>
						</div>
					</div>
				</div>
				<div className={`stageContainer ${open ? 'open' : 'close'}`}>
					<div className='stageScroller'>
						{this.props.children}
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
	const display = util.getValue(info, 'display');
	const articleID = util.getValue(info, 'articleID');
	const admin = util.getValue(gbx3, 'admin', {});
	const openAdmin = util.getValue(admin, 'open');
	const access = util.getValue(state.resource, 'access');
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
	const editable = util.getValue(admin, 'editable');

	return {
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
