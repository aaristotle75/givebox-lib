import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	Collapse,
	ColorPicker,
	TextField,
	_v
} from '../../';
import ButtonEdit from './ButtonEdit';

class GlobalsEdit extends React.Component {

	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {

		const {
			gbxStyle,
			button,
			primaryColor
		} = this.props;

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
									this.setState({ primaryColor: value });
								}}
								value={primaryColor}
								modalID='colorPickerBgColor'
								opts={{
									customOverlay: {
										zIndex: 9999909
									}
								}}
							/>
							<TextField
								name='maxWidth'
								value={util.getValue(gbxStyle, 'maxWidth')}
								onChange={(e) => {
									e.preventDefault();
									const value = parseInt(_v.formatNumber(e.target.value));
									const gbxStyle = { ...this.state.gbxStyle, ...{ maxWidth: value } };
									this.setState({ gbxStyle });
								}}
								fixedLabel={true}
								label='Max Width of Payment Form'
								placeholder='Enter the Max Width for Your Payment Form'
								inputMode='numeric'
								maxLength={4}
							/>
						</div>
					</div>
				</Collapse>
				<Collapse
					label={'Default Button Style'}
					id={'editing-button-options'}
					iconPrimary='link-2'
				>
					<div className='formSectionContainer'>
						<div className='formSection'>
							<ButtonEdit
								label={'Enable Amounts Button'}
								globalOption={true}
								button={button}
								optionsUpdated={this.optionsUpdated}
								onClick={() => console.log('Example button click')}
							/>
						</div>
					</div>
				</Collapse>
				<div style={{ marginBottom: 0 }} className='button-group center'>
					<GBLink className='link' onClick={() => this.closeGBXOptionsCallback('cancel')}>Cancel</GBLink>
					<GBLink className='button' onClick={this.closeGBXOptionsCallback}>Save</GBLink>
				</div>
			</div>
		)
	}

}

GlobalsEdit.defaultProps = {
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const globals = util.getValue(gbx3, 'globals', {});
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});
	const button = util.getValue(globals, 'button', {});
	const primaryColor = util.getValue(gbxStyle, 'primaryColor');

	return {
		gbxStyle,
		button,
		primaryColor
	}
}

export default connect(mapStateToProps, {
})(GlobalsEdit);
