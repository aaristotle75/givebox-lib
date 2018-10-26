import React, {Component} from 'react';

export default class NoRecords extends Component {

  render() {

    const {
      link,
      label,
      align
    } = this.props;

    return (
      <div className={`noRecords ${align}`}>
        <span className="normalText">No records found</span>
        {link && <a onClick={link}>{label}</a>}
      </div>
    )
  }
}

NoRecords.defaultProps = {
  align: 'center',
  label: 'Reload'
}
