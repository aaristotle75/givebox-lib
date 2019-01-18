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
    if (this.props.onClickCallback) this.props.onClickCallback();
  }

  render() {
    const {
      id,
      className,
      type,
      opts,
      style,
      onMouseEnter,
      onMouseLeave
    } = this.props;
    let component;

    switch (type) {
      case 'li':
        {
          component = React.createElement("li", {
            className: className,
            onClick: () => this.onClick(id, opts)
          }, this.props.children);
          break;
        }

      case 'div':
        {
          component = React.createElement("div", {
            style: style,
            className: `${className}`,
            onClick: () => this.onClick(id, opts)
          }, this.props.children);
          break;
        }

      default:
        {
          component = React.createElement(GBLink, {
            style: style,
            className: `${className}`,
            type: "button",
            onClick: () => this.onClick(id, opts),
            onMouseEnter: onMouseEnter,
            onMouseLeave: onMouseLeave
          }, this.props.children);
          break;
        }
    }

    return component;
  }

}

ModalLink.defaultProps = {
  type: 'link',
  className: '',
  style: {}
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  toggleModal
})(ModalLink);