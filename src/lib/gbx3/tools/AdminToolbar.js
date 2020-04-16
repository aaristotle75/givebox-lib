import React, { Component } from 'react';
import {
  util,
	GBLink,
	Portal,
	Alert,
	ModalLink,
	ModalRoute,
	TextField,
	ColorPicker,
	Fade,
	Collapse,
	_v
} from '../../';
import Draggable from 'react-draggable';
import AnimateHeight from 'react-animate-height';

export default class AdminToolbar extends Component {

  constructor(props) {
    super(props);
		this.closeGBXOptionsCallback = this.closeGBXOptionsCallback.bind(this);
		this.toggleOpen = this.toggleOpen.bind(this);
		const options = this.props.options;
		this.state = {
			primaryColor: util.getValue(options, 'primaryColor'),
			gbxStyle: util.getValue(options, 'gbxStyle', {}),
			open: this.props.open
    };
  }

	toggleOpen() {
		this.setState({ open: this.state.open ? false : true });
	}

	closeGBXOptionsCallback(type) {
		this.props.toggleModal('paymentForm-options', false);
		if (type !== 'cancel') {
			this.props.updateOptions({
					gbxStyle: this.state.gbxStyle,
					primaryColor: this.state.primaryColor
			});
			this.props.setCustomProp('primaryColor', this.state.primaryColor);
		}
	}

  render() {

		const {
			toggleEditable,
			toggleOutline,
			toggleCollision,
			editable,
			showOutline,
			collision,
			resetLayout,
			saveLayout,
			access
		} = this.props;

		const {
			gbxStyle,
			primaryColor,
			open
		} = this.state;

    const rootEl = document.getElementById('gbx-form-root');

    return (
      <Portal id={'gbx-form-portal'} rootEl={rootEl} className={`gbx3 ${editable ? 'editable' : ''}`}>
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
	            <GBLink className='link show' onClick={toggleEditable}>{editable ? 'Turn Editable Off' : 'Turn Editable On'}</GBLink>
	            <GBLink onClick={toggleOutline}>{showOutline ? 'Hide Outline' : 'Show Outline'}</GBLink>
	            <GBLink onClick={toggleCollision}>{collision ? 'Turn Freeform On' : 'Turn Freeform Off'}</GBLink>
	            <GBLink onClick={resetLayout}>Reset Layout</GBLink>
	            <GBLink onClick={saveLayout}>Save Layout</GBLink>
							<ModalLink id='paymentForm-options'>Options</ModalLink>
				      <ModalRoute
								optsProps={{ closeCallback: this.closeGBXOptionsCallback }}
								id={'paymentForm-options'}
								component={() =>
									<div className='modalWrapper'>
										<Collapse
											label={'Options'}
											id={'editing-paymentForm-options'}
											iconPrimary='layout'
										>
											<div className='formSectionContainer'>
												<div className='formSection'>
													<ColorPicker
														name='primaryColor'
														fixedLabel={true}
														label='Payment Form Theme Color'
														onAccept={(name, value) => {
															this.setState({ primaryColor: value });
														}}
														value={primaryColor || this.props.primaryColor}
														modalID='colorPickerBgColor'
														opts={{
															customOverlay: {
																zIndex: 9999909
															}
														}}
													/>
													<TextField
														name='maxWidth'
														value={util.getValue(gbxStyle, 'maxWidth')}
														onChange={(e) => {
													    e.preventDefault();
													    const value = parseInt(_v.formatNumber(e.target.value));
															const gbxStyle = { ...this.state.gbxStyle, ...{ maxWidth: value } };
															this.setState({ gbxStyle });
														}}
														fixedLabel={true}
														label='Max Width of Payment Form'
														placeholder='Enter the Max Width for Your Payment Form'
														inputMode='numeric'
														maxLength={4}
													/>
												</div>
											</div>
										</Collapse>
										<div style={{ marginBottom: 0 }} className='button-group center'>
											<GBLink className='link' onClick={() => this.closeGBXOptionsCallback('cancel')}>Cancel</GBLink>
											<GBLink className='button' onClick={this.closeGBXOptionsCallback}>Save</GBLink>
										</div>
									</div>
								}
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
