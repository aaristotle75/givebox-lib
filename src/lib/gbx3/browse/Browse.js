import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import * as util from '../../common/utility';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import ScrollTop from '../../common/ScrollTop';
import Loader from '../../common/Loader';
import GBXEntry from '../../common/GBXEntry';
import has from 'has';
import {
  updateInfo,
  updateAdmin,
  updateGBX3,
  setLoading
} from '../redux/gbx3actions';
import Header from './Header';
import Pages from './Pages';
import Footer from '../Footer';
import history from '../../common/history';

const ENV = process.env.REACT_APP_ENV;
const GBX_URL = process.env.REACT_APP_GBX_URL;

class Browse extends React.Component {

  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.resizer = this.resizer.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onClickArticle = this.onClickArticle.bind(this);
  }

  componentDidMount() {
    this.props.setLoading(false);
    this.onBreakpointChange();
    window.addEventListener('resize', this.resizer);
    GBXEntry.init([{ env: ENV }]);
  }

  async onClickArticle(ID, pageSlug) {
    const {
      stage,
      preview
    } = this.props;

    const infoUpdated = await this.props.updateInfo({ originTemplate: 'browse' });
    if (infoUpdated) {
      history.push(`${GBX_URL}/${ID}`);
      this.props.reloadGBX3(ID);
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
      isMobile,
      loading
    } = this.props;

    const isEditable = hasAccessToEdit && editable ? true : false;
    const isAdmin = stage === 'admin' ? true : false;

    return (
      <div className='gbx3Org gbx3Browse'>
        { loading ? <Loader msg='Loading Browse...' /> : null }
        <ScrollTop elementID={isAdmin ? 'stageContainer' : 'gbx3Layout'} />
        <div className='gbx3OrgHeader'>
          <div className={'gbx3OrgLogoContainer'} onClick={() => console.log('logo clicked!')}>
            <GBLink onClick={() => window.open('https://givebox.com')}>
              <Image size='small' maxHeight={29} url={'https://givebox-marketing.s3.us-west-1.amazonaws.com/images/2020/06/19054759/givebox_logo2020-grey-text.png'} alt='Givebox' />
            </GBLink>
          </div>
        </div>
        <div className='gbx3OrgContentContainer'>
          <Header
            onClickArticle={this.onClickArticle}
          />
          <div className='gbx3OrgSubHeader gbx3OrgContentOuterContainer'>
            <div style={{ padding: '15px 0' }} className='gbx3OrgContentInnerContainer'>
              <div className='nameSection'>
                <div className='flexColumn flexCenter centerItems'>
                  <span style={{ marginBottom: 15, fontSize: 22, fontWeight: 300 }}>Have a Nonprofit or Charity, start a fundraiser today.</span>
                  <GBLink
                    style={{ width: 200 }}
                    className='button'
                    onClick={() => {
                      GBXEntry.load({ env: ENV });
                    }}>
                    Start a Fundraiser
                  </GBLink>
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
  const loading = util.getValue(gbx3, 'loading');
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
    loading,
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
  updateAdmin,
  updateGBX3,
  setLoading
})(Browse);
