import React, { Component } from 'react';
import { connect } from 'react-redux';
import TestForm from './TestForm';
import Form from '../lib/form/Form';
import Dropdown from '../lib/form/Dropdown';
import MediaLibrary from '../lib/form/MediaLibrary';
import { setCustomProp } from '../lib/api/actions';
import { getResource, sendResource } from '../lib/api/helpers';
import CircularProgress from '../lib/common/CircularProgress';
import Plaid from './Plaid';
import Compress from './Compress';
import has from 'has';
import {
  util,
  GBLink
} from '../lib/'
import axios from 'axios';
import ReactPlayer from 'react-player';
import Editor from '../lib/gbx3/blocks/Editor';
import { toggleModal } from '../lib/api/actions';
import ModalRoute from '../lib/modal/ModalRoute';
import Lottie from 'lottie-react';
import * as coverPlaceholder from '../lib/gbx3/pages/coverPlaceholder.json';
import Paginate from '../lib/table/Paginate';
import MaxRecords from '../lib/table/MaxRecords';
import Export from '../lib/table/Export';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.getVideo = this.getVideo.bind(this);
    this.makeCineObj = this.makeCineObj.bind(this);
    this.listOptions = this.listOptions.bind(this);
    this.changeOptions = this.changeOptions.bind(this);
    this.state = {
      testValue: 1,
      options: [
        { ID: 1, text: 'Kitty Cat'},
        { ID: 2, text: 'Doggy Dog'},
        { ID: 3, text: 'Horse Horse'}
      ]
    };
    this.cineObj = {
      apiKey: '14388ca1-65a3-4a32-8dbc-dd001087dbcf'
    };
    this.assetID = '5ec82229fdce270f8f3fb2c4';
    this.playlistID = '5ea9c986d1dd2016535f1a02';
    // 5ea9c986d1dd2016535f1a02
  }

  componentDidMount() {
    console.log('execute coverPlaceholder -> ', coverPlaceholder);
    //this.getVideo();
    //this.props.toggleModal('testModal2', true);
    this.props.getResource('orgCustomers', {
      search: {
        sort: 'firstName'
      },
      reload: true
    });
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  changeOptions() {
    this.setState({
      options: [
        { ID: 1, text: 'Kitty Cat is cute'},
        { ID: 2, text: 'Doggy Dog are cool'},
        { ID: 3, text: 'Donkey Horse Mule'}
      ]
    })
  }

  listOptions() {
    const options = [];
    Object.entries(this.state.options).forEach(([key, value]) => {
      options.push({
        value: +value.ID,
        primaryText: value.text
      });
    });
    return options;
  }

  listCustomers() {
    const items = [];
    const customers = util.getValue(this.props.customers, 'data', {});
    if (!util.isEmpty(customers)) {
      Object.entries(customers).forEach(([key, value]) => {
        items.push(
          <li onClick={() => console.log('execute customer -> ', value.ID)} style={{padding: '15px'}} className='ripple' key={key}>
            <div className='liContent'>
              <span style={{fontWeight: 300 }} className='smallText gray'>Customer Since {util.getDate(value.createdAt, 'MM/DD/YYYY')}</span>
              <span className='normalText'>{value.firstName}{value.lastName ? ` ${value.lastName},` : ','} {value.email}</span>
            </div>
          </li>
        );
      });
    }
    return items;
  }

  makeQueryStr(obj) {
    const queryString = Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
    return queryString;
  }

  makeCineObj(obj = {}) {
    return {
      ...this.cineObj,
      ...obj
    }
  }

  createVoucher(assetID) {
    const obj = this.makeCineObj({
      assetID
    });
    const endpoint = `https://staging-api.cinesend.com/api/integrators/vouchers?${this.makeQueryStr(this.makeCineObj(obj))}`;

    axios({
      method: 'POST',
      url: endpoint
    })
    .then(function (response) {
      switch (response.status) {
        case 200: {
          console.log('execute 200', response);
          break;
        }
        default: {
          console.log('execute', response);
          break;
        }
      }
    })
    .catch(function (error) {
      console.log('execute catch', error);
    })
  }

  getVideo() {

    const endpoint = `https://staging-api.cinesend.com/api/integrators/videos/${this.assetID}?${this.makeQueryStr(this.makeCineObj())}`;

    axios.get(endpoint, {
      transformResponse: (data) => {
        return JSON.parse(data);
      }
    })
    .then(function (response) {
      switch (response.status) {
        case 200:
          console.log('execute status 200', response, response.data);
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

  getPlaylists() {

    const endpoint = `https://staging-api.cinesend.com/api/integrators/playlists/?${this.makeQueryStr(this.makeCineObj())}`;

    axios.get(endpoint, {
      transformResponse: (data) => {
        return JSON.parse(data);
      }
    })
    .then(function (response) {
      switch (response.status) {
        case 200:
          console.log('execute status 200', response, response.data);
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

  handleSaveCallback(url) {
    console.log('execute handleSaveCallback', url);
  }

  render() {

    const library = {
      saveMediaType: 'org',
      articleID: 651,
      orgID: 185,
      type: 'article',
      borderRadius: 0
    };

    return (
      <div>
        <h2>Dashboard</h2>
        <Dropdown
          name='emailListID'
          portalID={`dropdown-portal-emailListID`}
          portalClass={'gbx3 articleCardDropdown gbx3Steps'}
          portalLeftOffset={50}
          className='articleCard'
          contentWidth={400}
          label={'Contact List'}
          selectLabel='Select the List of Contacts Who Will Receive the Email'
          fixedLabel={false}
          fixedLabelHasValue={true}
          required={false}
          onChange={(name, value) => {
            this.setState({
              testValue: +value
            })
          }}
          options={this.listOptions()}
          showCloseBtn={true}
          value={this.state.testValue}
          style={{ paddingBottom: 5 }}
          leftBar={true}
          allowSelectedToChange={true}
        />
        <GBLink onClick={this.changeOptions}>Change Options</GBLink>
        <div style={{ position: 'relative', overflow: 'scroll' }}>
          <ul className='selectable selectArticle left'>
            {this.listCustomers()}
          </ul>
          <Paginate name={'orgCustomers'} />
          <MaxRecords name={'orgCustomers'} />
          <Export
              name='orgCustomers'
              desc='Download Customers'
          />
        </div>
        {/*
        <ModalRoute
          id='testModal2'
          component={() => {
            return (
              <div className='modalWrapper'>
                <h2>Test Modal Route</h2>
                <div style={{ height: '500px' }}>
                  Content
                </div>
              </div>
            )
          }}
        />
        <Form
          name='testForm'
          options={{
            color: '#ecab1f'
          }}>
          <TestForm {...this.props} />
        </Form>
        */}
        {/*
        <Lottie
          animationData={coverPlaceholder.default}
        />
        */}
        {/* <Plaid /> */}
        {/*
        <Compress />
        <GBLink onClick={() => this.createVoucher(this.playlistID)}>Create Voucher</GBLink>
        <br /><br />
        <GBLink onClick={() => this.getVideo()}>Get Video</GBLink>
        <br /><br />
        <GBLink onClick={() => this.getPlaylists()}>Get Playlists</GBLink>
        <GBLink onClick={() => this.createVoucher()}>Create Voucher</GBLink>
        <ReactPlayer
          url={'https://cdn.givebox.com/givebox/public/videos/filmfestivals.mp4'}
          width='100%'
          controls={true}
        />
        <MediaLibrary
          blockType={'article'}
          image={null}
          preview={null}
          handleSaveCallback={this.handleSaveCallback}
          handleSave={util.handleFile}
          library={library}
          showBtns={'hide'}
          saveLabel={'close'}
          mobile={false}
          uploadOnly={true}
        />
        */}
        {/*
        <CircularProgress
          progress={100}
          startDegree={0}
          progressWidth={5}
          trackWidth={5}
          cornersWidth={1}
          size={90}
          fillColor="transparent"
          trackColor={'#e8ebed'}
          progressColor={'#e83b2e'}
          progressColor2={'#29eee6'}
          gradient={true}
        />

        <Editor
          orgID={185}
          articleID={null}
          content={this.state.content}
          onBlur={(content) => console.log('onBlur -> ', content)}
          onChange={(content) => {
            this.setState({ content });
          }}
          type={'classic'}
          subType={'content'}
          acceptedMimes={['image']}
          autoFocus={false}
          allowLinking={false}
        />
        */}
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
    customers: state.resource.orgCustomers ? state.resource.orgCustomers : {}
  }
}


export default connect(mapStateToProps, {
  setCustomProp,
  getResource,
  sendResource,
  toggleModal
})(Dashboard)
