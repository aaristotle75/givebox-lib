import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
	Image,
	Choice,
	ModalLink,
	ModalRoute,
	util
} from '../../';
import AboutFee from './AboutFee';
import Security from './Security';
import Goal from './Goal';

class Totals extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
	}

	render() {

		const {
			paymethod,
			raised,
			subTotal,
			giveboxFee,
			fee,
			total,
			primaryColor,
			passFees,
			feeOption,
			block,
			placeholderColor
		} = this.props;

		const options = util.getValue(block, 'options', {});
		const form = util.getValue(options, 'form', {});
		const goal = util.getValue(form, 'goal');
		const hasCustomGoal = util.getValue(form, 'hasCustomGoal');

		return (
			<div className='totalsContainer'>
				{feeOption ?
				<Choice
					label={`Cover the Cost of the Fee`}
					value={passFees}
					checked={passFees}
					onChange={() => {
						this.props.setCart('passFees', passFees ? false : true)
					}}
					color={primaryColor}
				/> : <></> }
				<div className='totalsSection'>
					<div className='leftSide'>
						{hasCustomGoal && raised > 0 ?
							<Goal raised={raised} goal={goal} primaryColor={primaryColor} placeholderColor={placeholderColor} />
						:
							<>
								<ModalRoute
									id='security'
									className='gbx3'
									style={{ width: '60%' }}
									component={() =>
										<Security
											primaryColor={primaryColor}
											toggleModal={this.props.toggleModal}
										/>
									}
								/>
								<ModalLink id='security'><Image url='https://s3-us-west-1.amazonaws.com/givebox/public/images/logo-box.svg' alt='Givebox Security' /></ModalLink>
							</>
						}
					</div>
					<div className='rightSide'>
						<div className='totalsList'>
							<div style={{ width: 100 }}>
								<span className='line'>Sub Total:</span>
								<span className='line'>Givebox Fee:</span>
								<span className='line'>{paymethod === 'creditcard' ? 'Credit Card' : 'eCheck'} Fee:</span>
								<span className='totalLine'>Total:</span>
							</div>
							<div>
								<span className='line'>{util.money(subTotal)}</span>
								<span className='line'>{util.money(giveboxFee)}</span>
								<span className='line'>{util.money(fee)}</span>
								<span className='totalLine'>{util.money(total)}</span>
							</div>
						</div>
					</div>
				</div>
				<ModalRoute
					id='aboutFee'
					className='gbx3'
					style={{ width: '50%' }}
					component={() =>
						<AboutFee
							primaryColor={primaryColor}
							toggleModal={this.props.toggleModal}
						/>
					}
				/>
				<ModalLink allowCustom={true} customColor={primaryColor} id='aboutFee'>Learn More About the Fees</ModalLink>
			</div>
		)
	}
};

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const cart = util.getValue(gbx3, 'cart', {});
	const passFees = util.getValue(cart, 'passFees');
	const paymethod = util.getValue(cart, 'paymethod');
	const data = util.getValue(gbx3, 'data', {});
	const settings = util.getValue(data, 'giveboxSettings', {});
	const feeOption = util.getValue(settings, 'feeOption');
	const hasCustomGoal = util.getValue(data, 'hasCustomGoal', false);
	const raised = util.getValue(data, 'raised', 0);
	const goal = util.getValue(data, 'goal', 0);
	const subTotal = util.getValue(cart, 'subTotal', 0);
	const giveboxFee = (0).toFixed(2);
	const fee = util.getValue(cart, 'fee', 0);
	const total = util.getValue(cart, 'total', 0);
	const globals = util.getValue(gbx3, 'globals', {});
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});
	const placeholderColor = util.getValue(gbxStyle, 'placeholderColor');

	return {
		passFees,
		feeOption,
		paymethod,
		hasCustomGoal,
		raised,
		goal,
		subTotal,
		giveboxFee,
		fee,
		total,
		placeholderColor
	}
}

export default connect(mapStateToProps, {
})(Totals)
