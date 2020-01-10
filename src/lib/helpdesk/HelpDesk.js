import React, {Component} from 'react';
import { connect } from 'react-redux';
import TicketForm from './TicketForm';
import { searchContacts } from './zoho';
import {
  Form
} from '../';

class HelpDesk extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    return (
      <div className='helpdesk'>
        HelpDesk
        <TicketForm />
      </div>
    )
  }
}

HelpDesk.defaultProps = {
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(HelpDesk);
