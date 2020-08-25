import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	Fade,
	GBLink,
	Icon
} from '../../';
import '../../styles/gbx3Helper.scss';
//import { FiCheckCircle } from 'react-icons/fi';

class HelperPopup extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			open: true
		}
	}

	componentDidMount() {
	}

	render() {

		const {
			helper,
			targetElement: el
		} = this.props;

		const {
			open
		} = this.state;

		const helperClass = util.getValue(helper, 'className');
		const helperStyle = util.getValue(helper, 'style');
		const offsetTop = -110;
		const style = {};

		const rect = el.getBoundingClientRect();
		style.top = rect.y + offsetTop + util.getValue(helperStyle, 'top', 0);
		style.left = rect.x + util.getValue(helperStyle, 'left', 0);

		return (
			<Fade in={open}>
				<div
					className='gbx3Helper'
					style={{
					...util.getValue(helper, 'style', {}),
					...style
					}}
				>
					<div className='helperContainer'>
						<div className='closeBtn' onClick={() => this.props.onClick('close')}><span className='icon icon-x'></span></div>
						<div onClick={() => this.props.onClick('edit')} className={`helperBubble ${helperClass}`}>
							<h1>{util.getValue(helper, 'title')}</h1>
							<span className='text'>{util.getValue(helper, 'text')}</span>
						</div>
						<div className='helperDefaultActions'>
							<GBLink onClick={() => this.props.onClick('turnOff')}><span style={{ marginRight: 2 }} className='icon icon-x'></span> Turn Off Help</GBLink>
							<GBLink onClick={() => this.props.onClick('doLater')}>Skip <span style={{ marginLeft: 2 }} className='icon icon-chevron-right'></span></GBLink>
						</div>
					</div>
				</div>
			</Fade>
		)
	}
}

function mapStateToProps(state, props) {

	return {
	}
}

export default connect(mapStateToProps, {
})(HelperPopup);
