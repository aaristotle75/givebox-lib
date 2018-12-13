import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleModal } from '../api/actions';
import { GBLink } from '../';

class ModalLink extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(id, opts) {
    this.props.toggleModal(id, true, opts);
  }

  render() {
    const {
      id,
      className,
      type,
      opts
    } = this.props;
    const component = type === 'li' ? React.createElement("li", {
      className: className,
      onClick: () => this.onClick(id, opts)
    }, this.props.children) : React.createElement(GBLink, {
      className: `${className}`,
      type: "button",
      onClick: () => this.onClick(id, opts)
    }, this.props.children);
    return component;
  }

}

ModalLink.defaultProps = {
  type: 'link',
  className: ''
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  toggleModal
})(ModalLink);