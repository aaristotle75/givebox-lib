import React from 'react';
import {
	util,
	GBLink,
	Collapse,
	ColorPicker
} from '../../';

export default class GlobalsEdit extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {

		const {
			globals
		} = this.props;

		const gbxStyle = util.getValue(globals, 'gbxStyle', {});

		return (
			<div className='modalWrapper'>
				<Collapse
					label={'Payment Form Options'}
					id={'editing-paymentForm-options'}
					iconPrimary='layout'
				>
					<div className='formSectionContainer'>
						<div className='formSection'>
							<ColorPicker
								name='primaryColor'
								fixedLabel={true}
								label='Payment Form Theme Color'
								onAccept={(name, value) => {
									this.props.updatePrimaryColor(value);
								}}
								value={util.getValue(gbxStyle, 'primaryColor')}
								modalID='colorPickerBgColor'
								opts={{
									customOverlay: {
										zIndex: 9999909
									}
								}}
							/>
							{/*
							<TextField
								name='maxWidth'
								value={util.getValue(gbxStyle, 'maxWidth')}
								onChange={(e) => {
									e.preventDefault();
									const value = parseInt(_v.formatNumber(e.target.value));
									this.props.updateGlobals('maxWidth', value);
								}}
								fixedLabel={true}
								label='Max Width of Payment Form'
								placeholder='Enter the Max Width for Your Payment Form'
								inputMode='numeric'
								maxLength={4}
							/>
							*/}
						</div>
					</div>
				</Collapse>
				<div style={{ marginBottom: 0 }} className='button-group center'>
					<GBLink className='link' onClick={() => this.props.closeGBXOptionsCallback('cancel')}>Cancel</GBLink>
					<GBLink className='button' onClick={this.props.closeGBXOptionsCallback}>Save</GBLink>
				</div>
			</div>
		)
	}

}
