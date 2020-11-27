import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  util
} from '../../';
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
      data: article,
    } = this.props;

    const articleID = util.getValue(article, 'articleID');

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
      data: article,
    } = this.props;

    const articleID = util.getValue(article, 'articleID');

    this.props.sendResource('articleShares', {
      id: [articleID],
      data: {
        service
      },
      isSending: false
    });
    window.parent.postMessage('gbx3Shared', '*');
  }

  render() {

    const {
      data: article,
      subText,
      shareIconSize
    } = this.props;

    const shareLink = `${GBX_SHARE}/${util.getValue(article, 'articleID')}`;
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
  shareIconSize: 35
}

function mapStateToProps(state, props) {
  const data = util.getValue(state, 'gbx3.data', {});

  return {
    data
  }
}

export default connect(mapStateToProps, {
  sendResource,
  getResource
})(Social);
