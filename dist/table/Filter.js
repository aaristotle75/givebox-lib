import React, { Component } from 'react';
import { connect } from 'react-redux';
import AnimateHeight from 'react-animate-height';
import FilterForm from './FilterForm';
import Form from '../form/Form';
import { isFilterOpen } from '../api/actions';

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
    this.props.isFilterOpen(true);
    this.setState({
      open: true
    });
  }

  closeMenu() {
    this.props.isFilterOpen(false);
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
      name,
      allowDisabled,
      alwaysFilter,
      callback,
      iconOpened,
      iconClosed
    } = this.props;
    const {
      open
    } = this.state;
    return React.createElement("div", {
      className: "filterWrapper"
    }, React.createElement("button", {
      className: "link",
      type: "button",
      onClick: open ? this.closeMenu : this.openMenu
    }, React.createElement("span", null, label, open ? iconOpened : iconClosed)), React.createElement("div", {
      className: "filter",
      style: style
    }, React.createElement(AnimateHeight, {
      duration: 500,
      height: this.state.open ? 'auto' : 0
    }, React.createElement(Form, {
      name: name
    }, React.createElement(FilterForm, {
      allowDisabled: allowDisabled,
      closeMenu: this.closeMenu,
      name: name,
      options: options,
      alwaysFilter: alwaysFilter,
      callback: callback
    })))));
  }

}

Filter.defaultProps = {
  label: 'Filters',
  iconOpened: React.createElement("span", {
    className: "icon icon-chevron-down"
  }),
  iconClosed: React.createElement("span", {
    className: "icon icon-chevron-right"
  })
};

function mapStateToProps(state, props) {
  return {
    filterOpen: state.app.filterOpen
  };
}

export default connect(mapStateToProps, {
  isFilterOpen
})(Filter);