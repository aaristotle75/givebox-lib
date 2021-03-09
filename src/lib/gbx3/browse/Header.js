import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import Dropdown from '../../form/Dropdown';
import ModalLink from '../../modal/ModalLink';
import {
  updateData,
  updateInfo,
  setStyle,
  updateAdmin
} from '../redux/gbx3actions';
import {
  toggleModal
} from '../../api/actions';
import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';
import 'react-awesome-slider/dist/custom-animations/cube-animation.css';
import CoreStyles from 'react-awesome-slider/src/core/styles.scss';
import AnimationStyles from 'react-awesome-slider/src/styled/fold-out-animation/fold-out-animation.scss';

const AutoplaySlider = withAutoplay(AwesomeSlider);

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.onClickEditProfilePicture = this.onClickEditProfilePicture.bind(this);
    this.renderSlider = this.renderSlider.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  onClickEditProfilePicture() {
    console.log('execute onClickEditProfilePicture');
  }

  renderSlider() {

    const coverPhotoUrl = 'https://s3-us-west-1.amazonaws.com/givebox-marketing/images/2020/03/27060433/13-Jimmy-Miller-option-1.jpg';

    const images = [
      {
        url: coverPhotoUrl,
        title: 'Hello World 1',
        orgName: 'Organization 1',
        articleID: 4,
        buttonText: 'Learn More'
      },
      {
        url: coverPhotoUrl,
        title: 'Hello World 2',
        orgName: 'Organization 2',
        articleID: 651,
        buttonText: 'Buy Tickets'
      }
    ];
    const items = [];

    Object.entries(images).forEach(([key, value]) => {
      items.push(
        <div key={key} className='coverPhotoImageContainer'>
          <Image imgID='coverPhoto' size='large' url={value.url} maxWidth='950px' maxHeight='350px' alt='Cover Photo' />
          <div className='coverPhotoInfoContainer'>
            <span className='coverPhotoTitle'>{value.title}</span>
            <span className='coverPhotoOrgName'>{value.orgName}</span>
            <GBLink className='link' onClick={() => console.log('onclick button -> ', value.articleID)}>
              {value.buttonText} <span className='icon icon-chevron-right'></span>
            </GBLink>
          </div>
        </div>
      );
    });

    return items;
  }

  render() {

    const {
      coverPhoto,
      profilePicture,
      stage
    } = this.props;

    const isPublic = stage === 'public' ? true : false;
    const profilePictureUrl = 'https://givebox-marketing.s3.us-west-1.amazonaws.com/images/2020/01/19210256/givebox_logo2020_white-text.svg';

    return (
      <div className='gbx3OrgContentHeader gbx3OrgContentOuterContainer'>
        <div className='gbx3OrgContentInnerContainer'>
          <div id='coverPhoto' className='coverPhotoContainer'>
            <AutoplaySlider
              play={true}
              cancelOnInteraction={false}
              interval={2000}
              className='coverPhotoImage'
              animation="foldOutAnimation"
              cssModule={[CoreStyles, AnimationStyles]}
              bullets={false}
            >
              {this.renderSlider()}
            </AutoplaySlider>
          </div>
        </div>
      </div>
    )
  }

}

function mapStateToProps(state, props) {

  return {
    stage: util.getValue(state, 'gbx3.info.stage'),
  }
}

export default connect(mapStateToProps, {
  updateData,
  updateInfo,
  setStyle,
  updateAdmin,
  toggleModal
})(Header);
