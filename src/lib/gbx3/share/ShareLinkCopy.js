import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import CodeBlock from '../../block/CodeBlock';

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
      articleID
    } = this.props;

    const {
      copied
    } = this.state;

    const shareUrl = `${process.env.REACT_APP_GBX_SHARE}/${hasCustomSlug && slug ? slug : articleID}`;

    return (
      <div className='shareLink formSectionContainer'>
        <div className='formSection'>
          <div className='subText'>
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

function mapStateToProps(state, props) {

  const kind = util.getValue(state, 'gbx3.info.kind');
  const kindID = util.getValue(state, 'gbx3.info.kindID');
  const articleID = util.getValue(state, 'gbx3.info.articleID');
  const display = util.getValue(state, 'gbx3.info.display');
  const orgDisplay = display === 'org' ? true : false;
  const slug = util.getValue(state, `gbx3.${orgDisplay ? 'orgData' : 'data'}.slug`);
  const hasCustomSlug = orgDisplay ? true : util.getValue(state, 'gbx3.data.hasCustomSlug');

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
