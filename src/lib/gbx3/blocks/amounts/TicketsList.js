import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	_v,
	toggleModal,
	GBLink,
	Dropdown
} from '../../../';
import '../../../styles/gbx3amounts.scss';
import AnimateHeight from 'react-animate-height';

class TicketsList extends Component {

	constructor(props) {
		super(props);
		this.renderAmounts = this.renderAmounts.bind(this);
		this.handleAmountChanges = this.handleAmountChanges.bind(this);
		this.setAmounts = this.setAmounts.bind(this);
		this.onChangeQty = this.onChangeQty.bind(this);
		this.toggleShowDetails = this.toggleShowDetails.bind(this);
		this.state = {
			ticketsSelected: [],
			showDetails: []
		};
		this.amountInputRef = React.createRef();
	}

	componentDidMount() {
	}

	toggleShowDetails(id) {
		const showDetails = this.state.showDetails;
		const index = showDetails.findIndex((el) => {
			return el === id;
		});
		if (index === -1) showDetails.push(id);
		else showDetails.splice(index, 1);
		this.setState({ showDetails });
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

	onChangeQty(name, value, ticket) {
		const ticketsSelected = this.state.ticketsSelected;
		const index = ticketsSelected.findIndex(x => x.ID === ticket.ID);
		const qty = parseInt(value);
		if (index === -1 && qty > 0) {
			ticketsSelected.push({
				ticket,
				qty,
				ID: ticket.ID
			});
		} else {
			if (qty > 0) ticketsSelected[index] = { ...ticketsSelected[index], qty };
			else ticketsSelected.splice(index, 1);
		}
		this.setState({ ticketsSelected });
	}

	renderAmounts() {
		const {
			amountsList,
			article
		} = this.props;

		const {
			ticketsSelected,
			showDetails
		} = this.state;

		const items = [];

		const options = [];
		for ( let i = 0; i < util.getValue(article, 'maxQuantity', 1); i++) {
			options.push({
				primaryText: i === 0 ? 'None' : i,
				value: i
			});
		}

		if (!util.isEmpty(amountsList)) {
			Object.entries(amountsList).forEach(([key, value]) => {
				if (value.enabled) {
					const index = ticketsSelected.findIndex(x => x.ID === value.ID);
					const selected = util.getValue(ticketsSelected, index, {});
					const qty = util.getValue(selected, 'qty', 0);
					items.push(
						<div key={key} className='ticketAmountRow'>
							<div className='ticketDescRow'>
								<div className='ticketDesc'>
									{value.name}
									<span className='ticketDescAmount'>{util.money(value.price/100)}</span>
									{value.description ? <GBLink allowCustom={true} className='link ticketShowDetailsLink' onClick={() => this.toggleShowDetails(value.ID)}>{showDetails.includes(value.ID) ? 'Hide Info' : 'Show Info'}</GBLink> : <></>}
								</div>
								<div className='ticketQty'>
									<Dropdown
										portalID={`amountQty-dropdown-portal-${value.ID}`}
										portal={true}
										className='dropdown-quantity'
										contentWidth={100}
										name='unitQty'
										defaultValue={qty}
										color={this.props.color}
										onChange={(name, val) => this.onChangeQty(name, val, value)}
										options={options}
										selectLabel={0}
										value={qty}
									/>
								</div>
							</div>
							<AnimateHeight
								duration={200}
								height={showDetails.includes(value.ID) ? 'auto' : 0}
							>
								<div className='ticketDetails'>
									<div className='ticketDetailsContainer' dangerouslySetInnerHTML={{ __html: value.description }} />
								</div>
							</AnimateHeight>
						</div>
					);
				}
			});
		}

		return (
			<div className='ticketsList'>
				{items}
			</div>
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
