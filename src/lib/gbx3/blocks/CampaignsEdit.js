import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
	util,
	Collapse,
	Dropdown
} from '../../';

class CampaignsEdit extends Component{
	constructor(props){
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
	}

	render() {

		const {
			name,
			options
		} = this.props;

		const maxRecords = util.getValue(options, 'maxRecords', 3);

		return (
			<div className='modalWrapper'>
				<Collapse
					label={`Edit ${name}`}
					iconPrimary='edit'
					id={'gbx3-campaignsBlock-edit'}
				>
					<div className='formSectionContainer'>
						<div className='formSection'>

							<Dropdown
								portalID={`campaignsEdit-maxRecords`}
								portal={true}
								name='maxRecords'
								contentWidth={100}
								label={'Campaigns Per Page'}
								fixedLabel={true}
								defaultValue={maxRecords}
								onChange={(name, value) => {
									this.optionsUpdated({
										maxRecords: value
									});
								}}
								options={util.maxRecordOptions()}
							/>
						</div>
					</div>
				</Collapse>
			</div>
		)
	}
};

CampaignsEdit.defaultProps = {
}

function mapStateToProps(state, props) {

	return {
	}
}

export default connect(mapStateToProps, {
})(CampaignsEdit);
