import React, { Component } from 'react';
import { AppContext } from '../App';

export default class Header extends Component {

  componentWillUnmount() {
  }

  render() {

    return (
      <AppContext.Consumer>
      {(context) => (
        <header className='top'>
          <div className='leftSide'>
            {context.title}
          </div>
          <div className='rightSide'>
            <ul>
              <li>Right side</li>
            </ul>
          </div>
        </header>
      )}
      </AppContext.Consumer>
    )
  }
}
