import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
	util,
	Loader,
	GBLink,
	Image
} from '../../';
import {
	getResource
} from '../../api/helpers';
import {
	toggleModal
} from '../../api/actions';


class CheckoutDonationSelect extends Component {
	constructor(props){
		super(props);
		this.renderDonationForms = this.renderDonationForms.bind(this);
		this.createFundraiserSelect = this.createFundraiserSelect.bind(this);
		this.selectDonationForm = this.selectDonationForm.bind(this);
		this.state = {
			loading: false
		};
	}

	componentDidMount() {
		this.props.getResource('orgFundraisers', {
			customName: 'checkoutDonationForms',
			orgID: this.props.orgID
		});
	}

	createFundraiserSelect() {
		console.log('execute handle create fundraiser select');
	}

	selectDonationForm(ID) {
		const {
			orgID,
			checkoutDonationFormID
		} = this.props;

		if (checkoutDonationFormID !== ID) {
			this.setState({ loading: true });
			this.props.getResource('orgFundraiser', {
				id: [ID],
				orgID,
				reload: true,
				callback: (res, err) => {
					if (!util.isEmpty(res) && !err) {
						const amounts = util.getValue(res, 'amounts.list', []);
						const amountIndexCustom = util.getValue(res, 'amountIndexCustom', 0);
						const customAmount = util.getValue(amounts, amountIndexCustom, {});
						const checkoutAmountID = util.getValue(customAmount, 'ID');

						this.props.updateMulti({
							checkoutAmountID,
							checkoutDonationFormID: ID,
							checkoutDonationArticleID: util.getValue(res, 'articleID'),
							checkoutDonationFormTitle: util.getValue(res, 'title'),
							checkoutDonationImageURL: util.getValue(res, 'imageURL')
						}, () => {
							this.props.toggleModal('checkoutDonationSelect', false);
						});
					}
					this.setState({ loading: false });
				}
			});
		} else {
			this.props.toggleModal('checkoutDonationSelect', false);
		}
	}

	renderDonationForms() {
		const {
			checkoutDonationFormID
		} = this.props;

		const items = []
		const donationForms = util.getValue(this.props.donationForms, 'data', {});
		Object.entries(donationForms).forEach(([key, value]) => {
			items.push(
				<li onClick={() => this.selectDonationForm(value.ID, value.title)} key={key}>
					<div className='thumbnail'><Image url={value.imageURL} size={'thumb'} title={value.title} maxSize={40} /></div>
					<div className='title'>
						{value.title}
						{checkoutDonationFormID && checkoutDonationFormID === value.ID ? <span className='selected' style={{ fontSize: 14, display: 'block' }}>Selected Donation Form</span> : '' }
					</div>
					<div className='selectDonationForm'>SELECT</div>
				</li>
			);
		})

		return (
			!util.isEmpty(items) ?
				<ul>{items}</ul>
			:
				<div style={{ fontSize: 14 }} className='center noRecords'>You must have at least one donation form to use this feature.</div>
		);
	}

	render() {

		if (util.isLoading(this.props.donationForms)) return <Loader msg='Load Donation List' />

		return (
			<div className='modalWrapper'>
				{ this.state.loading ? <Loader msg='Selecting Donation Form...' /> : ''}
				<h2 style={{ marginBottom: 20 }} className='center'>Select Donation Form</h2>
				<div className='formSectionContainer'>
					<div className='formSection'>
						<div className='checkoutDonationSelect'>
							{this.renderDonationForms()}
						</div>
					</div>
				</div>
			</div>
		)
	}
};

CheckoutDonationSelect.defaultProps = {
}

function mapStateToProps(state, props) {

	const donationForms = util.getValue(state, 'resource.checkoutDonationForms', {});

	return {
		donationForms
	}
}

export default connect(mapStateToProps, {
	getResource,
	toggleModal
})(CheckoutDonationSelect);
