import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Tabs,
  Tab
} from '../../';
import ShareWebPop from './ShareWebPop';
import ShareWebIframe from './ShareWebIframe';

class ShareWeb extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  render() {

    const {
      orgDisplay
    } = this.props;

    return (
      <div className='formSectionContainer'>
        <div className='formSection'>
          <Tabs
            default={orgDisplay ? 'iframe' : 'pop'}
            className='subTabs'
          >
            { !orgDisplay ?
              <Tab id='pop' label={<span className='stepLabel'>Embed Popup Widget</span>}>
                <ShareWebPop />
              </Tab>
            : <></>}
            <Tab id='iframe' label={<span className='stepLabel'>Embed iFrame</span>}>
              <ShareWebIframe
                orgDisplay={orgDisplay}
              />
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(ShareWeb);
