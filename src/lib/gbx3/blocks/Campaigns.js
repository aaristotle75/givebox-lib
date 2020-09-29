import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	ModalRoute,
	Paginate,
	Loader,
	types,
	Image
} from '../../';
import CampaignsEdit from './CampaignsEdit';
import { toggleModal } from '../../api/actions';
import { getResource } from '../../api/helpers';
import {
	updateInfo,
	clearGBX3
} from '../redux/gbx3actions';
import '../../styles/gbx3Campaigns.scss';
import has from 'has';
const merge = require('deepmerge');

class Campaigns extends Component {

	constructor(props) {
		super(props);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onClickRemove = this.onClickRemove.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);
		this.optionsUpdated = this.optionsUpdated.bind(this);
		this.customListUpdated = this.customListUpdated.bind(this);
		this.getCampaigns = this.getCampaigns.bind(this);
		this.renderCampaigns = this.renderCampaigns.bind(this);
		this.filterCampaigns = this.filterCampaigns.bind(this);
		this.setStyle = this.setStyle.bind(this);
		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.loadGBX = this.loadGBX.bind(this);

		const options = props.options;

		this.state = {
			options,
			defaultOptions: util.deepClone(options),
			hasBeenUpdated: true,
			tab: 'edit',
			loading: false
		};
		this.blockRef = null;
		this.width = null;
		this.height = null;
		this.displayRef = React.createRef();
	}

	componentDidMount() {
		const {
			options,
			orgID,
			name
		} = this.props;

		if (!util.getValue(options, 'initiated')) {
			this.props.getResource('orgArticles', {
				customName: `${name}Init`,
				orgID,
				callback: (res, err) => {
					// callback
				},
				search: {
					filter: 'givebox:true',
					max: 1000
				}
			});
		}
		this.getCampaigns();

		this.blockRef = this.props.blockRef.current;
		if (this.blockRef) {
			this.width = this.blockRef.clientWidth;
			this.height = this.blockRef.clientHeight;
		}
	}

	componentDidUpdate() {
		this.props.setDisplayHeight(this.displayRef);
	}

	async loadGBX(ID) {
		const infoUpdated = await this.props.updateInfo({ originTemplate: 'org' });
		const gbx3Cleared = await this.props.clearGBX3();
		if (infoUpdated && gbx3Cleared) this.props.loadGBX3(ID);
	}

	setStyle() {

		const {
			primaryColor
		} = this.props;

		const rgb = util.hexToRgb(primaryColor);
		const color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .4)`;

		const style = `
			.scrollableCampaignsList::-webkit-scrollbar-thumb {
				background-color: ${color};
			}

			.gbx3 .campaignsBlockList .pagination .page:hover {
				color: ${primaryColor};
			}
		`;

		const el = document.getElementById('campaignStyle');
		if (el) {
			el.innerHTML = style;
		} else {
			const styleEl = document.head.appendChild(document.createElement('style'));
			styleEl.setAttribute('id', 'campaignStyle');
			styleEl.innerHTML = style;
		}
	}

	onBlur(content) {
		this.setState({ content });
		if (this.props.onBlur) this.props.onBlur(this.props.name, content);
	}

	onChange(content) {
		this.setState({ content, hasBeenUpdated: true });
		if (this.props.onChange) this.props.onChange(this.props.name, content);
	}

	closeEditModal(type = 'save') {
		const {
			options,
			defaultOptions,
			hasBeenUpdated
		} = this.state;

		if (type !== 'cancel') {
			const data = {};
			this.props.saveBlock({
				data,
				hasBeenUpdated,
				options
			});
		} else {
			this.setState({
				options: util.deepClone(defaultOptions)
			}, this.props.closeEditModal);
		}
	}

	customListUpdated(customList = [], callback) {
		const options = this.state.options;

		this.setState({
			options: {
				...options,
				customList: [
					...util.getValue(options, 'customList', []),
					...customList
				]
			},
			hasBeenUpdated: true
		}, () => {
			if (callback) callback();
		});
	}

	optionsUpdated(opts = {}, callback) {

		this.setState({
			options: {
				...this.state.options,
				...opts
			},
			hasBeenUpdated: true
		}, () => {
			if (callback) callback();
		});
	}

	setTab(tab) {
		this.setState({ tab });
	}

	onClickRemove() {
		console.log('onClickRemove');
	}

	getCampaigns(reload) {
		const {
			orgID,
			name,
			options,
		} = this.props;

		const filter = this.filterCampaigns();
		console.log('execute getCampaigns', filter);
		const max = util.getValue(options, 'maxRecords', 3);

		this.props.getResource('orgArticles', {
			customName: name,
			orgID,
			reload,
			callback: (res, err) => {
				this.setStyle();
			},
			search: {
				filter,
				max
			}
		});
	}

	filterCampaigns(forAdding) {
		const {
			options
		} = this.props;

		let filter = '';
		const customList = util.getValue(options, 'customList', []);
		if (!util.isEmpty(customList)) {
			customList.forEach((value) => {
				filter = forAdding ? filter + `%3BID:!${value}` : filter + `%2CID:${value}`;
			});
		} else {
			filter = forAdding ? 'givebox:false' : 'givebox:true';
		}
		return filter;
	}

	onMouseEnter(ID) {
		//console.log('execute onMouseEnter');
	}

	onMouseLeave(ID) {
		//console.log('execute onMouseLeave');
	}

	renderCampaigns() {
		const {
			name,
			campaigns,
			campaignsTotal
		} = this.props;

		const items = [];
		if (!util.isEmpty(campaigns)) {
			Object.entries(campaigns).forEach(([key, value]) => {
				const status = util.getValue(value, 'publishedStatus', {});
				const webApp = util.getValue(status, 'webApp', null);
				const published = value.kind !== 'fundraiser' && webApp ? false : true;
				if (published) {
					const imageURL = util.imageUrlWithStyle(value.imageURL, 'medium');
					const imageStyle = {
						background: `url(${imageURL}) no-repeat center`
					};
					const cardStyle = { WebkitBoxShadow: `0px 3px 6px 0px #465965` };

					items.push(
						<li key={key}>
							<div className='articleCardWrapper' id={value.ID} onMouseEnter={() => this.onMouseEnter(value.ID)} onMouseLeave={() => this.onMouseLeave(value.ID)}>
								<div className='articleCardShadow' style={cardStyle}></div>
								<div className='articleCard'>
									<div className='imageContainer'>
										<div style={imageStyle} className='imageBg'></div>
										<div className='image'>
											<GBLink onClick={() => this.loadGBX(value.ID)}><Image maxSize={'250px'} url={imageURL} size='medium' alt={value.imageURL} /></GBLink>
											<div className='imageCover' onClick={() => this.loadGBX(value.ID)}><div className='imageLink'>Learn More</div></div>
										</div>
									</div>
									<div className='kind'>
										<span className={`icon icon-${types.kind(value.kind).icon}`}></span>
										<span className='kindText'>{value.kind === 'fundraiser' ? 'Fundraiser' : types.kind(value.kind).name}</span>
									</div>
									<GBLink className='link title' onClick={() => this.loadGBX(value.ID)}>{value.title}</GBLink>
								</div>
							</div>
						</li>
					);
				}
			});
		}

		return (
			<div className='campaignsBlockList'>
				<div className='scrollableCampaignsList'>
					<ul className='campaignsList'>
						{!util.isEmpty(items) ? items : <span className='noRecords'></span>}
					</ul>
				</div>
				{ campaignsTotal > 3 ?
				<div className='paginateCampaignsList'>
					<Paginate
						customName={name}
					/>
				</div> : '' }
			</div>
		)
	}

	render() {

		const {
			modalID,
			title,
			block,
			campaignsInit,
			campaignsFetching
		} = this.props;

		const {
			options,
			loading
		} = this.state;

		const nonremovable = util.getValue(block, 'nonremovable', false);

		return (
			<div className={'campaignsBlock'}>
				{ campaignsFetching || loading ? <Loader msg={'Loading campaigns...'} /> : '' }
				<ModalRoute
					className='gbx3'
					id={modalID}
					effect='3DFlipVert' style={{ width: '70%' }}
					draggable={true}
					draggableTitle={`Editing ${title}`}
					closeCallback={this.closeEditModal}
					disallowBgClose={true}
					component={() =>
						<CampaignsEdit
							{...this.props}
							optionsUpdated={this.optionsUpdated}
							customListUpdated={this.customListUpdated}s
							options={options}
							campaignsInit={campaignsInit}
							filterCampaigns={this.filterCampaigns}
						/>
					}
					buttonGroup={
						<div className='gbx3'>
							<div style={{ marginBottom: 0 }} className='button-group center'>
								{!nonremovable ? <GBLink className='link remove' onClick={this.onClickRemove}><span className='icon icon-trash-2'></span> <span className='buttonText'>Remove</span></GBLink> : <></>}
								<GBLink className='link' onClick={() => this.closeEditModal('cancel')}>Cancel</GBLink>
								<GBLink className='button' onClick={this.closeEditModal}>Save</GBLink>
							</div>
						</div>
					}
				/>
				{this.renderCampaigns()}
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const primaryColor = util.getValue(state, 'gbx3.globals.gbxStyle.primaryColor');
	const campaignsInit = util.getValue(state, `resource.${props.name}Init.data`, {});
	const campaigns = util.getValue(state, `resource.${props.name}.data`, {});
	const campaignsTotal = util.getValue(state, `resource.${props.name}.meta.total`, 0);
	const campaignsFetching = util.getValue(state, `resource.${props.name}.isFetching`, false);

	return {
		primaryColor,
		campaigns,
		campaignsInit,
		campaignsTotal,
		campaignsFetching
	}
}

export default connect(mapStateToProps, {
	toggleModal,
	getResource,
	updateInfo,
	clearGBX3
})(Campaigns);
