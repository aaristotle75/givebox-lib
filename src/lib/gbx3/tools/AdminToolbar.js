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
	Dropdown,
	Fade,
	Collapse,
	_v,
	types
} from '../../';
import AnimateHeight from 'react-animate-height';

export default class AdminToolbar extends Component {

  constructor(props) {
    super(props);
		this.closeGBXOptionsCallback = this.closeGBXOptionsCallback.bind(this);
		this.toggleOpen = this.toggleOpen.bind(this);
		this.setRadius = this.setRadius.bind(this);
		const options = this.props.options;
		this.state = {
			primaryColor: util.getValue(options, 'primaryColor'),
			gbxStyle: util.getValue(options, 'gbxStyle', {}),
			button: util.getValue(options, 'button', {}),
			open: this.props.open
    };
  }

	setRadius(borderRadius) {
		const button = this.state.button;
		button.borderRadius = borderRadius;
    this.setState({ button, borderRadius })
	}

	toggleOpen() {
		this.setState({ open: this.state.open ? false : true });
	}

	closeGBXOptionsCallback(type) {
		this.props.toggleModal('paymentForm-options', false);
		if (type !== 'cancel') {
			this.props.updateOptions({
					gbxStyle: this.state.gbxStyle,
					button: this.state.button,
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
			toggleCollapse,
			editable,
			showOutline,
			collision,
			collapse,
			resetLayout,
			saveLayout,
			access,
			minRadius,
			maxRadius
		} = this.props;

		const {
			button,
			gbxStyle,
			primaryColor,
			open,
			borderRadius
		} = this.state;

    const rootEl = document.getElementById('gbx-form-root');

		const fontSize = util.getValue(button, 'fontSize');
		const type = util.getValue(button, 'type', 'button');
		const paddingTopBottom = fontSize >= 20 ? 15 : 10;
		const style = {}
		style.borderRadius = `${util.getValue(button, 'borderRadius', 0)}px`;
		style.fontSize = `${fontSize}px`;
		style.width = util.getValue(button, 'width');
		style.padding = `${paddingTopBottom}px 25px`;

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
	            <GBLink onClick={toggleCollapse}>{collapse ? 'Turn Compact On' : 'Turn Compact Off'}</GBLink>
	            <GBLink onClick={resetLayout}>Reset Layout</GBLink>
	            <GBLink onClick={saveLayout}>Save Layout</GBLink>
							<ModalLink id='paymentForm-options'>Options</ModalLink>
				      <ModalRoute
								optsProps={{ closeCallback: this.closeGBXOptionsCallback }}
								id={'paymentForm-options'}
								component={() =>
									<div className='modalWrapper'>
										<Collapse
											label={'Payment Form Options'}
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
										<Collapse
											label={'Button Default Options'}
											id={'editing-button-options'}
											iconPrimary='layout'
										>
											<div className='formSectionContainer'>
												<div className='formSection'>
													<ColorPicker
														name='bgColor'
														fixedLabel={true}
														label='Button Background Color'
														onAccept={(name, value) => {
															const button = this.state.button;
															button.bgColor = value;
															this.setState({ button });
														}}
														value={util.getValue(button, 'bgColor', primaryColor)}
														modalID='colorPickerButtonBgColor'
														opts={{
															customOverlay: {
																zIndex: 9999909
															}
														}}
													/>
													<TextField
														name='width'
														value={util.getValue(button, 'width')}
														onChange={(e) => {
													    e.preventDefault();
													    const value = parseInt(_v.formatNumber(e.target.value));
															const button = this.state.button;
															button.width = value;
															this.setState({ button });
														}}
														fixedLabel={true}
														label='Button Width'
														placeholder='Enter Button Width (Optional)'
														inputMode='numeric'
														maxLength={3}
													/>
								          <Dropdown
														label='Button Font Size'
														fixedLabel={true}
								            name='fontSize'
								            defaultValue={parseInt(util.getValue(button, 'fontSize', 16))}
								            onChange={(name, value) => {
															const button = this.state.button;
															button.fontSize = value;
															this.setState({ button });
														}}
								            options={types.fontSizeOptions(10, 28)}
								          />
													<div className='input-group'>
														<label className='label'>Button Roundness</label>
													  <div className='scale'>
													    <GBLink onClick={() => this.setRadius(minRadius)}><span className='icon icon-square'></span></GBLink>
													    <input
													      name="borderRadius"
													      type="range"
													      onChange={(e) => {
															    const borderRadius = parseInt(e.target.value)
																	const button = this.state.button;
																	button.borderRadius = borderRadius;
																	this.setState({ button, borderRadius });
																}}
													      min={minRadius}
													      max={maxRadius}
													      step="0"
													      value={borderRadius}
													    />
													    <GBLink onClick={() => this.setRadius(maxRadius)}><span className='icon icon-circle'></span></GBLink>
													  </div>
													</div>
													<div className='input-group'>
														<label className='label'>Button Preview</label>
														<div style={{ marginTop: 10 }} className='flexCenter'>
															<GBLink style={style} customColor={util.getValue(button, 'bgColor', null)} solidColor={type === 'button' ? true : false} allowCustom={true} className={`${type}`}>
																{this.props.buttonLabel}
															</GBLink>
														</div>
													</div>
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

AdminToolbar.defaultProps = {
	minRadius: 0,
	maxRadius: 50,
	buttonLabel: 'Button Example'
}
