import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
	_v,
	ModalLink,
	ModalRoute,
	toggleModal,
	Choice,
	Portal,
	Dropdown
} from '../../../';
import '../../../styles/gbx3amounts.scss';

class TicketsList extends Component {

  constructor(props) {
    super(props);
		this.renderAmounts = this.renderAmounts.bind(this);
		this.handleAmountChanges = this.handleAmountChanges.bind(this);
		this.setAmounts = this.setAmounts.bind(this);
		this.onChangeQty = this.onChangeQty.bind(this);
    this.state = {
    };
		this.amountInputRef = React.createRef();
  }

	componentDidMount() {
	}

	setAmounts(amount) {
		const amountEntered = _v.formatNumber(amount);
		const amountForAPI =  util.formatMoneyForAPI(amount);
		this.setState({ amountEntered, amountForAPI });
	}

	handleAmountChanges() {
		const obj = {
			amount: this.state.amountAPIValue
		};
		this.props.amountsCallback(obj);
	}

	onChangeQty(name, value) {
		console.log('execute onChangeQty', name, value);
	}

	renderAmounts() {
		const {
			list
		} = this.props;

		const items = [];

		const options = [];
		const dropdownRefs = {};

		if (!util.isEmpty(list)) {
			Object.entries(list).forEach(([key, value]) => {
				if (value.enabled) {
					dropdownRefs[value.ID] = React.createRef();
					items.push(
						<div key={key} className='amountRow ticketAmountRow'>
							<div className='ticketDesc'>
								{value.name}
							</div>
							<div className='amountQty' ref={dropdownRefs[value.ID]}>
								<Dropdown
									dropRef={dropdownRefs[value.ID]}
									portalID={`amountQty-dropdown-portal-${value.ID}`}
									portal={false}
				          className='dropdown-button'
				          style={{width: '100%' }}
				          name='unitQty'
				          defaultValue={0}
									color={this.props.color}
				          onChange={this.onChangeQty}
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
							</div>
						</div>
					);
				}
			});
		}

		return (
			<>
				<div className='amountsList'>{items}</div>
			</>
		)
	}

  render() {

		const {
			embed,
			buttonEnabled
		} = this.props;

		const height = embed && !buttonEnabled ? `${this.props.height}px` : 'auto';

    return (
			<div className={`${embed ? 'embed' : ''}`}>
	      <div style={{ height: height }} className='amountsSection'>
					{this.renderAmounts()}
	      </div>
			</div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
	toggleModal
})(TicketsList);
