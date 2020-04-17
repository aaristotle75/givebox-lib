import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
	ModalLink
} from '../../';

class Button extends Component {

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
			button
		} = this.props;

		const type = util.getValue(button, 'type', 'button');
		const fontSize = util.getValue(button, 'fontSize', 16);
		const paddingTopBottom = fontSize >= 20 ? 15 : 10;		
		const style = {}
		style.borderRadius = `${util.getValue(button, 'borderRadius', 20)}px`;
		style.fontSize = `${fontSize}px`;
		style.width = util.getValue(button, 'width');
		style.padding = `${paddingTopBottom}px 25px`;

    return (
			<ModalLink style={style} customColor={util.getValue(button, 'bgColor', null)} solidColor={type === 'button' ? true : false} allowCustom={true} className={`${type}`} id={modalID}>
				{util.getValue(button, 'text', 'Button Text')}
			</ModalLink>
    )
  }
}

Button.defaultProps = {
}

function mapStateToProps(state, props) {

	const primaryColor = util.getValue(state.custom, 'primaryColor');

  return {
		primaryColor
	}
}

export default connect(mapStateToProps, {
})(Button);
