import React, { Component } from 'react';
import { lookup, isEmpty } from '../common/utility';
import GBLink from '../common/GBLink';
import Fade from '../common/Fade';
import * as util from '../common/utility';
import AnimateHeight from 'react-animate-height';
import has from 'has';

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
      display: false,
      selected: '',
      value: '',
      direction: ''
    };
    this.dropdownRef = React.createRef();
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value) {
      let init = lookup(this.props.options, 'value', this.props.value);

      if (!isEmpty(init)) {
        this.setState({
          value: init.value,
          selected: init.primaryText
        });
      }
    }
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
    const ref = this.dropdownRef.current;
    const height = window.innerHeight;
    const rect = ref.getBoundingClientRect();
    let direction = '';
    if (height - rect.top < 300) direction = 'top';
    this.setState({
      direction,
      open: true,
      display: true
    });
    if (!this.props.multi) document.addEventListener('click', this.closeMenu);
  }

  closeMenu() {
    if (this.props.multiCloseCallback) this.props.multiCloseCallback();
    this.setState({
      open: false
    });
    document.removeEventListener('click', this.closeMenu);
    this.timeout = setTimeout(() => {
      this.setState({
        display: false
      });
      this.timeout = null;
    }, this.props.overlayDuration);
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
      const dataValue = !isNaN(value.value) ? parseInt(value.value) : value.value;
      if (Number.isInteger(dataValue)) selectedValue = parseInt(selectedValue);
      let selected = bindthis.props.multi ? util.getValue(bindthis.props, 'value') ? bindthis.props.value.includes(dataValue) ? true : false : false : selectedValue === dataValue ? true : false;

      if (has(value, 'bottom')) {
        items.push(React.createElement("div", {
          key: 'bottom',
          style: value.style
        }, value.bottom));
      } else {
        items.push(React.createElement("div", {
          "data-selected": value.primaryText,
          "data-value": dataValue,
          onClick: e => bindthis.onClick(e),
          className: `dropdown-item ${selected ? 'selected' : ''}`,
          key: dataValue
        }, bindthis.props.multi && selected && bindthis.props.iconMultiChecked, " ", value.primaryText, value.actions ? React.createElement("span", {
          className: "dropdown-item-actions"
        }, value.actions) : '', value.secondaryText && React.createElement("span", {
          className: "secondaryText"
        }, value.secondaryText)));
      }
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
      multiCloseLabel,
      value,
      defaultValue,
      floatingLabel,
      contentStyle,
      iconMultiClose,
      iconOpened,
      iconClosed,
      overlay,
      overlayDuration
    } = this.props;
    const {
      open,
      selected,
      display,
      direction
    } = this.state;
    const selectedValue = multi ? open ? multiCloseLabel : selectLabel : selected && (value || defaultValue) ? selected : selectLabel;
    const idleLabel = selectedValue === multiCloseLabel || selectedValue === selectLabel;
    return React.createElement("div", {
      style: style,
      className: `input-group ${className || ''} ${error ? 'error tooltip' : ''}`
    }, React.createElement(Fade, {
      in: open && overlay,
      duration: overlayDuration
    }, React.createElement("div", {
      onClick: this.closeMenu,
      className: `dropdown-cover ${display ? '' : 'displayNone'}`
    })), React.createElement("div", {
      className: `dropdown ${floatingLabel && 'floating-label'} ${label ? 'fixed' : ''}`,
      style: dropdownStyle
    }, label && !floatingLabel && React.createElement("label", null, React.createElement(GBLink, {
      onClick: open ? this.closeMenu : this.openMenu
    }, label)), React.createElement("button", {
      type: "button",
      onClick: open ? this.closeMenu : this.openMenu
    }, React.createElement("span", {
      className: `label ${idleLabel && 'idle'}`
    }, selectedValue), open ? multi ? iconMultiClose : iconOpened : iconClosed), React.createElement("div", {
      ref: this.dropdownRef,
      style: contentStyle,
      className: `${open ? 'opened' : ''} dropdown-content ${this.props.direction || direction}`
    }, React.createElement(AnimateHeight, {
      duration: 200,
      height: open ? 'auto' : 0
    }, React.createElement("div", {
      className: "dropdown-content-inner"
    }, this.listOptions()))), label && floatingLabel && React.createElement("label", null, React.createElement(GBLink, {
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
  multiCloseLabel: 'Close Menu',
  selectLabel: 'Please select',
  floatingLabel: true,
  contentStyle: {},
  iconMultiChecked: React.createElement("span", {
    className: "icon icon-check"
  }),
  iconMultiClose: React.createElement("span", {
    className: "icon icon-chevron-down"
  }),
  iconClosed: React.createElement("span", {
    className: "icon icon-chevron-right"
  }),
  iconOpened: React.createElement("span", {
    className: "icon icon-chevron-down"
  }),
  overlayDuration: 200,
  overlay: true,
  direction: ''
};
export default Dropdown;