import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	updateGlobals,
	saveGBX3,
	toggleModal,
	ModalLink,
	ModalRoute
} from '../../';
import GlobalsEdit from '../blocks/GlobalsEdit';

class DesignMenuStyle extends React.Component {

	constructor(props) {
		super(props);
		this.closeGBXOptionsCallback = this.closeGBXOptionsCallback.bind(this);
		this.updatePrimaryColor = this.updatePrimaryColor.bind(this);
		const globals = props.globals;
		this.state = {
			globals,
			globalsDefault: util.deepClone(globals)
		};
	}

	updatePrimaryColor(value) {
		const globals = {
			...this.state.globals,
			gbxStyle: {
				...this.state.globals.gbxStyle,
				primaryColor: value
			},
			button: {
				...this.state.globals.button,
				style: {
					...this.state.globals.button.style,
					bgColor: value
				}
			}
		};
		this.setState({ globals });
	}

	async closeGBXOptionsCallback(type = 'save') {

		const {
			globals,
			globalsDefault
		} = this.state;
		if (type !== 'cancel') {
			this.setState({
				globalsDefault: util.deepClone(globals)
			});
			const updated = await this.props.updateGlobals(globals);
			if (updated) this.props.saveGBX3(null, false, () => {
				this.props.toggleModal('paymentForm-options', false);
			});
		} else {
			this.setState({
				globals: util.deepClone(globalsDefault)
			}, this.props.toggleModal('paymentForm-options', false));
		}
	}

	render() {

		const {
			globals
		} = this.props;

		return (
			<div className='layoutMenu'>
				<ul>
					<ModalLink type='li' id='paymentForm-options'>Options</ModalLink>
					<ModalRoute
						optsProps={{ closeCallback: this.closeGBXOptionsCallback }}
						id={'paymentForm-options'}
						component={() => (
							<GlobalsEdit
								closeGBXOptionsCallback={this.closeGBXOptionsCallback}
								updatePrimaryColor={this.updatePrimaryColor}
								globals={globals}
							/>
						 )}
						effect='3DFlipVert' style={{ width: '60%' }}
						draggable={true}
						draggableTitle={`Editing Payment Form`}
						closeCallback={this.closeGBXOptionsCallback}
						disallowBgClose={true}
					/>
				</ul>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const globals = util.getValue(gbx3, 'globals', {});
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});

	return {
		globals,
		gbxStyle
	}
}

export default connect(mapStateToProps, {
	updateGlobals,
	saveGBX3,
	toggleModal
})(DesignMenuStyle);
