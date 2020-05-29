import React, {Component} from 'react';
import { connect } from 'react-redux';
import TextField from './TextField';
import Upload from './Upload';
import Dropdown from './Dropdown';
import Choice from './Choice';
import RichTextField from './RichTextField';
import ModalField from './ModalField';
import CreditCard from './CreditCard';
import CalendarField from './CalendarField';
import WhereField from './WhereField';
import ColorPicker from './ColorPicker';
import * as _v from './formValidate';
import Loader from '../common/Loader';
import { Alert } from '../common/Alert';
import { cloneObj, isEmpty, numberWithCommas, stripHtml, getValue } from '../common/utility';
import { toggleModal } from '../api/actions';
import ModalRoute from '../modal/ModalRoute';
import ModalLink from '../modal/ModalLink';
import CVVModal from './CVVModal';
import has from 'has';

class Form extends Component {

	constructor(props) {
		super(props);
		this.onEnterKeypress = this.onEnterKeypress.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onChangeDropzone = this.onChangeDropzone.bind(this);
		this.onChangeCalendar = this.onChangeCalendar.bind(this);
		this.onChangeDropdown = this.onChangeDropdown.bind(this);
		this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
		this.onChangeRadio = this.onChangeRadio.bind(this);
		this.onChangeRichText = this.onChangeRichText.bind(this);
		this.onChangeCCExpire = this.onChangeCCExpire.bind(this);
		this.onChangeCreditCard = this.onChangeCreditCard.bind(this);
		this.onChangeWhere = this.onChangeWhere.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.fieldRef = this.fieldRef.bind(this);
		this.validateForm = this.validateForm.bind(this);
		this.validateField = this.validateField.bind(this);
		this.calendarField = this.calendarField.bind(this);
		this.uploadField = this.uploadField.bind(this);
		this.textField = this.textField.bind(this);
		this.dropdown = this.dropdown.bind(this);
		this.choice = this.choice.bind(this);
		this.richText = this.richText.bind(this);
		this.modalField = this.modalField.bind(this);
		this.creditCard = this.creditCard.bind(this);
		this.creditCardGroup = this.creditCardGroup.bind(this);
		this.whereField = this.whereField.bind(this);
		this.colorPicker = this.colorPicker.bind(this);
		this.createField = this.createField.bind(this);
		this.createRadioField = this.createRadioField.bind(this);
		this.fieldProp = this.fieldProp.bind(this);
		this.multiFieldProp = this.multiFieldProp.bind(this);
		this.formProp = this.formProp.bind(this);
		this.getErrors = this.getErrors.bind(this);
		this.saveButton = this.saveButton.bind(this);
		this.formSaved = this.formSaved.bind(this);
		this.successAlert = this.successAlert.bind(this);
		this.errorAlert = this.errorAlert.bind(this);
		this.fieldError = this.fieldError.bind(this);
		this.allowEnterToSubmit = this.allowEnterToSubmit.bind(this);
		this.closeModalAndSave = this.closeModalAndSave.bind(this);
		this.state = {
			error: false,
			errorMsg: '',
			saved: false,
			savedMsg: '',
			updated: false,
			fields: {}
		}
		this.defaultOptions = {
			parent: false,
			useChildren: false,
			label: '',
			fixedLabel: false,
			className: '',
			style: {},
			required: false,
			value: '',
			placeholder: '',
			group: 'default',
			subGroup: '',
			readOnly: false,
			autoFocus: false,
			type: '',
			autoReturn: true,
			validate: '',
			validateOpts: {
				decimal: true
			},
			maxLength: 64,
			error: false,
			errorType: 'tooltip', // choices: tooltip, normal, none
			checked: false,
			options: [],
			selectLabel: 'Select One',
			modal: false,
			debug: false,
			strength: false,
			count: false,
			meta: {},
			disallowModalBgClose: false,
			color: ''
		}
		this.defaults = { ...this.defaultOptions, ...props.options };
		this.saveButtonRef = React.createRef();
	}

	componentDidMount() {
		window.addEventListener('keyup', this.onEnterKeypress);
	}

	componentWillUnmount() {
		if (this.formSavedTimeout) {
			clearTimeout(this.formSavedTimeout);
			this.formSavedTimeout = null;
		}
		window.removeEventListener('keyup', this.onEnterKeypress);
	}

	focusInput(ref) {
		if (ref) {
			ref.current.focus();
		}
	}

	fieldRef(name) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		if (field) {
			if (has(field, 'ref')) return field.ref.current;
		}
		return null;
	}

	onEnterKeypress(e) {
		e.preventDefault();
		const form = this.saveButtonRef ? this.saveButtonRef.current : null;
		if (e.keyCode === 13) {
			if (form && this.allowEnterToSubmit()) form.click();
		}
	}

	allowEnterToSubmit() {
		let allowEnter = false;
		let topModal = getValue(this.props.modals, 'topModal', null);
		if (topModal) {
			if (!isEmpty(this.props.modals)) {
				Object.entries(this.props.modals).forEach(([key, value]) => {
					if (this.props.id.includes(`${key}`) && value.open && key === topModal) {
						allowEnter = true;
					}
				});
			}
		} else {
			allowEnter = true;
		}
		if (this.props.alwaysSubmitOnEnter) allowEnter = true;
		if (this.props.neverSubmitOnEnter) allowEnter = false;
		return allowEnter;
	}

	createField(name, args) {
		const merge = { ...this.state.fields, [name]: { name: name, ...args } };
		this.setState(Object.assign(this.state, {
			...this.state,
			fields: merge
		}));
		if (args.parent) {
			const parentField = has(this.state.fields, args.parent) ? this.state.fields[args.parent] : null;
			if (parentField) {
				if (parentField.useChildren) {
					const children = has(parentField, 'children') ? parentField.children : [];
					const index = children.findIndex((el) => {
						return el === name;
					});
					if (index === -1) {
						children.push(
							{ [name]: args }
						);
					} else {
						children[index] = { [name]: args }
					}
					const parentMerge = {
						...this.state.fields,
						[args.parent]: {
							...this.state.fields[args.parent],
							children
						}};
					this.setState(Object.assign(this.state, {
						...this.state,
						fields: parentMerge
					}));
				}
			}
			const parentMerge = {
				...this.state.fields,
				[args.parent]: {
					...this.state.fields[args.parent],
					[name]: args.value
				}};
			this.setState(Object.assign(this.state, {
				...this.state,
				fields: parentMerge
			}));
		}
	}

	createRadioField(name, args) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		if (!field) {
			this.createField(name, args);
		}
	}

	multiFieldProp(fields) {
		const bindthis = this;
		Object.entries(fields).forEach(([key, value]) => {
			bindthis.fieldProp(value.name, value.args);
		});
	}

	fieldProp(name, args) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		if (field) {
			const params = Object.assign(this.state.fields[name], args);
			this.setState(Object.assign(this.state, {
				...this.state,
				fields: {
					...this.state.fields,
					[name]: params
				}
			}));
			if (field.parent) {
				const parentField = has(this.state.fields, field.parent) ? this.state.fields[field.parent] : null;
				if (parentField) {
					if (parentField.useChildren) {
						const children = parentField.children;
						this.setState(Object.assign(this.state, {
							...this.state,
							fields: {
								...this.state.fields,
								[field.parent]: {
									...this.state.fields[field.parent],
									children
								}
							}
						}));
					}
					this.setState(Object.assign(this.state, {
						...this.state,
						fields: {
							...this.state.fields,
							[field.parent]: {
								...this.state.fields[field.parent],
								[name]: params.value
							}
						}
					}));
				}
			}
		} else {
			console.error(`Error in fieldProp: ${name}`);
		}
	}

	formProp(args) {
		this.setState(Object.assign(this.state, args), this.props.formPropCallback ? this.props.formPropCallback(this.state) : null);
	}

	onChangeDropzone(name, url) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		if (field) {
			this.formProp({ error: false, errorMsg: '', updated: true });
			if (field.debug) console.log('onChangeDropzone', name, field);
		}
	}

	onChangeCalendar(ts, name) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		if (field) {
			this.fieldProp(name, { value: ts ? ts/field.reduceTS : null, error: false });
			this.formProp({ error: false, errorMsg: '', updated: true });
			if (has(field, 'rangeStartField')) {
				let required = field.rangeRequired ? ts ? true : false : false;
				this.fieldProp(field.rangeStartField, {error: false, required: required});
			}
			if (has(field, 'rangeEndField')) {
				let required = field.rangeRequired ? ts ? true : false : false;
				this.fieldProp(field.rangeEndField, {error: false, required: required});
			}
			if (field.debug) console.log('onChangeCalendar', name, field);
		}
	}

	onChangeWhere(e) {
		e.preventDefault();
		const name = e.target.name;
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		if (field) {
			let value = e.target.value;
			this.fieldProp(name, {value: value, error: false});
			this.formProp({error: false, updated: true});
			if (field.onChange) field.onChange(name, value, field, this.state.fields);
			if (field.debug) console.log('onChange', name, field);
		}
	}

	onChange(e) {
		e.preventDefault();
		const name = e.target.name;
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		if (field) {
			let value = e.target.value;
			if (field.validate === 'taxID') value = _v.formatTaxID(value);
			if (field.validate === 'ssn') value = _v.formatSSN(value);
			if (field.validate === 'phone') value = _v.formatPhone(value);
			if (field.validate === 'ccexpire') value = _v.formatCCExpire(value);
			if (field.validate === 'money'
				|| field.validate === 'number'
				|| field.validateOpts.validate === 'money'
				|| field.validateOpts.validate === 'number') {
				value = _v.formatNumber(value);
			}
			this.fieldProp(name, {value: value, error: false});
			this.formProp({error: false, updated: true});
			if (field.onChange) field.onChange(name, value, field, this.state.fields);
			if (field.debug) console.log('onChange', name, field);
		}
	}

	onChangeDropdown(name, value) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		let formatValue = value;
		if (field) {
			const arr = [];
			if (field.multi) {
				if (Array.isArray(field.value)) {
					arr.push(...field.value);
				} else {
					if (field.value) arr.push(field.value);
				}
				if (arr.includes(value)) {
					arr.splice(arr.indexOf(value), 1);
				} else {
					arr.push(value);
				}
			} else {
				formatValue = isNaN(value) ? value : parseFloat(value);
			}
			this.fieldProp(name, {value: field.multi ? arr : formatValue, error: false});
			this.formProp({error: false, updated: true});
			if (field.onChange) field.onChange(name, field.multi ? arr : formatValue, field, this.state.fields);
			if (field.debug) console.log('onChangeDropdown', name, field);
		}
	}

	onChangeCheckbox(name) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		if (field) {
			const checked = field.checked ? false : true;
			this.fieldProp(name, {checked: checked, value: checked, error: false});
			this.formProp({error: false, updated: true});
			if (field.onChange) field.onChange(name, checked, this.fieldProp, field, this.state.fields);
			if (field.debug) console.log('onChangeCheckbox', name, field);
		}
	}

	onChangeRadio(name, value) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		if (field) {
			this.fieldProp(name, {checked: value, value: value, error: false});
			this.formProp({error: false, updated: true});
			if (field.onChange) field.onChange(name, value, this.fieldProp, field, this.state.fields);
			if (field.debug) console.log('onChangeRadio', name, field);
		}
	}

	onChangeRichText(name, val, hasText) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		if (field) {
			const value = hasText ? field.wysiwyg === 'hide' ? stripHtml(val) : val : _v.clearRichTextIfShouldBeEmpty(val);
			this.fieldProp(name, {value: value, error: false});
			this.formProp({error: false, updated: true});
			if (field.onChange) field.onChange(name, val, field, hasText);
			if (field.debug) console.log('onChangeRichText', name, field);
		}
	}

	onChangeCCExpire(name, value, field, fields) {
		const length = value.replace('/', '').length;
		if (length === 4) {
			this.focusInput(fields.cvv.ref);
		}
	}

	onChangeCreditCard(name, val, cardType, binData) {
		const obj = _v.formatCreditCard(val);
		const field = this.state.fields[name];
		const value = obj.value;
		const apiValue = obj.apiValue;
		this.fieldProp(name, {value, apiValue, cardType, error: false});

		field.binData = { ...getValue(field, 'binData', {}), ...binData };

		if (cardType === 'amex') {
			this.fieldProp('cvv', { maxLength: 4 });
		} else {
			this.fieldProp('cvv', { maxLength: 3 });
		}
		this.formProp({error: false, updated: true});

		if ((cardType === 'amex' && apiValue.length === 15)
			 || (field.cardType !== 'default' && apiValue.length === 16)) {
				this.fieldProp(name, {checked: true});
				const ccexpire = this.state.fields.ccexpire;
				const ccexpireLength = ccexpire.value.replace('/', '').length;
				if (ccexpireLength === 4) this.focusInput(this.state.fields.cvv.ref);
				else this.focusInput(ccexpire.ref);
		} else {
			this.fieldProp(name, {checked: false});
		}

		if (field.onChange) field.onChange(name, value, cardType, field, this.state.fields);
		if (field.debug) console.log('onChangeCreditCard', name, field);
	}

	onBlur(e) {
		e.preventDefault();
		const name = e.target.name;
		const field = this.state.fields[name];
		let value = e.target.value;
		if (field.validate === 'url') this.fieldProp(name, {value: _v.checkHTTP(value)});
		if (field.onBlur) field.onBlur(name, value, field, this.state.fields);
		if (field.debug) console.log('onBlur', name, field);
	}

	onFocus(e) {
		e.preventDefault();
		const name = e.target.name;
		const field = this.state.fields[name];
		if (field.onFocus) field.onFocus(name, field);
		if (field.debug) console.log('onFocus', name, field);
	}

	calendarField(name, opts) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		const defaults = cloneObj(this.defaults);
		const params = Object.assign({}, defaults, {
			enableTime: false,
			enableTimeOption: false,
			reduceTS: 1000,
			fixedLabel: true,
			rangeRequired: true,
			utc: true
		}, opts);

		if (field) {
			params.dateFormat = field.enableTime  ? 'MM/DD/YYYY H:mm' : 'MM/DD/YYYY';
		} else {
			params.dateFormat = params.enableTime  ? 'MM/DD/YYYY H:mm' : 'MM/DD/YYYY';
		}

		return (
			<CalendarField
				name={name}
				required={field ? field.required : params.required}
				rangeRequired={field ? field.rangeRequired : params.rangeRequired}
				enableTime={field ? field.enableTime : params.enableTime}
				enableTimeOption={params.enableTimeOption}
				enableTimeOptionLabel={params.enableTimeOptionLabel}
				minDate={params.minDate}
				group={field ? field.group : params.group}
				readOnly={field ? field.readOnly : params.readOnly}
				onChangeCalendar={this.onChangeCalendar}
				defaultValue={params.value}
				label={params.label}
				fixedLabel={params.fixedLabel}
				style={params.style}
				className={params.className}
				error={field ? field.error : params.error }
				errorType={params.errorType}
				createField={this.createField}
				params={params}
				overlay={params.overlay}
				overlayDuration={params.overlayDuration}
				dateFormat={params.dateFormat}
				fieldProp={this.fieldProp}
				utc={params.utc}
				allowInput={params.allowInput}
				placeholder={params.placeholder}
			/>
		)
	}

	calendarRange(name, opts) {
		const defaults = cloneObj(this.defaults);
		const params = Object.assign({}, defaults, {
			className: '',
			enableTime: false,
			enableTimeOption: false,
			range1Name: 'range1',
			range1Label: 'Start Date',
			range1Value: '',
			range1EnableTime: false,
			range1EnableTimeOption: false,
			range2Name: 'range2',
			range2Label: 'End Date',
			range2Value: '',
			range2EnableTime: false,
			range2EnableTimeOption: false,
			colWidth: '50%',
			overlay: true,
			required: false,
			rangeRequired: true,
			utc: true
		}, opts);

		return (
			<div style={params.style} className={`field-group`}>
				<div style={{width: params.colWidth}} className='col'>
					{this.calendarField(params.range1Name, { required: params.required, rangeRequired: params.rangeRequired, enableTime: params.range1EnableTime || params.enableTime, placeholder: params.range1Placeholder, enableTimeOption: params.range1EnableTimeOption || params.enableTimeOption, enableTimeOptionLabel: params.enableTimeOptionLabel, value: params.range1Value, label: params.range1Label, range: 'start', rangeEndField: params.range2Name, debug: params.debug, filter: name, validate: 'calendarRange', overlay: params.overlay, overlayDuration: params.overlayDuration, utc: params.utc })}
				</div>
				<div style={{width: params.colWidth}} className='col'>
					{this.calendarField(params.range2Name, { required: params.required, rangeRequired: params.rangeRequired, enableTime: params.range2EnableTime || params.enableTime, placeholder: params.range2Placeholder, enableTimeOption: params.range2EnableTimeOption || params.enableTimeOption, enableTimeOptionLabel: params.enableTimeOptionLabel, value: params.range2Value, label: params.range2Label, range: 'end', rangeStartField: params.range1Name, debug: params.debug, filter: name, validate: 'calendarRange', overlay: params.overlay, overlayDuration: params.overlayDuration, utc: params.utc })}
				</div>
				<div className='clear'></div>
			</div>
		)
	}

	choice(name, opts) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		const defaults = cloneObj(this.defaults);
		const params = Object.assign({}, defaults, {
			type: 'checkbox',
			value: '',
			className: ''
		}, opts);

		let onChange, createField;
		switch (params.type) {
			case 'checkbox': {
				onChange = this.onChangeCheckbox;
				createField = this.createField;
				break;
			}

			case 'radio': {
				onChange = this.onChangeRadio;
				createField = this.createRadioField;
				break;
			}

			// no default
		}

		return (
			<Choice
				name={name}
				type={params.type}
				checked={field ? field.checked : params.checked}
				value={params.value}
				customValue={params.customValue}
				group={field ? field.group : params.group}
				readOnly={field ? field.readOnly : params.readOnly}
				onChange={onChange}
				className={params.className}
				style={params.style}
				label={params.label}
				error={field ? field.error : params.error }
				errorType={params.errorType}
				createField={createField}
				params={params}
				useIcon={params.useIcon}
				color={params.color || this.props.primaryColor}
			/>
		)
	}

	dropdown(name, opts) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		const defaults = cloneObj(this.defaults);
		const params = Object.assign({}, defaults, {
			floatingLabel: true,
			overlay: true,
			fixedLabel: true
		}, opts);

		const defaultValue = field ? field.value : params.value;

		return (
			<Dropdown
				name={name}
				options={params.options}
				required={field ? field.required : params.required}
				group={field ? field.group : params.group}
				readOnly={field ? field.readOnly : params.readOnly}
				onChange={this.onChangeDropdown}
				defaultValue={defaultValue}
				selectLabel={field ? field.selectLabel : params.selectLabel}
				label={params.label}
				floatingLabel={params.floatingLabel}
				fixedLabel={params.fixedLabel}
				style={params.style}
				contentStyle={params.contentStyle}
				className={params.className}
				error={field ? field.error : params.error}
				errorType={params.errorType}
				createField={this.createField}
				value={field ? field.value : ''}
				params={params}
				overlay={params.overlay}
				overlayDuration={params.overlayDuration}
				direction={params.direction}
				multi={field ? field.multi : params.multi}
				multiCloseLabel={params.multiCloseLabel}
				multiCloseCallback={params.multiCloseCallback}
				fieldProp={this.fieldProp}
				formProp={this.formProp}
				inputRef={params.ref}
				color={params.color || this.props.primaryColor}
			/>
		)
	}

	uploadField(name, opts) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		const params = Object.assign({}, cloneObj(this.defaults), {
			className: '',
			type: 'dropdown',
			fixedLabel: true,
			library: {},
			articleID: null
		}, opts);

		return (
			<Upload
				name={name}
				className={params.className}
				label={params.label}
				labelClass={params.labelClass}
				uploadLabel={params.uploadLabel}
				style={params.style}
				required={field ? field.required : params.required}
				group={field ? field.group : params.group}
				onChange={this.onChangeDropzone}
				saveCallback={params.saveCallback || null}
				onBlur={this.onBlur}
				onFocus={this.onFocus}
				value={field ? field.value : params.value}
				error={field ? field.error : params.error }
				errorType={params.errorType}
				createField={this.createField}
				fieldProp={this.fieldProp}
				clear={field ? field.clear : null}
				noPreview={params.noPreview}
				customLink={params.customLink}
				library={params.library}
				disallowModalBgClose={params.disallowModalBgClose}
				closeModalAndSave={this.closeModalAndSave}
				params={params}
				maxSize={params.maxSize}
			/>
		)
	}

	textField(name, opts) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		const params = Object.assign({}, cloneObj(this.defaults), {
			className: '',
			type: 'text'
		}, opts);

		let maxLength;
		switch (params.validate) {
			case 'taxID': {
				maxLength = 10;
				break;
			}
			case 'ssn': {
				maxLength = 11;
				break;
			}
			case 'email': {
				maxLength = 128;
				break;
			}
			case 'emailList': {
				maxLength = 52428800;
				break;
			}
			case 'descriptor': {
				maxLength = 21;
				break;
			}
			case 'cvv': {
				maxLength = field ? field.maxLength : params.maxLength;
				break;
			}
			// no default
		}
		maxLength =  maxLength || params.maxLength;

		return (
			<TextField
				id={params.id}
				name={name}
				className={params.className}
				label={params.label}
				customLabel={params.customLabel}
				fixedLabel={params.fixedLabel}
				style={params.style}
				placeholder={field ? field.placeholder : params.placeholder}
				type={field ? field.type : params.type}
				required={field ? field.required : params.required}
				group={field ? field.group : params.group}
				readOnly={field ? field.readOnly : params.readOnly}
				readOnlyText={field ? field.readOnlyText : params.readOnlyText}
				autoFocus={field ? field.autoFocus : params.autoFocus}
				onChange={this.onChange}
				onBlur={this.onBlur}
				onFocus={this.onFocus}
				value={field ? field.value : params.value}
				error={field ? field.error : params.error }
				errorType={params.errorType}
				maxLength={maxLength}
				createField={this.createField}
				params={params}
				strength={params.strength}
				count={params.count}
				meta={params.meta}
				symbol={params.validateOpts.symbol}
				money={params.validate === 'money' || params.validateOpts.validate === 'money' ? true : false}
				inputRef={params.ref}
				customLink={params.customLink}
				inputMode={params.inputMode}
				color={params.color || this.props.primaryColor}
			/>
		)
	}

	richText(name, opts) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		const defaultParams = cloneObj(this.defaults);
		const params = Object.assign({}, defaultParams, {
			className: '',
			type: 'richText',
			fixedLabel: true,
			autoFocus: true
		}, opts);

		return (
			<RichTextField
				name={name}
				className={params.className}
				label={params.label}
				fixedLabel={params.fixedLabel}
				modal={params.modal}
				modalLabel={params.modalLabel}
				modalID={params.modalID}
				style={params.style}
				placeholder={field ? field.placeholder : params.placeholder}
				required={field ? field.required : params.required}
				group={field ? field.group : params.group}
				autoFocus={field ? field.autoFocus : params.autoFocus}
				onChange={this.onChangeRichText}
				value={field ? field.value : params.value}
				updateContent={field ? field.updateContent || null : null}
				error={field ? field.error : params.error }
				errorType={params.errorType}
				createField={this.createField}
				wysiwyg={params.wysiwyg}
				allowLink={params.allowLink}
				params={params}
				closeModalAndSave={this.closeModalAndSave}
				hideCloseModalAndSaveButtons={params.hideCloseModalAndSaveButtons}
				disallowModalBgClose={params.disallowModalBgClose}
				color={params.color || this.props.primaryColor}
			/>
		)
	}

	closeModalAndSave(id, save = true) {
		this.props.toggleModal(id, false);
		if (save) {
			const form = document.getElementById(`${this.props.id}-saveButton`) || null;
			if (form) form.click();
		}
	}

	modalField(name, opts) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		const defaultParams = cloneObj(this.defaults);
		const params = Object.assign({}, defaultParams, {
			className: '',
			fixedLabel: true
		}, opts);

		return (
			<ModalField
				id={params.id}
				name={name}
				className={params.className}
				label={params.label}
				fixedLabel={params.fixedLabel}
				modalLabel={params.modalLabel}
				style={params.style}
				placeholder={field ? field.placeholder : params.placeholder}
				required={field ? field.required : params.required}
				group={field ? field.group : params.group}
				value={field ? field.value : params.value}
				error={field ? field.error : params.error }
				errorType={params.errorType}
				createField={this.createField}
				opts={params.opts}
				disallowModalBgClose={params.disallowModalBgClose}
				params={params}
			/>
		)
	}

	creditCard(name, opts) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		const defaultParams = cloneObj(this.defaults);
		const params = Object.assign({}, defaultParams, {
			className: '',
			type: 'text',
			cardType: 'default',
			placeholder: 'xxxx xxxx xxxx xxxx',
			validate: 'creditCard',
			hideLabel: false
		}, opts);

		return (
			<CreditCard
				name={name}
				className={params.className}
				cardType={field ? field.cardType : params.cardType}
				checked={field ? field.checked : params.checked}
				label={params.label}
				fixedLabel={params.fixedLabel}
				hideLabel={params.hideLabel}
				style={params.style}
				placeholder={field ? field.placeholder : params.placeholder}
				type={field ? field.type : params.type}
				required={field ? field.required : params.required}
				group={field ? field.group : params.group}
				readOnly={field ? field.readOnly : params.readOnly}
				autoFocus={field ? field.autoFocus : params.autoFocus}
				onChange={this.onChangeCreditCard}
				onBlur={this.onBlur}
				onFocus={this.onFocus}
				value={field ? field.value : params.value}
				error={field ? field.error : params.error }
				errorType={params.errorType}
				createField={this.createField}
				params={params}
				color={params.color || this.props.primaryColor}
			/>
		)
	}

	creditCardGroup(opts) {
		const defaults = cloneObj(this.defaults);
		const params = Object.assign({}, defaults, {
			className: '',
			required: true
		}, opts);

		const cvvModal =
			<div className='cvvModal'>
				<ModalRoute modalRootClass={params.cvvModalRootClass} id='cvvModal' component={() => { return <CVVModal /> }} effect='3DFlipVert' style={{ width: '60%' }} />
				<ModalLink allowCustom={true} customColor={this.props.primaryColor} id='cvvModal'>What is CVV?</ModalLink>
			</div>
		;

		return (

			<div style={params.style} className={`field-group creditCard-group`}>
				<div className='creditCard col'>
					{this.creditCard('ccnumber', {label: params.ccnumberLabel || 'Credit Card', fixedLabel: params.ccnumberfixedLabel || true, hideLabel: params.hideLabel, placeholder: params.placeholder, readOnly: params.readOnly, required: params.required, onChange: params.onChange, onBlur: params.onBlur, debug: params.debug})}
				</div>
				<div className='ccexpire col'>
					{this.textField('ccexpire', {label: params.ccxpireLabel || 'Expiration', fixedLabel: params.ccexpirefixedLabel || true, placeholder: 'MM/YY', required: params.required, value: params.ccexpireValue || '', validate: 'ccexpire', maxLength: 5, count: false, debug: params.debug, inputMode: 'numeric', onChange: this.onChangeCCExpire, onBlur: params.onBlurCCExpire })}
				</div>
				<div className='cvv col'>
					{this.textField('cvv', {label: 'CVV', customLabel: cvvModal, fixedLabel: true, placeholder: 'CVV', required: params.required, maxLength: 3, count: false, debug: params.debug, validate: 'number', inputMode: 'numeric', onBlur: params.onBlurCVV })}
				</div>
				<div className='clear'></div>
			</div>
		)
	}

	echeckGroup(opts) {
		const defaults = cloneObj(this.defaults);
		const params = Object.assign({}, defaults, {
			className: '',
			required: true
		}, opts);

		const cvvModal =
			<div className='cvvModal'>
				<ModalRoute modalRootClass={params.cvvModalRootClass} id='cvvModal' component={() => { return <CVVModal /> }} effect='3DFlipVert' style={{ width: '60%' }} />
				<ModalLink allowCustom={true} customColor={this.props.primaryColor} id='cvvModal'>What is CVV?</ModalLink>
			</div>
		;

		return (

			<div style={params.style} className={`field-group echeck-group`}>
				<div className='col'>
					{this.creditCard('ccnumber', {label: params.ccnumberLabel || 'Credit Card', fixedLabel: params.ccnumberfixedLabel || true, hideLabel: params.hideLabel, placeholder: params.placeholder, readOnly: params.readOnly, required: params.required, debug: params.debug})}
				</div>
				<div className='ccexpire col'>
					{this.textField('ccexpire', {label: params.ccxpireLabel || 'Expiration', fixedLabel: params.ccexpirefixedLabel || true, placeholder: 'MM/YY', required: params.required, value: params.ccexpireValue || '', validate: 'ccexpire', maxLength: 5, count: false, debug: params.debug, inputMode: 'numeric', onChange: this.onChangeCCExpire })}
				</div>
				<div className='cvv col'>
					{this.textField('cvv', {label: 'CVV', customLabel: cvvModal, fixedLabel: true, placeholder: 'CVV', required: params.required, maxLength: 3, count: false, debug: params.debug, inputMode: 'numeric'})}
				</div>
				<div className='clear'></div>
			</div>
		)
	}

	whereField(name, opts) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		const params = Object.assign({}, cloneObj(this.defaults), {
			className: '',
			type: 'text',
			maxLength: 128,
			googleMaps: {},
			where: {},
			fixedLabel: true
		}, opts);

		return (
			<WhereField
				name={name}
				className={params.className}
				label={params.label}
				fixedLabel={params.fixedLabel}
				style={params.style}
				placeholder={field ? field.placeholder : params.placeholder}
				modalLabel={params.modalLabel}
				modalID={params.modalID || 'defaultWhereField'}
				manualLabel={params.manualLabel}
				type={field ? field.type : params.type}
				required={field ? field.required : params.required}
				group={field ? field.group : params.group}
				readOnly={field ? field.readOnly : params.readOnly}
				autoFocus={field ? field.autoFocus : params.autoFocus}
				onChange={this.onChangeWhere}
				onBlur={this.onBlur}
				onFocus={this.onFocus}
				value={field ? field.value : params.value}
				error={field ? field.error : params.error }
				errorType={params.errorType}
				maxLength={params.maxLength}
				createField={this.createField}
				params={params}
				meta={params.meta}
				fieldProp={this.fieldProp}
				dropdown={this.dropdown}
				field={field}
				fields={this.state.fields}
				textField={this.textField}
				closeModalAndSave={this.closeModalAndSave}
				disallowModalBgClose={params.disallowModalBgClose}
			/>
		)
	}

	colorPicker(name, opts) {
		const field = has(this.state.fields, name) ? this.state.fields[name] : null;
		const params = Object.assign({}, cloneObj(this.defaults), {
			className: '',
			fixedLabel: true
		}, opts);

		return (
			<ColorPicker
				name={name}
				className={params.className}
				fixedLabel={params.fixedLabel}
				label={params.label}
				style={params.style}
				required={field ? field.required : params.required}
				group={field ? field.group : params.group}
				onChange={this.onChange}
				saveCallback={params.saveCallback || null}
				onBlur={this.onBlur}
				onFocus={this.onFocus}
				value={field ? field.value : params.value}
				error={field ? field.error : params.error }
				errorType={params.errorType}
				createField={this.createField}
				fieldProp={this.fieldProp}
				formProp={this.formProp}
				clear={field ? field.clear : null}
				params={params}
				toggleModal={this.props.toggleModal}
				disallowModalBgClose={params.disallowModalBgClose}
			/>
		)
	}

	/**
	* Get Errors returned from the API
	* @param {object} err Error response returned
	*
	* TODO: get this cleaned up on the API side to have consistent responses
	*/
	getErrors(err, returnCode = false) {
		let error = false;
		let code = getValue(err, 'code');

		// Make sure the response has data prop before continuing
		if (has(err, 'data')) {
			const data = err.data;
			code = getValue(data, 'code');
			// Handle single error
			if (has(data, 'message')) {
				if (data.code === 'vantiv_payfac' && this.props.hideVantivErrors) {
					// Show the hideVantivErrors message
					if (!returnCode) this.formProp({ error: true, errorMsg: `${this.props.hideVantivErrors}` });
					error = this.props.hideVantivErrors;
				} else {
					if (!returnCode) this.formProp({ error: true, errorMsg: `${data.message}` });
					error = data.message;
				}
			}

			if (has(data, 'errors')) {

				// Handle multiple errors
				const errors = data.errors;
				for (let i=0; i <= errors.length; i++) {
					if (!isEmpty(errors[i])) {
						if (has(errors[i], 'field')) {
							if (has(this.state.fields, errors[i].field)) {
								if (!returnCode) this.fieldProp(errors[i].field, { error: `The following error occurred while saving, ${errors[i].message}` });
							}
						}
						if (has(errors[i], 'message')) {
							error = i === 0 ? errors[0].message : `${error}, ${errors[i].message}`;
						}
					}
				}
				if (!returnCode) this.formProp({ error: true, errorMsg: `Error saving: ${error}` });
			}
		}

		if (!error && (typeof err === 'string')) error = err;
		return returnCode ? code : error;
	}

	formSaved(callback, msg = '', timeout = 2500) {
		this.formProp({saved: true, savedMsg: msg || _v.msgs.success, updated: false });
		if (timeout) {
			this.formSavedTimeout = setTimeout(() => {
				if (callback) callback();
				this.formProp({saved: false, savedMsg: this.state.savedMsg});
				this.formSavedTimeout = null;
			}, timeout);
		}
		return;
	}

	saveButton(callback, opts = {}) {
		const defaults = {
			label: 'Save',
			style: {},
			className: '',
			allowDisabled: false,
			group: 'submitAll'
		}
		const options = { ...defaults, ...opts };
		const id = `${this.props.id}-saveButton`;
		return (
			<button ref={this.saveButtonRef} id={id} className={`button ${options.className}`} style={options.style} type='button' disabled={!this.state.updated && options.allowDisabled ? true : false} onClick={(e) => this.validateForm(e, callback, options.group)}>{options.label}</button>
		)
	}

	errorAlert() {
		return (
			<Alert alert='error' display={this.state.error} msg={this.state.errorMsg} />
		);
	}

	successAlert() {
		return (
			<Alert alert='success' display={this.state.saved} msg={this.state.savedMsg} />
		);
	}

	fieldError(name, msg) {
		let error = false;
		if (has(this.state.fields, name)) {
			if (this.state.fields[name].error) error = this.state.fields[name].error;
		}
		return (
			<div className={`error ${!error && 'displayNone'}`}>{msg ? msg : error}</div>
		)
	}

	checkForErrors(fields, group) {
		let error = false;
		Object.entries(fields).forEach(([key, value]) => {
			if (value.group === group || value.group === 'all' || group === 'submitAll') {
				if (value.error) error = true;
			}
		});
		this.formProp({error: error});
		return error;
	}

	validateForm(e, callback, group = 'default', cbCallback = null) {
		if (e) e.preventDefault();
		let bindthis = this;
		let fields = this.state.fields;
		const groupFields = {};
		Object.entries(fields).forEach(([key, value]) => {
			if ((value.group === group || value.group === 'all' || group === 'submitAll') && value.autoReturn) {
				groupFields[key] = value;
				if (value.required && !value.value) {
					bindthis.fieldProp(key, {error: value.label ? `${value.label} is required.` : _v.msgs.required});
				} else {
					bindthis.validateField(key, value.validate, value.value, value.validateOpts, value.parent, value);
				}
			}
		});
		const error = this.checkForErrors(fields, group);
		if (!error) {
			if (callback) callback(groupFields, cbCallback, group);
			return true;
		} else {
			return false;
		}
	}

	validateField(key, validate, value, opts = {}, parent, field) {
		let min, max, errorMsg, format;
		switch (validate) {
			case 'custom':
				if (!opts.custom(key, value, parent)) this.fieldProp(key, { error: opts.errorMsg || `Custom validation error for ${key}.` });
				break;
			case 'date':
				format = opts.format || null;
				min = opts.min || null;
				max = opts.max || null;
				errorMsg = min && max ? `Please enter a date between ${min} and ${max}.`
				: min && !max ? `Please enter a date after ${min}.`
				: !min && max ? `Please enter a date before ${max}.`
				: `default error`;
				if (value) if (!_v.validateDate(value, { min: min, max: max, format: format })) this.fieldProp(key, {error: opts.errorMsg || errorMsg});
				break;
			case 'emailList':
				const optional = opts.optional || false;
				if (value) if (!_v.validateEmailList(value, optional)) this.fieldProp(key, {error: opts.errorMsg || _v.msgs.emailList});
				break;
			case 'email':
				if (value) if (!_v.validateEmail(value)) this.fieldProp(key, {error: opts.errorMsg || _v.msgs.email});
				break;
			case 'password':
				if (value) if (!_v.validatePassword(value)) this.fieldProp(key, {error: opts.errorMsg || _v.msgs.password});
				break;
			case 'taxID':
				if (value) if (!_v.validateTaxID(value)) this.fieldProp(key, {error: opts.errorMsg || _v.msgs.taxID});
				break;
			case 'ssn':
				if (value) if (!_v.validateTaxID(value)) this.fieldProp(key, {error:opts.errorMsg ||  _v.msgs.ssn});
				break;
			case 'phone':
				if (value) if (!_v.validatePhone(value)) this.fieldProp(key, {error: opts.errorMsg || _v.msgs.phone});
				break;
			case 'descriptor':
				if (value) if (!_v.validateDescriptor(value)) this.fieldProp(key, {error: opts.errorMsg || _v.msgs.descriptor});
				break;
			case 'url':
				if (value) if (!_v.validateURL(value)) this.fieldProp(key, {error: opts.errorMsg || _v.msgs.url});
				break;
			case 'number':
			case 'money':
				const decimal = opts.decimal ? true : false;
				min = opts.min || _v.limits.txMin;
				max = opts.max || _v.limits.txMax;
				errorMsg = opts.errorMsg || `Please enter a valid ${validate === 'money' ? 'amount' : 'number'} between ${numberWithCommas(min)} to ${numberWithCommas(max)}`;
				const error = decimal ? errorMsg : `${errorMsg} with no decimal point.`;
				if (value) if (!_v.validateNumber(value, min, max, decimal )) this.fieldProp(key, {error: error});
				break;
			case 'calendarRange':
				if (value) if (!_v.validateCalendarRange(key, this.state.fields)) this.fieldProp(key, {error: _v.msgs.calendarRange});
				break;
			case 'creditCard':
				if (value) if (!_v.validateCardTypes(value)) this.fieldProp(key, {error: _v.msgs.creditCard});
				break;
			case 'address':
				if (value) if (!_v.validateAddress(value)) this.fieldProp(key, {error: opts.errorMsg || _v.msgs.address});
				break;
			case 'googleMaps':
				let locationError = false;
				if (value && field) {
					if (has(field, 'googleMaps')) {
						if (isEmpty(field.googleMaps)) locationError = true;
					} else {
						locationError = true;
					}
					if (locationError) {
						this.fieldProp(key, { error: 'Google maps could not find address. Please try again or manually enter address.'});
					}
				}
				break;

			// no default
		}
	}

	renderChildren() {
		const childrenWithProps = React.Children.map(this.props.children,
			(child) => React.cloneElement(child, {
				validateForm: this.validateForm,
				formProp: this.formProp,
				fieldProp: this.fieldProp,
				fieldRef: this.fieldRef,
				multiFieldProp: this.multiFieldProp,
				formSaved: this.formSaved,
				saveButton: this.saveButton,
				getErrors: this.getErrors,
				formState: this.state,
				textField: this.textField,
				whereField: this.whereField,
				uploadField: this.uploadField,
				colorPicker: this.colorPicker,
				richText: this.richText,
				modalField: this.modalField,
				creditCardGroup: this.creditCardGroup,
				dropdown: this.dropdown,
				choice: this.choice,
				calendarField: this.calendarField,
				calendarRange: this.calendarRange,
				savingErrorMsg: _v.msgs.savingError,
				responseData: this.props.responseData,
				fieldError: this.fieldError,
				errorAlert: this.errorAlert,
				successAlert: this.successAlert,
				name: this.props.name,
				onChangeDropdown: this.onChangeDropdown,
				toggleModal: this.props.toggleModal
			})
		);
		return childrenWithProps;
	}

	render() {

		const {
			id,
			name,
			className,
			errorMsg,
			successMsg
		} = this.props;

		return (
			<form
				autoComplete='nope'
				name={name}
				id={id}
				className={`${id} ${className || ''}`}
				onSubmit={this.validateForm}
				noValidate={true}
			>
				<input autoComplete="false" name="hidden" type="text" style={{ display: 'none' }} />
				{this.props.showLoader === 'display' && this.props.isSending && <Loader msg={'Sending data'} />}
				{errorMsg && this.errorAlert()}
				{successMsg && this.successAlert()}
				{this.renderChildren()}
			</form>
		);
	}
}

Form.defaultProps = {
	errorMsg: true,
	successMsg: true,
	hideVantivErrors: false,
	showLoader: 'display',
	alwaysSubmitOnEnter: false,
	neverSubmitOnEnter: false
}

function mapStateToProps(state, props) {
	let id = props.name + '-form';
	let responseData;
	if (has(state.send, props.name)) responseData = state.send[props.name].response;
	return {
		id: id,
		isSending: state.send.isSending,
		responseData: responseData,
		modals: state.modal ? state.modal : {}
	}
}


export default connect(mapStateToProps, {
	toggleModal
})(Form)
