import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import * as util from '../../common/utility';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import ScrollTop from '../../common/ScrollTop';
import has from 'has';
import {
  updateInfo,
  updateAdmin
} from '../redux/gbx3actions';
import Header from './Header';
import Pages from './Pages';
import Footer from '../Footer';

class Browse extends React.Component {

  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.resizer = this.resizer.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onClickArticle = this.onClickArticle.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
    this.onBreakpointChange();
    window.addEventListener('resize', this.resizer);
  }

  async onClickArticle(ID, pageSlug) {
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

  render() {

    const {
      editable,
      hasAccessToEdit,
      breakpoint,
      stage,
      pages,
      pageSlug,
      isMobile
    } = this.props;

    const isEditable = hasAccessToEdit && editable ? true : false;
    const isAdmin = stage === 'admin' ? true : false;

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
          />
          <div className='gbx3OrgSubHeader gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
              <div className='nameSection'>
                <div className='nameSectionContainer'>
                  <div className='nameText'>
                    Browse Nonprofit Fundraisers
                  </div>
                </div>
              </div>
            </div>
          </div>
          <main className='gbx3OrgContent gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
                <Pages
                  isAdmin={isAdmin}
                  onClickArticle={this.onClickArticle}
                  onMouseOverArticle={this.onMouseOverArticle}
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
  const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
  const editable = util.getValue(admin, 'editable');
  const breakpoint = util.getValue(info, 'breakpoint');
  const isMobile = breakpoint === 'mobile' ? true : false;
  const pageSlug = 'browse'

  return {
    breakpointWidth,
    stage,
    pageSlug,
    hasAccessToEdit,
    editable,
    breakpoint,
    isMobile
  }
}

export default connect(mapStateToProps, {
  updateInfo,
  updateAdmin
})(Browse);
