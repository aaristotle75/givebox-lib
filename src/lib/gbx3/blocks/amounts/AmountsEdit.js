import React, { Component } from 'react';
import {
	util,
	GBLink,
	TextField,
	Choice,
	_v,
	types,
	MediaLibrary,
	ModalRoute,
	ModalLink,
	Collapse,
	Image
} from '../../../';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import '../../../styles/gbx3amountsEdit.scss';
import { amountFieldsConfig } from './amountFieldsConfig';
import AnimateHeight from 'react-animate-height';
import Editor from '../Editor';

const arrayMove = require('array-move');

const DragHandle = SortableHandle(() => {
	return (
		<GBLink ripple={false} className='tooltip sortable right'>
			<span className='tooltipTop'><i />Drag & drop to change the order.</span>
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
		this.getAmount = this.getAmount.bind(this);
		this.deleteAmount = this.deleteAmount.bind(this);
		this.addAmount = this.addAmount.bind(this);
		this.validateEnabledAmount = this.validateEnabledAmount.bind(this);
		this.handleThumbnailSaveCallback = this.handleThumbnailSaveCallback.bind(this);
		this.thumbnailField = this.thumbnailField.bind(this);
		this.state = {
			deleteError: []
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
		const amountsList = [ ...this.props.amountsList ];
		this.props.amountsListUpdated(arrayMove(amountsList, oldIndex, newIndex), true);
	};


	getAmount(ID) {
		const amountsList = this.props.amountsList;
		const index = amountsList.findIndex(x => x.ID === ID);
		return amountsList[index];
	}

	updateAmounts(ID, obj = {}, customData = {}) {
		const amountsList = [ ...this.props.amountsList ];
		const index = amountsList.findIndex(x => x.ID === ID);
		if (index !== -1) {
			amountsList[index] = { ...amountsList[index], ...obj };
			amountsList[index].customData = {
				...util.getValue(amountsList[index], 'customData', {}),
				...customData
			}
			this.props.amountsListUpdated(amountsList);
		}
	}

	deleteAmount(ID) {
		const {
			orgID
		} = this.props;
		const amountsList = [ ...this.props.amountsList ];
		const index = amountsList.findIndex(x => x.ID === ID);
		const amount = amountsList[index];

		this.props.sendResource(types.kind(this.props.kind).api.amount, {
			orgID,
			id: [amount[`${this.props.kind}ID`], amount.ID],
			method: 'delete',
			reload: false,
			callback: (res, err) => {
				amountsList.splice(index, 1);
				this.props.amountsListUpdated(amountsList, true, true);
			}
		});
	}

	addAmount() {
		const {
			orgID,
			kind
		} = this.props;
		const amountsList = [ ...this.props.amountsList ];
		const length = amountsList.length;
		const amount = amountsList[length - 1];

		let entries = null;
		let max = null;
		if (kind === 'sweepstake') {
			entries = 1;
		}
		if (kind === 'membership' || kind === 'event') {
			max = 100;
		}
		this.props.sendResource(`${types.kind(this.props.kind).api.amount}s`, {
			orgID,
			id: [amount[`${this.props.kind}ID`]],
			method: 'post',
			data: {
				price: 0,
				name: '',
				description: '',
				enabled: false,
				orderBy: length,
				max,
				entries
			},
			reload: false,
			callback: (res, err) => {
				if (!err && !util.isEmpty(res)) {
					amountsList.push(res);
					this.props.amountsListUpdated(amountsList, true, true);
				}
			}
		});
	}

	validateEnabledAmount(ID, enabled, priceDisplay) {
		const {
			customID
		} = this.props;
		const config = util.getValue(amountFieldsConfig, this.props.kind, {});
		const amount = this.getAmount(ID);
		const customField = config.hasCustomField && customID === ID ? true : false;
		const displayValue = priceDisplay || ( amount.priceDisplay || (amount.price && amount.price !== 0 ? amount.price/100 : '') );
		let error = false;
		if (enabled && !customField && !_v.validateNumber(displayValue, _v.limits.txMin, _v.limits.txMax) && !util.getValue(amount, 'freeSingleEntry')) {
			error = `Enabled amounts must be between $${_v.limits.txMin} and $${util.numberWithCommas(_v.limits.txMax)}.`;
		} else if (!enabled && !_v.validateNumber(displayValue, 0, _v.limits.txMax)) {
			error = `Amounts cannot exceed $${util.numberWithCommas(_v.limits.txMax)}.`;
		}

		return error;
	}

	enabledField(ID, fieldProps, config) {
		const amount = this.getAmount(ID);
		const isDefault = config.hasDefaultField && this.props.defaultID === ID ? true : false;
		const error = this.validateEnabledAmount(ID, amount.enabled);

		return (
			<div className={`enableField ${isDefault ? 'tooltip' : ''}`}>
				{isDefault ? <span className={`tooltipTop`}><i />To disable amount please change the default to a different amount.</span> : <></>}
				<Choice
					className={`${amount.enabled ? error ? 'error' : '' : 'link gray'}`}
					type='checkbox'
					toggle={true}
					name='enabled'
					label={''}
					onChange={() => {
						let enabled = amount.enabled ? false : true;
						if (config.hasDefaultField && isDefault && !enabled) {
							enabled = true;
						}
						this.props.validateAmountsBeforeSave(ID, this.validateEnabledAmount(ID, enabled));
						this.updateAmounts(ID, { enabled });
					}}
					checked={amount.enabled}
					value={amount.enabled}
				/>
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
		const error = this.validateEnabledAmount(ID, amount.enabled);

		return (
			<TextField
				className={`${customField ? 'customField' : ''} ${amount.enabled ? '' : 'notOnForm'}`}
				name={fieldName}
				label={util.getValue(fieldProps, 'label')}
				fixedLabel={true}
				placeholder={customField ? 'Any Amount' : util.getValue(fieldProps, 'placeholder', '0.00')}
				onBlur={(e) => {
					this.props.validateAmountsBeforeSave(ID, this.validateEnabledAmount(ID, amount.enabled));
				}}
				onChange={(e) => {
					const value = e.currentTarget.value;
					const priceDisplay = _v.formatNumber(value);
					const price = util.formatMoneyForAPI(value);
					this.props.validateAmountsBeforeSave(ID, this.validateEnabledAmount(ID, amount.enabled, priceDisplay));
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

	nameField(ID, fieldProps, config) {
		const {
			customID
		} = this.props;

		const amount = this.getAmount(ID);
		const fieldName = `name${ID}`;
		const customField = config.hasCustomField && customID === ID ? true : false;

		return (
			<TextField
				className={`${customField ? 'customField' : ''} ${amount.enabled ? '' : 'notOnForm'}`}
				name={fieldName}
				label={util.getValue(fieldProps, 'label')}
				fixedLabel={true}
				placeholder={util.getValue(fieldProps, 'placeholder')}
				onChange={(e) => {
					const name = e.currentTarget.value;
					this.updateAmounts(ID, { name });
				}}
				value={customField && !amount.name ? util.getValue(fieldProps, 'customFieldDefault', '') : amount.name}
				count={true}
				maxLength={60}
			/>
		)
	}

	descField(ID) {
		const {
			article
		} = this.props;
		const amount = this.getAmount(ID);
		const showDetails = amount.showDetails ? false : true;
		return (
			<div className='longdescRow'>
				<div style={{ width: '100%' }} className={`column descField ${amount.showDetails ? 'showDetailsOpen' : ''}`}>
					<GBLink
						style={{ fontSize: 12 }}
						onClick={() => {
							this.updateAmounts(ID, { showDetails });
						}}>
						{amount.description ? 'Edit' : 'Add'} Long Description <span className={`icon icon-${amount.showDetails ? 'minus' : 'plus'}`}></span>
					</GBLink>
				</div>
				<AnimateHeight
					duration={200}
					height={amount.showDetails ? 'auto' : 0}
				>
					<div className='showDetails'>
						<Editor
							orgID={util.getValue(article, 'orgID', null)}
							articleID={util.getValue(article, 'articleID', null)}
							content={amount.description}
							subType='content'
							loaderClass='gbx3amountsEdit'
							balloonButtons={''}
							onChange={(description) => {
								this.updateAmounts(ID, { description });
							}}
						/>
					</div>
				</AnimateHeight>
			</div>
		)
	}

	maxField(ID, fieldProps, config) {

		const amount = this.getAmount(ID);
		const fieldName = `max${ID}`;
		const sold = +util.getValue(amount, 'sold', 0);
		const max = +util.getValue(amount, 'max', 0);
		const inStock = util.getValue(amount, 'inStock', +(max - sold));
		//const error = this.validateEnabledAmount(ID, amount.enabled);
		const error = false;

		return (
			<TextField
				className={`${amount.enabled ? '' : 'notOnForm'}`}
				name={fieldName}
				label={util.getValue(fieldProps, 'label')}
				fixedLabel={true}
				placeholder={util.getValue(fieldProps, 'placeholder', '0')}
				onChange={(e) => {
					const inStock = +e.currentTarget.value;
					const max = +(inStock + sold);
					this.updateAmounts(ID, { inStock, max });
				}}
				maxLength={7}
				value={inStock || ''}
				error={error}
				errorType={'tooltip'}
			/>
		)
	}

	validateEnabledEntries(ID, enabled, entries) {
		let error = false;
		if (enabled && ( entries < 1 || !entries)) {
			error = `Entries per ticket must be 1 or more.`;
		}

		return error;
	}

	entriesField(ID, fieldProps, config) {

		const amount = this.getAmount(ID);
		const fieldName = `entries${ID}`;
		const entries = +util.getValue(amount, 'entries');
		const error = this.validateEnabledEntries(ID, amount.enabled, entries);

		return (
			<TextField
				className={`${amount.enabled ? '' : 'notOnForm'}`}
				name={fieldName}
				label={util.getValue(fieldProps, 'label')}
				fixedLabel={true}
				placeholder={util.getValue(fieldProps, 'placeholder', 0)}
				onBlur={(e) => {
					this.props.validateAmountsBeforeSave(`${ID}-2`, this.validateEnabledEntries(ID, amount.enabled, entries));
				}}
				onChange={(e) => {
					const entries = +e.currentTarget.value;
					this.props.validateAmountsBeforeSave(`${ID}-2`, this.validateEnabledEntries(ID, amount.enabled, entries));
					this.updateAmounts(ID, { entries });
				}}
				maxLength={7}
				value={entries || ''}
				error={error}
				errorType={'tooltip'}
			/>
		)
	}

	handleThumbnailSaveCallback(url, ID, modalID) {
		this.updateAmounts(ID, {}, { thumbnailURL: url });
		this.props.toggleModal(modalID, false);
	}

	thumbnailField(ID) {
		const {
			orgID,
			articleID,
			isVolunteer,
			breakpoint
		} = this.props;

		const modalID = `amount-thumbnail-${ID}`;
		const amount = this.getAmount(ID);
		const customData = util.getValue(amount, 'customData', {});
		const thumbnailURL = util.getValue(customData, 'thumbnailURL');

		const library = {
			saveMediaType: isVolunteer ? 'article' : 'org',
			articleID,
			orgID,
			type: 'article',
			borderRadius: 0
		}

		const previewImage = thumbnailURL ?
			<Image url={thumbnailURL} size={'thumb'} minHeight={0} maxWidth={60} maxHeight={60} alt={'Thumbnail'} />
		:
			<div className='mediaPlaceholder'>
				<span className='icon icon-instagram'></span>
				Add Thumbnail
			</div>
		;

		return (
			<div className='thumbnailField'>
				<ModalRoute
					className='gbx3'
					optsProps={{ customOverlay: { zIndex: 10000000 } }}
					id={modalID}
					effect='3DFlipVert' style={{ width: '60%' }}
					draggable={true}
					draggableTitle={`Add Thumbnail`}
					closeCallback={() => console.log('execute closeCallback')}
					disallowBgClose={true}
					component={() =>
						<div className='modalWrapper'>
							<Collapse
								label={'Image'}
								iconPrimary='image'
								id={'gbx3-mediaLibrary'}
							>
								<div className='formSectionContainer'>
									<div className='formSection'>
										<MediaLibrary
											modalID={modalID}
											image={thumbnailURL}
											preview={thumbnailURL}
											handleSaveCallback={(url) => this.handleThumbnailSaveCallback(url, ID, modalID)}
											handleSave={util.handleFile}
											library={library}
											showBtns={'hide'}
											saveLabel={'close'}
											mobile={breakpoint === 'mobile' ? true : false }
										/>
									</div>
								</div>
							</Collapse>
						</div>
					}
					buttonGroup={
						<div style={{ margin: 0 }} className='button-group center'>
							<GBLink className='link remove' onClick={() => this.handleThumbnailSaveCallback('', ID, modalID)}><span className='icon icon-trash-2'></span> <span className='buttonText'>Remove</span></GBLink>
							<GBLink className='button' onClick={() => this.props.toggleModal(modalID, false)}>Close</GBLink>
						</div>
					}
				/>
				<ModalLink className='amountThumb' id={modalID}>
					{previewImage}
				</ModalLink>
			</div>
		)
	}

	renderAmountsList() {
		const items = [];
		const {
			amountsList,
			customID
		} = this.props;

		const formError = !util.isEmpty(this.props.formError);
		const config = util.getValue(amountFieldsConfig, this.props.kind, {});
		const fields = util.getValue(config, 'fields');
		let numEnabled = 0;

		if (!util.isEmpty(amountsList)) {
			Object.entries(amountsList).forEach(([key, value]) => {
				numEnabled = value.enabled ? numEnabled + 1 : numEnabled;
				const fieldItems = [];
				const customField = customID === value.ID && config.hasCustomField ? true : false;
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
							<span className='tooltipTop'><i />This is the default amount selected for the user.</span>
						</span>
					:
						<GBLink className={`link ${!value.enabled ? 'sortable tooltip right' : ''}`} style={{ fontSize: 12 }} onClick={() => value.enabled ? this.props.defaultUpdated(key, value.ID) : console.error('Cannot set a disabled amount as the default')}>
							Set Default
							{!value.enabled ? <span className='tooltipTop'><i />Must be enabled to set as the default.</span> : <></>}
						</GBLink>
				: <></> ;

				const deleteField = amountsList.length > 1 ?
					<GBLink className={`link ${value.enabled || customField || formError ? 'sortable tooltip right' : ''}`} style={{ fontSize: 18 }} onClick={() => value.enabled || customField || formError ? console.error(`${customField ? 'Cannot delete custom field.' : formError ? 'Cannot delete amount with form errors.' : 'Cannot delete an enabled amount.'}`) : this.deleteAmount(value.ID)}>
						<span className='icon icon-x'></span>
						{value.enabled || customField || formError ? <span style={{ left: '-20px' }} className='tooltipTop'><i />{customField ? 'The custom amount field cannot be deleted.' : formError ? 'Please fix errors in red before deleting.' : 'You must disable the amount before you can delete it.'}</span> : <></>}
					</GBLink>
				: <></> ;

				fieldItems.push(
					<div key={'rightButtonGroup'} className='column' style={{ width: `${util.getValue(config.buttonGroup, 'width', 20)}%` }}>
						<div className='amountsRightSideButtonGroup'>
							{draggable}
							{defaultField}
							{deleteField}
						</div>
					</div>
				);

				items.push(
					<div key={key} className={`amountsEditRow sortableListItem ${value.enabled ? '' : 'notOnForm'}`} disabled={util.getValue(config, 'disableSort', false)}>
						<div className='fieldItems'>{fieldItems}</div>
						<div className='fieldItems'>
							<div className='column' style={{ width: '100%' }}>{this.descField(value.ID)}</div>
						</div>
					</div>
				);
			});
		}

		const rows =  <SortableList onSortStart={this.onSortStart} onSortMove={this.onSortMove} helperClass='sortableHelper' hideSortableGhost={true} useDragHandle={true} items={items} onSortEnd={this.onSortEnd} />;

		const addAmount =
			<div style={{ marginTop: '20px' }} className='flexCenter'>
				<GBLink style={{ verticalAlign: 'middle' }} onClick={() => this.addAmount()}>
					<span className='icon icon-plus-square'></span> New {types.kind(this.props.kind).amountDesc}
				</GBLink>
			</div>
		;

		return (
			<div className='amountsEditList'>
				{rows}
				{numEnabled >= amountsList.length && !formError ? addAmount : <></>}
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
