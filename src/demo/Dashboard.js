import React, { Component } from 'react';
import TestForm from './TestForm';
import { Form, Alert, Tabs, Tab, ModalLink, GBLink } from '../lib';

export default class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.status = this.status.bind(this);
    this.toggleModalState = this.toggleModalState.bind(this);
    this.state = {
      msg: '',
      display: false,
      modalState: 'closed'
    };
  }

  componentDidMount() {
    this.status();
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

  render() {

    return (
      <div>
      <GBLink onClick={() => this.toggleModalState()}>Toggle Modal</GBLink>
      <ModalLink modalState={this.state.modalState} id='accessDenied'>Access Denied</ModalLink>
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
          <TestForm />
        </Form>
      </div>
    )
  }
}
