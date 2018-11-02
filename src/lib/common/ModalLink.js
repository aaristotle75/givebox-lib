import React, {Component} from 'react';
import { connect } from 'react-redux';
import { toggleModal } from '../redux/actions';
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
      id
    } = this.props;

    return (
      <GBLink className='link' type='button' onClick={() => this.onClick(id)}>
        {this.props.children}
      </GBLink>
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
