import React, { Component } from 'react';
import { lookup, isEmpty } from '../common/utility';

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

  openMenu(e) {
    e.stopPropagation();
    this.setState({open: true});
    window.addEventListener('click', this.closeMenu);
  }

  closeMenu() {
    this.setState({open: false });
    window.removeEventListener('click', this.closeMenu);
  }

  onClick(e) {
    e.preventDefault();
    let value = e.currentTarget.getAttribute('data-value');
    let selected = e.currentTarget.getAttribute('data-selected');
    this.setState({
      open: false,
      value: value,
      selected: selected
    });
    this.props.onChange(this.props.name, value);
  }

  setSelected(selected) {
    this.setState({selected: selected});
  }

  listOptions() {
    let bindthis = this;
    var selectedValue = this.state.value;
    let items = [];
    this.props.options.forEach(function(value) {
      let selected = selectedValue === value.value ? true : false;
      items.push(
        <div data-selected={value.primaryText} data-value={value.value} onClick={(e) => bindthis.onClick(e)} className={`dropdown-item ${selected ? 'selected' : ''}`} key={value.value}>{value.primaryText}</div>
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
      errorType
    } = this.props;

    const {
      open,
      selected
    } = this.state;

    return (
      <div style={style} className={`input-group dropdown-group ${className || ''} ${error ? 'error tooltip' : ''}`}>
        {label && <label>{label}</label>}
        <div className='dropdown' style={style}>
          <button type='button' onClick={open ? this.closeMenu : this.openMenu}>{!selected ? <span className='label'>{selectLabel}</span> : selected}<span className='icon icon-triangle-down'></span></button>
          <div className={`dropdown-content ${!open ? 'displayNone' : ''}`}>
            {this.listOptions()}
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
  name: 'defaultSelect'
}

export default Dropdown;
