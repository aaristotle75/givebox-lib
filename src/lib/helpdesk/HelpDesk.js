import React, {Component} from 'react';
import { connect } from 'react-redux';
import TicketForm from './TicketForm';
import { searchContact } from './zoho';
import {
  Form,
  util,
  Loader
} from '../';

class HelpDesk extends Component {

  constructor(props) {
    super(props);
    this.getContact = this.getContact.bind(this);
    this.state = {
      contact: null,
      loading: true
    };
  }

  componentDidMount() {
    this.getContact('buddyteal333@gmail.com');
    /*
    const script = document.createElement('script');
    var $zoho = {};
    $zoho.salesiq = {
      widgetcode: "9feaee9a13b3e3450e9a46f159fc9103727a1bf286cad49ee766103888a42fbb",
      values: {},
      ready: function() {}
    };
    script.type = "text/javascript";
    script.id = "zsiqscript";
    script.defer = true;
    script.src = "https://salesiq.zoho.com/widget";
    const el = document.getElementById('helpdesk');
    el.prepend(script);
    */
  }

  async getContact(email) {
    const promise = new Promise((resolve, reject) => {
      searchContact(email, (data, error) => {
        this.setState({ contact: data }, resolve(true));
      });
    });

    if (await promise) {
      this.setState({ loading: false });
    }
  }

  render() {

    if (this.state.loading) {
      return <Loader msg='Loading zoho contact...' />
    }

    return (
      <div id='helpdesk' className='helpdesk'>
        HelpDesk
        <div id='zsiqwidget'></div>
        <TicketForm
          contact={this.state.contact}
        />
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
