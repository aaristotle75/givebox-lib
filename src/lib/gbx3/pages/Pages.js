import React, {Component} from 'react';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';

class Pages extends Component{
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

    return (
      <div className='gbx3OrgPages'>
        <div className='block'>
          <div className={`blockOptions`}>
            <div className='blockEdit'>
              <GBLink className='tooltip blockEditButton' onClick={() => console.log('execute onClick Edit')}>
                <span className='tooltipTop'><i />Click Icon to EDIT Page</span>
                <span className='icon icon-edit'></span>
              </GBLink>
            </div>
          </div>
          <div className='block'>
            PAGES
          </div>
        </div>
      </div>
    )
  }
};

Pages.defaultProps = {
};

export default Pages;
