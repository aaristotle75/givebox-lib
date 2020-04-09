import React, { Component } from 'react';
import {
  util,
  getResource,
  Loader,
  Portal,
  Fade,
  GBLink
} from '../';
import Draggable from 'react-draggable';
import '../styles/popup.scss';

export default class Popup extends Component {

  constructor(props) {
    super(props);
		this.buttonClick = this.buttonClick.bind(this);
    this.state = {
      open: this.props.open
    };
  }

	componentDidUpdate(prev) {
		if (prev.open !== this.props.open) {
			this.setState({ open: this.props.open });
		}
	}

	buttonClick(type) {
		if (this.props.buttonCallback) this.props.buttonCallback(type, false);
	}

  render() {

    const {
      open
    } = this.state;

		const {
			title,
			showButtons,
			style
		} = this.props;

    const rootEl = document.getElementById('modal-root');

    return (
			<>
				{open ?
	      <Portal id={'gbx-popup-portal'} rootEl={rootEl} className='popupWrapper'>
					<div className='popupOverlay'></div>
	        <Draggable
	          allowAnyClick={false}
	          handle={'.handle'}
	        >
	          <div style={style} className={`popup ${open ? 'open' : 'closed'}`}>
	            <div className='handle'><span className='title'>{title}</span></div>
	            <GBLink className='removeBtn' onClick={() => this.buttonClick('ok')}><span className='icon icon-x'></span></GBLink>
	            <Fade in={open}>
	              {this.props.children}
	            </Fade>
							{showButtons ?
							<div className='button-group'>
								{showButtons === 'cancel' || showButtons === 'all' ? <GBLink className='popupBtn cancel' onClick={() => this.buttonClick('cancel')}>Cancel</GBLink> : <></>}
								{showButtons === 'ok' || showButtons === 'all' ? <GBLink className='popupBtn ok' onClick={() => this.buttonClick('ok')}>OK</GBLink> : <></>}
							</div> : <></>}
	          </div>
	        </Draggable>
	      </Portal>
				: <></>}
			</>
    )
  }
}

Popup.defaultProps = {
	showButtons: 'all'
};
