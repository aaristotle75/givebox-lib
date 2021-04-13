import React from 'react';
import { connect } from 'react-redux';
import PostSignupMenu from '../../signup/PostSignupMenu';

class HelperMenuPanel extends React.Component {

  constructor(props) {
    super(props);
    this.renderPanel = this.renderPanel.bind(this);
    this.state = {
      panel: 'postSignup'
    };
  }

  componentDidMount() {
  }

  renderPanel() {
    const {
      panel
    } = this.state;

    switch (panel) {

      case 'postSignup':
      default: {
        return (
          <PostSignupMenu blockType={'org'} />
        )
      }
    }
  }

  render() {

    const {
    } = this.props;

    return this.renderPanel();
  }
}

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
})(HelperMenuPanel);
