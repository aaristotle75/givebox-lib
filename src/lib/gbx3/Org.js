import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import * as util from '../common/utility';
import Image from '../common/Image';
import GBLink from '../common/GBLink';
import Dropdown from '../form/Dropdown';
import has from 'has';
import {
  updateData,
  updateInfo,
  setStyle,
  updateAdmin
} from './redux/gbx3actions';
import Pages from './pages/Pages';
import Footer from './Footer';
import axios from 'axios';


class Org extends React.Component {

  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.resizer = this.resizer.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.pageOptions = this.pageOptions.bind(this);
    this.pageLinks = this.pageLinks.bind(this);
    this.onClickArticle = this.onClickArticle.bind(this);
  }

  componentDidMount() {
    this.onBreakpointChange();
    window.addEventListener('resize', this.resizer);
  }

  async onClickArticle(ID) {
    const infoUpdated = await this.props.updateInfo({ originTemplate: 'org' });
    if (infoUpdated) this.props.reloadGBX3(ID);
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
      page,
      pages
    } = this.props;

    const options = [];

    Object.entries(pages).forEach(([key, value]) => {
      const rightText = value.slug === page ? <span className='icon icon-check'></span> : null;
      options.push({ rightText, primaryText: value.name, value: value.slug });
    });

    return options;
  }

  pageLinks() {
    const {
      page,
      pages
    } = this.props;

    const links = [];

    Object.entries(pages).forEach(([key, value]) => {
      const active = value.slug === page ? true : false;
      links.push(
        <GBLink
          key={key}
          className={`link ${active ? 'active' : ''}`}
          onClick={() => active ? console.log('Active Link') : this.props.updateInfo({ page: value.slug })}
        >
          {value.name}
        </GBLink>
      );
    });

    return links;
  }

  render() {

    const {
      editable,
      hasAccessToEdit,
      breakpoint,
      stage,
      page,
      isMobile
    } = this.props;

    const isEditable = hasAccessToEdit && editable ? true : false;

    return (
      <div className='gbx3Org'>
        <GBLink onClick={() => util.toTop('gbx3Layout')} className='toTop'><span className='icon icon-chevrons-up'></span></GBLink>
        <div className='gbx3OrgHeader'>
          <div className={'gbx3OrgLogoContainer'} onClick={() => console.log('logo clicked!')}>
            <Image size='thumb' maxSize={35} url={'https://givebox.s3-us-west-1.amazonaws.com/public/gb-logo5.png'} alt='Givebox' />
          </div>
        </div>
        <div className='gbx3OrgContentContainer'>
          <div className='gbx3OrgContentHeader gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
              <div id='coverPhoto' className='coverPhotoContainer'>
                <div className='coverPhotoImage'>
                  <Image imgID='coverPhoto' url='https://scontent.fbts5-1.fna.fbcdn.net/v/t1.0-9/146458272_1594146030775580_1681237268117440186_n.jpg?_nc_cat=107&ccb=2&_nc_sid=e3f864&_nc_ohc=RiyM11oq7s4AX_Ogn0b&_nc_ht=scontent.fbts5-1.fna&oh=8523127a27556559d511cabd31f142ff&oe=604298EB' maxSize='950px' alt='Cover Photo' />
                </div>
                <div className='profilePictureContainer'>
                  <Image url='https://scontent.fbts5-1.fna.fbcdn.net/v/t1.0-1/p200x200/60898531_1092468567609998_4827187149260455936_o.jpg?_nc_cat=111&ccb=2&_nc_sid=7206a8&_nc_ohc=3p90oFEZeOEAX84huL6&_nc_ht=scontent.fbts5-1.fna&tp=6&oh=bebd0f2bacec213fe8165a8799e1f4c7&oe=6040E930' maxSize='160px' alt='Profile Picture' imgStyle={{ borderRadius: '50%' }}/>
                </div>
              </div>
            </div>
          </div>
          <div className='gbx3OrgSubHeader gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
              <div className='nameSection'>
                <div className='nameText'>Service Dogs of America</div>
              </div>
              { !isMobile ?
              <div className='navigation'>
                {this.pageLinks()}
              </div> :
              <div className='navigation'>
                <Dropdown
                  name='page'
                  label={''}
                  selectLabel={'More'}
                  fixedLabel={false}
                  onChange={(name, value) => {
                    this.props.updateInfo({ page: value });
                  }}
                  options={this.pageOptions()}
                />
              </div> }
            </div>
          </div>
          <main className='gbx3OrgContent gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
              <Pages
                onClickArticle={this.onClickArticle}
              />
            </div>
          </main>
          <div className='gbx3OrgFooter gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
              Givebox Footer
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
  const page = util.getValue(info, 'page');
  const pages = util.getValue(gbx3, 'landing.pages', []);
  const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
  const editable = util.getValue(admin, 'editable');
  const breakpoint = util.getValue(info, 'breakpoint');
  const isMobile = breakpoint === 'mobile' ? true : false;

  return {
    breakpointWidth,
    stage,
    page,
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
  updateAdmin
})(Org);
