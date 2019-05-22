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
      open: false,
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.closeMenu();
  }

  openMenu(e) {
    this.props.isFilterOpen(true);
    this.setState({open: true});
  }

  closeMenu() {
    this.props.isFilterOpen(false);
    this.setState({open: false });
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

    return (
      <div className='filterWrapper'>
        <button className='link' type='button' onClick={open ? this.closeMenu : this.openMenu}><span>{label}{open ? iconOpened : iconClosed}</span></button>
        <div className='filter' style={style}>
          <AnimateHeight
            duration={500}
            height={this.state.open ? 'auto' : 0}
          >
            <Form name={name} >
              <FilterForm
              allowDisabled={allowDisabled}
              closeMenu={this.closeMenu}
              name={name}
              customName={customName}
              options={options}
              alwaysFilter={alwaysFilter}
              callback={callback}
            />
            </Form>
          </AnimateHeight>
        </div>
      </div>
    );
  }
}

Filter.defaultProps = {
  label: 'Filters',
  iconOpened: <span className='icon icon-minus'></span>,
  iconClosed: <span className='icon icon-plus'></span>
}

function mapStateToProps(state, props) {
  return {
    filterOpen: state.app.filterOpen
  }
}

export default connect(mapStateToProps, {
  isFilterOpen
})(Filter);
