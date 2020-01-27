import React, {Component} from 'react';
import { connect } from 'react-redux';
import TicketForm from './TicketForm';
import {
  Tab,
  Tabs,
  GBLink
} from '../';
import Articles from './Articles';

class HelpDesk extends Component {

  constructor(props) {
    super(props);
    this.closeHelpDesk = this.closeHelpDesk.bind(this);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
  }

  closeHelpDesk() {
    if (this.props.closeHelpDeskCb) this.props.closeHelpDeskCb();
  }

  render() {

    return (
      <div id='helpdesk' className='helpdesk'>
        <Tabs
          default='articles'
          className='statsTab'
          intro={
            <div className='helpDeskClose'>
              <GBLink onClick={this.closeHelpDesk}><span className='icon icon-x'></span></GBLink>
            </div>
          }
        >
          <Tab
            className='showOnMobile'
            id='articles'
            label='Givebox FAQs'
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
  scrollHeight: '400px'
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(HelpDesk);
