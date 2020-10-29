import React, { Component } from 'react';
import { connect } from 'react-redux';
import TestForm from './TestForm';
import {
  Form,
  Alert,
  Tabs,
  Tab,
  ModalLink,
  GBLink,
  Image,
  util,
  MediaLibrary,
  _v,
  Paginate,
  Table,
  types,
  ActionsMenu
} from '../lib';
import { setCustomProp } from '../lib/api/actions';
import { getResource } from '../lib/api/helpers';
import has from 'has';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.status = this.status.bind(this);
    this.toggleModalState = this.toggleModalState.bind(this);
    this.formatTableData = this.formatTableData.bind(this);
    this.state = {
      msg: '',
      display: false,
      modalState: 'closed'
    };
  }

  componentDidMount() {
    this.status();
    this.props.setCustomProp('primaryColor', '#ecab1f');
    this.props.getResource('orgBankAccounts', {
      id: [391093]
    });
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  status() {
    let msg =
      <div className='statusMsg'>
        Your account is not complete and all transactions will be processed through Givebox Technology Foundation Tax ID 47-4471615.
        <div>CLICK HERE TO COMPLETE YOUR ACCOUNT</div>
      </div>
    ;
    let display = true;
    this.setState({ msg: msg, display: display });
  }

  toggleModalState() {
    let modalState = 'open';
    if (this.state.modalState === 'open') {
      modalState = 'closed';
    }
    this.setState({ modalState });
  }

  handleSaveCallback(url) {
    console.log('handleSaveCallback', url);
  }

  getObfuscationXs(length) {
    let xs = '';
    for (let i=0; i <= length; i++) {
      xs = xs + 'x';
    }
    return xs;
  }

  formatTableData(resource) {

    const fdata = {};
    const headers = [];
    const rows = [];
    //let footer = [];

    headers.push(
      { name: '*details', width: '5%', sort: '' },
      { name: 'Account', width: '45%', sort: 'name' },
      { name: 'Status', width: '30%', sort: 'status' },
      { name: '', width: '20%', sort: '' }
    );
    fdata.headers = headers;

    if (!util.isEmpty(resource.data) && has(resource, 'data')) {
      resource.data.forEach(function(value, key) {
        const createdAt = util.getDate(value.createdAt, 'MM/DD/YYYY');
        const accountNumber = `********${value.last4}`;

        const desc =
          <div className='description'>
            <span className='line'>{value.name}</span>
            <span className='line date'>{value.bankName}</span>
          </div>
        ;

        const status = value.status === 'pending' && !value.voidCheck ?
          <ModalLink id='bankForm' opts={{ id: value.ID, resource: 'orgBankAccount', modalID: 'bankForm' }}>Upload Void Check or Bank Statement</ModalLink>
        :
          <span className={`${util.getValue(types.bankStatus(value.status, value.voidCheck), 'color')}`}>{util.getValue(types.bankStatus(value.status, value.voidCheck), 'name')}</span>
        ;
        const details =
          <div className='description'>
            <div className='column50'>
              <span className='line'><span className='detailsLabel'>Created:</span>{createdAt}</span>
              <span className='line'><span className='detailsLabel'>Account Name:</span>{value.name}</span>
              <span className='line'><span className='detailsLabel'>Account Type:</span>{util.toTitleCase(value.accountType)}</span>
              <span className='line'><span className='detailsLabel'>Account Number:</span>{accountNumber}</span>
              <span className='line'><span className='detailsLabel'>Routing Number:</span>{value.routingNumber}</span>
              {value.bankName ? <span className='line'><span className='detailsLabel'>Bank Name:</span>{value.bankName}</span> : <></>}
            </div>
            <div className='column50 right'>
              <span className='line'><span className='detailsLabel'>Status:</span>{status}</span>
            </div>
            <div className='clear'></div>
            {value.notes ?
              <div className='column'>
                <span className='line'><span style={{ display: 'block' }} className='detailsLabel'>Notes:</span><div dangerouslySetInnerHTML={{ __html: value.notes}} /></span>
              </div>
            : <></>}
          </div>
        ;

        // Actions Menu Options
        const deleteDesc= `bank account ${value.name} ${accountNumber}`;
        const options = [];
        options.push(
          <ModalLink className='button' id={'bankForm'} opts={{ id: value.ID, resource: 'orgBankAccount', modalID: 'bankForm' }}>Edit</ModalLink>
        );
        if (value.status === 'pending' && !value.voidCheck) {
          options.push(
            <ModalLink className='button' id={'bankForm'} opts={{ id: value.ID, resource: 'orgBankAccount', modalID: 'bankForm' }}>Upload Void Check or Bank Statement</ModalLink>
          );
        }
        options.push(
          <ModalLink className='button' id={'bankDelete'} opts={{ id: value.ID, resource: 'orgBankAccount', desc: deleteDesc, modalID: 'bankDelete' }}>Delete</ModalLink>
        );

        rows.push([
          { details: details, width: '6%', key: value.ID },
          { value: desc, primary: true },
          { value: <span className={`${util.getValue(types.bankStatus(value.status, value.voidCheck), 'color')}`}>{util.getValue(types.bankStatus(value.status, value.voidCheck), 'name')}</span> },
          { actions: <ActionsMenu
            options={options}
          />
          }
        ]);
      });
    }
    fdata.rows = rows;

    /*
    footer.push(
      { name: <div style={{textAlign: 'right'}}>Totals</div>, colspan: 3 },
      { name: '$1,123.42', colspan: 1}
    );
    fdata.footer = footer;
    */
    return fdata;
  }

  render() {

    //const color = util.hexToRgb('#6cfef7');

    const library = {
      saveMediaType: 'org',
      articleID: null,
      orgID: 185,
      type: 'org',
      borderRadius: 0
    }

    const {
      orgBankAccounts
    } = this.props;

    return (
      <div>
        <h2>Dashboard</h2>
          {/*
      <Table
          name={'orgBankAccounts'}
          data={() => this.formatTableData(orgBankAccounts)}
          exportDisplay='None'
        />
          <MediaLibrary
            handleSaveCallback={this.handleSaveCallback}
            handleSave={util.handleFile}
            library={library}
            closeModalAndCancel={() => console.log('cancel')}
            closeModalAndSave={() => console.log('save')}
            showBtns={'hide'}
            saveLabel={'close'}
            imageEditorOpenCallback={(open) => {
              console.log('execute callback', open)
            }}
          />
          */}

        <Form
          name='testForm'
          options={{
            color: '#ecab1f'
          }}>
          <TestForm {...this.props} />
        </Form>
      {/*
      <Image maxSize={'125px'} url={`https://s3-us-west-1.amazonaws.com/givebox/public/images/backgrounds/raise-fundraiser.png`} size='inherit' alt={`Customers`} />
      <ModalLink id='testModal'>Modal Form</ModalLink>
      <br /><br />
      <ModalLink id='accessDenied'>Access Denied</ModalLink>
      */}
      {/*
        <Tabs
          default='list'
          className='statsTab'
        >
          <Tab className='showOnMobile' id='list' label='List'>
            Tab 1
          </Tab>
          <Tab id='form' label={`Preview`} disabled={true}>
            Tab 2
          </Tab>
        </Tabs>
        <Form name='testForm'>
          <TestForm {...this.props} />
        </Form>
      */}
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const app = util.getValue(state, 'app', {});
  const orgBankAccounts = state.resource.orgBankAccounts ? state.resource.orgBankAccounts : {};

  return {
    orgBankAccounts,
    primaryColor: util.getValue(app, 'primaryColor')
  }
}


export default connect(mapStateToProps, {
  setCustomProp,
  getResource
})(Dashboard)
