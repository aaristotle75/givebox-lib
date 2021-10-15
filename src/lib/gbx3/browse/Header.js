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
const ENV = process.env.REACT_APP_ENV;

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.onClickEditProfilePicture = this.onClickEditProfilePicture.bind(this);
    this.renderSlider = this.renderSlider.bind(this);
    this.onClickCoverPhoto = this.onClickCoverPhoto.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  onClickCoverPhoto(ID) {
    this.props.onClickArticle(ID);
  }

  onClickEditProfilePicture() {
    console.log('execute onClickEditProfilePicture');
  }

  renderSlider() {

    const coverPhotoUrl = 'https://cdn.givebox.com/images/2020/03/27060433/13-Jimmy-Miller-option-1.jpg';

    const images = [
      {
        url: 'https://cdn.givebox.com/givebox/public/images/browse/SBIFF.jpg',
        title: '36th SBIFF Passes & Event Tickets',
        orgName: 'Santa Barbara International Film Festival',
        articleID: 520854,
        buttonText: 'Select Passes & Tickets'
      },
      {
        url: 'https://cdn.givebox.com/givebox/public/images/browse/Heal-The-Ocean.jpg',
        title: 'You can directly help reduce ocean pollution',
        orgName: 'Heal The Ocean',
        articleID: 685,
        buttonText: 'Reduce Ocean Pollution'
      },
      {
        url: 'https://cdn.givebox.com/givebox/public/images/browse/Infinite.jpg',
        title: 'YOUR DONATION MATTERS',
        orgName: 'Infinite Hero Foundation',
        articleID: 519963,
        buttonText: 'Support Veterans'
      },
      {
        url: 'https://cdn.givebox.com/givebox/public/images/browse/Jimmy-Miller.jpg',
        title: 'Help Fund the 2021 Ocean Therapy Sessions',
        orgName: 'JIMMY MILLER MEMORIAL FOUNDATION',
        articleID: 104595,
        buttonText: 'Click Here to Help Now'
      },
      {
        url: 'https://cdn.givebox.com/givebox/public/images/browse/Blake-Griffin.jpg',
        title: 'Help Invest In Positive Futures',
        orgName: 'Team Griffin Foundation',
        articleID: 1527,
        buttonText: 'Invest Now'
      },
      {
        url: 'https://cdn.givebox.com/givebox/public/images/browse/Juglife.jpg',
        title: 'DRINK WATER, GIVE WATER, SAVE WATER. WATER IS LIFE',
        orgName: 'JUGLIFE',
        articleID: 614,
        buttonText: 'Give the Gift of Water Now'
      }
    ];
    const items = [];

    Object.entries(images).forEach(([key, value]) => {
      items.push(
        <div key={key} className='coverPhotoImageContainer'>
          <Image imgID='coverPhoto' size='large' url={value.url} maxheight='350px' maxWidth='950px' alt='Cover Photo' />
          <div onClick={() => this.onClickCoverPhoto(value.articleID)} className='coverPhotoInfoContainer'>
            <span className='coverPhotoTitle'>{util.truncate(value.title, 90)}</span>
            <span className='coverPhotoOrgName'>{value.orgName}</span>
            <GBLink className='coverPhotoButton' onClick={() => console.log(value.articleID)}>
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
              play={ENV !== 'local' ? true : true}
              cancelOnInteraction={true}
              interval={5000}
              className='coverPhotoImage'
              animation="cubeAnimation"
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
