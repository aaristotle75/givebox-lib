import React, { Component } from 'react';
import PasswordStrength from './PasswordStrength';
import CharacterCount from './CharacterCount';
import Fade from '../common/Fade';

class TextField extends Component {

	constructor(props) {
		super(props);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.inputRef = React.createRef();
		this.state = {
			status: 'idle'
		}
	}

	componentDidMount() {
		const params = Object.assign({}, this.props.params, { ref: this.props.inputRef || this.inputRef });
		if (params.type === 'hidden') params.required = false;
		if (this.props.createField) this.props.createField(this.props.name, params);
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

	render() {

		const {
			id,
			name,
			type,
			placeholder,
			autoFocus,
			required,
			readOnly,
			style,
			inputStyle,
			label,
			customLabel,
			fixedLabel,
			className,
			error,
			errorType,
			maxLength,
			value,
			strength,
			count,
			symbol,
			money,
			inputRef,
			inputMode,
			color,
			moneyStyle,
			autoComplete
		} = this.props;

		const {
			status
		} = this.state;

		const labelStyle = {
			color: status === 'active' ? color : ''
		};
		const inputBottomStyle = {
			background: status === 'active' ? color : ''
		};

		const readOnlyText = this.props.readOnlyText || `${label} is not editable`;

		return (
				<div style={style} className={`input-group ${className || ''} textfield-group ${readOnly ? 'readOnly tooltip' : ''} ${error ? 'error tooltip' : ''} ${type === 'hidden' && 'hidden'} ${money ? 'money-group' : ''}`}>
					<div className={`floating-label ${this.state.status} ${fixedLabel && 'fixed'}`}>
						{money && <div style={moneyStyle} className={`moneyAmount ${value ? 'active' : 'noValue'}`}><span className='symbol'>{symbol}</span></div>}
						<input
							autoFocus={autoFocus}
							id={id || name}
							ref={inputRef || this.inputRef}
							name={name}
							type={type}
							placeholder={placeholder}
							required={type === 'hidden' ? false : required}
							readOnly={readOnly}
							onChange={this.props.onChange}
							onBlur={this.onBlur}
							onFocus={this.onFocus}
							autoComplete={autoComplete}
							value={value}
							maxLength={maxLength}
							style={inputStyle}
							inputMode={inputMode}
						/>
						{label && <label style={labelStyle} htmlFor={name}>{customLabel || label}</label>}
						<div style={inputBottomStyle} className={`input-bottom ${error ? 'error' : this.state.status}`}></div>
						{this.props.children}
						{strength && <PasswordStrength password={value} error={error} />}
						{<div className='customLink'>{this.props.customLink}</div> || ''}
						{count && type !== 'password' && type !== 'hidden' &&
							<Fade in={this.state.status === 'active' && value ? true : false} duration={200}>
								<CharacterCount max={maxLength} count={value.length} />
							</Fade>
						}
					</div>
					<div className={`tooltipTop ${(errorType !=='tooltip' || strength) && 'displayNone'}`}>
						{error}{readOnly ? readOnlyText : ''}
						<i></i>
					</div>
					<div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
				</div>
		);
	}
}

TextField.defaultProps = {
	name: 'defaultTextField',
	type: 'text',
	maxLength: 64,
	symbol: '$',
	money: false,
	inputRef: null,
	inputStyle: {},
	moneyStyle: {},
	autoComplete: 'nope'
}

export default TextField;
