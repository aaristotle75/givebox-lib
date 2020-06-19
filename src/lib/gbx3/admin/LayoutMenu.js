import React from 'react';
import { connect } from 'react-redux';
import {
	GBLink,
	util,
	ModalLink,
	ModalRoute,
	updateAdmin,
	updateGlobals,
	resetGBX3,
	saveGBX3,
	toggleModal
} from '../../';
import GlobalsEdit from '../blocks/GlobalsEdit';
import AnimateHeight from 'react-animate-height';
import blockTemplates from '../blocks/blockTemplates';

class LayoutMenu extends React.Component {

	constructor(props) {
		super(props);
		this.closeGBXOptionsCallback = this.closeGBXOptionsCallback.bind(this);
		this.updatePrimaryColor = this.updatePrimaryColor.bind(this);
		this.renderAvailableBlocks = this.renderAvailableBlocks.bind(this);
		this.reset = this.reset.bind(this);
		const globals = props.globals;
		this.state = {
			globals,
			globalsDefault: util.deepClone(globals)
		};
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
			globals
		} = this.state;

		const {
			editable,
			preventCollision,
			verticalCompact,
			outline
		} = this.props;

		return (
			<div className='layoutMenu'>
				<div className='adminSectionTitle'>Form Designer</div>
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
				<AnimateHeight height={editable ? 'auto' : 0}>
					<div className='adminSectionTitle'>Content</div>
					{this.renderAvailableBlocks()}
				</AnimateHeight>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const admin = util.getValue(gbx3, 'admin', {});
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
		outline
	}
}

export default connect(mapStateToProps, {
	updateAdmin,
	updateGlobals,
	resetGBX3,
	saveGBX3,
	toggleModal
})(LayoutMenu);
