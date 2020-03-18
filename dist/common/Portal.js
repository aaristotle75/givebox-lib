import { Component } from 'react';
import ReactDOM from 'react-dom';
export default class Portal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.el.setAttribute('id', this.props.id);

    if (props.className) {
      const array = props.className.split(' ');
      array.forEach(value => {
        if (value) this.el.classList.add(value);
      });
    }
  }

  componentDidMount() {
    this.props.rootEl.appendChild(this.el);
  }

  componentWillUnmount() {
    this.props.rootEl.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }

}
Portal.defaultProps = {
  className: 'portal'
};