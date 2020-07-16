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
      customName,
      allowDisabled,
      alwaysFilter,
      callback,
      iconOpened,
      iconClosed
    } = this.props;
    const {
      open
    } = this.state;
    return /*#__PURE__*/React.createElement("div", {
      className: "filterWrapper"
    }, /*#__PURE__*/React.createElement("button", {
      className: "link",
      type: "button",
      onClick: open ? this.closeMenu : this.openMenu
    }, /*#__PURE__*/React.createElement("span", null, label, open ? iconOpened : iconClosed)), /*#__PURE__*/React.createElement("div", {
      className: "filter",
      style: style
    }, /*#__PURE__*/React.createElement(AnimateHeight, {
      duration: 500,
      height: this.state.open ? 'auto' : 0
    }, /*#__PURE__*/React.createElement(Form, {
      name: name
    }, /*#__PURE__*/React.createElement(FilterForm, {
      allowDisabled: allowDisabled,
      closeMenu: this.closeMenu,
      name: name,
      customName: customName,
      options: options,
      alwaysFilter: alwaysFilter,
      callback: callback
    })))));
  }

}

Filter.defaultProps = {
  label: 'Filters',
  iconOpened: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-minus"
  }),
  iconClosed: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-plus"
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