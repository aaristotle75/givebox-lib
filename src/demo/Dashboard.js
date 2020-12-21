import React, { Component } from 'react';
import { connect } from 'react-redux';
import TestForm from './TestForm';
import Form from '../lib/form/Form';
import { setCustomProp } from '../lib/api/actions';
import { getResource } from '../lib/api/helpers';
import CircularProgress from '../lib/common/CircularProgress';
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
        {/*
        <Form
          name='testForm'
          options={{
            color: '#ecab1f'
          }}>
          <TestForm {...this.props} />
        </Form>
        */}
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
