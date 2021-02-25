import React from 'react';
import * as util from './utility';
import GBLink from './GBLink';
import Fade from './Fade';

export default class ScrollTo extends React.Component {

  constructor(props) {
    super(props);
    this.getScrolled = this.getScrolled.bind(this);
    this.state = {
      display: false
    };
  }

  componentDidMount() {
    const {
      elementID
    } = this.props;

    const el = document.getElementById(elementID);
    if (el) el.addEventListener('scroll', this.getScrolled);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.elementID !== this.props.elementID) {
      const prevEl = document.getElementById(prevProps.elementID);
      const el = document.getElementById(this.props.elementID);

      if (prevEl) prevEl.removeEventListener('scroll', this.getScrolled);
      if (el) el.addEventListener('scroll', this.getScrolled);
    }
  }

  getScrolled() {
    const {
      display
    } = this.state;

    const breakpoint = 200;
    const el = document.getElementById(this.props.elementID);
    let scrollTop = 0;
    if (el) scrollTop = el.scrollTop;
    if (scrollTop > breakpoint) {
      this.setState({ display: true });
    } else if (display && scrollTop <= breakpoint) {
      this.setState({ display: false });
    }
  }

  render() {

    const {
      elementID
    } = this.props;

    return (
      <Fade
        duration={500}
        in={this.state.display}
      >
        <GBLink onClick={() => util.toTop(elementID)} className='toTop'><span className='icon icon-chevrons-up'></span></GBLink>
      </Fade>
    )
  }
}
