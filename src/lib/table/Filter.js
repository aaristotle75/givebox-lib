import React, { Component } from 'react';
import AnimateHeight from 'react-animate-height';
import FilterForm from './FilterForm';
import Form from '../form/Form';

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
    this.setState({open: true});
  }

  closeMenu() {
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
      name
    } = this.props;

    const {
      open
    } = this.state;

    return (
      <div className='filter' style={style}>
        <button className='link' type='button' onClick={open ? this.closeMenu : this.openMenu}>{label}<span className='icon icon-triangle-down'></span></button>
        <AnimateHeight
          duration={500}
          height={this.state.open ? 'auto' : 0}
        >
          <Form name={name} >
            <FilterForm name={name} options={options} />
          </Form>
        </AnimateHeight>
      </div>
    );
  }
}

Filter.defaultProps = {
  label: 'Filters'
}

export default Filter;
