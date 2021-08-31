import React, {Component} from 'react';
import GBLink from '../common/GBLink';

export default class NoRecords extends Component {

  render() {

    const {
      link,
      label,
      align,
      text
    } = this.props;

    return (
      <div className={`noRecords ${align}`}>
        <span className='normalText'>{text}</span>
        {link && <GBLink onClick={link}>{label}</GBLink>}
      </div>
    )
  }
}

NoRecords.defaultProps = {
  align: 'center',
  label: 'Reload',
  text: 'No Results'
}
