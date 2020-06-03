import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
	util,
	updateCart,
	types,
	GBLink
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

	renderPaymethodText() {
		const {
			paymethod,
			confirmation,
			descriptor,
			total
		} = this.props;

		const item = [];

		item.push(
			<span key={'receiptEmailed'} className='group'>
				<span className='icon icon-check'></span>
				<span className='inlineText'>An email receipt has been sent to <strong>{util.getValue(confirmation, 'email')}</strong>.</span>
			</span>
		);
		switch (paymethod) {
			case 'echeck': {
				item.push(
					<span key={paymethod}>
						<span className='group'>
							<span className='icon icon-check'></span>
							<span className='inlineText'>Your <strong>{util.getValue(confirmation, 'bankName')}</strong> bank account has been charged in the amount of <strong>{util.money(total)}</strong>.</span>
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
							<span className='inlineText'>Your <strong>{util.getValue(confirmation, 'cardType')}</strong> card has been charged in the amount of <strong>{util.money(total)}</strong>.</span>
						</span>
						<span className='group'>
							<span className='icon icon-check'></span>
							<span className='inlineText'>The charge will show up in your credit card or bank statement with the description <strong>{descriptor}</strong>.</span>
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
			form,
			primaryColor
		} = this.props;

		const shareLink = `${GBX_SHARE}/${util.getValue(article, 'articleID')}`;
		const title = util.getValue(article, 'title');
		const image = util.imageUrlWithStyle(article.imageURL, 'medium');
		const description = util.getValue(article, 'summary');
		const shareIconSize = 35;
		const allowShare = util.getValue(form, 'allowShare', false);

		return (
			<div className='modalWrapper confirmation'>
				<div className='successfulText'>
					<span className='titleText' style={{ color: primaryColor }}>
						<span className='icon icon-check-circle'></span>
						Your transaction has been processed successfully!
					</span>
				</div>
				{this.renderPaymethodText()}
				{ allowShare ?
				<div className='share'>
					<div className='subText'>
						Please tell people about us by sharing below.
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
	const cart = util.getValue(gbx3, 'cart', {});
	const paymethod = util.getValue(cart, 'paymethod');
	const total = util.getValue(cart, 'total', 0);
	const confirmation = util.getValue(cart, 'confirmation', {});
	const data = util.getValue(gbx3, 'data', {});
	const descriptor = util.getValue(data, 'orgBillingDescriptor', 'GBX*GIVEBOX');

	return {
		paymethod,
		total,
		confirmation,
		descriptor,
		data
	}
}

export default connect(mapStateToProps, {
	updateCart
})(Confirmation);
