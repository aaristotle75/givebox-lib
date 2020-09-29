import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
	util,
	Collapse,
	Dropdown,
	Tabs,
	Tab,
	Image,
	GBLink,
	types,
	ModalLink
} from '../../';
import { getResource } from '../../api/helpers';

class CampaignsEdit extends Component{
	constructor(props){
		super(props);
		this.maxRecordsOptions = this.maxRecordsOptions.bind(this);
		this.renderArticles = this.renderArticles.bind(this);
		this.updateCampaign = this.updateCampaign.bind(this);
		this.getCampaignsForEdit = this.getCampaignsForEdit.bind(this);
		this.setInitCampaigns = this.setInitCampaigns.bind(this);
		this.state = {
		};
	}

	componentDidMount() {
		const {
			options
		} = this.props;

		if (!util.getValue(options, 'initiated')) {
			this.setInitCampaigns();
		} else {
			this.getCampaignsForEdit();
		}
	}

	setInitCampaigns() {
		const {
			campaignsInit
		} = this.props;

		const customList = [];

		if (!util.isEmpty(campaignsInit)) {
			Object.entries(campaignsInit).forEach(([key, value]) => {
				customList.push(value.ID);
			});
		}

		this.props.optionsUpdated({
			customList,
			initiated: true
		}, () => {
			this.setState({ loading: false });
			this.getCampaignsForEdit();
		});
	}

	getCampaignsForEdit(reload) {
		const {
			orgID,
			name
		} = this.props;

		const filter = this.props.filterCampaigns();

		this.props.getResource('orgArticles', {
			customName: name,
			orgID,
			reload,
			callback: (res, err) => {
				// callback
			},
			search: {
				filter,
				max: 1000
			}
		});
	}

	maxRecordsOptions() {
		const items = [];
		for (let i=1; i <= 20; i++) {
			const number = i * 3;
			items.push({ primaryText: `${number} Per Page`, value: number});
		}
		return items;
	}

	updateCampaign(article, type = 'add', callback) {
		const {
			options
		} = this.props;

		const customList = util.getValue(options, 'customList');

		const {
			ID
		} = article;

		switch (type) {
			case 'remove': {
				const index = customList.indexOf(ID);
				if (index >= 0) customList.splice(index, 1);
				break;
			}

			case 'add':
			default: {
				customList.unshift(ID);
				break;
			}
		}
		this.props.customListUpdated(customList, () => {
			this.getCampaignsForEdit(true);
		})
	}

	renderArticles() {
		const {
			campaigns,
			isMobile
		} = this.props;

		const items = [];

		if (!util.isEmpty(campaigns)) {
			Object.entries(campaigns).forEach(([key, value]) => {
				items.push(
					<div
						key={key}
						className='articleItem'
					>
						<div className='editableRowMenu'>
							<GBLink onClick={() => this.updateCampaign(value, 'remove')}><span className='icon icon-x'></span> {isMobile ? 'Remove' : 'Remove From List' }</GBLink>
						</div>
						<div className='articleImage'>
							<Image url={util.imageUrlWithStyle(value.imageURL, 'thumb')} size='thumb' maxSize={50} />
						</div>
						<div className='articleText'>
							<span>
								{value.title}
								<span className='gray smallText'>{types.kind(value.kind).name}</span>
							</span>
						</div>
					</div>
				);
			});
		}

		return (
			<div className='articleGroupList campaignsEdit'>
				<div className='articleGroup'>
				{!util.isEmpty(items) ? items : <span className='noRecords'>No Campaigns are Available</span>}
				</div>
			</div>
		)
	}

	render() {

		const {
			options
		} = this.props;

		const maxRecords = util.getValue(options, 'maxRecords', 3);

		return (
			<div className='modalWrapper gbx3Shop editable'>
				<Tabs
					default={'edit'}
					className='statsTab'
				>
					<Tab id='edit' label={<span className='stepLabel'>Form List</span>}>
						<Collapse
							label={`Edit Form List`}
							iconPrimary='edit'
							id={'gbx3-campaignsBlock-edit'}
						>
							<div className='formSectionContainer'>
								<div className='formSection'>
									<div className='flexCenter' style={{ margin: '20px 0 10px 0' }}>
										<ModalLink
											id='articleList'
											style={{ fontSize: 14 }}
											opts={{
												title: 'Select Forms to Add to List',
												notPublicText: 'This is Set to Private and Cannot be Added',
												selectedText: <span><span className='icon icon-check'></span> Added</span>,
												selectText: 'Add to Form List',
												filterFunc: () => this.props.filterCampaigns(true),
												callback: this.updateCampaign,
												closeCallback: () => {
													console.log('execute closeCallback');
												}
											}}
										><span className='icon icon-plus'></span> Add a Form to the List</ModalLink>
									</div>
									{this.renderArticles()}
								</div>
							</div>
						</Collapse>
					</Tab>
					<Tab id='options' label={<span className='stepLabel'>Options</span>}>
						<Collapse
							label={`Edit Options`}
							iconPrimary='edit'
							id={'gbx3-campaignsBlock-options'}
						>
							<div className='formSectionContainer'>
								<div className='formSection'>
									<Dropdown
										portalClass={'dropdown-left-portal'}
										portalID={`campaignsEdit-maxRecords`}
										portal={true}
										name='maxRecords'
										contentWidth={200}
										portalLeftOffset={5}
										label={'Forms Per Page'}
										fixedLabel={true}
										defaultValue={+maxRecords}
										onChange={(name, value) => {
											this.props.optionsUpdated({
												maxRecords: +value
											});
										}}
										options={this.maxRecordsOptions()}
									/>
								</div>
							</div>
						</Collapse>
					</Tab>
				</Tabs>
			</div>
		)
	}
};

CampaignsEdit.defaultProps = {
}

function mapStateToProps(state, props) {

	const name = 'campaignsBlockEditList';
	const campaigns = util.getValue(state, `resource.${name}.data`, {});
	const campaignsTotal = util.getValue(state, `resource.${name}.meta.total`, 0);
	const campaignsFetching = util.getValue(state, `resource.${name}.isFetching`, false);
	const isMobile = util.getValue(state, 'gbx3.info.breakpoint') === 'mobile' ? true : false;

	return {
		name,
		campaigns,
		campaignsTotal,
		campaignsFetching,
		isMobile
	}
}

export default connect(mapStateToProps, {
	getResource
})(CampaignsEdit);
