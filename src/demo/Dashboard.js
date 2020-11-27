import React, { Component } from 'react';
import { connect } from 'react-redux';
import TestForm from './TestForm';
import Form from '../lib/form/Form';
import { setCustomProp } from '../lib/api/actions';
import { getResource } from '../lib/api/helpers';
import has from 'has';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  render() {

    return (
      <div>
        <h2>Dashboard</h2>
        <Form
          name='testForm'
          options={{
            color: '#ecab1f'
          }}>
          <TestForm {...this.props} />
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}


export default connect(mapStateToProps, {
  setCustomProp,
  getResource
})(Dashboard)
