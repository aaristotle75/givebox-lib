import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import * as util from '../common/utility';
import Image from '../common/Image';
import GBLink from '../common/GBLink';
import ScrollTop from '../common/ScrollTop';
import Dropdown from '../form/Dropdown';
import ModalLink from '../modal/ModalLink';
import has from 'has';
import {
  updateOrgPage,
  updateOrgGlobal,
  updateData,
  updateInfo,
  setStyle,
  updateAdmin,
  saveOrg
} from './redux/gbx3actions';
import Header from './pages/Header';
import Pages from './pages/Pages';
import Footer from './Footer';

class Org extends React.Component {

  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.resizer = this.resizer.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.pageLinks = this.pageLinks.bind(this);
    this.pageOptions = this.pageOptions.bind(this);
    this.pageDropdown = this.pageDropdown.bind(this);
    this.onClickPageLink = this.onClickPageLink.bind(this);
    this.onClickArticle = this.onClickArticle.bind(this);
    this.saveGlobal = this.saveGlobal.bind(this);
    this.savePage = this.savePage.bind(this);
    this.state = {
      defaultTitle: props.title
    };
  }

  componentDidMount() {
    this.onBreakpointChange();
    window.addEventListener('resize', this.resizer);
  }

  async saveGlobal(name, obj = {}, callback) {
    const globalUpdated = await this.props.updateOrgGlobal(name, obj);
    if (globalUpdated) {
      this.props.saveOrg({
        callback: (res, err) => {
          if (callback) callback();
        }
      })
    }
  }

  async savePage(name, obj = {}, callback) {
    const pageUpdated = await this.props.updateOrgPage(name, obj);
    if (pageUpdated) {
      this.props.saveOrg({
        callback: (res, err) => {
          if (callback) callback();
        }
      })
    }
  }

  async onClickArticle(ID) {
    const {
      stage,
      preview
    } = this.props;
    const infoUpdated = await this.props.updateInfo({ originTemplate: 'org' });
    if (infoUpdated) {
      if (stage === 'admin' && !preview) {
        console.log('execute onClickArticle do admin stuff -> ', ID);
      } else {
        this.props.reloadGBX3(ID);
      }
    }
  }

  async onClickPageLink(activePageSlug) {
    const updatedInfo = await this.props.updateInfo({ activePageSlug });
    if (updatedInfo) {
      this.props.scrollTo('gbx3OrgPages');
    }
  }

  resizer(e) {
    this.onBreakpointChange();
  }

  async onBreakpointChange() {
    const {
      breakpointWidth
    } = this.props;

    let breakpoint = 'desktop';
    if (window.innerWidth <= this.props.breakpointWidth) {
      breakpoint = 'mobile';
    }
    if (breakpoint !== this.props.breakpoint) {
      const infoUpdated = await this.props.updateInfo({ breakpoint });
    }
  }

  pageLinks() {
    const {
      pagesEnabled,
      pageSlug,
      pages,
      stage
    } = this.props;

    const links = [];
    const isAdmin = stage === 'admin' ? true : false;

    pagesEnabled.forEach((key) => {
      const value = util.getValue(pages, key, {});
      const primaryText = util.getValue(value, 'navText', value.name);
      const active = value.slug === pageSlug ? true : false;
      links.push(
        <GBLink
          key={key}
          className={`link ${active ? 'active' : ''}`}
          onClick={() => active ? console.log('Active Link') : this.onClickPageLink(value.slug)}
        >
          {primaryText}
        </GBLink>
      );
    });

    return links;
  }

  pageOptions() {
    const {
      pagesEnabled,
      pageSlug,
      pages
    } = this.props;

    const options = [];

    pagesEnabled.forEach((val, key) => {
      const value = util.getValue(pages, val, {});
      const primaryText = util.getValue(value, 'navText', value.name);
      const rightText = value.slug === pageSlug ? <span className='icon icon-check'></span> : null;
      options.push({ key: val, rightText, primaryText, value: value.slug });
    });

    return options;
  }

  pageDropdown(options = [], label = 'More') {
    return (
      <Dropdown
        name='page'
        label={''}
        selectLabel={label}
        fixedLabel={false}
        onChange={(name, value) => {
          this.onClickPageLink(value);
        }}
        options={options}
      />
    )
  }

  render() {

    const {
      editable,
      hasAccessToEdit,
      breakpoint,
      stage,
      pages,
      pageSlug,
      isMobile,
      title
    } = this.props;

    const isEditable = hasAccessToEdit && editable ? true : false;
    const isAdmin = stage === 'admin' ? true : false;
    const pageOptions = this.pageOptions();

    return (
      <div className='gbx3Org'>
        <ScrollTop elementID={isAdmin ? 'stageContainer' : 'gbx3Layout'} />
        <div className='gbx3OrgHeader'>
          <div className={'gbx3OrgLogoContainer'} onClick={() => console.log('logo clicked!')}>
            <Image size='thumb' maxSize={35} url={'https://givebox.s3-us-west-1.amazonaws.com/public/gb-logo5.png'} alt='Givebox' />
          </div>
        </div>
        <div className='gbx3OrgContentContainer'>
          <Header
            saveGlobal={this.saveGlobal}
          />
          <div className='gbx3OrgSubHeader gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
              <div className='nameSection'>
                <ModalLink
                  id='orgEditTitle'
                  type='div'
                  className='nameSectionContainer orgAdminEdit'
                  opts={{
                    saveGlobal: this.saveGlobal
                  }}
                >
                  <button className='tooltip blockEditButton' id='orgEditTitle'>
                    <span className='tooltipTop'><i />Click Icon to EDIT Title</span>
                    <span className='icon icon-edit'></span>
                  </button>
                </ModalLink>
                <div className='nameSectionContainer'>
                  <div className='nameText'>
                    <div dangerouslySetInnerHTML={{ __html: util.cleanHtml(title) }} />
                  </div>
                </div>
              </div>
              { pageOptions.length > 1 || isAdmin ?
                <div className='navigation'>
                  <ModalLink
                    id='orgEditMenu'
                    type='div'
                    className='navigationContainer orgAdminEdit'
                    opts={{
                      saveGlobal: this.saveGlobal,
                      closeCallback: () => this.props.saveOrg()
                    }}
                  >
                    <button className='tooltip blockEditButton' id='orgEditMenu'>
                      <span className='tooltipTop'><i />Click Icon to EDIT Navigation Menu</span>
                      <span className='icon icon-edit'></span>
                    </button>
                  </ModalLink>
                  { pageOptions.length > 0 ?
                    <div className='navigationContainer'>
                    { !isMobile ?
                      this.pageLinks()
                    :
                      <div className='navigationDropdown'>
                        {this.pageDropdown(this.pageOptions())}
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
                  isAdmin={isAdmin}
                  onClickArticle={this.onClickArticle}
                  pageDropdown={this.pageDropdown}
                />
            </div>
          </main>
          <div className='gbx3OrgFooter gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
              <Footer />
            </div>
          </div>
        </div>
        {breakpoint === 'mobile' ? <div className='bottomOffset'>&nbsp;</div> : <></>}
      </div>
    )
  }

}

function mapStateToProps(state, props) {

  const breakpointWidth = 736;
  const gbx3 = util.getValue(state, 'gbx3', {});
  const admin = util.getValue(gbx3, 'admin', {});
  const info = util.getValue(gbx3, 'info', {});
  const stage = util.getValue(info, 'stage');
  const preview = util.getValue(info, 'preview');
  const pages = util.getValue(gbx3, 'orgPages', {});
  const pagesEnabled = util.getValue(gbx3, 'orgGlobals.pagesEnabled', []);
  const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
  const editable = util.getValue(admin, 'editable');
  const breakpoint = util.getValue(info, 'breakpoint');
  const isMobile = breakpoint === 'mobile' ? true : false;
  const pageSlug = util.getValue(info, 'activePageSlug');
  const title = util.getValue(gbx3, 'orgGlobals.title.content');

  return {
    breakpointWidth,
    stage,
    pageSlug,
    pages,
    pagesEnabled,
    hasAccessToEdit,
    editable,
    breakpoint,
    isMobile,
    title
  }
}

export default connect(mapStateToProps, {
  updateOrgGlobal,
  updateData,
  updateInfo,
  setStyle,
  updateAdmin,
  saveOrg
})(Org);
