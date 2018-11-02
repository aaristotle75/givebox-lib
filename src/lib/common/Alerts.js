import React, {Component} from 'react';
import { CSSTransition } from 'react-transition-group';
import { msgs } from '../form/formValidate';

export class Alert extends Component {

  constructor(props) {
    super(props);
    this.renderAlert = this.renderAlert.bind(this);
  }

  componentDidMount() {
  }

  renderAlert(alert, msg) {
    switch (alert) {
      case 'error':
        return <Error msg={msg} />
      case 'success':
        return <Success msg={msg} />

      // no default
    }
  }

  render() {

    const {
      alert,
      msg
    } = this.props;

    return (
      <CSSTransition
        in={msg ? true : false}
        timeout={300}
        classNames='alertMsg'
        unmountOnExit
      >
        <div className='alertMsg'>
          {this.renderAlert(alert, msg)}
        </div>
      </CSSTransition>
    )

  }
}

export const Error = ({msg}) => {
  return (
    <div className={`error`}>
      <span className='msgText'><span className='icon icon-error-circle'></span> {typeof msg === 'string' ? msg : msgs.error}</span>
    </div>
  )
}

export const Success = ({msg}) => {
  return (
    <div className={`success`}>
      <span className='msgText'><span className='icon icon-checkmark-circle'></span> {typeof msg === 'string' ? msg : msgs.success}</span>
    </div>
  )
}
