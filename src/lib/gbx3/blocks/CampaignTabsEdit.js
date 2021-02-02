import React, { Component } from 'react';
import { connect } from 'react-redux';

class CampaignTabsEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
  }

  render() {

    const {
    } = this.props;

    const {
    } = this.state;


    return (
      <div className={'campaignTabsEditBlock'}>
        Campaign Tabs Edit
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
})(CampaignTabsEdit);
