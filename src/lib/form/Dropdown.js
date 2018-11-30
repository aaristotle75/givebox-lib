import React, { Component } from 'react';
import { lookup, isEmpty } from '../common/utility';
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
    const selectedValue = this.state.value;
    const items = [];
    this.props.options.forEach(function(value) {
      let selected = bindthis.props.multi ? bindthis.props.value.includes(value.value) ? true : false : selectedValue === value.value ? true : false;
      items.push(
        <div data-selected={value.primaryText} data-value={value.value} onClick={(e) => bindthis.onClick(e)} className={`dropdown-item ${selected ? 'selected' : ''}`} key={value.value}>{bindthis.props.multi && selected && <span className='icon icon-checkmark'></span>} {value.primaryText}</div>
      );
    });

    return items ? items : <option>None</option>;
  }

  render() {

    const {
      label,
      className,
      style,
      selectLabel,
      error,
      errorType,
      multi
    } = this.props;

    const {
      open,
      selected
    } = this.state;

    const selectedValue = multi ? open ? 'Close Menu' : selectLabel : selected || selectLabel;
    const idleLabel = selectedValue === 'Close Menu' || selectedValue === selectLabel;

    return (
      <div style={style} className={`input-group dropdown-group ${className || ''} ${error ? 'error tooltip' : ''}`}>
        {label && <label>{label}</label>}
        <div className='dropdown' style={style}>
          <button type='button' onClick={open ? this.closeMenu : this.openMenu}><span className={`label ${idleLabel && 'idle'}`}>{selectedValue}</span><span className={`icon ${open ? multi ? 'icon-close' : 'icon-triangle-down' : 'icon-triangle-right'}`}></span></button>
          <div className={`dropdown-content`}>
            <AnimateHeight
              duration={200}
              height={open ? 'auto' : 0}
            >
                {this.listOptions()}
            </AnimateHeight>
          </div>
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
  selectLabel: 'Please select'
}

export default Dropdown;
