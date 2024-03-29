import React, {Component} from 'react';
import { CSSTransition } from 'react-transition-group';
import { msgs } from '../form/formValidate';
import GBLink from './GBLink';

export class Alert extends Component {

  constructor(props) {
    super(props);
    this.renderAlert = this.renderAlert.bind(this);
    this.close = this.close.bind(this);
    this.state = {
      display: this.props.display ? 'show' : 'hide'
    };
  }

  componentDidMount() {
  }

  componentDidUpdate(nextProps) {
    if (this.props.display !== nextProps.display) {
      this.timeout = setTimeout(() => {
        this.setState({display: this.props.display ? 'show' : 'hide'})
        this.timeout = null;
      }, 0);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  renderAlert(alert, msg) {
    const {
      hideIcon
    } = this.props;

    switch (alert) {
      case 'suspeneded':
        return <Suspended msg={msg} icon={hideIcon ? '' : this.props.iconSuspended} />
      case 'error':
        return <Error msg={msg} icon={hideIcon ? '' : this.props.iconError} />
      case 'success':
        return <Success msg={msg} icon={hideIcon ? '' : this.props.iconSuccess} />
      case 'warning':
        return <Warning msg={msg} icon={hideIcon ? '' : this.props.iconWarning} />
      case 'passive':
        return <Passive msg={msg} icon={hideIcon ? '' : this.props.iconPassive} />

      // no default
    }
  }

  close() {
    this.setState({ display: 'hide' });
    if (this.props.callback) this.props.callback();
  }

  render() {

    const {
      alert,
      msg,
      display,
      closeBtn,
      iconClose,
      style
    } = this.props;

    const showAlert = display && (this.state.display !== 'hide') ? true : false;

    return (
      <CSSTransition
        in={showAlert ? true : false}
        timeout={300}
        classNames='alertMsg'
        unmountOnExit
      >
        <div style={style} className='alertMsg'>
          {closeBtn && <GBLink onClick={this.close} className='close'>{iconClose}</GBLink>}
          {this.renderAlert(alert, msg)}
        </div>
      </CSSTransition>
    )

  }
}

Alert.defaultProps = {
  style: {},
  iconClose: <span className='icon icon-x'></span>,
  iconSuspended: <span className='icon icon-alert-circle'></span>,
  iconError: <span className='icon icon-alert-circle'></span>,
  iconSuccess: <span className='icon icon-check-circle'></span>,
  iconWarning: <span className='icon icon-alert-circle'></span>,
  iconPassive: <span className='icon icon-alert-circle'></span>
}

export const Suspended = ({msg, icon}) => {
  return (
    <div className={`suspeneded`}>
      <span className='msgText'>{icon} {msg || msgs.error}</span>
    </div>
  )
}

export const Error = ({msg, icon}) => {
  return (
    <div className={`error`}>
      <span className='msgText'>{icon} {msg || msgs.error}</span>
    </div>
  )
}

export const Success = ({msg, icon}) => {
  return (
    <div className={`success`}>
      <span className='msgText'>{icon} {msg}</span>
    </div>
  )
}

export const Warning = ({msg, icon}) => {
  return (
    <div className={`warning`}>
      <span className='msgText'>{icon} {msg}</span>
    </div>
  )
}

export const Passive = ({msg, icon}) => {
  return (
    <div className={`passive`}>
      <span className='msgText'>{icon} {msg}</span>
    </div>
  )
}
