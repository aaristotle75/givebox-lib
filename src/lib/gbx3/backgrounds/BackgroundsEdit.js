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
		this.opacityOptions = this.opacityOptions.bind(this);
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

	opacityOptions() {
		const items = [];
		for (let i=0; i <= 20; i++) {
			const perc = i * 5;
			items.push({ primaryText: `${perc}%`, value: perc });
		}
		return util.sortByField(items, 'value');
	}

	render() {

		const extraColors = [];

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
									console.log('onAccept', name, value)
								}}
								value={''}
								modalID='backgroundsEdit-bgColor'
								opts={{
									customOverlay: {
										zIndex: 9999909
									}
								}}
								extraColors={extraColors}
							/>
							<Dropdown
								portalID={`backgroundsEdit-pageOpacity`}
								portal={true}
								name='pageOpacity'
								contentWidth={100}
								label={'Background Opacity'}
								fixedLabel={true}
								defaultValue={100}
								onChange={(name, value) => {
									const pageOpacity = +(value / 100);
									console.log('execute pageOpacity', pageOpacity);
								}}
								options={this.opacityOptions()}
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
