import React from 'react';
import { connect } from 'react-redux';
import { launchpadConfig } from './admin/launchpad/launchpadConfig';
import Image from '../common/Image';
import {
  toggleModal
} from '../api/actions';

const APP_URL = process.env.REACT_APP_CLOUD_URL;

class Launchpad extends React.Component {

  constructor(props) {
    super(props);
    this.renderApps = this.renderApps.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  renderApps() {
    const items = [];
    Object.entries(launchpadConfig).forEach(([key, value]) => {
      items.push(
        <div
          key={key}
          className='launchpadItem'
          onClick={() => {
            const appURL = `${APP_URL}${value.path}`;
            window.open(appURL, '_blank', 'fullscreen=yes,channelmode=yes');
          }}
        >
        <Image maxSize={'140px'} url={`https://cdn.givebox.com/givebox/public/images/backgrounds/${value.image}.png`} size='inherit' alt={value.name} />
          <span className='appName'>{value.name}</span>
        </div>
      )
    });

    return items;
  }

  render() {

    const {
    } = this.props;

    return (
      <>
        <div className='launchpadScreen'></div>
        <div className='launchpadContent' onClick={() => this.props.toggleModal('launchpad', false, { blurClass: 'launchpadBlur' })}>
          <div className='launchpadItems'>
            {this.renderApps()}
          </div>
        </div>
      </>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(Launchpad);
