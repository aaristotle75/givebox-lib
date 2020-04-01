import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Sidebar extends Component {

  render() {

    return (
      <nav id='sideBar' className='sideBar'>
        <ul>
          <NavLink to='/dashboard'>Dashboard</NavLink>
          <NavLink to='/charts'>Charts</NavLink>
          <NavLink to='/list'>List Items</NavLink>
          <NavLink to='/transactions'>Transactions</NavLink>
          <NavLink to='/about'>About</NavLink>
          <NavLink to='/contact'>Contact</NavLink>
          <NavLink to='/helpdesk'>Help Desk</NavLink>
          <NavLink to='/gbx'>GBX</NavLink>
          <NavLink to='/gbx3'>GBX3</NavLink>
          <NavLink to='/test'>Test</NavLink>
          <NavLink to='/editor'>Upload Editor Test</NavLink>					
        </ul>
      </nav>
    )
  }
}

const NavLink = props => (
  <li>
    <Link {...props} style={{ color: 'inherit' }} />
  </li>
);
