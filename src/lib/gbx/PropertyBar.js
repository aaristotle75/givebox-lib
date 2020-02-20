import React, { Component } from 'react';
import {
  util,
  getResource,
  Loader,
  Portal,
  Fade
} from '../';
import Draggable from 'react-draggable';

export default class PropertyBar extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
  }

  render() {

    const rootEl = document.getElementById('gbx-form-root');

    return (
      <Portal id={'gbx-form-portal'} rootEl={rootEl}>
        <Draggable
          allowAnyClick={false}
          handle={'.handle'}
        >
          <div className={`pageElementPropertyBar`}>
            <div className='handle'><span className='icon icon-move'></span></div>
            Page Element Property Bar
            {this.props.children}
          </div>
        </Draggable>
      </Portal>
    )
  }
}
