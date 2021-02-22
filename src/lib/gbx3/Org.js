import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import * as util from '../common/utility';
import Image from '../common/Image';
import GBLink from '../common/GBLink';
import Dropdown from '../form/Dropdown';
import ModalLink from '../modal/ModalLink';
import has from 'has';
import {
  updateData,
  updateInfo,
  setStyle,
  updateAdmin,
  saveOrg
} from './redux/gbx3actions';
import Header from './pages/Header';
import Pages from './pages/Pages';
import Footer from './Footer';
import Scroll from 'react-scroll';
import axios from 'axios';

class Org extends React.Component {

  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.resizer = this.resizer.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.pageOptions = this.pageOptions.bind(this);
    this.pageLinks = this.pageLinks.bind(this);
    this.pageDropdown = this.pageDropdown.bind(this);
    this.onClickPageLink = this.onClickPageLink.bind(this);
    this.onClickArticle = this.onClickArticle.bind(this);
  }

  componentDidMount() {
    this.onBreakpointChange();
    window.addEventListener('resize', this.resizer);
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
    if (updatedInfo) this.props.scrollTo('page');
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

  pageOptions() {
    const {
      pageSlug,
      pages
    } = this.props;

    const options = [];

    Object.entries(pages).forEach(([key, value]) => {
      const rightText = value.slug === pageSlug ? <span className='icon icon-check'></span> : null;
      options.push({ rightText, primaryText: value.name, value: value.slug });
    });

    return options;
  }

  pageLinks() {
    const {
      pageSlug,
      pages
    } = this.props;

    const links = [];

    Object.entries(pages).forEach(([key, value]) => {
      const active = value.slug === pageSlug ? true : false;
      links.push(
        <GBLink
          key={key}
          className={`link ${active ? 'active' : ''}`}
          onClick={() => active ? console.log('Active Link') : this.onClickPageLink(value.slug)}
        >
          {value.name}
        </GBLink>
      );
    });

    return links;
  }

  pageDropdown(label = 'More') {
    return (
      <Dropdown
        name='page'
        label={''}
        selectLabel={label}
        fixedLabel={false}
        onChange={(name, value) => {
          this.onClickPageLink(value);
        }}
        options={this.pageOptions()}
      />
    )
  }

  render() {

    const {
      editable,
      hasAccessToEdit,
      breakpoint,
      stage,
      pageSlug,
      isMobile
    } = this.props;

    const isEditable = hasAccessToEdit && editable ? true : false;
    const Element = Scroll.Element;

    return (
      <div className='gbx3Org'>
        <GBLink onClick={() => util.toTop('gbx3Layout')} className='toTop'><span className='icon icon-chevrons-up'></span></GBLink>
        <div className='gbx3OrgHeader'>
          <div className={'gbx3OrgLogoContainer'} onClick={() => console.log('logo clicked!')}>
            <Image size='thumb' maxSize={35} url={'https://givebox.s3-us-west-1.amazonaws.com/public/gb-logo5.png'} alt='Givebox' />
          </div>
        </div>
        <div className='gbx3OrgContentContainer'>
          <Header />
          <div className='gbx3OrgSubHeader gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
              <div className='nameSection'>
                <div className='nameSectionContainer orgAdminEdit'>
                  <ModalLink
                    id='orgEditTitle'
                    className='tooltip blockEditButton'
                    opts={{
                      closeCallback: () => console.log('execute closeCallback -> orgEditTitle')
                    }}
                  >
                    <span className='tooltipTop'><i />Click Icon to EDIT Title</span>
                    <span className='icon icon-edit'></span>
                  </ModalLink>
                </div>
                <div className='nameSectionContainer'>
                  <div className='nameText'>Service Dogs of America</div>
                </div>
              </div>
              <div className='navigation'>
                <ModalLink
                  id='orgEditMenu'
                  type='div'
                  className='navigationContainer orgAdminEdit'
                >
                  <button className='tooltip blockEditButton' id='orgEditMenu'>
                    <span className='tooltipTop'><i />Click Icon to EDIT Navigation Menu</span>
                    <span className='icon icon-edit'></span>
                  </button>
                </ModalLink>
                <div className='navigationContainer'>
                { !isMobile ?
                  this.pageLinks()
                :
                  <div className='navigationDropdown'>
                    {this.pageDropdown()}
                  </div>
                }
                </div>
              </div>
            </div>
          </div>
          <main className='gbx3OrgContent gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
              <Element name='page'>
                <Pages
                  onClickArticle={this.onClickArticle}
                  pageDropdown={this.pageDropdown}
                />
              </Element>
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
  const pageSlug = util.getValue(info, 'activePageSlug');
  const pages = util.getValue(gbx3, 'orgPages', {});
  const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
  const editable = util.getValue(admin, 'editable');
  const breakpoint = util.getValue(info, 'breakpoint');
  const isMobile = breakpoint === 'mobile' ? true : false;

  return {
    breakpointWidth,
    stage,
    pageSlug,
    pages,
    hasAccessToEdit,
    editable,
    breakpoint,
    isMobile
  }
}

export default connect(mapStateToProps, {
  updateData,
  updateInfo,
  setStyle,
  updateAdmin,
  saveOrg
})(Org);
