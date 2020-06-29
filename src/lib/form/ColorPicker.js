import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PhotoshopPicker } from 'react-color';
import {
	ModalRoute,
	ModalLink,
	util
} from '../';
import { toggleModal } from '../api/actions';

class ColorPicker extends Component {

	constructor(props) {
		super(props);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onAccept = this.onAccept.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.renderColorPicker = this.renderColorPicker.bind(this);
		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.inputRef = React.createRef();
		this.state = {
			status: 'idle',
			hex: this.props.value || this.props.defaultColor
		}
	}

	componentDidMount() {
		const params = Object.assign({}, this.props.params, { ref: this.props.ref || this.inputRef });
		if (this.props.createField) this.props.createField(this.props.name, params);
		if (this.props.open) this.props.toggleModal(this.props.modalID, this.props.open);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.open !== this.props.open) {
			this.props.toggleModal(this.props.modalID, this.props.open);
		}
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	onFocus(e) {
		e.preventDefault();
		this.setState({status: 'active'});
		if (this.props.onFocus) this.props.onFocus(e);
	}

	onBlur(e) {
		e.preventDefault();
		this.setState({status: 'idle'});
		if (this.props.onBlur) this.props.onBlur(e);
	}

	onChange(color, e) {
		this.timeout = setTimeout(() => {
			this.setState({ hex: util.getValue(color, 'hex', color) });
			this.timeout = null;
		}, 0);
	}

	onAccept(res) {
		if (this.props.fieldProp) {
			this.props.fieldProp(this.props.name, { value: this.state.hex });
			this.props.formProp({ updated: true });
		}
		if (this.props.onAccept) this.props.onAccept(this.props.name, this.state.hex);
		if (this.props.modal) this.props.toggleModal(this.props.modalID, false);
	}

	onCancel() {
		this.setState({ hex: this.props.value || this.props.defaultColor });
		if (this.props.onCancel) this.props.onCancel(this.props.modalID);
		this.props.toggleModal(this.props.modalID, false);
	}

	onMouseEnter(e) {
		e.preventDefault();
		if (!this.props.error) this.setState({status: 'active'});
	}

	onMouseLeave(e) {
		e.preventDefault();
		this.setState({status: 'idle'});
	}

	renderExtraColors() {
		const {
			extraColors,
			extraColorsHeader
		} = this.props;
		const colors = [];
		const items = [];
		if (!util.isEmpty(extraColors)) {
			extraColors.forEach((value) => {
				if (!colors.includes(value)) {
					items.push(
						<div key={value} onClick={() => this.onChange(value)} style={{ background: value, height: 30, width: 30 }} className='extraColorSquare'></div>
					);
					colors.push(value);
				}
			});
		}
		if (!util.isEmpty(items)) {
			return (
				<div className='extraColorsContainer'>
					<div className='extraColorsHeader'>{extraColorsHeader}</div>
					<div className='extraColors'>
						{items}
					</div>
				</div>
			)
		} else {
			return '';
		}
	}

	renderColorPicker() {
		const item = [];
		const style = {
			default: {
				head: {
					background: '#fff',
					backgroundImage: 'none',
					fontSize: '1.5em',
					fontWeight: 300,
					border: 0,
					marginBottom: 20,
					boxShadow: 'none',
					color: '#465965'
				},
			}
		};

		const picker =
			<PhotoshopPicker
				styles={style}
				header={this.props.label}
				color={this.state.hex}
				onChangeComplete={this.onChange}
				onAccept={this.onAccept}
				onCancel={this.onCancel}
			/>
		;
		if (this.props.modal) {
			item.push(
				<div key={'colorPicker'} className='modalWrapper'>
					<div className='flexCenter flexColumn'>
						{picker}
						{this.renderExtraColors()}
					</div>
				</div>
			);
		} else {
			item.push(
				<div key={'colorPicker'}>
					{picker}
					{this.renderExtraColors()}
				</div>
			);
		}

		return item;
	}

	render() {

		const {
			name,
			label,
			fixedLabel,
			style,
			className,
			error,
			errorType,
			modal,
			modalLabel,
			modalID,
			opts,
			value,
			disallowModalBgClose
		} = this.props;

		let renderModalLabel = <span>{modalLabel}</span>;
		if (value) {
			renderModalLabel =
				<span className='colorPickerLabel'>
					<span style={{ background: value }} className='colorPickerExample'></span>
					<span className='colorPickerText'>{value}</span>
				</span>;
		}

		return (
				<div style={style} className={`input-group ${className || ''} colorpicker-group ${error ? 'error tooltip' : ''}`}>
					<div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
					{modal ?
					<div className={`floating-label ${this.state.status} ${fixedLabel && 'fixed'}`}>
						<div>
						<ModalRoute id={modalID} component={() => this.renderColorPicker()} />
						<ModalLink onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} className={`input ${value ? 'hasValue' : ''}`} id={modalID} opts={{ ...opts, disallowBgClose: disallowModalBgClose}}>{renderModalLabel}</ModalLink>
						</div>
						{label && <label htmlFor={name}>{label}</label>}
						<div className={`input-bottom ${error ? 'error' : this.state.status}`}></div>
					</div>
					:
					<div>{this.renderColorPicker()}</div>
					}
					<div className={`tooltipTop ${(errorType !=='tooltip') && 'displayNone'}`}>
						{error}
						<i></i>
					</div>
					<div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
				</div>
		);
	}
}

ColorPicker.defaultProps = {
	name: 'defaultColorPicker',
	modal: true,
	modalLabel: 'Select Color',
	modalID: 'colorPicker',
	defaultColor: '#45a8dc',
	extraColorsHeader: 'Current Color Pallete'
}

function mapStateToProps(state, props) {
	return {
	}
}

export default connect(mapStateToProps, {
	toggleModal
})(ColorPicker);
