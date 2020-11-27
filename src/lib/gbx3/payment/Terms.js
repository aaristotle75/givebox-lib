import React, {Component} from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import {
  util
} from '../../';
import GBLink from '../../common/GBLink';
import Collapse from '../../common/Collapse';
import Icon from '../../common/Icon';

import { GoLaw } from 'react-icons/go';
import TermsSweepstakes from './TermsSweepstakes';

class Terms extends Component {

  constructor(props) {
    super(props);
    this.acceptTerms = this.acceptTerms.bind(this);
    this.renderKindSpecific = this.renderKindSpecific.bind(this);
  }

  acceptTerms() {
    this.props.setCart('acceptedTerms', true);
    this.props.toggleModal('terms', false);
  }

  renderKindSpecific() {
    const {
      kind,
      primaryColor
    } = this.props;

    const items = [];

    switch (kind) {

      case 'sweepstake': {
        items.push(
          <TermsSweepstakes key='sweepstakes' primaryColor={primaryColor} />
        );
        break;
      }

      // no default

    }

    return items;
  }

  render() {

    const {
      primaryColor
    } = this.props;

    return (
      <div className='modalWrapper'>
        <div className='center'>
          <img className='pciImage' src='https://s3-us-west-1.amazonaws.com/givebox/public/images/logo-box.svg' alt='Givebox' height='70px' width='135px' />
        </div>
        <Collapse
          label={'Givebox Terms and Conditions'}
          customIcon={<Icon><GoLaw /></Icon>}
          id={'givebox-terms'}
        >
          <div className='sectionContent'>
            <h3 style={{ marginBottom: 0 }}>Givebox Terms and Conditions</h3>
            <p>Givebox and its associates provide their services to you subject to the following conditions.</p>
            <p>THIS AGREEMENT IS EXECUTED ELECTRONICALLY. BY ACCEPTING, YOU ARE AGREEING TO THE TERMS AND CONDITIONS FOR USE OF THE GIVEBOX SERVICES AS SET FORTH IN THIS AGREEMENT. YOU UNDERSTAND THAT YOU WILL BE BOUND BY THESE TERMS AND CONDITIONS. YOU WARRANT THAT YOU HAVE READ, UNDERSTAND, AND AGREE TO ALL OF THE TERMS OF THIS AGREEMENT, THAT YOU ARE AUTHORIZED TO ENTER INTO THIS AGREEMENT, AND THAT THIS AGREEMENT IS LEGALLY BINDING ON YOU. IF YOU DO NOT AGREE TO BE BOUND BY THIS AGREEMENT YOU SHALL NOT PARTICIPATE IN OR USE THE GIVEBOX SERVICES, RECEIVE ANY RIGHTS FROM GIVEBOX, OR ACCESS OR USE ANY MATERIALS OF GIVEBOX.</p>
            <h4>PRIVACY</h4>
            <p>Please review our <GBLink allowCustom={true} customColor={primaryColor} onClick={() => window.open('https://givebox.com/privacy')}>Privacy Policy</GBLink>, which also governs your visit to our website, to understand our practices.</p>
            <h4>ELECTRONIC COMMUNICATIONS</h4>
            <p>When you visit Givebox or send e-mails to us, you are communicating with us electronically. You consent to receive communications from us electronically. We will communicate with you by e-mail or by posting notices on this site. You agree that all agreements, notices, disclosures and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.</p>
            <h4>COPYRIGHT</h4>
            <p>All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Givebox or its content suppliers and protected by international copyright laws. The compilation of all content on this site is the exclusive property of Givebox, with copyright authorship for this collection by Givebox, and protected by international copyright laws.</p>
            <h4>TRADE MARKS</h4>
            <p>Givebox{`'`}s trademarks and trade dress may not be used in connection with any product or service that is not Givebox{`'`}s, in any manner that is likely to cause confusion among customers, or in any manner that disparages or discredits Givebox. All other trademarks not owned by Givebox or its subsidiaries that appear on this site are the property of their respective owners, who may or may not be affiliated with, connected to, or sponsored by Givebox or its subsidiaries.</p>
            <h4>LICENSE AND SITE ACCESS</h4>
            <p>Givebox grants you a limited license to access and make personal use of this site and not to download (other than page caching) or modify it, or any portion of it, except with express written consent of Givebox. This license does not include any resale or commercial use of this site or its contents: any collection and use of any product listings, descriptions, or prices: any derivative use of this site or its contents: any downloading or copying of account information for the benefit of another merchant: or any use of data mining, robots, or similar data gathering and extraction tools. This site or any portion of this site may not be reproduced, duplicated, copied, sold, resold, visited, or otherwise exploited for any commercial purpose without express written consent of Givebox. You may not frame or utilize framing techniques to enclose any trademark, logo, or other proprietary information (including images, text, page layout, or form) of Givebox and our associates without express written consent. You may not use any meta tags or any other 'hidden text' utilizing Givebox{`'`}s name or trademarks without the express written consent of Givebox. Any unauthorized use terminates the permission or license granted by Givebox. You are granted a limited, revocable, and nonexclusive right to create a hyperlink to the home page of Givebox so long as the link does not portray Givebox, its associates, or their products or services in a false, misleading, derogatory, or otherwise offensive matter. You may not use any Givebox logo or other proprietary graphic or trademark as part of the link without express written permission.</p>
            <h4>YOUR MEMBERSHIP ACCOUNT</h4>
            <p>If you use this site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password. If you are under 18, you may use our website only with involvement of a parent or guardian. Givebox and its associates reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders in their sole discretion.</p>
            <h4>REVIEWS, COMMENTS, EMAILS, AND OTHER CONTENT</h4>
            <p>Visitors may post reviews, comments, and other content: and submit suggestions, ideas, comments, questions, or other information, so long as the content is not illegal, obscene, threatening, defamatory, invasive of privacy, infringing of intellectual property rights, or otherwise injurious to third parties or objectionable and does not consist of or contain software viruses, political campaigning, commercial solicitation, chain letters, mass mailings, or any form of 'spam.' You may not use a false e-mail address, impersonate any person or entity, or otherwise mislead as to the origin of a card or other content. Givebox reserves the right (but not the obligation) to remove or edit such content, but does not regularly review posted content. If you do post content or submit material, and unless we indicate otherwise, you grant Givebox and its associates a nonexclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content throughout the world in any media. You grant Givebox and its associates and sublicensees the right to use the name that you submit in connection with such content, if they choose. You represent and warrant that you own or otherwise control all of the rights to the content that you post: that the content is accurate: that use of the content you supply does not violate this policy and will not cause injury to any person or entity: and that you will indemnify Givebox or its associates for all claims resulting from content you supply. Givebox has the right but not the obligation to monitor and edit or remove any activity or content. Givebox takes no responsibility and assumes no liability for any content posted by you or any third party.</p>
            <h4>PRODUCT DESCRIPTIONS</h4>
            <p>Givebox and its associates attempt to be as accurate as possible. However, Givebox does not warrant that product descriptions or other content of this site is accurate, complete, reliable, current, or error-free. If a product offered by Givebox itself is not as described, your sole remedy is to return it in unused condition. </p>
            <p>DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY THIS SITE IS PROVIDED BY Givebox ON AN 'AS IS' AND 'AS AVAILABLE' BASIS. Givebox MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THIS SITE OR THE INFORMATION, CONTENT, MATERIALS, OR PRODUCTS INCLUDED ON THIS SITE. YOU EXPRESSLY AGREE THAT YOUR USE OF THIS SITE IS AT YOUR SOLE RISK. TO THE FULL EXTENT PERMISSIBLE BY APPLICABLE LAW, Givebox DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. Givebox DOES NOT WARRANT THAT THIS SITE, ITS SERVERS, OR E-MAIL SENT FROM Givebox ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. Givebox WILL NOT BE LIABLE FOR ANY DAMAGES OF ANY KIND ARISING FROM THE USE OF THIS SITE, INCLUDING, BUT NOT LIMITED TO DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, AND CONSEQUENTIAL DAMAGES. CERTAIN STATE LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS, EXCLUSIONS, OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MIGHT HAVE ADDITIONAL RIGHTS.
            APPLICABLE LAW
            </p>
            <p>
              By visiting Givebox, you agree that the laws of the state of DEFINE_STATE, DEFINE_COUNTRY, without regard to principles of conflict of laws, will govern these Conditions of Use and any dispute of any sort that might arise between you and Givebox or its associates.</p>
              <h4>DISPUTES</h4>
              <p>Any dispute relating in any way to your visit to Givebox or to products you purchase through Givebox shall be submitted to confidential arbitration in DEFINE_STATE, DEFINE_COUNTRY, except that, to the extent you have in any manner violated or threatened to violate Givebox{`'`}s intellectual property rights, Givebox may seek injunctive or other appropriate relief in any state or federal court in the state of DEFINE_STATE, DEFINE_COUNTRY, and you consent to exclusive jurisdiction and venue in such courts. Arbitration under this agreement shall be conducted under the rules then prevailing of the American Arbitration Association. The arbitrators award shall be binding and may be entered as a judgment in any court of competent jurisdiction. To the fullest extent permitted by applicable law, no arbitration under this Agreement shall be joined to an arbitration involving any other party subject to this Agreement, whether through class arbitration proceedings or otherwise.</p>
              <h4>SITE POLICIES, MODIFICATION, AND SEVERABILITY</h4>
              <p>Please review our other policies, such as our Shipping and Returns policy, posted on this site. These policies also govern your visit to Givebox. We reserve the right to make changes to our site, policies, and these Conditions of Use at any time. If any of these conditions shall be deemed invalid, void, or for any reason unenforceable, that condition shall be deemed severable and shall not affect the validity and enforceability of any remaining condition.</p>
              <h4>QUESTIONS</h4>
              <p>Questions regarding our Conditions of Usage, Privacy Policy, or other policy related material can be directed to our support staff by visiting <GBLink allowCustom={true} customColor={primaryColor} onClick={() => window.open('https://support.givebox.com')}>Givebox Customer Support</GBLink>. Or you can email us at: <a href='mailto:support@givebox.com' style={{ color: primaryColor }}>support@givebox.com</a>
            </p>
          </div>
        </Collapse>
        {this.renderKindSpecific()}
        <div style={{ paddingBottom: 100 }} className='sectionContent center'>
          <h4>Payment will be processed by:</h4>
          <img style={{paddingTop: 10 }} src='https://s3-us-west-1.amazonaws.com/givebox/public/gb-logo5.svg' height='40px' width='40px' alt='Givebox, Inc.' />
          <div className='address'>
            <span className='line'><strong>Givebox</strong></span>
            <span className='line'>1730 E. Holly Ave</span>
            <span className='line'>El Segundo, CA 90245</span>
            <span className='line'>United States</span>
          </div>
        </div>
        <div className='bottomContainer2 flexCenter'>
          <div className='button-group'>
            <GBLink allowCustom={true} customColor={primaryColor} onClick={() => this.props.toggleModal('terms', false)}>Close</GBLink>
            <GBLink
              className='button'
              allowCustom={true}
              customColor={primaryColor}
              onClick={this.acceptTerms}
              solidColor={true}
            >I Agree</GBLink>
          </div>
        </div>
      </div>
    )
  }
};

function mapStateToProps(state, props) {

  const kind = util.getValue(state, 'gbx3.info.kind');

  return {
    kind
  }
}

export default connect(mapStateToProps, {
})(Terms);
