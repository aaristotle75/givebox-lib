import React, { Component } from 'react';
import { util } from '../';

class ActionsMenu extends Component {

  constructor(props) {
    super(props);
    this.closeMenu = this.closeMenu.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {
      open: false,
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.closeMenu();
  }

  openMenu(e) {
    e.stopPropagation();
    this.setState({open: true});
    document.addEventListener('click', this.closeMenu);
  }

  closeMenu() {
    this.setState({open: false });
    document.removeEventListener('click', this.closeMenu);
  }

  onClick(e) {
    e.preventDefault();
    this.setState({
      open: false
    });
  }

  listOptions() {
    let items = [];
    if (!util.isEmpty(this.props.options)) {
      this.props.options.forEach(function(value, key) {
        items.push(
          <div className={`actionsMenu-item`} key={key}>{value}</div>
        );
      });
    }

    return items;
  }

  render() {

    const {
      style,
      label,
    } = this.props;

    const {
      open
    } = this.state;

    return (
      <div className='actionsMenu' style={style}>
        <button disabled={!!util.isEmpty(this.props.options)} className='menuLabel' type='button' onClick={open ? this.closeMenu : this.openMenu}>{label}<span className='icon icon-triangle-down'></span></button>
        <div className={`actionsMenu-content ${!open ? 'displayNone' : ''}`}>
          {this.listOptions()}
        </div>
      </div>
    );
  }
}

ActionsMenu.defaultProps = {
  label: 'Actions'
}

export default ActionsMenu;
