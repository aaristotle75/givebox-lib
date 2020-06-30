import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
	util,
	updateCart,
	types,
	GBLink,
	resetConfirmation
} from '../../';
import {
	FacebookShareButton,
	TwitterShareButton,
	PinterestShareButton,
	LinkedinShareButton
} from 'react-share';

const GBX_SHARE = process.env.REACT_APP_GBX_SHARE;

class Confirmation extends Component {

	constructor(props) {
		super(props);
		this.renderPaymethodText = this.renderPaymethodText.bind(this);
		this.state = {
		};
	}

	componentDidMount() {
	}

	componentWillUnmount() {
		this.props.resetConfirmation();
	}

	renderPaymethodText() {
		const {
			paymethod,
			email,
			bankName,
			cardType,
			descriptor,
			cartTotal
		} = this.props;

		const item = [];

		item.push(
			<span key={'receiptEmailed'} className='group'>
				<span className='icon icon-check'></span>
				<span className='inlineText'>An email receipt has been sent to <strong>{email}</strong>.</span>
			</span>
		);
		switch (paymethod) {
			case 'echeck': {
				item.push(
					<span key={paymethod}>
						<span className='group'>
							<span className='icon icon-check'></span>
							<span className='inlineText'>Your <strong>{bankName}</strong> bank account has been charged in the amount of <strong>{util.money(cartTotal)}</strong>.</span>
						</span>
						<span className='group'>
							<span className='icon icon-check'></span>
							<span className='inlineText'>The charge will show in your bank statement with the description {descriptor}.</span>
						</span>
					</span>
				);
				break;
			}

			case 'creditcard':
			case 'applepay':
			default: {
				item.push(
					<span key={paymethod}>
						<span className='group'>
							<span className='icon icon-check'></span>
							<span className='inlineText'>Your <strong>{cardType}</strong> card has been charged in the amount of <strong>{util.money(cartTotal)}</strong>.</span>
						</span>
						<span className='group'>
							<span className='icon icon-check'></span>
							<span className='inlineText'>The charge will show up in your credit card or bank statement with the description <strong>GBX*{descriptor}</strong>.</span>
						</span>
					</span>
				);
				break;
			}
		}

		item.push(
			<span key={'thankyou'} className='group'>
				<span className='icon icon-check'></span>
				<span className='inlineText'>Thank you for your support!</span>
			</span>
		);

		return (
			<div className='successfulText'>
				{item}
			</div>
		)
	}

	render() {

		const {
			data: article,
			allowSharing,
			primaryColor,
			firstname
		} = this.props;

		const shareLink = `${GBX_SHARE}/${util.getValue(article, 'articleID')}`;
		const title = util.getValue(article, 'title');
		const image = util.imageUrlWithStyle(article.imageURL, 'medium');
		const description = util.getValue(article, 'summary');
		const shareIconSize = 35;

		return (
			<div className='modalWrapper confirmation'>
				<div className='successfulText'>
					<span className='titleText' style={{ color: primaryColor }}>
						<span className='icon icon-check-circle'></span>
						{firstname}, your transaction has been processed successfully!
					</span>
				</div>
				{this.renderPaymethodText()}
				{ allowSharing ?
				<div className='share'>
					<div className='subText'>
						{firstname}, please help us grow our community by sharing below.
					</div>
					<ul className="center">
						<li>
							<FacebookShareButton
								url={shareLink}
								quote={title}
								onShareWindowClose={() => this.linkClicked('facebook')}
							>
								{types.socialIcons('facebook', shareIconSize)}
							</FacebookShareButton>
						</li>
						<li>
							<TwitterShareButton
								url={shareLink}
								title={title}
								onShareWindowClose={() => this.linkClicked('twitter')}
							>
								{types.socialIcons('twitter', shareIconSize)}
							</TwitterShareButton>
						</li>
						{image ?
						<li>
							<PinterestShareButton
								url={shareLink}
								media={image}
								windowWidth={700}
								windowHeight={600}
								onShareWindowClose={() => this.linkClicked('pinterest')}
							>
								{types.socialIcons('pinterest', shareIconSize)}
							</PinterestShareButton>
						</li> : ''}
						<li>
							<LinkedinShareButton
								url={shareLink}
								title={title}
								description={description}
								onShareWindowClose={() => this.linkClicked('linkedin')}
							>
								{types.socialIcons('linkedin', shareIconSize)}
							</LinkedinShareButton>
						</li>
					</ul>
				</div> : <></> }
				<div className='successfulText'>
					<div className='subText'>
						<span style={{ marginBottom: 20 }} className='line'>Have a Nonprofit or know someone who does?</span>
						<GBLink
							className='button'
							customColor={primaryColor}
							allowCustom={true}
							solidColor={true}
							onClick={() => window.open('https://www.givebox.com')}
						>
							Learn About Givebox
						</GBLink>
					</div>
				</div>
			</div>
		)
	}
};

function mapStateToProps(state, props) {
	const gbx3 = util.getValue(state, 'gbx3', {});
	const confirmation = util.getValue(gbx3, 'confirmation', {});
	const blocks = util.getValue(gbx3, 'blocks', {});
	const paymentFormBlock = util.getValue(blocks, 'paymentForm', {});
	const paymentFormOptions = util.getValue(paymentFormBlock, 'options', {});
	const form = util.getValue(paymentFormOptions, 'form', {});
	const allowSharing = util.getValue(form, 'allowSharing');
	const firstname = util.getValue(confirmation, 'firstname');
	const email = util.getValue(confirmation, 'email');
	const bankName = util.getValue(confirmation, 'bankName');
	const cardType = util.getValue(confirmation, 'cardType');
	const paymethod = util.getValue(confirmation, 'paymethod');
	const cartTotal = util.getValue(confirmation, 'cartTotal', 0);
	const data = util.getValue(gbx3, 'data', {});
	const descriptor = util.getValue(data, 'orgBillingDescriptor', 'GBX*GIVEBOX');

	return {
		firstname,
		email,
		bankName,
		cardType,
		paymethod,
		cartTotal,
		descriptor,
		data,
		allowSharing
	}
}

export default connect(mapStateToProps, {
	updateCart,
	resetConfirmation
})(Confirmation);
