import React, { Component } from 'react';
import {
	util,
	GBLink,
	TextField,
	_v
} from '../../../';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import '../../../styles/gbx3amountsEdit.scss';
import { amountFieldsConfig } from './amountFieldsConfig';
const arrayMove = require('array-move');

const DragHandle = SortableHandle(() => {
	return (
		<GBLink ripple={false} className='tooltip sortable right'>
			<span className='tooltipTop'>Drag & drop to change the order.</span>
			<span className='icon icon-move'></span>
		</GBLink>
	)
});

const SortableItem = SortableElement(({value}) => {
	return (
		<div className='gbx3amountsEdit sortableElement' >
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
		this.deleteAmount = this.deleteAmount.bind(this);
		this.addAmount = this.addAmount.bind(this);
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

	onSortEnd = ({oldIndex, newIndex, collection}) => {
		const config = util.getValue(amountFieldsConfig, this.props.kind, {});
		const amountsList = [ ...this.props.amountsList ];
		this.props.amountsListUpdated(arrayMove(amountsList, oldIndex, newIndex), true, config);
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

	deleteAmount(ID) {
		const amountsList = [ ...this.props.amountsList ];
		const index = amountsList.findIndex(x => x.ID === ID);
		console.log('execute deleteAmount', ID, index);
	}

	addAmount(ID) {
		const amountsList = [ ...this.props.amountsList ];
		const index = amountsList.findIndex(x => x.ID === ID);
		console.log('execute addAmount', ID, index);
	}

	enabledField(ID) {
		const config = util.getValue(amountFieldsConfig, this.props.kind, {});
		const amount = this.getAmount(ID);
		const isDefault = config.hasDefaultField && this.props.defaultID === ID ? true : false;
		return (
			<div className={`enableField ${isDefault ? 'tooltip' : ''}`}>
				{isDefault ? <span className={`tooltipTop`}>To disable amount please change the default to a different amount.</span> : <></>}
				<GBLink
					className={`${amount.enabled ? '' : 'link gray'}`}
					onClick={() => {
						let enabled = amount.enabled ? false : true;
						if (config.hasDefaultField && isDefault && !enabled) {
							enabled = true;
						}
						this.updateAmounts(ID, { enabled });
					}}
				>
					{amount.enabled ? <span className='icon icon-check-square'></span> : <span className='icon icon-square'></span>}
				</GBLink>
			</div>
		)
	}

	priceField(ID, fieldProps, config) {
		const {
			customID
		} = this.props;

		const amount = this.getAmount(ID);
		const fieldName = `price${ID}`;
		const displayValue = amount.priceDisplay || (amount.price && amount.price !== 0 ? amount.price/100 : '');
		const customField = config.hasCustomField && customID === ID ? true : false;
		let error = false;
		if (amount.enabled && !customField && !_v.validateNumber(displayValue, _v.limits.txMin, _v.limits.txMax) && !util.getValue(amount, 'freeSingleEntry')) {
			error = `Enabled amounts must be between $${_v.limits.txMin} and $${util.numberWithCommas(_v.limits.txMax)}.`;
		} else if (!amount.enabled && !_v.validateNumber(displayValue, 0, _v.limits.txMax)) {
			error = `Amounts cannot exceed $${util.numberWithCommas(_v.limits.txMax)}.`;
		}

		return (
			<TextField
				className={`${amount.enabled ? '' : 'notOnForm'}`}
				name={fieldName}
				label={util.getValue(fieldProps, 'label')}
				fixedLabel={true}
				placeholder={customField ? 'Any Amount' : util.getValue(fieldProps, 'placeholder', '0.00')}
				onChange={(e) => {
					const value = e.currentTarget.value;
					const priceDisplay = _v.formatNumber(value);
					const price = util.formatMoneyForAPI(value);
					this.updateAmounts(ID, { priceDisplay, price });
				}}
				maxLength={8}
				money={customField ? false : true}
				value={displayValue}
				error={error}
				errorType={'tooltip'}
				readOnly={customField ? true : false}
				readOnlyText={'The user enters any amount.'}
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
		let numEnabled = 0;

		if (!util.isEmpty(amountsList)) {
			Object.entries(amountsList).forEach(([key, value]) => {
				numEnabled = value.enabled ? numEnabled + 1 : numEnabled;
				const fieldItems = [];
				Object.entries(fields).forEach(([fieldKey, fieldProps]) => {
					fieldItems.push(
						<div key={fieldKey} className={`column ${util.getValue(fieldProps, 'className')}`} style={{ width: `${fieldProps.width}%` }}>
							{this[`${fieldKey}Field`](value.ID, fieldProps, config)}
						</div>
					);
				});

				const draggable = !util.getValue(config, 'disableSort', false) ?
					<DragHandle />
				: <></> ;

				const defaultField = config.hasDefaultField ?
					value.ID === this.props.defaultID ?
						<span className='defaultAmount tooltip sortable right' style={{ fontSize: 12 }}>
							Default
							<span className='tooltipTop'>This is the default amount selected for the user.</span>
						</span>
					:
						<GBLink className={`link ${!value.enabled ? 'sortable tooltip right' : ''}`} style={{ fontSize: 12 }} onClick={() => value.enabled ? this.props.defaultUpdated(key, value.ID) : console.error('Cannot set a disabled amount as the default')}>
							Set Default
							{!value.enabled ? <span className='tooltipTop'>Must be enabled to set as the default.</span> : <></>}
						</GBLink>
				: <></> ;

				const deleteField = amountsList.length > 1 ?
					<GBLink className={`link ${value.enabled ? 'sortable tooltip right' : ''}`} style={{ fontSize: 18 }} onClick={() => value.enabled ? console.error('Cannot delete an enabled amount.') : this.deleteAmount(value.ID)}>
						<span className='icon icon-x'></span>
						{value.enabled ? <span style={{ left: '-20px' }} className='tooltipTop'>You must disable the amount before you can delete it.</span> : <></>}
					</GBLink>
				: <></> ;

				fieldItems.push(
					<div key={'rightButtonGroup'} className='column amountsRightSideButtonGroup' style={{ width: '20%' }}>
						{draggable}
						{defaultField}
						{deleteField}
					</div>
				);

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
