import React, { Component } from 'react';
import { util } from '../';
import AnimateHeight from 'react-animate-height';
import Fade from '../common/Fade';

class ActionsMenu extends Component {

  constructor(props) {
    super(props);
    this.closeMenu = this.closeMenu.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {
      open: false,
      display: false
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.closeMenu();
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  openMenu(e) {
    e.stopPropagation();
    this.setState({open: true, display: true});
    document.addEventListener('click', this.closeMenu);
  }

  closeMenu() {
    this.setState({open: false });
    document.removeEventListener('click', this.closeMenu);
    this.timeout = setTimeout(() => {
      this.setState({display: false });
      this.timeout = null;
    }, this.props.overlayDuration);
  }

  onClick(e) {
    e.preventDefault();
    this.setState({
      open: false
    });
  }

  listOptions() {
    const items = [];
    const bindthis = this;
    if (!util.isEmpty(this.props.options)) {
      this.props.options.forEach(function(value, key) {
        items.push(
          <div className={`actionsMenu-item ${bindthis.props.itemClass}`} key={key}>{value}</div>
        );
      });
    }

    return items;
  }

  render() {

    const {
      style,
      label,
      iconOpened,
      iconClosed,
      overlay,
      overlayDuration,
      direction
    } = this.props;

    const {
      open,
      display
    } = this.state;

    return (
      <div className='actionsMenu' style={style}>
        <Fade in={open && overlay} duration={overlayDuration}><div onClick={this.closeMenu} className={`dropdown-cover ${display ? '' : 'displayNone'}`}></div></Fade>
        <button disabled={!!util.isEmpty(this.props.options)} className='menuLabel' type='button' onClick={open ? this.closeMenu : this.openMenu}>{!util.isEmpty(this.props.options) ? label : 'No Actions'}<span className={`${util.isEmpty(this.props.options) && 'displayNone'}`}>{open ? iconOpened : iconClosed}</span></button>
        <div className={`actionsMenu-content ${direction}`}>
          <AnimateHeight
            duration={200}
            height={open ? 'auto' : 0}
          >
            <i></i>
            <div className='actionsMenu-text'>
              {this.listOptions()}
            </div>
          </AnimateHeight>
        </div>
      </div>
    );
  }
}

ActionsMenu.defaultProps = {
  label: 'Actions',
  className: '',
  itemClass: 'button',
  iconOpened: <span className='icon icon-chevron-down'></span>,
  iconClosed: <span className='icon icon-chevron-right'></span>,
  overlayDuration: 200,
  overlay: true,
  direction: ''
}

export default ActionsMenu;
