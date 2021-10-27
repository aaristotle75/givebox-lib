/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import Moment from 'moment';
import ReceiptEmailLayout from './ReceiptEmailLayout';
import {
  saveReceipt
} from '../../redux/gbx3actions';

const emailTemplate = require('html-loader!./receiptEmailTemplate.html');
const defaultContent = require('html-loader!./receiptEmailDefaultContent.html');
const orderConfirmationTemplate = require('html-loader!./receiptConfirmationTemplate.html');

const GBX_SHARE = process.env.REACT_APP_GBX_SHARE;

class ReceiptEmailEdit extends React.Component {

  constructor(props) {
    super(props);
    this.setPreviewHTML = this.setPreviewHTML.bind(this);
  }

  componentDidMount() {
    this.props.saveReceipt();

    if (this.props.previewMode) {
      this.setPreviewHTML();
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  setPreviewHTML() {
    const {
      receiptHTML,
      org
    } = this.props;

    const descriptor = util.getValue(org, 'billingDescriptor', 'BillingDescription');
    const orderConfirmation = util.replaceAll(orderConfirmationTemplate, {
      '{{ordername}}': `Customer Name`,
      '{{orderdate}}' : Moment().format('MMMM Do, YYYY'),
      '{{descriptor}}' : `GBX*${descriptor}`,
      '{{lastfour}}' : '0000'
    });

    const content = receiptHTML;
    const tokens = {
      '{{content}}': content,
      '{{orderconfirmation}}': orderConfirmation
    };

    const html = util.replaceAll(emailTemplate, tokens);

    const iframeRef = util.getValue(this.props.iframePreviewRef, 'current', {});

    if (iframeRef) {
      if (iframeRef.contentDocument) iframeRef.contentDocument.write(html);
    }
  }


  render() {

    const {
      previewMode
    } = this.props;

    if (previewMode) {
      return (
        <></>
      );
    } else {
      return (
        <div className='gbx3ReceiptLayout'>
          <div className='gbx3ReceiptContainer'>
            <div className='block'>
              <div className='flexCenter'>
                <ReceiptEmailLayout />
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const admin = util.getValue(gbx3, 'admin', {});
  const previewMode = util.getValue(admin, 'previewMode');
  const receiptHTML = util.getValue(gbx3, 'data.receiptHTML');
  const org = util.getValue(state, 'resource.gbx3Org.data', {});

  return {
    previewMode,
    receiptHTML,
    org
  }
}

export default connect(mapStateToProps, {
  saveReceipt
})(ReceiptEmailEdit);
