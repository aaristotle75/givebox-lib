import React from 'react';
import * as util from '../../common/utility';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import ScrollTop from '../../common/ScrollTop';
import Header from './Header';
import Pages from './Pages';
import Footer from '../Footer';
import MoneyRaised from './MoneyRaised';
import Icon from '../../common/Icon';
import { GoDashboard } from 'react-icons/go';
import HelpfulTip from '../../common/HelpfulTip';

export default class OrgDisplay extends React.Component {

  render() {

    const {
      breakpoint,
      isMobile,
      title,
      cameFromNonprofitAdmin,
      morePageOptions,
      isAdmin,
      isEditable
    } = this.props;

    return (
      <div className='gbx3Org'>
        <ScrollTop elementID={isAdmin ? 'stageContainer' : 'gbx3Layout'} />
        <div className='gbx3OrgHeader'>
          <div className={'gbx3OrgLogoContainer'} onClick={() => console.log('logo clicked!')}>
            <Image size='thumb' maxSize={35} url={'https://cdn.givebox.com/givebox/public/gb-logo5.png'} alt='Givebox' />
          </div>
          <MoneyRaised />
          { cameFromNonprofitAdmin ?
            <div className='gbx3OrgBackToDashboard orgAdminOnly'>
              <GBLink key={'exit'} style={{ fontSize: '14px' }} className='link' onClick={() => this.props.exitAdmin()}><Icon><GoDashboard /></Icon>{ isMobile ? 'Dashboard' : `Back to Dashboard` }</GBLink>
            </div>
          : null }
        </div>
        <div className='gbx3OrgContentContainer'>
          <Header
            saveGlobal={this.props.saveGlobal}
            openOrgAdminMenu={this.props.openOrgAdminMenu}
          />
          <div className='gbx3OrgSubHeader gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
              <div className='nameSection'>
                <div
                  id='orgEditTitle'
                  className='nameSectionContainer orgAdminEdit'
                  onClick={() => {
                    this.props.openOrgAdminMenu('orgEditTitle');
                  }}
                >
                  <button className='tooltip blockEditButton'>
                    <span className='tooltipTop'><i />Click to EDIT Title</span>
                    <span className='icon icon-edit'></span>
                  </button>
                </div>
                <div className='nameSectionContainer'>
                  <div className='nameText'>
                    <div dangerouslySetInnerHTML={{ __html: util.cleanHtml(title) }} />
                  </div>
                </div>
              </div>
              { morePageOptions.length > 1 || isAdmin ?
                <div className='navigation'>
                  <div
                    id='orgEditMenu'
                    className='navigationContainer orgAdminEdit'
                    onClick={() => {
                      this.props.openOrgAdminMenu('orgEditMenu', () => {
                        this.props.saveOrg();
                      });
                    }}
                  >
                    <button className='tooltip blockEditButton'>
                      <span className='tooltipTop'><i />Click to Manage Pages / Navigation Menu</span>
                      <span className='icon icon-edit'></span>
                    </button>
                  </div>
                  { morePageOptions.length > 0  ?
                    <div className='navigationContainer'>
                    { !isMobile ?
                      this.props.pageLinks()
                    :
                      <div className='navigationDropdown'>
                        {this.props.pageDropdown(morePageOptions)}
                      </div>
                    }
                    </div>
                  :
                    <div className='navigationContainer'>
                      Manage Navigation Menu
                    </div>
                  }
                </div>
              : null }
            </div>
          </div>
          <main className='gbx3OrgContent gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
                <Pages
                  openOrgAdminMenu={this.props.openOrgAdminMenu}
                  pageDropdown={this.props.pageDropdown}
                  isAdmin={isAdmin}
                  adminPageOptions={this.props.adminPageOptions}
                  onClickArticle={this.props.onClickArticle}
                  reloadGetArticles={this.props.reloadGetArticles}
                  getArticles={this.props.getArticles}
                  setPageSearch={this.props.setPageSearch}
                  resetPageSearch={this.props.resetPageSearch}
                  removeCard={this.props.removeCard}
                  createFundraiser={this.props.createFundraiser}
                  selectKindOptions={this.props.selectKindOptions}
                />
            </div>
          </main>
          <div className='gbx3OrgFooter gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
              <Footer
                showP2P={true}
                onClickVolunteerFundraiser={this.props.onClickVolunteerFundraiser}
              />
            </div>
          </div>
        </div>
        {breakpoint === 'mobile' ? <div className='bottomOffset'>&nbsp;</div> : <></>}
      </div>
    )
  }
}
