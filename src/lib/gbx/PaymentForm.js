import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util
} from '../';

class PaymentForm extends Component {

  render() {

    return (
      <div>
        <h2>Payment Form</h2>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(PaymentForm);
