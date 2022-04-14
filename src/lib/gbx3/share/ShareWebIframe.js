import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import CodeBlock from '../../block/CodeBlock';
import GBX from '../../common/GBX';
import {
  updateInfo
} from '../redux/gbx3actions';

const REACT_APP_GBX_URL = process.env.REACT_APP_GBX_URL;

class ShareIframe extends React.Component {

  constructor(props) {
    super(props);
    this.iframeScript = this.iframeScript.bind(this);
    this.toggleAuto = this.toggleAuto.bind(this);
    this.state = {
      autoPop: true
    }
  }

  componentDidMount() {
    //window.GIVEBOX.init({ env: 'staging'});
  }

  iframeScript() {
    const {
      orgDisplay,
      orgData,
      articleID: ID
    } = this.props;

    let src = `${REACT_APP_GBX_URL}/${ID}?public=true&noFocus=true`;
    if (orgDisplay) {
      src = `${REACT_APP_GBX_URL}/${util.getValue(orgData, 'slug')}?public=true&noFocus=true`;
    }

    const iframe =
    `<iframe src="${src}" frameBorder="no" scrolling="auto" height="800px" width="100%"></iframe>`;
    return iframe;
  }

  toggleAuto() {
    this.setState({autoPop: this.state.autoPop ? false : true});
  }

  render() {

    const {
      orgDisplay,
      kindName
    } = this.props;

    return (
      <div className='shareWeb'>
        <div style={{ width: '100%' }} className='column'>
          <div className='subText'>Embed iFrame Code</div>
          <p>Copy and paste this code anywhere in your website's HTML where you want the { orgDisplay ? 'page' : `${kindName.toLowerCase()}` } to show.</p>
          <CodeBlock showCopied={true} style={{ fontSize: '1em' }} className='flexCenter flexColumn' type='javascript' regularText={''} text={this.iframeScript()} name={<div style={{ margin: '20px 0' }} className='copyButton'>Click Here to Copy Code</div>} nameIcon={false} nameStyle={{}} />
        </div>
      </div>
    )
  }
}

ShareIframe.defaultProps = {
  kindName: ''
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const info = util.getValue(gbx3, 'info', {});
  const kind = util.getValue(info, 'kind');
  const articleID = util.getValue(info, 'articleID');
  const primaryColor = util.getValue(state, 'gbx3.globals.gbxStyle.primaryColor');
  const orgData = util.getValue(state, 'resource.gbx3Org.data', {});

  return {
    kind,
    articleID,
    primaryColor,
    orgData,
    kindName: util.getValue(gbx3, 'info.kindName')
  }
}

export default connect(mapStateToProps, {
  updateInfo
})(ShareIframe);
