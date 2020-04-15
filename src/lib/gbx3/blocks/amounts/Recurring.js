import React, {Component} from 'react';
import {
	util,
	TextField,
	Dropdown,
	GBLink
} from '../../../';
import AnimateHeight from 'react-animate-height';
import Moment from 'moment';

class Recurring extends Component {
	constructor(props){
		super(props);
    this.onChangeRecurring = this.onChangeRecurring.bind(this);
		this.getEndDate = this.getEndDate.bind(this);
		this.state = {
			interval: this.props.interval,
      paymentMax: this.props.paymentMax,
			forever: true,
      paymentMaxError: ''
		};
	}

	componentDidMount() {
	}

  onChangeRecurring(name, interval) {
		const forever = interval === 'once' ? true : this.state.forever;
		const paymentMax = interval === 'once' ? '' : this.state.paymentMax;
		this.setState({ forever, paymentMax, interval }, this.props.setRecurring({ interval, paymentMax }));
  }

	recurringName(value) {
    const obj = {};
		switch (value) {
      case 'once':
        obj.name = 'One-time';
        obj.alt = 'Once';
				obj.alt2 = 'once';
        break;
			case 'monthly':
				obj.name = 'Monthly';
        obj.alt = 'Months';
				obj.alt2 = 'month';
				break;
			case 'quarterly':
				obj.name = 'Quarterly';
        obj.alt = 'Quarters';
				obj.alt2 = 'quarter';
				obj.short = '';
				break;
			case 'annually':
				obj.name = 'Yearly';
        obj.alt = 'Years';
				obj.alt2 = 'year';
				break;
			default:
				break;
		}
		return obj;
	}

	getEndDate(interval, value) {
		const dateFormat = 'MMMM YYYY';
		let endsAt = null;
		if (value) {
			switch (interval) {
				case 'monthly':
					endsAt = Moment().add(value, 'month').endOf('month').format(dateFormat);
					break;
				case 'quarterly':
					endsAt = Moment().add(value, 'quarter').endOf('month').format(dateFormat);
					break;
				case 'annually':
					endsAt = Moment().add(value, 'year').endOf('month').format(dateFormat);
					break;

					// no default
			}
		}
		return endsAt;
	}

  render() {

		const {
			amount,
			recurringText,
			typeText
		} = this.props;

    const {
      interval,
			paymentMax
    } = this.state;

    return (
      <>
        <div className='recurring'>
					<div className='recurringTop'>
						<h3>Customize Your Recurring {util.toTitleCase(this.props.topText)}</h3>
					</div>
					<div className='amount'>
						{util.money(amount)}
					</div>
          {recurringText}
          <Dropdown
            className='dropdown-button'
            style={{width: '210px' }}
            name='interval'
            defaultValue={interval}
						color={this.props.color}
            onChange={this.onChangeRecurring}
            options={[
              {
                primaryText: 'One-Time',
                value: 'once'
              },
              {
                primaryText: 'Monthly',
                value: 'monthly'
              },
              {
                primaryText: 'Quarterly',
                value: 'quarterly'
              },
              {
                primaryText: 'Yearly',
                value: 'annually'
              }
            ]}
          />
          <AnimateHeight
            duration={500}
            height={interval !== 'once' ? 'auto' : 0}
          >
            <div className='maxRecurring'>
              How many {this.recurringName(interval).alt.toLowerCase()} would you like to {typeText} this amount?
              <TextField
                style={{width: '210px' }}
								inputStyle={{ textAlign: 'center' }}
                label=''
                fixedLabel={false}
                placeholder={`Enter # of ${util.toTitleCase(this.recurringName(interval).alt)}`}
                name='paymentMax'
                value={paymentMax}
                onChange={(e) => {
                  const value = isNaN(e.currentTarget.value) ? '' : parseInt(e.currentTarget.value);
									const paymentMax = value || '';
									this.setState({ paymentMax, forever: value ? false : true });
									this.props.setRecurring({ paymentMax });
                }}
                maxLength={2}
								color={this.props.color}
              />
		          <AnimateHeight
		            duration={500}
		            height={paymentMax ? 'auto' : 0}
		          >
								<div className='endsAt'>
									<span>Your {this.props.topText} will end {this.getEndDate(interval, paymentMax)}</span>
								</div>
          		</AnimateHeight>
		          <AnimateHeight
		            duration={500}
		            height={!paymentMax ? 'auto' : 0}
		          >
								<div className='forever'>
									Leave blank, if you want to {typeText} every {this.recurringName(interval).alt2} ongoing until canceled.
								</div>
          		</AnimateHeight>
            </div>
          </AnimateHeight>
					<div className='recurringBottom'>
						<div className="button-group">
		    		  <GBLink
								allowCustom={true}
								className='button'
		    				onClick={() => this.props.onCloseRecurringOptions(this.props.modalID)}
		    		  >Close & Checkout</GBLink>
						</div>
					</div>
        </div>
      </>
    )
  }
}

export default Recurring;


export const renderRecurringName = (kind, interval, max = null) => {
	let name = 'One-Time Donation';
	switch (interval) {
		case 'monthly':
			name = `Monthly Donation ${max ? `for ${max} Month${max > 1 ? 's' : ''}` : ''}`;
			break;
		case 'quarterly':
			name = `Quarterly Donation ${max ? `for ${max} Quarter${max > 1 ? 's' : ''}`: ''}`;
			break;
		case 'annually':
			name = `Yearly Donation ${max ? `for ${max} Year${max > 1 ? 's' : ''}` : ''}`;
			break;

		// no default
	}
	return name;
}
