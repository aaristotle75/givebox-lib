import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	Fade,
	GBLink,
	Icon,
	ColorPicker
} from '../../';
import '../../styles/gbx3Helper.scss';
import {
	updateGlobal,
	updateData,
	saveGBX3
} from '../redux/gbx3actions';
//import { FiCheckCircle } from 'react-icons/fi';

class HelperPopup extends React.Component {

	constructor(props) {
		super(props);
		this.updatePrimaryColor = this.updatePrimaryColor.bind(this);
		this.renderHelperTypeExtra = this.renderHelperTypeExtra.bind(this);
		this.state = {
			open: true,
			openColorPicker: false
		}
	}

	componentDidMount() {
	}

	async updatePrimaryColor(value) {

		const {
			blockType
		} = this.props;

		let globalName = 'gbxStyle';

		const globalUpdated = await this.props.updateGlobal(globalName, {
			primaryColor: value,
			backgroundColor: value
		});
		if (globalUpdated) {
			this.props.saveGBX3(blockType);
		}
	}

	renderHelperTypeExtra() {
		const {
			helper
		} = this.props;

		const {
			openColorPicker
		} = this.state;

		const item = [];

		switch (util.getValue(helper, 'type')) {
			case 'color': {
				item.push(
					<div key={'color'} className='helperColorPicker'>
						<ColorPicker
							open={openColorPicker}
							name='primaryColor'
							fixedLabel={false}
							label=''
							onAccept={(name, value) => {
								this.updatePrimaryColor(value);
							}}
							onCancel={() => console.log('colorPicker cancel')}
							value={''}
							modalID={'helperPrimaryColorPicker'}
							opts={{
								customOverlay: {
									zIndex: 9999909
								}
							}}
						/>
					</div>
				);
				break;
			}

			case 'block':
			case 'share':
			default: {
				break;
			}
		}
		return item;
	}

	render() {

		const {
			helper,
			isLastStep,
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
			<div
				className='gbx3Helper'
				style={{
				...util.getValue(helper, 'style', {}),
				...style
				}}
			>
				<div
					className='helperContainer'
					style={{
						opacity: open ? 1 : 0
					}}
				>
					<div className='closeBtn' onClick={() => this.props.onClick('close')}><span className='icon icon-x'></span></div>
					<div onClick={() => this.props.onClick('edit')} className={`helperBubble ${helperClass}`}>
						<h1>{util.getValue(helper, 'title')}</h1>
						<span className='text'>{util.getValue(helper, 'text')}</span>
						{this.renderHelperTypeExtra()}
					</div>
					<div className='helperDefaultActions'>
						<GBLink onClick={() => this.props.onClick('turnOff')}><span style={{ marginRight: 2 }} className='icon icon-x'></span> Turn Off Help</GBLink>
						{ !isLastStep ?
						<GBLink onClick={() => this.props.onClick('doLater')}>{util.getValue(helper, 'skipText', 'Skip')} <span style={{ marginLeft: 2 }} className='icon icon-chevron-right'></span></GBLink> :
						<GBLink onClick={() => this.props.onClick('close')}>Continue Designing <span style={{ marginLeft: 2 }} className='icon icon-chevron-right'></span></GBLink>
						}
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	return {
	}
}

export default connect(mapStateToProps, {
	updateGlobal,
	saveGBX3
})(HelperPopup);
