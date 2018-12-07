import React, {Component} from 'react';
import { connect } from 'react-redux';
import { toggleModal } from '../api/actions';
import { GBLink } from '../';

class ModalLink extends Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(id) {
    this.props.toggleModal(id, true);
  }

  render() {

    const {
      id,
      className,
      type
    } = this.props;

    const component =
      type === 'li' ?
      <li className={className} onClick={() => this.onClick(id)}>{this.props.children}</li>
      :
      <GBLink className={`${type} ${className}`} type='button' onClick={() => this.onClick(id)}>
        {this.props.children}
      </GBLink>
    ;

    return (
      component
    )
  }
}

ModalLink.defaultProps = {
  type: 'link'
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(ModalLink)
