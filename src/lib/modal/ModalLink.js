import React, {Component} from 'react';
import { connect } from 'react-redux';
import { toggleModal } from '../api/actions';
import { GBLink } from '../';

class ModalLink extends Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    if (this.props.modalState === 'open') {
      this.props.toggleModal(this.props.id, true, this.props.opts);
      if (this.props.onOpenCallback) this.props.onOpenCallback();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.modalState !== this.props.modalState) {
      this.props.toggleModal(this.props.id, this.props.modalState === 'open' ? true : false, this.props.opts);
      if (this.props.onOpenCallback) this.props.onOpenCallback();
    }
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
      onMouseLeave,
			allowCustom
    } = this.props;

    let component;
    switch(type) {
      case 'li' : {
        component = <li className={className} onClick={() => this.onClick(id, opts)}>{this.props.children}</li>;
        break;
      }
      case 'div': {
        component =
          <div style={style} className={`${className}`} onClick={() => this.onClick(id, opts)}>
            {this.props.children}
          </div>
        break;
      }
      default: {
        component =
          <GBLink allowCustom={allowCustom} style={style} className={`${className}`} type='button' onClick={() => this.onClick(id, opts)} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {this.props.children}
          </GBLink>
        ;
        break;
      }
    }

    return (
      component
    )
  }
}

ModalLink.defaultProps = {
  type: 'link',
  className: '',
  style: {},
  modalState: 'closed',
	allowCustom: false
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(ModalLink)
