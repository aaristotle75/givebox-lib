import React, {Component} from 'react';
import { connect } from 'react-redux';
import TicketForm from './TicketForm';

class HelpDesk extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
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

  render() {

    return (
      <div id='helpdesk' className='helpdesk'>
        HelpDesk
        <div id='zsiqwidget'></div>
        <TicketForm
          {...this.props}
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
