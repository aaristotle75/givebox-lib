import React from 'react';
import { connect } from 'react-redux';
import Choice from '../form/Choice';
import ModalLink from '../modal/ModalLink';
import ModalRoute from '../modal/ModalRoute';
import Terms from './Terms';
import { toggleModal } from '../api/actions';

class AcceptTerms extends React.Component {

  constructor(props) {
    super(props);
    this.onChangeAcceptTerms = this.onChangeAcceptTerms.bind(this);
    this.acceptTerms = this.acceptTerms.bind(this);
    const checked = props.checked;
    this.state = {
      checked,
      value: checked
    };
  }

  componentDidMount() {
  }

  acceptTerms() {
    this.props.toggleModal('readTerms', false);
    this.setState({ checked: true, value: true });
    if (this.props.onChange) this.props.onChange(true);
  }

  onChangeAcceptTerms(name, value) {
    const checked = this.state.checked ? false : true;
    this.setState({ checked, value: checked });
    if (this.props.onChange) this.props.onChange(checked);
  }

  render() {

    const {
      checked,
      value
    } = this.state;

    const {
      error,
      errorMsg
    } = this.props;

    return (
      <>
        <ModalRoute id='readTerms' component={(props) => <Terms {...props} />  } effect='3DFlipVert' style={{ width: '60%'}} />
        <div style={{ marginTop: 20 }} className='flexBetween'>
          <Choice
            name={'acceptTerms'}
            label='I Agree to Givebox Terms of Service'
            checked={checked}
            value={value}
            onChange={this.onChangeAcceptTerms}
            error={error ? errorMsg : false}
          />
          <ModalLink id='readTerms' className='link terms' opts={{ closeCallback: this.acceptTerms }}>Read Agreement <span className='icon icon-chevron-right'></span></ModalLink>
        </div>
      </>
    )
  }
}

AcceptTerms.defaultProps = {
  errorMsg: 'You must agree to Givebox Terms of Service to continue.'
};

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(AcceptTerms);
