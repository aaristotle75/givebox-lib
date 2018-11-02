import React, {Component} from 'react';
import { GBLink } from '../';

export default class NoRecords extends Component {

  render() {

    const {
      link,
      label,
      align
    } = this.props;

    return (
      <div className={`noRecords ${align}`}>
        <span className='normalText'>No records found</span>
        {link && <GBLink onClick={link}>{label}</GBLink>}
      </div>
    )
  }
}

NoRecords.defaultProps = {
  align: 'center',
  label: 'Reload'
}
