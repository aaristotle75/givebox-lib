import React, {Component} from 'react';
import { zohoCats } from './zohoCats';
import * as util from '../common/utility';
import GBLink from '../common/GBLink';

export default class Breadcrumbs extends Component {

  constructor(props) {
    super(props);
    this.renderBreadcrumbs = this.renderBreadcrumbs.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  renderBreadcrumbs() {
    const items = [];
    if (this.props.category && !this.props.searchValue) {
      const category = util.getValue(zohoCats, this.props.category);
      if (util.getValue(category, 'parent')) {
        const parent = util.getValue(zohoCats, category.parent);
        items.push(
          <li key={'parent'}>
            <GBLink onClick={() => this.props.setCategory(category.parent)}>{util.getValue(parent, 'name')}<span className='spacer'>/</span></GBLink>
          </li>
        );
      }
      items.push(
        <li key={'current'}>
          <GBLink onClick={() => this.props.setCategory(this.props.category)}>{util.getValue(category, 'name')}</GBLink>
        </li>
      );
    } else if (this.props.searchValue) {
      items.push(
        <li key={'current'}>
          Search results for "{this.props.searchValue}"
        </li>
      );
    }

    return (
      <ul className='breadcrumbs'>
        <li><GBLink onClick={() => this.props.setCategory()}>Givebox FAQs<span className='spacer'>/</span></GBLink></li>
        {items}
      </ul>
    );
  }

  render() {

    return this.renderBreadcrumbs()
  }
}

Breadcrumbs.defaultProps = {
  category: ''
}
