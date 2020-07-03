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
				{ (hasCustomGoal && raised > 0)  &&
					<div className='goalSection'>
						<Goal raised={raised} goal={goal} primaryColor={primaryColor} placeholderColor={placeholderColor} />
					</div>
				}
				<div className='totalsSection'>
					<div className='totalsListTop'>
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
					</div>
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
					<div className='totalsListBottom'>
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
				</div>
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
	const textColor = util.getValue(gbxStyle, 'textColor', '#253655');
	const rgb = util.hexToRgb(textColor);
	const textColor2 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .2)`;
	const placeholderColor = util.getValue(gbxStyle, 'placeholderColor', textColor2);

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
