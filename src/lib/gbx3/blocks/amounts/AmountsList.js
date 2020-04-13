import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
	GBLink,
	ModalRoute,
	toggleModal,
	Choice,
	TextField
} from '../../../';
import '../../../styles/gbx3amounts.scss';

class AmountsList extends Component {

  constructor(props) {
    super(props);
		this.renderEmbedAmounts = this.renderEmbedAmounts.bind(this);
		this.renderModalAmounts = this.renderModalAmounts.bind(this);
		this.onChangeAmountRadio = this.onChangeAmountRadio.bind(this);
		this.onChangeEnteredAmount = this.onChangeEnteredAmount.bind(this);
		this.onBlurEnteredAmount = this.onBlurEnteredAmount.bind(this);
    this.state = {
			amountRadioSelected: null,
			amountEntered: ''
    };
  }

	componentDidMount() {
		console.log('execute', this.props.width, this.props.height);
	}

	onChangeAmountRadio(name, value) {
		console.log('execute onChangeQty', name, value);
		this.setState({ amountRadioSelected: value });
	}

	onChangeEnteredAmount(e) {
		const amount = e.currentTarget.value;
		console.log('execute entered amount onchange', amount);
	}

	onBlurEnteredAmount(e) {
		const amount = e.currentTarget.value;
		console.log('execute entered amount onblue', amount);
	}

	renderEmbedAmounts() {
		const {
			list,
			customIndex,
			defaultIndex
		} = this.props;
		const amountRadioSelected = this.state.amountRadioSelected;
		const items = [];
		let length = 0;

		Object.entries(list).forEach(([key, value]) => {
			const defaultRadio = defaultIndex === key ? true : false;
			if (value.enabled) {
				length++;
				items.push(
					<div key={key} className='amountRow'>
						<div className='amountDesc'>
							<Choice
								name={`ID`}
								value={value.ID}
								onChange={this.onChangeAmountRadio}
								type='radio'
								label={value.name}
								checked={amountRadioSelected || defaultRadio}
							/>
						</div>
					</div>
				);
			}
		});

		const enteredAmount =
			<div key={'enteredAmount'} className='amountInput'>
				<TextField
					name='enteredAmount'
					placeholder={0}
					onChange={this.onChangeEnteredAmount}
					onBlur={this.onBlurEnteredAmount}
					maxLength={9}
					money={true}
					style={{
						fontSize: '100px'
					}}
					value={this.state.amountEntered}
				/>
			</div>
		;

		return (
			<>
				{enteredAmount}
				{!util.isEmpty(items) && length > 0 ? items : <></>}
			</>
		)
	}

	renderModalAmounts() {
		const {
			list,
			customIndex,
			defaultIndex
		} = this.props;
		const items = [];

		Object.entries(list).forEach(([key, value]) => {
			items.push(
				<div key={key} className='amountRow'>
					<div className='amountDesc'>
						{value.name}
					</div>
					<div className='amountQty'>
						<Choice
							name={value.ID}
							onChange={this.onChangeQty}
							type='radio'
							label={value.name}
						/>
					</div>
				</div>
			);
		});

		return items;
	}

  render() {

		const {
			embed
		} = this.props;

		const height = embed ? `${this.props.height}px` : 'auto';

    return (
			<div className={`${embed ? 'embed' : ''}`}>
	      <div style={{ height: height }} className='amountsList'>
					{embed ? this.renderEmbedAmounts() : this.renderModalAmounts()}
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
})(AmountsList);
