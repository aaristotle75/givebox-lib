import React, { Component } from 'react';
import { util, GBLink, types } from '../';
import AnimateHeight from 'react-animate-height';

class Collapse extends Component {

  constructor(props) {
    super(props);
    this.renderChildren = this.renderChildren.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this);
    this.state = {
      display: this.props.defaultCollapse === 'open' ? true : false
    };
  }

  componentDidMount() {
  }

  toggleDisplay() {
    this.setState({ display: this.state.display ? false : true });
  }

  renderChildren() {
    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        ...this.props
      })
    );
    return childrenWithProps;
  }

  render() {

    const {
      collapseStyle,
      collapseClassName,
      collapseLabel,
      iconOpen,
      iconClosed,
      iconPrimary,
      showBorder
    } = this.props;

    return (
      <div className={`collapse ${showBorder ? '' : 'noBorder'} ${collapseClassName || ''}`} style={collapseStyle}>
        <GBLink className='sectionLink' onClick={() => this.toggleDisplay()}>
          <span className='sectionText'>
            <span className={`icon icon-${iconPrimary}`}></span>{collapseLabel}
          </span>
          <span className={`icon icon-${this.state.display ? iconOpen : iconClosed}`}></span>
        </GBLink>
        <AnimateHeight
          duration={500}
          height={this.state.display ? 'auto' : 0}
        >
          {this.renderChildren()}
        </AnimateHeight>
      </div>
    );
  }
}

Collapse.defaultProps = {
  showBorder: false,
  iconPrimary: 'edit',
  iconOpen: 'chevron-down',
  iconClosed: 'chevron-right',
  defaultCollapse: 'open',
  collapseLabel: 'Collapsible Label'
}

export default Collapse;
