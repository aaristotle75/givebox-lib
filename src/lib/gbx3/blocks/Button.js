import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
	util,
	ModalLink,
	GBLink
} from '../../';

class Button extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
	}

	render() {

		const {
			modalID,
			onClick,
			button,
			globalButtonStyle
		} = this.props;

		const type = util.getValue(button, 'type', 'button');
		const style = { ...globalButtonStyle, ...util.getValue(button, 'style', {}) };

		const fontSize = parseInt(util.getValue(style, 'fontSize', 16));
		const paddingTopBottom = fontSize >= 20 ? 15 : 10;


		style.width = util.getValue(style, 'width', 150);
		style.fontSize = fontSize;
		style.padding = `${paddingTopBottom}px 25px`;
		style.minWidth = 150;

		return (
			<>
			{modalID ?
				<ModalLink opts={this.props.opts} style={style} customColor={util.getValue(style, 'bgColor', null)} solidColor={type === 'button' ? true : false} allowCustom={true} className={`${type}`} id={modalID}>
					{util.getValue(button, 'text', 'Button Text')}
				</ModalLink>
				:
				<GBLink style={style} customColor={util.getValue(style, 'bgColor', null)} solidColor={type === 'button' ? true : false} allowCustom={true} className={`${type}`} onClick={onClick}>
					{util.getValue(button, 'text', 'Button Text')}
				</GBLink>
			}
			</>
		)
	}
}

Button.defaultProps = {
	opts: {}
};

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const globals = util.getValue(gbx3, 'globals', {});
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});
	const gbxPrimaryColor = util.getValue(gbxStyle, 'primaryColor');
	const globalButton = util.getValue(globals, 'button', {});
	const globalButtonStyle = util.getValue(globalButton, 'style', {});
	const primaryColor = util.getValue(globalButton, 'bgColor', gbxPrimaryColor);

	return {
		primaryColor,
		globalButton,
		globalButtonStyle
	}
}

export default connect(mapStateToProps, {
})(Button);
