import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import Image from '../../../common/Image';
import GBLink from '../../../common/GBLink';
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
    this.state = {
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

  setValidated(validated = false) {
    const {
      virtualEvent
    } = this.props.form;

    this.setState({ validated }, () => {
      virtualEvent.validated = validated;
      this.props.updateForm('virtualEvent', virtualEvent);
    })
  }

  makeQueryStr(obj) {
    const queryString = Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
    return queryString;
  }

  getVideo() {

    const {
      virtualEvent
    } = this.props.form;

    const videoID = util.getValue(virtualEvent, 'videoID');
    const APIKey = util.getValue(virtualEvent, 'APIKey');

    console.log('execute -> ', videoID, APIKey);

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
            console.log('execute status 200', response, response.data);
            this.props.updateForm()
            break;
          default:
            console.log(response);
            break;
        }
      })
      .catch(function (error) {
        console.log('catch error');
      })
    }
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
          { videoID && APIKey ?
            <div style={{ marginLeft: 5 }}>
              <GBLink onClick={() => this.getVideo()}>Click Here to Validate Video</GBLink>
              <div className={`${validated ? 'green' : 'gray'}`} style={{ display: 'block' }}>
                <span className={`icon icon-${validated ? 'check' : 'alert-triangle'}`}></span> {validated ? 'Video Validated' : 'Video has not been Validated'}
              </div>
            </div>
          : null }
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
