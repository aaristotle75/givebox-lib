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
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.state = {
      open: false,
      display: false,
      selected: '',
      value: '',
      direction: '',
      status: 'idle'
    }
    this.dropdownRef = React.createRef();
  }

  componentDidMount() {
    const params = Object.assign({}, this.props.params, { ref: this.dropdownRef, openMenu: this.openMenu, closeMenu: this.closeMenu });
    if (this.props.createField) this.props.createField(this.props.name, params);
    let init = lookup(this.props.options, 'value', this.props.value || this.props.defaultValue);
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
      } else {
        this.setState({
          value: this.props.options[0].value,
          selected: this.props.options[0].primaryText
        });
      }
    }

    if (util.getValue(prevProps.params, 'value') !== util.getValue(this.props.params, 'value')) {
      let init = lookup(this.props.options, 'value', this.props.params.value);
      if (!isEmpty(init)) {
        this.setState({
          value: init.value,
          selected: init.primaryText
        });
        if (this.props.fieldProp) this.props.fieldProp(this.props.name, { value: init.value });
      }
    }

    if (Array.isArray(this.props.value)) {
      if (!util.equals(prevProps.value, this.props.value)) {
        this.setState({
          value: this.props.value
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
    if (this.props.fieldProp) this.props.fieldProp(this.props.name, { error: false });
    if (this.props.formProp) this.props.formProp({ error: false, errorMsg: '' });
    const ref = this.dropdownRef.current;
    const height = window.innerHeight;
    const rect = ref.getBoundingClientRect();
    let direction = '';
    if ((height - rect.top) < 300) direction = 'top';
    this.setState({direction, open: true, display: true});
    if (!this.props.multi) document.addEventListener('click', this.closeMenu);
  }

  closeMenu() {
    if (this.props.multiCloseCallback) this.props.multiCloseCallback();
    this.setState({open: false });
    document.removeEventListener('click', this.closeMenu);
    this.timeout = setTimeout(() => {
      this.setState({display: false });
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
    this.setState({selected: selected});
  }

  listOptions() {
    const bindthis = this;
    let selectedValue = this.state.value;
    const items = [];
    this.props.options.forEach(function(value) {
      const dataValue = !isNaN(value.value) ? parseInt(value.value) : value.value;
      if (Number.isInteger(dataValue)) selectedValue = parseInt(selectedValue);
      let selected = bindthis.props.multi ? util.getValue(bindthis.props, 'value') ? bindthis.props.value.includes(dataValue) ? true : false : false : selectedValue === dataValue ? true : false;
      if (has(value, 'bottom')) {
        items.push(
          <div key={'bottom'} style={value.style}>{value.bottom}</div>
        );
      } else {
        items.push(
          <div data-selected={value.primaryText} data-value={dataValue} onClick={(e) => bindthis.onClick(e)} className={`dropdown-item ${selected ? 'selected' : ''}`} key={dataValue}>{bindthis.props.multi && selected && bindthis.props.iconMultiChecked} {value.primaryText}{value.actions ? <span className='dropdown-item-actions'>{value.actions}</span> : ''}{value.secondaryText && <span className='secondaryText'>{value.secondaryText}</span>}</div>
        );
      }
    });

    return items ? items : <option>None</option>;
  }

  onMouseEnter(e) {
    e.preventDefault();
    if (!this.props.error) this.setState({status: 'active'});
  }

  onMouseLeave(e) {
    e.preventDefault();
    this.setState({status: 'idle'});
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
      overlayDuration,
      fixedLabel
    } = this.props;

    const {
      open,
      selected,
      display,
      direction
    } = this.state;

    const selectedValue = multi ? open ? multiCloseLabel : selectLabel : selected && (value || defaultValue) ? selected : selectLabel;
    const idleLabel = selectedValue === multiCloseLabel || selectedValue === selectLabel;

    return (
      <div style={style} className={`input-group ${className || ''} ${error ? 'error tooltip' : ''}`}>
        <Fade in={open && overlay} duration={overlayDuration}>
          <div onClick={this.closeMenu} className={`dropdown-cover ${display ? '' : 'displayNone'}`}></div>
        </Fade>
        <div className={`dropdown ${floatingLabel && 'floating-label'} ${this.state.status} ${fixedLabel ? 'fixed' : ''}`} style={dropdownStyle}>
          {label && !floatingLabel && <label><GBLink onClick={open ? this.closeMenu : this.openMenu}>{label}</GBLink></label>}
          <button onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} type='button' onClick={open ? this.closeMenu : this.openMenu}><span className={`label ${idleLabel && 'idle'}`}>{selectedValue}</span>{open ? multi ? iconMultiClose : iconOpened : iconClosed}</button>
          <div ref={this.dropdownRef} style={contentStyle} className={`${open ? 'opened' : ''} dropdown-content ${this.props.direction || direction}`}>
            <AnimateHeight
              duration={200}
              height={open ? 'auto' : 0}
            >
              <div className='dropdown-content-inner'>
                {this.listOptions()}
              </div>
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
  multiCloseLabel: 'Close Menu',
  selectLabel: 'Please select',
  floatingLabel: true,
  contentStyle: {},
  iconMultiChecked: <span className='icon icon-check'></span>,
  iconMultiClose: <span className='icon icon-chevron-down'></span>,
  iconClosed: <span className='icon icon-chevron-right'></span>,
  iconOpened: <span className='icon icon-chevron-down'></span>,
  overlayDuration: 200,
  overlay: true,
  direction: ''
}

export default Dropdown;
