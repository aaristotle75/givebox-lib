import React, {Component} from 'react';
import { connect } from 'react-redux';
import TicketForm from './TicketForm';
import {
  Tab,
  Tabs
} from '../';
import Articles from './Articles';

class HelpDesk extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
  }

  render() {

    return (
      <div id='helpdesk' className='helpdesk'>
        <Tabs
          default='articles'
          className='statsTab'
        >
          <Tab
            className='showOnMobile'
            id='articles'
            label='FAQs'
          >
            <Articles
              {...this.props}
            />
          </Tab>
          <Tab
            className='showOnMobile'
            id='contact'
            label='Contact Support'
          >
            <TicketForm
              {...this.props}
            />
          </Tab>
        </Tabs>
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
