import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	TextField,
	ColorPicker,
	Dropdown,
	Collapse
} from '../../';

class BackgroundsEdit extends Component {

	constructor(props) {
		super(props);
		this.updateBackground = this.updateBackground.bind(this);
		this.state = {
		};
		this.mounted = false;
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	updateBackground(background) {
		this.props.setBackground(background);
	}

	render() {

		const {
			background,
			primaryColor
		} = this.props;

		const bgColor = util.getValue(background, 'bgColor', primaryColor);

		const extraColors = [
			primaryColor,
			bgColor
		];

		const opacity = +(util.getValue(background, 'opacity', 1) * 100);

		return (
			<div className='modalWrapper'>
				<Collapse
					label={'Edit Background'}
					iconPrimary='edit'
					id={'gbx3-background-edit'}
				>
					<div className='formSectionContainer'>
						<div className='formSection'>
							<ColorPicker
								name='bgColor'
								fixedLabel={true}
								label='Background Color'
								onAccept={(name, value) => {
									this.updateBackground({
										bgColor: value
									});
								}}
								value={bgColor}
								modalID='backgroundsEdit-bgColor'
								opts={{
									customOverlay: {
										zIndex: 9999909
									}
								}}
								extraColors={extraColors}
							/>
							<Dropdown
								portalID={`backgroundsEdit-opacity`}
								portal={true}
								name='opacity'
								contentWidth={100}
								label={'Page Background Opacity'}
								fixedLabel={true}
								defaultValue={opacity}
								onChange={(name, value) => {
									const opacity = +(value / 100);
									this.updateBackground({
										opacity
									});
								}}
								options={util.opacityOptions()}
							/>
							<Dropdown
								portalID={`backgroundsEdit-blur`}
								portal={true}
								name='backgroundBlur'
								contentWidth={100}
								label={'Page Background Blur'}
								selectLabel='Select'
								fixedLabel={true}
								defaultValue={+util.getValue(background, 'blur', 0)}
								onChange={(name, value) => {
									this.updateBackground({
										blur: +value
									});
								}}
								options={util.blurOptions()}
							/>
						</div>
					</div>
				</Collapse>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	return {
	}
}

export default connect(mapStateToProps, {
})(BackgroundsEdit);
