import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import {
  sendResource,
  getResource
} from '../../api/helpers';
import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
  LinkedinShareButton
} from 'react-share';
import Moment from 'moment';

const GBX_SHARE = process.env.REACT_APP_GBX_SHARE;

class Social extends Component {

  constructor(props) {
    super(props);
    this.linkClicked = this.linkClicked.bind(this);
    this.checkShare = this.checkShare.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  linkClicked(service) {
    this.checkShare(service);
  }

  checkShare(service) {
    const {
      articleID
    } = this.props;

    const checkTime = parseInt(Moment().subtract(1, 'minute').format('x')/1000);
    this.props.getResource('articleShares', {
      id: [articleID],
      reload: true,
      search: {
        filter: `service:"${service}"%3BcreatedAt:>d${checkTime}`
      },
      callback: (res, err) => {
        const total = !util.isEmpty(res) ? util.getValue(res, 'total', 0) : 0;
        if (total === 0) {
          this.saveShare(service);
        }
      }
    });
  }

  saveShare(service) {
    const {
      articleID
    } = this.props;

    this.props.sendResource('articleShares', {
      id: [articleID],
      data: {
        service
      },
      isSending: false
    });
    window.parent.postMessage('gbx3Shared', '*');
    window.postMessage('gbx3Shared', '*');
  }

  render() {

    const {
      articleID,
      data: article,
      subText,
      shareIconSize
    } = this.props;

    const slug = util.getValue(article, 'slug');
    const hasCustomSlug = util.getValue(article, 'hasCustomSlug');
    const shareLink = `${GBX_SHARE}/${hasCustomSlug && slug ? slug : articleID}`;
    const title = util.getValue(article, 'title');
    const image = util.imageUrlWithStyle(article.imageURL, 'medium');
    const description = util.getValue(article, 'summary');

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

Social.defaultProps = {
  shareIconSize: 35,
  subText: ''
}

function mapStateToProps(state, props) {
  const data = props.data || util.getValue(state, 'gbx3.data', {});
  const articleID = props.articleID || util.getValue(data, 'articleID');

  return {
    data,
    articleID
  }
}

export default connect(mapStateToProps, {
  sendResource,
  getResource
})(Social);
