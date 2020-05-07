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
	Alert
} from '../';
import GlobalsEdit from './blocks/GlobalsEdit';
import AnimateHeight from 'react-animate-height';

class Admin extends React.Component {

	constructor(props) {
		super(props);
		this.toggleOpen = this.toggleOpen.bind(this);
		this.state = {
			open: false
		};
	}

	toggleOpen() {
		this.setState({ open: this.state.open ? false : true });
	}

	render() {

		const {
			open
		} = this.state;

		const {
			editable,
			collision,
			collapse,
			outline,
			access,
			hasAccessToEdit
		} = this.props;

		const rootEl = document.getElementById('gbx-form-root');

		if (!hasAccessToEdit) return <></>;

		return (
			<Portal id={'modal-root'} rootEl={rootEl} className={`gbx3 ${editable ? 'editable' : ''}`}>
				<GBLink onClick={this.toggleOpen} className={`link adminCustomAreaOpen ${open ? 'open' : 'close'}`}><span className='icon icon-menu'></span></GBLink>
				<GBLink onClick={this.toggleOpen} className={`link adminCustomAreaClose ${open ? 'open' : 'close'}`}><span className='icon icon-x'></span></GBLink>
				<div className={`adminCustomArea ${editable ? 'editable' : ''} ${open ? 'open' : 'close'}`}>
					<Fade in={open ? true : false} >
						<div className='logo'>
							<img src={util.imageUrlWithStyle('https://givebox.s3-us-west-1.amazonaws.com/public/gb-logo5.png', 'small')} alt='Givebox Logo' onClick={() => window.open('https://admin.givebox.com', '_blank')} />
						</div>
						<div className='loggedInGroup'>
							<span className='loggedInAs'>Logged in as {util.getValue(access, 'userRole')}</span>
							<GBLink className='link show' onClick={() => window.open('https://admin.givebox.com', '_blank')}>{util.getValue(this.props.access, 'fullName')}</GBLink>
						</div>
						<div className='button-group linkBar'>
							<GBLink className='link show' onClick={() => this.props.updateAdmin({ editable: editable ? false : true }) }>{editable ? 'Turn Editable Off' : 'Turn Editable On'}</GBLink>
							<GBLink onClick={() => this.props.updateAdmin({ outline: outline ? false : true })}>{outline ? 'Hide Outline' : 'Show Outline'}</GBLink>
							<GBLink onClick={() => this.props.updateAdmin({ collision: collision ? false : true })}>{collision ? 'Turn Freeform On' : 'Turn Freeform Off'}</GBLink>
							<GBLink onClick={() => this.props.updateAdmin({ collapse: collapse ? false : true })}>{collapse ? 'Turn Compact On' : 'Turn Compact Off'}</GBLink>
							<GBLink onClick={this.resetGBX}>Reset</GBLink>
							<GBLink onClick={this.saveGBX}>Save</GBLink>
							<ModalLink id='paymentForm-options'>Options</ModalLink>
							<ModalRoute
								optsProps={{ closeCallback: this.closeGBXOptionsCallback }}
								id={'paymentForm-options'}
								component={() => <GlobalsEdit /> }
								effect='3DFlipVert' style={{ width: '60%' }}
								draggable={true}
								draggableTitle={`Editing Payment Form`}
								closeCallback={this.closeGBXOptionsCallback}
								disallowBgClose={true}
							/>
						</div>
						<AnimateHeight
							duration={500}
							height={editable ? 'auto' : 1}
						>
							<div>Blocks available</div>
						</AnimateHeight>
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
	const admin = util.getValue(gbx3, 'admin', {});
	const access = util.getValue(state.resource, 'access');
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
	const editable = util.getValue(admin, 'editable');
	const collision = util.getValue(admin, 'collision');
	const collapse = util.getValue(admin, 'collapse');
	const outline = util.getValue(admin, 'outline');

	return {
		access,
		hasAccessToEdit,
		admin,
		editable,
		collision,
		collapse,
		outline
	}
}

export default connect(mapStateToProps, {
	updateAdmin
})(Admin);
