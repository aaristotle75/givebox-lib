import React, { Component } from 'react';
import { lookup, isEmpty } from '../common/utility';
import GBLink from '../common/GBLink';
import AnimateHeight from 'react-animate-height';

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.listOptions = this.listOptions.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.onClick = this.onClick.bind(this);
    this.setSelected = this.setSelected.bind(this);
    this.state = {
      open: false,
      selected: '',
      value: ''
    };
  }

  componentDidMount() {
    if (this.props.createField) this.props.createField(this.props.name, this.props.params);
    let init = lookup(this.props.options, 'value', this.props.defaultValue);

    if (!isEmpty(init)) {
      this.setState({
        value: init.value,
        selected: init.primaryText
      });
    }
  }

  componentWillUnmount() {
    this.closeMenu();
  }

  openMenu(e) {
    e.stopPropagation();
    this.setState({
      open: true
    });
    if (!this.props.multi) document.addEventListener('click', this.closeMenu);
  }

  closeMenu() {
    this.setState({
      open: false
    });
    document.removeEventListener('click', this.closeMenu);
  }

  onClick(e) {
    e.preventDefault();
    const value = e.currentTarget.getAttribute('data-value');
    const selected = e.currentTarget.getAttribute('data-selected');
    const open = this.props.multi ? true : false;
    this.setState({
      open: open,
      value: value,
      selected: selected
    });
    this.props.onChange(this.props.name, value);
  }

  setSelected(selected) {
    this.setState({
      selected: selected
    });
  }

  listOptions() {
    const bindthis = this;
    let selectedValue = this.state.value;
    const items = [];
    this.props.options.forEach(function (value) {
      if (Number.isInteger(value.value)) selectedValue = parseInt(selectedValue);
      let selected = bindthis.props.multi ? bindthis.props.value.includes(value.value) ? true : false : selectedValue === value.value ? true : false;
      items.push(React.createElement("div", {
        "data-selected": value.primaryText,
        "data-value": value.value,
        onClick: e => bindthis.onClick(e),
        className: `dropdown-item ${selected ? 'selected' : ''}`,
        key: value.value
      }, bindthis.props.multi && selected && React.createElement("span", {
        className: "icon icon-checkmark"
      }), " ", value.primaryText, value.secondaryText && React.createElement("span", {
        className: "secondaryText"
      }, value.secondaryText)));
    });
    return items ? items : React.createElement("option", null, "None");
  }

  render() {
    const {
      label,
      className,
      style,
      dropdownStyle,
      selectLabel,
      error,
      errorType,
      multi,
      value,
      defaultValue,
      floatingLabel
    } = this.props;
    const {
      open,
      selected
    } = this.state;
    const selectedValue = multi ? open ? 'Close Menu' : selectLabel : selected && (value || defaultValue) ? selected : selectLabel;
    const idleLabel = selectedValue === 'Close Menu' || selectedValue === selectLabel;
    console.log(value);
    return React.createElement("div", {
      style: style,
      className: `input-group ${className || ''} ${error ? 'error tooltip' : ''}`
    }, React.createElement("div", {
      className: `dropdown ${floatingLabel && 'floating-label'} ${label ? 'fixed' : ''}`,
      style: dropdownStyle
    }, label && !floatingLabel && React.createElement("label", null, React.createElement(GBLink, {
      onClick: open ? this.closeMenu : this.openMenu
    }, label)), React.createElement("button", {
      type: "button",
      onClick: open ? this.closeMenu : this.openMenu
    }, React.createElement("span", {
      className: `label ${idleLabel && 'idle'}`
    }, selectedValue), React.createElement("span", {
      className: `icon ${open ? multi ? 'icon-close' : 'icon-down-arrow' : 'icon-next'}`
    })), React.createElement("div", {
      className: `dropdown-content`
    }, React.createElement(AnimateHeight, {
      duration: 200,
      height: open ? 'auto' : 0
    }, this.listOptions())), label && floatingLabel && React.createElement("label", null, React.createElement(GBLink, {
      className: "link label",
      onClick: open ? this.closeMenu : this.openMenu
    }, label))), React.createElement("div", {
      className: `tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`
    }, this.props.error, React.createElement("i", null)), React.createElement("div", {
      className: `errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`
    }, error));
  }

}

Dropdown.defaultProps = {
  name: 'defaultSelect',
  multi: false,
  selectLabel: 'Please select',
  floatingLabel: true
};
export default Dropdown;