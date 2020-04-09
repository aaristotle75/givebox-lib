import React, { Component } from 'react';
import {
  util,
	GBLink,
	Portal,
	Alert
} from '../../';
import Draggable from 'react-draggable';
import AnimateHeight from 'react-animate-height';

export default class AdminToolbar extends Component {

  constructor(props) {
    super(props);
		this.state = {
    };
  }

  render() {

		const {
			toggleEditable,
			toggleOutline,
			editable,
			showOutline,
			resetLayout,
			saveLayout,
			access
		} = this.props;

    const rootEl = document.getElementById('gbx-form-root');

    return (
      <Portal id={'gbx-form-portal'} rootEl={rootEl} className={`gbx3 ${editable ? 'editable' : ''}`}>
        <Draggable
          allowAnyClick={false}
          handle={'.handle'}
          axis='y'
        >
          <div className={`adminCustomArea ${editable ? 'editable' : ''}`}>
            <div className='handle'><span className='icon icon-move'></span></div>
            <div className='logo'>
              <div className='loggedInGroup'>
                <span className='loggedInAs'>Logged in as {util.getValue(access, 'userRole')}</span>
                <GBLink className='link show' onClick={() => window.open('https://admin.givebox.com', '_blank')}>{util.getValue(this.props.access, 'fullName')}</GBLink>
              </div>
              <img src={util.imageUrlWithStyle('https://givebox.s3-us-west-1.amazonaws.com/public/gb-logo5.png', 'small')} alt='Givebox Logo' onClick={() => window.open('https://admin.givebox.com', '_blank')} />
            </div>
            <div className='button-group linkBar'>
              <GBLink className='link show' onClick={toggleEditable}>{editable ? 'Turn Editable Off' : 'Turn Editable On'}</GBLink>
              <GBLink onClick={toggleOutline}>{showOutline ? 'Hide Outline' : 'Show Outline'}</GBLink>
              <GBLink onClick={resetLayout}>Reset Layout</GBLink>
              <GBLink onClick={saveLayout}>Save Layout</GBLink>
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
          </div>
        </Draggable>
      </Portal>
    )
  }
}
