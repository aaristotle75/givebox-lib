import React, {Component} from 'react';

class GBLink extends Component {

	linkStyle() {
		const style = {
			color: `${this.props.primaryColor}`
		};
		return { ...style, ...this.props.style};
	}

	render() {
		const {
			id,
			onClick,
			onMouseEnter,
			onMouseLeave,
			className,
			style,
			primaryColor,
			disabled
		} = this.props;

		const color = primaryColor ? { color: primaryColor } : {};
		const mergeStyle = { ...style, ...color };

		return (
      <button disabled={disabled} type='button' id={id} className={className || 'link'} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={mergeStyle}>
        {this.props.children}
      </button>
		)
	}
};

GBLink.defaultProps = {
	primaryColor: '',
	style: {},
	disabled: false
}

export default GBLink;
