import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import Image from '../../../common/Image';
import GBLink from '../../../common/GBLink';
import Loader from '../../../common/Loader';
import Choice from '../../../form/Choice';
import TextField from '../../../form/TextField';
import AnimateHeight from 'react-animate-height';
import axios from 'axios';

const ENV = process.env.REACT_APP_ENV;
const API_URL = ENV === 'production' ? 'https://api.cinesend.com/api' : 'https://staging-api.cinesend.com/api';

class Cinesend extends React.Component {

  constructor(props) {
    super(props);
    this.getVideo = this.getVideo.bind(this);
    this.renderValidated = this.renderValidated.bind(this);
    this.setValidated = this.setValidated.bind(this);
    this.state = {
      validating: false,
      validated: ''
    };
  }

  componentDidMount() {
    //this.getVideo();
  }

  componentDidUpdate(prevProps) {
    /*
    if ((util.getValue(prevProps, 'form.virtualEvent.videoID') !== util.getValue(this.props, 'form.virtualEvent.videoID'))
    || (util.getValue(prevProps, 'form.virtualEvent.APIKey') !== util.getValue(this.props, 'form.virtualEvent.APIKey'))) {
      this.getVideo();
    }
    */
  }

  makeQueryStr(obj) {
    const queryString = Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
    return queryString;
  }

  getVideo(callback) {

    const {
      virtualEvent
    } = this.props.form;

    this.setState({ validating: true });
    const videoID = util.getValue(virtualEvent, 'videoID');
    const APIKey = util.getValue(virtualEvent, 'APIKey');

    if (videoID && APIKey) {
      const obj = {
        apiKey: APIKey
      };
      const endpoint = `${API_URL}/integrators/videos/${videoID}?${this.makeQueryStr(obj)}`;

      axios.get(endpoint, {
        transformResponse: (data) => {
          return JSON.parse(data);
        }
      })
      .then(function (response) {
        switch (response.status) {
          case 200:
            callback('validated');
            break;
          default:
            callback('error');
            break;
        }
      })
      .catch(function (error) {
        callback('error');
      })
    }
  }

  setValidated(validated) {
    this.setState({ validated, validating: false });
  }

  renderValidated() {
    const {
      validated
    } = this.state;

    const item = '';

    const obj = {};

    switch (validated) {
      case 'validated': {
        obj.icon = 'check';
        obj.color = 'green';
        obj.text = 'Video Validated';
        break;
      }

      case 'error': {
        obj.color = 'red';
        obj.icon = 'alert-triangle';
        obj.text = 'Error: Video Not Validated - Please Check Video ID and API Key are Correct';
        break;
      }

      // no default

    }

    return (
      <div style={{ marginLeft: 5 }}>
        <GBLink onClick={() => this.getVideo(this.setValidated)}>Click Here to Validate Video</GBLink>
        <AnimateHeight height={ !util.isEmpty(obj) ? 'auto' : 0 }>
          <div className={`${obj.color}`} style={{ fontSize: '12px', display: 'block', marginTop: 5 }}>
            <span className={`icon icon-${obj.icon}`}></span> {obj.text}
          </div>
        </AnimateHeight>
      </div>
    );
  }

  render() {

    const {
      virtualEvent
    } = this.props.form;

    const {
      APIKey,
      videoID,
      validated
    } = virtualEvent;

    return (
      <>
        { this.state.validating ? <Loader msg='Validating...' /> : null }
        <div className='formSectionHeader'>Virtual Event</div>
        <Choice
          type='checkbox'
          name='virtualEvent'
          label={'Enable Virtual Event'}
          onChange={(name, value) => {
            virtualEvent.isEnabled = virtualEvent.isEnabled ? false : true;
            this.props.updateForm('virtualEvent', virtualEvent);
          }}
          checked={util.getValue(virtualEvent, 'isEnabled')}
          value={util.getValue(virtualEvent, 'isEnabled')}
          toggle={true}
        />
        <AnimateHeight height={util.getValue(virtualEvent, 'isEnabled') ? 'auto' : 0}>
          <TextField
            name='virtualEventProviderName'
            label='Virtual Event Provider'
            fixedLabel={true}
            placeholder='Select Virtual Event Provider'
            value={util.getValue(virtualEvent, 'providerName')}
            onChange={(e) => {
              const value = e.currentTarget.value;
            }}
            style={{ paddingBottom: 0 }}
            readOnly={true}
            readOnlyText={'Must have a Cinesend Account'}
          />
          <TextField
            name='virtualEventAPIKey'
            label='Virtual Event Provider API Key'
            fixedLabel={true}
            placeholder='Enter Your API Key (You get this from your Virtual Event Provider)'
            value={APIKey}
            onChange={(e) => {
              const value = e.currentTarget.value;
              virtualEvent.APIKey = value;
              this.props.updateForm('virtualEvent', virtualEvent);
            }}
            style={{ paddingBottom: 0 }}
          />
          <TextField
            name='virtualEventVideoID'
            label='Virtual Event Provider Video ID'
            fixedLabel={true}
            placeholder='Enter Your Virtual Event Video ID (You get this from your Virtual Event Provider)'
            value={videoID}
            onChange={(e) => {
              const value = e.currentTarget.value;
              virtualEvent.videoID = value;
              this.props.updateForm('virtualEvent', virtualEvent);
            }}
            style={{ paddingBottom: 0 }}
          />
          { videoID && APIKey ? this.renderValidated() : null }
        </AnimateHeight>
      </>
    )
  }
}

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
})(Cinesend);
