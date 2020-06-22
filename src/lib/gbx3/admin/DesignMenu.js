import React from 'react';
import { connect } from 'react-redux';
import {
	GBLink,
	util,
	ModalLink,
	ModalRoute,
	updateAdmin,
	toggleAdminLeftPanel,
	updateGlobals,
	resetGBX3,
	saveGBX3,
	toggleModal
} from '../../';
import GlobalsEdit from '../blocks/GlobalsEdit';
import blockTemplates from '../blocks/blockTemplates';

class DesignMenu extends React.Component {

	constructor(props) {
		super(props);
		this.switchPanelType = this.switchPanelType.bind(this);
		this.closeGBXOptionsCallback = this.closeGBXOptionsCallback.bind(this);
		this.updatePrimaryColor = this.updatePrimaryColor.bind(this);
		this.renderAvailableBlocks = this.renderAvailableBlocks.bind(this);
		this.reset = this.reset.bind(this);
		const globals = props.globals;
		this.state = {
			globals,
			globalsDefault: util.deepClone(globals),
			panelType: 'layout'
		};
	}

	switchPanelType(panelType) {
		this.setState({ panelType });
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

	reset() {
		this.props.resetGBX3();
	}

	render() {

		const {
			globals,
			panelType
		} = this.state;

		const {
			editable,
			preventCollision,
			verticalCompact,
			outline,
			openAdmin: open
		} = this.props;

		return (
			<div className='leftPanelContainer'>
				<div className='leftPanelTop'>
					<div className='leftPanelHeader'>
						Design Menu
						<GBLink onClick={this.props.toggleAdminLeftPanel} className={`link leftPanelClose ${open ? 'open' : 'close'}`}><span className='icon icon-x'></span></GBLink>
					</div>
					<div className='middle centerAlign adminPanelTabs'>
						<GBLink className={`ripple link ${panelType === 'layout' ? 'selected' : ''}`} onClick={() => this.switchPanelType('layout')}>Layout</GBLink>
						<GBLink className={`ripple link ${panelType === 'style' ? 'selected' : ''}`} onClick={() => this.switchPanelType('style')}>Style</GBLink>
						<GBLink className={`ripple link ${panelType === 'tools' ? 'selected' : ''}`} onClick={() => this.switchPanelType('tools')}>Tools</GBLink>
					</div>
				</div>
				<div className={`leftPanelScroller`}>
					<ul>
						<li className='link show' onClick={() => this.props.updateAdmin({ editable: editable ? false : true }) }>{editable ? 'Turn Editable Off' : 'Turn Editable On'}</li>
						<li onClick={() => this.props.updateAdmin({ outline: outline ? false : true })}>{outline ? 'Hide Outline' : 'Show Outline'}</li>
						<li onClick={() => this.props.updateAdmin({ preventCollision: preventCollision ? false : true })}>Prevent Collision {preventCollision ? 'true' : 'false'}</li>
						<li onClick={() => this.props.updateAdmin({ verticalCompact: verticalCompact ? false : true })}>Vertical Compact {verticalCompact ? 'true' : 'false'}</li>
						<li onClick={this.reset}>Reset</li>
						<li onClick={() => this.props.saveGBX3(null, true)}>Save</li>
						<ModalLink type='li' id='paymentForm-options'>Options</ModalLink>
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
					</ul>
					{/*
					<AnimateHeight height={editable ? 'auto' : 0}>
						<div className='adminSectionTitle'>Content</div>
						{this.renderAvailableBlocks()}
					</AnimateHeight>
					*/}
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const openAdmin = util.getValue(admin, 'open');
	const availableBlocks = util.getValue(admin, 'availableBlocks', []);
	const globals = util.getValue(gbx3, 'globals', {});
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});
	const editable = util.getValue(admin, 'editable');
	const preventCollision = util.getValue(admin, 'preventCollision');
	const verticalCompact = util.getValue(admin, 'verticalCompact');
	const outline = util.getValue(admin, 'outline');

	return {
		availableBlocks,
		globals,
		gbxStyle,
		editable,
		preventCollision,
		verticalCompact,
		outline,
		openAdmin
	}
}

export default connect(mapStateToProps, {
	updateAdmin,
	toggleAdminLeftPanel,
	updateGlobals,
	resetGBX3,
	saveGBX3,
	toggleModal
})(DesignMenu);
