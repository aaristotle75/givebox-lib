import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	types,
	Dropdown,
	GBLink,
	Image
} from '../../';

class CreateNew extends React.Component {

	constructor(props) {
		super(props);
		this.onChangeKind = this.onChangeKind.bind(this);
		this.kindOptions = this.kindOptions.bind(this);
		this.state = {
		};
	}

	onChangeKind(name, value) {
		console.log('execute onChangeKind', name, value);
	}

	kindOptions() {
		const options = [];
		types.kinds().forEach((value) => {
			options.push({
				value,
				primaryText: types.kind(value).name
			});
		});
		return options;
	}

	render() {

		const {
			hasAccessToEdit,
			globals,
			kind
		} = this.props;


		if (!hasAccessToEdit) {
			return (
				<div className='flexCenter flexColumn centeritems'>You do not have access.</div>
			)
		}

		return (
			<div style={util.getValue(globals, 'gbxStyle', {})}  className='gbx3Container gbx3CreateNew modalWrapper'>
				<div className='intro'>
					Start raising money with two easy steps<br />Create & Share!
				</div>
				<Image url='https://s3-us-west-1.amazonaws.com/givebox/public/images/backgrounds/raise-fundraiser-lg.png' maxSize={200} />
				<div style={{ marginTop: 20 }} className='step'>
					<h2><span style={{ fontWeight: 300 }}>Step 1:</span> Create</h2>
					What kind of fundraiser do you want to start?
					<Dropdown
						className='dropdown-button'
						style={{width: '210px' }}
						name='kind'
						defaultValue={kind}
						onChange={this.onChangeKind}
						options={this.kindOptions()}
					/>
					<div className='button-group'>
						<GBLink className='button' onClick={() => console.log(``)}>Create {types.kind(kind).name}</GBLink>
						<GBLink className='link smallText' onClick={() => console.log('Do this later')}>Do This Later</GBLink>
					</div>
				</div>
			</div>
		)
	}
}

CreateNew.defaultProps = {
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const info = util.getValue(gbx3, 'info', {});
	const kind = util.getValue(info, 'kind');
	const globals = util.getValue(gbx3, 'globals', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');

	return {
		kind,
		globals,
		hasAccessToEdit
	}
}

export default connect(mapStateToProps, {
})(CreateNew);
