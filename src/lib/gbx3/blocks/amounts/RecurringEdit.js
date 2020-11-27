import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import GBLink from '../../../common/GBLink';
import Choice from '../../../form/Choice';
import Dropdown from '../../../form/Dropdown';

class RecurringEdit extends Component {

  constructor(props) {
    super(props);
    this.renderRecurringByKind = this.renderRecurringByKind.bind(this);
    this.onChangeIntervals = this.onChangeIntervals.bind(this);
  }

  componentDidMount() {
  }

  onChangeIntervals(name, value) {
    const {
      recurring
    } = this.props;

    const recurringIntervals = util.getValue(recurring, 'recurringIntervals', []);
    if (recurringIntervals.includes(value)) {

    } else {
      const index = recurringIntervals.indexOf(value);
      if (index > -1) recurringIntervals.splice(index, 1);
    }


  }

  renderRecurringByKind() {

    const {
      article,
      kind
    } = this.props;

    switch (kind) {
      case 'membership': {
        const recurring = {
          ...this.props.recurring,
          recurringIntervals: util.getValue(article, 'recurringIntervals', []),
          recurringDefaultInterval: util.getValue(article, 'recurringDefaultInterval')
        };

        const recurringIntervals = util.getValue(recurring, 'recurringIntervals', []);
        const recurringDefaultInterval = util.getValue(recurring, 'recurringDefaultInterval', 'once')

        const recurringOptions = [
          { primaryText: 'One-Time', value: 'once' },
          { primaryText: 'Monthly', value: 'monthly' },
          { primaryText: 'Quarterly', value: 'quarterly' },
          { primaryText: 'Yearly', value: 'annually' }
        ];

        const items = [];

        Object.entries(recurringOptions).forEach(([key, value]) => {

          const isDefault = value.value === recurringDefaultInterval ? true : false;
          const index = recurringIntervals.indexOf(value.value);
          const enabled = index > -1 ? true : false;

          items.push(
            <div key={value.value} style={{ padding: '10px 5px 10px 0' }} className={`amountsEditRow ${enabled ? '' : 'notOnForm'}`}>
              <div style={{ width: '20%' }} className={`column enableField ${isDefault ? 'tooltip' : ''}`}>
                {isDefault ? <span className={`tooltipTop`}><i />To disable option please change the default to a different option.</span> : <></>}
                <Choice
                  className={`link ${enabled ? '' : 'link gray'}`}
                  type={'checkbox'}
                  toggle={true}
                  name={'enabled'}
                  label={value.primaryText}
                  onChange={() => {
                    if (enabled) {
                      if (!isDefault) recurringIntervals.splice(index, 1);
                    } else {
                      if (!recurringIntervals.includes(value.value)) recurringIntervals.push(value.value);
                    }

                    const data = {
                      recurringIntervals
                    };
                    this.props.optionsUpdated('recurring', { ...recurring, recurringIntervals });
                    this.props.updateData(data);
                  }}
                  checked={enabled}
                  value={enabled}
                />
              </div>
              <div className='column' style={{ width: '20%' }}>
                {isDefault ?
                  <span className='defaultAmount tooltip sortable right' style={{ fontSize: 12 }}>
                    Default
                    <span className='tooltipTop'><i />This is the default option selected for the user.</span>
                  </span>
                :
                  <GBLink
                    className={`link ${!enabled ? 'sortable tooltip right' : ''}`}
                    style={{ fontSize: 12 }}
                    onClick={() => {
                      if (!recurringIntervals.includes(value.value)) recurringIntervals.push(value.value);
                      const data = {
                        recurringIntervals,
                        recurringDefaultInterval: value.value
                      };
                      this.props.optionsUpdated('recurring', { ...recurring, recurringIntervals, recurringDefaultInterval });
                      this.props.updateData(data);
                    }}
                  >
                    Set Default
                    {!enabled ? <span className='tooltipTop'><i />Must be enabled to set as the default.</span> : <></>}
                  </GBLink>
                }
              </div>
            </div>
          );
        });


        return (
          <div className='gbx3amountsEdit'>
            <div style={{ padding: '5px 0' }} className='input-group'>
              <label className='label'>Select the Subscription Recurring Options</label>
            </div>
            <div className='amountsEditList'>
              {items}
            </div>
          </div>
        )
      }

      case 'fundraiser':
      case 'invoice': {
        const recurring = { enabled: util.getValue(article, 'allowRecurring', true), ...this.props.recurring };
        return (
          <>
            <Dropdown
              label='Allow Recurring Option'
              fixedLabel={true}
              name='allowRecurring'
              defaultValue={util.getValue(recurring, 'enabled', true) ? 'yes' : 'no'}
              onChange={(name, value) => {
                const allowRecurring = value === 'yes' ? true : false;
                const data = {
                  allowRecurring
                };
                const recurring = this.props.recurring;
                recurring.enabled = allowRecurring;
                this.props.optionsUpdated('recurring', recurring);
                this.props.updateData(data);
              }}
              options={[
                { primaryText: 'Yes', value: 'yes' },
                { primaryText: 'No', value: 'no' }
              ]}
            />
          </>
        )
      }

      default: {
        return (
          <div className='flexCenter error'>No Recurring Options Available.</div>
        )
      }
    }
  }

  render() {

    return this.renderRecurringByKind();
  }
}

RecurringEdit.defaultProps = {
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(RecurringEdit);
