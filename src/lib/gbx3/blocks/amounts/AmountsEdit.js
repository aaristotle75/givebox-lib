import React, { Component } from 'react';
import {
	util,
	GBLink,
	TextField,
	_v
} from '../../../';
import {SortableContainer, SortableElement, arrayMove, SortableHandle} from 'react-sortable-hoc';
import '../../../styles/gbx3amountsEdit.scss';
import { amountFieldsConfig } from './amountFieldsConfig';

const DragHandle = SortableHandle(() => {
	return (
		<GBLink ripple={false} className='tooltip sortable right'>
			<span className='tooltipTop'>Drag & Drop to change the order</span>
			<span className='icon icon-move'></span>
		</GBLink>
	)
});

const SortableItem = SortableElement(({value}) => {
	return (
		<div className='sortableElement' >
			{value}
		</div>
	)
});

const SortableList = SortableContainer(({items}) => {
	return (
		<div>
			{items.map((value, index) => (
				<SortableItem key={`item-${index}`} index={index} value={value} />
			))}
		</div>
	);
});

export default class AmountsEdit extends Component {

	constructor(props) {
		super(props);
		this.onSortStart = this.onSortStart.bind(this);
		this.onSortMove = this.onSortMove.bind(this);
		this.renderAmountsList = this.renderAmountsList.bind(this);
		this.updateAmounts = this.updateAmounts.bind(this);
		this.enabledField = this.enabledField.bind(this);
		this.priceField = this.priceField.bind(this);
		this.nameField = this.nameField.bind(this);
		this.descField = this.descField.bind(this);
		this.defaultField = this.defaultField.bind(this);
		this.getAmount = this.getAmount.bind(this);
		this.state = {
		};
	}

	componentDidMount() {
	}

	onSortStart(e) {
		util.noSelection();
	}

	onSortMove(e) {
		util.noSelection();
	}

	onSortEnd = ({oldIndex, newIndex}) => {
		const amountsList = [ ...this.props.amountsList ];
		this.props.amountsListUpdated(arrayMove(amountsList, oldIndex, newIndex));
	};


	getAmount(ID) {
		const amountsList = this.props.amountsList;
		const index = amountsList.findIndex(x => x.ID === ID);
		return amountsList[index];
	}

	updateAmounts(ID, obj = {}) {
		const amountsList = [ ...this.props.amountsList ];
		const index = amountsList.findIndex(x => x.ID === ID);
		if (index !== -1) {
			amountsList[index] = { ...amountsList[index], ...obj };
			this.props.amountsListUpdated(amountsList);
		}
	}

	enabledField(ID) {
		const amount = this.getAmount(ID);
		return (
			<div className='enableField'>
				<GBLink
					className={`${amount.enabled ? '' : 'link gray'}`}
					onClick={() => {
						const enabled = amount.enabled ? false : true;
						this.updateAmounts(ID, { enabled });
					}}
				>
					{amount.enabled ? <span className='icon icon-check-square'></span> : <span className='icon icon-square'></span>}
				</GBLink>
			</div>
		)
	}

	priceField(ID, fieldProps, config) {
		const amount = this.getAmount(ID);
		const fieldName = `price${ID}`;
		const displayValue = amount.priceDisplay || (amount.price && amount.price !== 0 ? amount.price/100 : '');

		let error = false;
		if (amount.enabled && !util.getValue(config, 'customField') && !_v.validateNumber(displayValue, _v.limits.txMin, _v.limits.txMax) && !util.getValue(amount, 'freeSingleEntry')) {
			error = `Enabled amounts must be between $${_v.limits.txMin} and $${util.numberWithCommas(_v.limits.txMax)}.`;
		} else if (!amount.enabled && !_v.validateNumber(displayValue, 0, _v.limits.txMax)) {
			error = `Amounts cannot exceed $${util.numberWithCommas(_v.limits.txMax)}.`;
		}

		return (
			<TextField
				name={fieldName}
				label={util.getValue(fieldProps, 'label')}
				fixedLabel={true}
				placeholder={util.getValue(fieldProps, 'placeholder', '0.00')}
				onChange={(e) => {
					const value = e.currentTarget.value;
					const priceDisplay = _v.formatNumber(value);
					const price = util.formatMoneyForAPI(value);
					this.updateAmounts(ID, { priceDisplay, price });
				}}
				maxLength={8}
				money={true}
				value={displayValue}
				error={error}
				errorType={'tooltip'}
			/>
		)
	}

	nameField() {

	}

	descField() {

	}

	defaultField() {

	}

	renderAmountsList() {
		const items = [];
		const {
			amountsList
		} = this.props;

		const config = util.getValue(amountFieldsConfig, this.props.kind, {});
		const fields = util.getValue(config, 'fields');

		if (!util.isEmpty(amountsList)) {
			Object.entries(amountsList).forEach(([key, value]) => {
				const fieldItems = [];
				Object.entries(fields).forEach(([fieldKey, fieldProps]) => {
					fieldItems.push(
						<div key={fieldKey} className={`column ${util.getValue(fieldProps, 'className')}`} style={{ width: `${fieldProps.width}%` }}>
							{this[`${fieldKey}Field`](value.ID, fieldProps, config)}
						</div>
					);
				});

				fieldItems.push(
					<div key={'draggableHandle'} className='column' style={{ width: '5%' }}>
						{!util.getValue(config, 'disableSort', false) ? <DragHandle /> : <></>}
					</div>
				)

				items.push(
					<div key={key} className={`amountsEditRow sortableListItem ${value.enabled ? '' : 'notOnForm'}`} disabled={util.getValue(config, 'disableSort', false)}>
						{fieldItems}
					</div>
				);
			});
		}

		const rows =  <SortableList onSortStart={this.onSortStart} onSortMove={this.onSortMove} helperClass='sortableHelper' hideSortableGhost={true} useDragHandle={true} items={items} onSortEnd={this.onSortEnd} />;

		return (
			<div className='amountsEditList'>
				{rows}
			</div>
		)
	}

	render() {

		return (
			<div className='amountsEdit'>
				{this.renderAmountsList()}
			</div>
		)
	}
}
