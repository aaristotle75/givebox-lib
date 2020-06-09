import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	updateAdmin,
	GBLink,
	ModalRoute,
	Portal,
	Fade,
	ModalLink,
	Alert,
	resetGBX3,
	saveGBX3,
	toggleModal,
	updateGlobals
} from '../';
import GlobalsEdit from './blocks/GlobalsEdit';
import blockTemplates from './blocks/blockTemplates';
import AnimateHeight from 'react-animate-height';

class Admin extends React.Component {

	constructor(props) {
		super(props);
		this.toggleOpen = this.toggleOpen.bind(this);
		this.closeGBXOptionsCallback = this.closeGBXOptionsCallback.bind(this);
		this.updatePrimaryColor = this.updatePrimaryColor.bind(this);
		this.reset = this.reset.bind(this);
		const globals = props.globals;
		this.state = {
			globals,
			globalsDefault: util.deepClone(globals)
		};
	}

	toggleOpen() {
		this.props.updateAdmin({ open: this.props.openAdmin ? false : true });
	}

	updatePrimaryColor(value) {
		const globals = {
			...this.state.globals,
			gbxStyle: {
				...this.state.globals.gbxStyle,
				primaryColor: value
			},
			button: {
				...this.state.globals.button,
				style: {
					...this.state.globals.button.style,
					bgColor: value
				}
			}
		};
		this.setState({ globals });
	}

	async closeGBXOptionsCallback(type = 'save') {

		const {
			globals,
			globalsDefault
		} = this.state;
		if (type !== 'cancel') {
			this.setState({
				globalsDefault: util.deepClone(globals)
			});
			const updated = await this.props.updateGlobals(globals);
			if (updated) this.props.saveGBX3(null, false, () => {
				this.props.toggleModal('paymentForm-options', false);
			});
		} else {
			this.setState({
				globals: util.deepClone(globalsDefault)
			}, this.props.toggleModal('paymentForm-options', false));
		}
	}

	renderAvailableBlocks() {
		const {
			availableBlocks
		} = this.props;

		const items = [];

		availableBlocks.forEach((value) => {
			items.push(
				<div
					key={value}
					className='draggableBlock'
					draggable={true}
					onDragStart={(e) => {
						e.dataTransfer.setData('text/plain', value);
						const el = document.getElementById('gbx3DropArea');
						if (el) {
							if (!el.classList.contains('dragOver')) el.classList.add('dragOver');
						}
					}}
					onDragEnd={(e) => {
						const el = document.getElementById('gbx3DropArea');
						if (el) {
							if (el.classList.contains('dragOver')) el.classList.remove('dragOver');
						}
					}}
				>
					Add {blockTemplates[value].title}
				</div>
			);
		});

		return (
			<div className='availableBlocks'>
				{items}
			</div>
		)
	}

	async reset() {
		const GBX3reset = await this.props.resetGBX3();
		if (GBX3reset) window.reload();
	}

	render() {

		const {
			globals
		} = this.state;

		const {
			openAdmin: open,
			saveStatus,
			editable,
			preventCollision,
			verticalCompact,
			outline,
			access,
			hasAccessToEdit
		} = this.props;

		const rootEl = document.getElementById('gbx-form-root');

		if (!hasAccessToEdit) return <></>;

		return (
			<Portal id={'modal-root'} rootEl={rootEl} className={`gbx3 ${editable ? 'editable' : ''}`}>
				<AnimateHeight height={saveStatus === 'saving' ? 'auto' : 0 } duration={500}>
					<div className='autoSaved'>Saving...</div>
				</AnimateHeight>
				<GBLink onClick={this.toggleOpen} className={`link adminCustomAreaOpen ${open ? 'open' : 'close'}`}><span className='icon icon-menu'></span></GBLink>
				<GBLink onClick={this.toggleOpen} className={`link adminCustomAreaClose ${open ? 'open' : 'close'}`}><span className='icon icon-x'></span></GBLink>
				<div className={`adminCustomArea ${editable ? 'editable' : ''} ${open ? 'open' : 'close'}`}>
					<Fade in={open ? true : false} >
						<div className='logo'>
							<img src={util.imageUrlWithStyle('https://givebox.s3-us-west-1.amazonaws.com/public/gb-logo5.png', 'small')} alt='Givebox Logo' onClick={() => window.open('https://admin.givebox.com', '_blank')} />
						</div>
						<div className='adminSectionContainer'>
							<div className='adminSectionTitle'>Actions</div>
							<div className='button-group linkBar'>
								<GBLink className='link show' onClick={() => this.props.updateAdmin({ editable: editable ? false : true }) }>{editable ? 'Turn Editable Off' : 'Turn Editable On'}</GBLink>
								<GBLink onClick={() => this.props.updateAdmin({ outline: outline ? false : true })}>{outline ? 'Hide Outline' : 'Show Outline'}</GBLink>
								<GBLink onClick={() => this.props.updateAdmin({ preventCollision: preventCollision ? false : true })}>Prevent Collision {preventCollision ? 'true' : 'false'}</GBLink>
								<GBLink onClick={() => this.props.updateAdmin({ verticalCompact: verticalCompact ? false : true })}>Vertical Compact {verticalCompact ? 'true' : 'false'}</GBLink>
								<GBLink onClick={this.reset}>Reset</GBLink>
								<GBLink onClick={() => this.props.saveGBX3(null, true)}>Save</GBLink>
								<ModalLink id='paymentForm-options'>Options</ModalLink>
								<ModalRoute
									optsProps={{ closeCallback: this.closeGBXOptionsCallback }}
									id={'paymentForm-options'}
									component={() => (
										<GlobalsEdit
											closeGBXOptionsCallback={this.closeGBXOptionsCallback}
											updatePrimaryColor={this.updatePrimaryColor}
											globals={globals}
										/>
									 )}
									effect='3DFlipVert' style={{ width: '60%' }}
									draggable={true}
									draggableTitle={`Editing Payment Form`}
									closeCallback={this.closeGBXOptionsCallback}
									disallowBgClose={true}
								/>
							</div>
							<div className='adminSectionTitle'>Content</div>
							{this.renderAvailableBlocks()}
						</div>
						<div className='loggedInGroup'>
							<span className='loggedInAs'>Logged in as {util.getValue(access, 'userRole')}</span>
							<GBLink className='link show' onClick={() => window.open('https://admin.givebox.com', '_blank')}>{util.getValue(this.props.access, 'fullName')}</GBLink>
						</div>
						<div className='alertContainer'>
							<Alert alert='error' display={this.state.error} msg={'Error saving, check console'} />
							<Alert alert='success' display={this.state.success} msg={'Custom Template Saved'} />
						</div>
					</Fade>
				</div>
			</Portal>
		)
	}
}

Admin.defaultProps = {
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const saveStatus = util.getValue(gbx3, 'saveStatus');
	const info = util.getValue(gbx3, 'info', {});
	const articleID = util.getValue(info, 'articleID');
	const admin = util.getValue(gbx3, 'admin', {});
	const openAdmin = util.getValue(admin, 'open');
	const availableBlocks = util.getValue(admin, 'availableBlocks', []);
	const globals = util.getValue(gbx3, 'globals', {});
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});
	const access = util.getValue(state.resource, 'access');
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
	const editable = util.getValue(admin, 'editable');
	const preventCollision = util.getValue(admin, 'preventCollision');
	const verticalCompact = util.getValue(admin, 'verticalCompact');
	const outline = util.getValue(admin, 'outline');

	return {
		articleID,
		openAdmin,
		availableBlocks,
		saveStatus,
		access,
		hasAccessToEdit,
		admin,
		globals,
		gbxStyle,
		editable,
		preventCollision,
		verticalCompact,
		outline
	}
}

export default connect(mapStateToProps, {
	updateAdmin,
	resetGBX3,
	saveGBX3,
	toggleModal,
	updateGlobals
})(Admin);
