import React, {Component} from 'react';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';

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
      height: 200,
      ...this.props.style
    };

    return (
      <div style={style} className='gbx3OrgHeader'>
        <div className='block'>
          <div className={`blockOptions`}>
            <div className='blockEdit'>
              <GBLink className='tooltip blockEditButton' onClick={() => console.log('execute onClick settings')}>
                <span className='tooltipTop'><i />Click Icon for Header Options</span>
                <span className='icon icon-sliders'></span>
              </GBLink>
              <GBLink className='tooltip blockEditButton' onClick={() => console.log('execute onClick Edit')}>
                <span className='tooltipTop'><i />Click Icon to EDIT Header</span>
                <span className='icon icon-edit'></span>
              </GBLink>
            </div>
          </div>
          <div className='block'>
            HEADER
          </div>
        </div>
      </div>
    )
  }
};

Header.defaultProps = {
  style: {}
};

export default Header;
