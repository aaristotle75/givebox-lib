import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import CodeBlock from '../../block/CodeBlock';
import GBLink from '../../common/GBLink';

class ShareLinkCopy extends Component {

  constructor(props) {
    super(props);
    this.copyCallback = this.copyCallback.bind(this);
    this.state = {
      copied: false
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  copyCallback() {
    this.setState({ copied: true });
    this.timeout = setTimeout(() => {
      this.setState({ copied: false });
      this.timeout = null;
    }, 1000);
  }

  render() {

    const {
      slug,
      hasCustomSlug,
      articleID,
      subText
    } = this.props;

    const {
      copied
    } = this.state;

    const shareUrl = `${process.env.REACT_APP_GBX_SHARE}/${hasCustomSlug && slug ? slug : articleID}`;

    return (
      <div className='shareLink formSectionContainer'>
        <div className='formSection'>
          <div className='subText'>
            {subText}
            {shareUrl}
          </div>
          <CodeBlock copyCallback={this.copyCallback} style={{ marginTop: 10, fontSize: '1em' }} className='flexCenter flexColumn' type='javascript' regularText={''} text={shareUrl} name={<div className='copyButton'>Click Here to Copy Share Link</div>} nameIcon={false} nameStyle={{}} />
          <div className={`codeCopied ${copied ? 'copied' : ''}`}>
            <span className='icon icon-check-circle'></span>
            <span className='copiedText'>Copied</span>
          </div>
        </div>
      </div>
    )
  }
}

ShareLinkCopy.defaultProps = {
  subText: ''
};

function mapStateToProps(state, props) {

  const kind = props.kind || util.getValue(state, 'gbx3.info.kind');
  const kindID = props.kindID || util.getValue(state, 'gbx3.info.kindID');
  const articleID = props.articleID || util.getValue(state, 'gbx3.info.articleID');
  const display = props.display || util.getValue(state, 'gbx3.info.display');
  const orgDisplay = display === 'org' ? true : false;
  const slug = props.slug ? props.slug : orgDisplay ? util.getValue(state, 'resource.gbx3Org.data.slug') : util.getValue(state, 'gbx3.data.slug');
  const hasCustomSlug = props.hasCustomSlug ? props.hasCustomSlug : orgDisplay ? true : util.getValue(state, 'gbx3.data.hasCustomSlug');

  return {
    kind,
    kindID,
    articleID,
    slug,
    hasCustomSlug
  }
}

export default connect(mapStateToProps, {
})(ShareLinkCopy);
