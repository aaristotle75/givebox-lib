import React, { Component } from 'react';
import { lookup, isEmpty } from '../common/utility';
import GBLink from '../common/GBLink';
import Fade from '../common/Fade';
import * as util from '../common/utility';
import AnimateHeight from 'react-animate-height';
import Portal from '../common/Portal';
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
      status: 'idle',
      buttonStyle: {
        color: props.color || ''
      },
      contentStyle: {},
      mounted: false
    }
    this.dropdownRef = React.createRef();
    this.inputRef = React.createRef();
    this.buttonRef = React.createRef();
    this.labelRef = React.createRef();
    this.selectedRef = React.createRef();
    this.iconRef = React.createRef();
    this.itemRefs = {};
  }

  componentDidMount() {
    const params = Object.assign({}, this.props.params, { ref: this.dropdownRef, openMenu: this.openMenu, closeMenu: this.closeMenu });
    if (this.props.createField) this.props.createField(this.props.name, params);
    let init = lookup(this.props.options, 'value', this.props.value || this.props.defaultValue);
    if (!isEmpty(init)) {
      this.setState({
        value: init.value,
        selected: util.getValue(init, 'selectedText', init.primaryText)
      });
    }
    this.setState({ mounted: true });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.open !== this.props.open) {
      if (this.props.open && !this.state.open && !this.state.display) {
        this.openMenu();
      } else if (this.state.open && this.state.display) {
        this.closeMenu();
      }
    }

    if (prevProps.value !== this.props.value) {
      let init = lookup(this.props.options, 'value', this.props.value);
      if (!isEmpty(init)) {
        this.setState({
          value: init.value,
          selected: util.getValue(init, 'selectedText', init.primaryText)
        });
      } else {
        this.setState({
          value: this.props.options[0].value,
          selected: util.getValue(this.props.options[0], 'selectedText', this.props.options[0].primaryText)
        });
      }
    }

    if (util.getValue(prevProps.params, 'value') !== util.getValue(this.props.params, 'value')) {
      let init = lookup(this.props.options, 'value', this.props.params.value);
      if (!isEmpty(init)) {
        this.setState({
          value: init.value,
          selected: util.getValue(init, 'selectedText', init.primaryText)
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
    const buttonRef = this.buttonRef.current;
    const height = window.innerHeight;
    const rect = ref.getBoundingClientRect();
    const rectXY = this.props.rectXY;

    let direction = '';
    if (this.props.portalID) {
      const buttonRect = buttonRef.getBoundingClientRect();
      const contentWidth = this.props.contentWidth || 200;
      const contentWidthStr = `${contentWidth}px`;
      ref.style.position = 'fixed';
      ref.style.width = contentWidthStr;
      ref.style.minWidth = contentWidthStr;
      const offsetBottom = height - buttonRect.bottom;
      if (offsetBottom < 300) {
        ref.style.bottom = `${offsetBottom}px`;
      } else {
        ref.style.top = `${rectXY ? buttonRect.y : buttonRect.top}px`;
      }
      const leftOffset = `${(rectXY ? buttonRect.x : buttonRect.width) - (contentWidth / this.props.portalLeftOffset) }px`;
      ref.style.left = leftOffset;
    } else {
      if ((height - rect.top) < 300) direction = 'top';
    }

    this.setState({direction, open: true, display: true});
    if (!this.props.multi) document.addEventListener('click', this.closeMenu);
  }

  closeMenu() {
    if (this.props.multiCloseCallback) this.props.multiCloseCallback();
    if (this.props.closeCallback) this.props.closeCallback();
    this.setState({open: false });
    document.removeEventListener('click', this.closeMenu);
    this.timeout = setTimeout(() => {
      this.setState({display: false });
      this.timeout = null;
    }, this.props.overlayDuration);
  }

  onClick(e, disabled = false) {
    e.preventDefault();
    if (!disabled) {
      const value = e.currentTarget.getAttribute('data-value');
      const selected = e.currentTarget.getAttribute('data-selected');
      const open = this.props.multi ? true : false;
      this.setState({
        open,
        value,
        selected
      });
      this.props.onChange(this.props.name, value, selected);
    }
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
        bindthis.itemRefs[dataValue] = React.createRef();
        items.push(
          <div style={{ color: selected ? bindthis.props.color || '' : ''}} ref={bindthis.itemRefs[dataValue]} onMouseEnter={() => { const ref = bindthis.itemRefs[dataValue].current; ref.style.setProperty('background', value.disabled ? '' : bindthis.props.color); ref.style.setProperty('color', selected && bindthis.props.color ? '#ffffff' : ''); } } onMouseLeave={() => { const ref = bindthis.itemRefs[dataValue].current; ref.style.setProperty('background', ''); ref.style.setProperty('color', selected ? bindthis.props.color : ''); } } data-selected={util.getValue(value, 'selectedText', value.primaryText)} data-value={dataValue} onClick={(e) => bindthis.onClick(e, value.disabled)} className={`dropdown-item ${selected ? 'selected' : ''} ${value.disabled ? 'disabled' : ''}`} key={dataValue}>
            <div className='dropdown-container'>
              <div className='leftSide'>
                {bindthis.props.multi && selected ? <span className={`icon icon-${bindthis.props.iconMultiChecked}`}></span> : ''} {value.primaryText}
                {value.secondaryText && <span className='secondaryText'>{value.secondaryText}</span>}
              </div>
              <div className='rightSide'>
                {value.rightText && <span className='rightText'>{value.rightText}</span>}
                {value.actions ? <span className='dropdown-item-actions'>{value.actions}</span> : ''}
              </div>
            </div>
          </div>
        );
      }
    });

    return items ? items : <option>None</option>;
  }

  onMouseEnter(e) {
    e.preventDefault();
    if (!this.props.error) {
      const buttonStyle = {
        borderBottom: this.props.color ? `1px solid ${this.props.color}` : ''
      };
      if (util.getValue(this.labelRef, 'current')) this.labelRef.current.style.setProperty('color', this.props.color, 'important');
      if (util.getValue(this.selectedRef, 'current')) this.selectedRef.current.style.setProperty('color', this.props.color, 'important');
      if (util.getValue(this.iconRef, 'current')) this.iconRef.current.style.setProperty('color', this.props.color, 'important');
      this.setState({buttonStyle, status: 'active'});
    }
  }

  onMouseLeave(e) {
    e.preventDefault();
    if (util.getValue(this.labelRef, 'current')) this.labelRef.current.style.setProperty('color', '');
    if (util.getValue(this.selectedRef, 'current')) this.selectedRef.current.style.setProperty('color', '');
    if (util.getValue(this.iconRef, 'current')) this.iconRef.current.style.setProperty('color', '');
    this.setState({status: 'idle', buttonStyle: {} });
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
      hideIcons,
      hideButton,
      overlay,
      overlayDuration,
      fixedLabel,
      readOnly,
      portalID,
      portalRootEl,
      portalClass,
      showCloseBtn
    } = this.props;

    const {
      open,
      selected,
      display,
      direction,
      status,
      buttonStyle
    } = this.state;

    const selectedValue = multi ? open ? multiCloseLabel : selectLabel : selected && ( (value || value === 0) || (defaultValue || defaultValue === 0) ) ? selected : selectLabel;
    const idleLabel = selectedValue === multiCloseLabel || selectedValue === selectLabel;
    const readOnlyText = this.props.readOnlyText || `${label} is not editable`;
    const portalRoot = document.getElementById(portalRootEl);

    const dropdownContent =
      <div ref={this.dropdownRef} style={{ ...contentStyle, boxShadow: this.props.color ? `none`: '', border: this.props.color && open ? `1px solid ${this.props.color}` : ''}} className={`${open ? 'opened' : ''} dropdown-content ${this.props.direction || direction} ${this.props.color ? 'customColor' : ''}`}>
        {showCloseBtn ?
          <div className='dropdownCloseBtn'><span className='icon icon-x'></span></div>
        : null}
        <AnimateHeight
          duration={200}
          height={open ? 'auto' : 0}
        >
          <div className='dropdown-content-inner'>
            {this.listOptions()}
          </div>
        </AnimateHeight>
      </div>
    ;

    const dropdownPortal =
      <Portal id={portalID} rootEl={portalRoot} className={`dropdown ${portalClass}`}>
        {dropdownContent}
      </Portal>
    ;

    return (
      <div ref={this.inputRef} style={style} className={`input-group ${className || ''} ${readOnly ? 'readOnly tooltip' : ''} ${error ? 'error tooltip' : ''}`}>
        <Fade in={open && overlay} duration={overlayDuration}>
          <div onClick={this.closeMenu} className={`dropdown-cover ${display ? '' : 'displayNone'}`}></div>
        </Fade>
        <div className={`dropdown ${this.props.color ? 'customColor' : ''} ${floatingLabel && 'floating-label'} ${status} ${fixedLabel ? 'fixed' : ''}`} style={dropdownStyle}>
          {label && !floatingLabel && <label><GBLink onClick={open || readOnly ? this.closeMenu : this.openMenu}>{label}</GBLink></label>}
          {!hideButton ?
            <button ref={this.buttonRef} style={buttonStyle} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} type='button' onClick={open || readOnly ? this.closeMenu : this.openMenu}><span ref={this.selectedRef} className={`label ${selected ? 'selected' : ''} ${idleLabel && 'idle'}`}>{selectedValue}</span>{!hideIcons ? <span ref={this.iconRef} className={`icon icon-${open ? multi ? iconMultiClose : iconOpened : iconClosed}`}></span> : null }</button>
          :
            <button ref={this.buttonRef} style={{ visibility: 'hidden' }}></button>
          }
          {portalID ? dropdownPortal : dropdownContent}
          {label && floatingLabel && <label><GBLink className='link label' onClick={open || readOnly ? this.closeMenu : this.openMenu}><span ref={this.labelRef}>{label}</span></GBLink></label>}
          {this.props.children}
        </div>
        <div className={`tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`}>
          {this.props.error}{readOnly ? readOnlyText : ''}
          <i></i>
        </div>
        <div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
      </div>
    );
  }
}

Dropdown.defaultProps = {
  showCloseBtn: false,
  rectXY: true,
  portalLeftOffset: 1.75,
  portalClass: 'dropdown-portal',
  portalRootEl: 'dropdown-root',
  portalID: false,
  name: 'defaultSelect',
  multi: false,
  multiCloseLabel: 'Close Menu',
  selectLabel: 'Please select',
  floatingLabel: true,
  contentStyle: {},
  iconMultiChecked: 'check',
  iconMultiClose: 'chevron-down',
  iconClosed: 'chevron-right',
  iconOpened: 'chevron-down',
  hideIcons: false,
  hideButton: false,
  overlayDuration: 200,
  overlay: true,
  direction: '',
  defaultColor: '#4775f8'
}

export default Dropdown;
