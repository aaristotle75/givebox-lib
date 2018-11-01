import React, {Component} from 'react';

class GBLink extends Component{

	linkStyle() {
		const primaryColor = this.props.primaryColor;
		let style = {
			color: `${primaryColor}`,
		}
		return { ...style, ...this.props.style};
	}

	render() {
		const { id, onClick, href, target, className } = this.props;

		return (
      <a id={id} className={className} href={href} onClick={onClick} style={this.linkStyle} target={target}>
        {this.props.children}
      </a>
		)
	}
};

GBLink.defaultProps = {
	primaryColor: "#00BCD4"
}

export default GBLink;
