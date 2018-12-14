import React, { Component } from 'react';
import AnimateHeight from 'react-animate-height';
import FilterForm from './FilterForm';
import Form from '../form/Form';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.closeMenu = this.closeMenu.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {
      open: false
    };
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.closeMenu();
  }

  openMenu(e) {
    this.setState({
      open: true
    });
  }

  closeMenu() {
    this.setState({
      open: false
    });
  }

  onClick(e) {
    e.preventDefault();
    this.setState({
      open: false
    });
  }

  render() {
    const {
      style,
      label,
      options,
      name
    } = this.props;
    const {
      open
    } = this.state;
    return React.createElement("div", {
      className: "filter",
      style: style
    }, React.createElement("button", {
      className: "link",
      type: "button",
      onClick: open ? this.closeMenu : this.openMenu
    }, label, React.createElement("span", {
      className: `icon-normal ${open ? 'icon-triangle-down' : 'icon-triangle-right'}`
    })), React.createElement(AnimateHeight, {
      duration: 500,
      height: this.state.open ? 'auto' : 0
    }, React.createElement(Form, {
      name: name
    }, React.createElement(FilterForm, {
      closeMenu: this.closeMenu,
      name: name,
      options: options
    }))));
  }

}

Filter.defaultProps = {
  label: 'Filters'
};
export default Filter;