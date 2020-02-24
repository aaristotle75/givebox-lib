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

export default class PropertyBar extends Component {

  constructor(props) {
    super(props);
    this.toggleDisplay = this.toggleDisplay.bind(this);
    this.state = {
      open: true
    };
  }

  componentDidMount() {
  }

  toggleDisplay() {
    const open = this.state.open ? false : true;
    this.setState({ open }, this.props.editPageElement(null));
  }

  render() {

    const {
      open
    } = this.state;

    const rootEl = document.getElementById('gbx-form-root');

    return (
      <Portal id={'gbx-form-portal'} rootEl={rootEl}>
        <Draggable
          allowAnyClick={false}
          handle={'.handle'}
        >
          <div className={`pageElementPropertyBar ${open ? 'open' : 'closed'}`}>
            <div className='handle'><span className='icon icon-move'></span></div>
            <GBLink className='removeBtn' onClick={this.toggleDisplay}><span className='icon icon-x'></span></GBLink>
            <Fade in={open}>
              {this.props.children}
            </Fade>
          </div>
        </Draggable>
      </Portal>
    )
  }
}
