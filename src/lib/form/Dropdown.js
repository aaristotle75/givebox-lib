import React, { Component } from 'react';
import { lookup, isEmpty } from '../common/utility';
import GBLink from '../common/GBLink';
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
      selected: '',
      value: ''
    }
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
    this.setState({open: true});
    if (!this.props.multi) document.addEventListener('click', this.closeMenu);
  }

  closeMenu() {
    this.setState({open: false });
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
    this.setState({selected: selected});
  }

  listOptions() {
    const bindthis = this;
    let selectedValue = this.state.value;
    const items = [];
    this.props.options.forEach(function(value) {
      if (Number.isInteger(value.value)) selectedValue = parseInt(selectedValue);
      let selected = bindthis.props.multi ? bindthis.props.value.includes(value.value) ? true : false : selectedValue === value.value ? true : false;
      if (has(value, 'bottom')) {
        items.push(
          <div key={'bottom'} style={value.style} className={`dropdown-item bottom`}>{value.bottom}</div>
        );
      } else {
        items.push(
          <div data-selected={value.primaryText} data-value={value.value} onClick={(e) => bindthis.onClick(e)} className={`dropdown-item ${selected ? 'selected' : ''}`} key={value.value}>{bindthis.props.multi && selected && bindthis.props.iconMultiChecked} {value.primaryText}{value.secondaryText && <span className='secondaryText'>{value.secondaryText}</span>}</div>
        );
      }
    });

    return items ? items : <option>None</option>;
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
      floatingLabel,
      contentStyle,
      iconMultiClose,
      iconOpened,
      iconClosed
    } = this.props;

    const {
      open,
      selected
    } = this.state;

    const selectedValue = multi ? open ? 'Close Menu' : selectLabel : selected && (value || defaultValue) ? selected : selectLabel;
    const idleLabel = selectedValue === 'Close Menu' || selectedValue === selectLabel;

    return (
      <div style={style} className={`input-group ${className || ''} ${error ? 'error tooltip' : ''}`}>
        <div className={`dropdown ${floatingLabel && 'floating-label'} ${label ? 'fixed' : ''}`} style={dropdownStyle}>
          {label && !floatingLabel && <label><GBLink onClick={open ? this.closeMenu : this.openMenu}>{label}</GBLink></label>}
          <button type='button' onClick={open ? this.closeMenu : this.openMenu}><span className={`label ${idleLabel && 'idle'}`}>{selectedValue}</span>{open ? multi ? iconMultiClose : iconOpened : iconClosed}</button>
          <div style={contentStyle} className={`dropdown-content`}>
            <AnimateHeight
              duration={200}
              height={open ? 'auto' : 0}
            >
                {this.listOptions()}
            </AnimateHeight>
          </div>
          {label && floatingLabel && <label><GBLink className='link label' onClick={open ? this.closeMenu : this.openMenu}>{label}</GBLink></label>}
        </div>
        <div className={`tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`}>
          {this.props.error}
          <i></i>
        </div>
        <div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
      </div>
    );
  }
}

Dropdown.defaultProps = {
  name: 'defaultSelect',
  multi: false,
  selectLabel: 'Please select',
  floatingLabel: true,
  contentStyle: {},
  iconMultiChecked: <span className='icon icon-check'></span>,
  iconMultiClose: <span className='icon icon-x'></span>,
  iconClosed: <span className='icon icon-chevron-right'></span>,
  iconOpened: <span className='icon icon-chevron-down'></span>
}

export default Dropdown;
