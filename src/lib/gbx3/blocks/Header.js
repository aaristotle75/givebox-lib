import React, {Component} from 'react';
import * as util from '../../common/utility';

class Header extends Component{
  constructor(props){
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
  }

  render() {

    const {
    } = this.props;

    const style = {
      height: 300
    };

    return (
      <div style={style} className='gbx3OrgHeader'>
        HEADER
      </div>
    )
  }
};

Header.defaultProps = {
  style: {}
};

export default Header;
