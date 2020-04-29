import React, { PureComponent } from 'react';
import {
	util,
	ModalLink,
	GBLink
} from '../../';

export default class Button extends PureComponent {

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
			button
		} = this.props;

		const type = util.getValue(button, 'type', 'button');
		const style = util.getValue(button, 'style', {});
		const fontSize = util.getValue(style, 'fontSize', 16);
		const paddingTopBottom = fontSize >= 20 ? 15 : 10;
		style.borderRadius = `${util.getValue(style, 'borderRadius', 0)}px`;
		style.fontSize = `${fontSize}px`;
		style.width = util.getValue(style, 'width');
		style.padding = `${paddingTopBottom}px 25px`;

		return (
			<>
			{modalID ?
				<ModalLink style={style} customColor={util.getValue(style, 'bgColor', null)} solidColor={type === 'button' ? true : false} allowCustom={true} className={`${type}`} id={modalID}>
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
