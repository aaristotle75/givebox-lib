/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import Image from '../../../common/Image';
import GBLink from '../../../common/GBLink';
import CustomCKEditor4 from '../../../editor/CustomCKEditor4';
import Moment from 'moment';
import {
  saveGBX3,
  updateData
} from '../../redux/gbx3actions';

const emailTemplate = require('html-loader!./receiptEmailTemplate.html');
const defaultContent = require('html-loader!./receiptEmailDefaultContent.html');
const GBX_SHARE = process.env.REACT_APP_GBX_SHARE;

class ReceiptEmailEdit extends React.Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setPreviewHTML = this.setPreviewHTML.bind(this);
    this.save = this.save.bind(this);

    const info = props.info;
    const receiptConfig = props.receiptConfig;
    const data = props.data;

    const style = util.getValue(receiptConfig, 'receiptStyle', {});
    const link = `${GBX_SHARE}/${util.getValue(info, 'articleID')}`;
    const orgImage = util.getValue(info, 'orgImage');
    const orgName = util.getValue(info, 'orgName');
    const articleTitle = util.getValue(data, 'title');
    const articleImageURL = util.getValue(data, 'imageURL');

    const tokens = {
      '{{color}}': util.getValue(style, 'primaryColor', props.primaryColor),
      '{{link}}': link,
      '{{orgimage}}': util.imageUrlWithStyle(orgImage, 'small'),
      '{{orgname}}': orgName,
      '{{articletitle}}': articleTitle,
      '{{articleimage}}': util.imageUrlWithStyle(articleImageURL, 'medium'),
      '{{message}}': `Write your content for your audience...`
    };

    const content = util.getValue(receiptConfig, 'content', `${util.replaceAll(defaultContent, tokens)}`);

    this.state = {
      content
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  onBlur(value) {
    const content = util.cleanHtml(value);
    this.setState({ content },
      () => {
        this.save(true);
      }
    );
  }

  onChange(value) {
    const content = util.cleanHtml(value);
    this.setState({ content },
      () => {
        this.save();
      }
    );
  }

  setPreviewHTML() {
    const {
      info
    } = this.props;

    const content = this.state.content;
    const tokens = {
      '{{content}}': content
    };

    const html = util.replaceAll(emailTemplate, tokens);
    return (
      <div style={{ background: '#ffffff', width: '100%', maxWidth: 550 }} dangerouslySetInnerHTML={{ __html: content }} />
    );
  }

  async save(saveGBX3 = false) {
    const {
      content
    } = this.state;

    const obj = {
      receiptHTML: content,
      receiptConfig: {
        content
      }
    }
    const dataUpdated = await this.props.updateData(obj);
    if (dataUpdated && saveGBX3) this.props.saveGBX3('receipt', { obj });
  }

  render() {

    const {
      info,
      breakpoint,
      previewMode
    } = this.props;

    const {
      content
    } = this.state;

    return (
      <div className='gbx3Layout gbx3ReceiptLayout'>
        <div className='gbx3Container gbx3ReceiptContainer'>
          <div className='block flexCenter'>
          {previewMode ?
            this.setPreviewHTML()
          :
            <CustomCKEditor4
              orgID={util.getValue(info, 'orgID', null)}
              articleID={util.getValue(info, 'articleID', null)}
               onChange={this.onChange}
              onBlur={this.onBlur}
              content={content}
              width={breakpoint === 'mobile' ? 'auto' : 600}
              height={'600'}
              type={breakpoint === 'mobile' ? 'classic' : 'inline'}
            />
          }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const admin = util.getValue(gbx3, 'admin', {});
  const previewMode = util.getValue(admin, 'previewMode');
  const info = util.getValue(gbx3, 'info', {});
  const breakpoint = util.getValue(info, 'breakpoint');
  const data = util.getValue(gbx3, 'data', {});
  const receiptConfig = util.getValue(data, 'receiptConfig', {});
  const receiptStyle = util.getValue(receiptConfig, 'style', {});

  return {
    previewMode,
    info,
    breakpoint,
    data,
    receiptConfig,
    receiptStyle
  }
}

export default connect(mapStateToProps, {
  saveGBX3,
  updateData
})(ReceiptEmailEdit);
