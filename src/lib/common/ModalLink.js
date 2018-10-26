import React, {Component} from 'react';
import { connect } from 'react-redux';
import {toggleModal} from "./actions";

class ModalLink extends Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onClick(id) {
    this.props.toggleModal(id, true);
  }

  render() {

    const {
      id
    } = this.props;

    return (
      <a onClick={() => this.onClick(id)}>
        {this.props.children}
      </a>
    )
  }
}

function mapStateToProps(state) {
  return {
  }
}


export default connect(mapStateToProps, {
  toggleModal
})(ModalLink)
