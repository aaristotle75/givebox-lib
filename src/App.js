import React, {Component} from 'react';
import { Form } from './lib';
import TestForm from './TestForm';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      mobile: window.innerWidth < props.mobileBreakpoint ? true : false
    }
  }

  render() {

    return (
      <div className={this.state.mobile ? 'mobile' : 'desktop'}>
        <div id="app-root">
          <Form
            name="testForm"
            defaults={{
              required: false
            }}
          >
            <TestForm />
          </Form>
        </div>
        <div id="modal-root"></div>
      </div>
    )
  }
}

App.defaultProps = {
  mobileBreakpoint: 1000
}
