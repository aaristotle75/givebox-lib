import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
  GBLink,
} from '../';
import { setPrefs } from '../api/actions';
import { savePrefs } from '../api/helpers';
import AnimateHeight from 'react-animate-height';
import has from 'has';

class Collapse extends Component {

  constructor(props) {
    super(props);
    this.renderChildren = this.renderChildren.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this);
    this.state = {
      display: this.props.open
    };
  }

  componentDidMount() {
  }

  componentWillUmount() {
  }

  toggleDisplay() {
    const display = this.state.display ? false : true;
    this.setState({ display });
    if (this.props.id) this.props.savePrefs({ [this.props.id]: { open: display } });
  }

  renderChildren() {
    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
      })
    );
    return childrenWithProps;
  }

  render() {

    const {
      style,
      className,
      label,
      iconOpen,
      iconClosed,
      iconPrimary
    } = this.props;

    return (
      <div className={`collapse ${this.state.display ? 'noBorder' : ''} ${className || ''}`} style={style}>
        <GBLink className='sectionLink ripple' onClick={() => this.toggleDisplay()}>
          <span className='sectionText'>
            <span className={`icon icon-${iconPrimary}`}></span>{label}
          </span>
          <span className={`icon icon-${this.state.display ? iconOpen : iconClosed}`}></span>
        </GBLink>
        <AnimateHeight
          duration={500}
          height={this.state.display ? 'auto' : 1}
        >
          {this.props.children}
        </AnimateHeight>
      </div>
    );
  }
}

Collapse.defaultProps = {
  iconPrimary: 'edit',
  iconOpen: 'minus',
  iconClosed: 'plus',
  default: 'open',
  label: 'Collapsible Label'
}

function mapStateToProps(state, props) {

  let open = props.default === 'closed' ? false : true;
  if (props.id) {
    if (has(state, 'preferences')) {
      if (has(state.preferences, props.id)) {
        open = util.getValue(state.preferences[props.id], 'open', props.default || true );
      }
    }
  }

  return {
    open
  }
}

export default connect(mapStateToProps, {
  setPrefs,
  savePrefs
})(Collapse);
