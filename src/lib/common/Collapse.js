import React, { Component } from 'react';
import { util, GBLink, types } from '../';
import AnimateHeight from 'react-animate-height';

class Collapse extends Component {

  constructor(props) {
    super(props);
    this.renderChildren = this.renderChildren.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this);
    this.state = {
      display: this.props.default === 'open' ? true : false
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
      cstyle,
      cclassName,
      clabel,
      iconopen,
      iconclosed,
      iconprimary
    } = this.props;

    return (
      <div className={`collapse ${this.state.display ? 'noBorder' : ''} ${cclassName || ''}`} style={cstyle}>
        <GBLink className='sectionLink' onClick={() => this.toggleDisplay()}>
          <span className='sectionText'>
            <span className={`icon icon-${iconprimary}`}></span>{clabel}
          </span>
          <span className={`icon icon-${this.state.display ? iconopen : iconclosed}`}></span>
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
  iconprimary: 'edit',
  iconopen: 'chevron-down',
  iconclosed: 'chevron-right',
  default: 'open',
  clabel: 'Collapsible Label'
}

export default Collapse;
