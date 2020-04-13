import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
	GBLink,
	ModalRoute,
	toggleModal
} from '../../../';

class AmountsEdit extends Component {

  constructor(props) {
    super(props);

    this.state = {
			amounts: []
    };
  }

	componentDidMount() {
	}

  render() {

    return (
      <div className='amountsEdit'>
				<h3>Edit Amounts</h3>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
	toggleModal
})(AmountsEdit);
