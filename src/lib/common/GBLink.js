import React, {Component} from 'react';

class GBLink extends Component{
	constructor(props){
		super(props);
	}

	linkStyle(primaryColor) {
		var primaryColor = this.props.primaryColor;
		var style = {
			color: `${primaryColor}`,
		}
		return Object.assign(style, this.props.style);
	}

	render() {
		const { id, onClick, href, primaryColor, target, className } = this.props;

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
