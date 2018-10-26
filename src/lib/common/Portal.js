import React, {Component} from 'react';
import ReactDOM from 'react-dom';


export default class Portal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.el.classList.add(props.className);
  }

  componentDidMount() {
    this.props.rootEl.appendChild(this.el);
  }

  componentWillUnmount() {
    this.props.rootEl.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

Portal.defaultProps = {
  className: 'portal'
}
