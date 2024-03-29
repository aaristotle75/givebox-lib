import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
  LinkedinShareButton
} from 'react-share';

const GBX_SHARE = process.env.REACT_APP_GBX_SHARE;

class SocialOrg extends Component {

  constructor(props) {
    super(props);
    this.linkClicked = this.linkClicked.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  linkClicked(social) {
    console.log('Shared on', social);
  }

  render() {

    const {
      data: org,
      subText,
      shareIconSize
    } = this.props;

    const shareLink = `${GBX_SHARE}/${util.getValue(org, 'slug')}`;
    const title = util.getValue(org, 'name');
    const image = util.imageUrlWithStyle(org.imageURL, 'medium');
    const description = `Check out how ${title} is doing good in the world.`;

    return (
      <div className='share'>
        {subText}
        <ul className="center">
          <li>
            <FacebookShareButton
              url={shareLink}
              quote={title}
              onShareWindowClose={() => this.linkClicked('facebook')}
            >
              {types.socialIcons('facebook', shareIconSize)}
            </FacebookShareButton>
          </li>
          <li>
            <TwitterShareButton
              url={shareLink}
              title={title}
              onShareWindowClose={() => this.linkClicked('twitter')}
            >
              {types.socialIcons('twitter', shareIconSize)}
            </TwitterShareButton>
          </li>
          {image ?
          <li>
            <PinterestShareButton
              url={shareLink}
              media={image}
              windowWidth={700}
              windowHeight={600}
              onShareWindowClose={() => this.linkClicked('pinterest')}
            >
              {types.socialIcons('pinterest', shareIconSize)}
            </PinterestShareButton>
          </li> : ''}
          <li>
            <LinkedinShareButton
              url={shareLink}
              title={title}
              description={description}
              onShareWindowClose={() => this.linkClicked('linkedin')}
            >
              {types.socialIcons('linkedin', shareIconSize)}
            </LinkedinShareButton>
          </li>
        </ul>
      </div>
    )
  }
};

SocialOrg.defaultProps = {
  shareIconSize: 35,
  subText: ''
}

function mapStateToProps(state, props) {
  const data = util.getValue(state, 'resource.gbx3Org.data', {});

  return {
    data
  }
}

export default connect(mapStateToProps, {
})(SocialOrg);
