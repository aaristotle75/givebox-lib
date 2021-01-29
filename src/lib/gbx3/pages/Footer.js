import React, {Component} from 'react';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';

class Footer extends Component{
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
      <div className='gbx3OrgFooter'>
        <div className='block'>
          <div className={`blockOptions`}>
            <div className='blockEdit'>
              <GBLink className='tooltip blockEditButton' onClick={() => console.log('execute onClick Edit')}>
                <span className='tooltipTop'><i />Click Icon to EDIT Footer</span>
                <span className='icon icon-edit'></span>
              </GBLink>
            </div>
          </div>
          <div className='block'>
            FOOTER
          </div>
        </div>
      </div>
    )
  }
};

Footer.defaultProps = {
};

export default Footer;
