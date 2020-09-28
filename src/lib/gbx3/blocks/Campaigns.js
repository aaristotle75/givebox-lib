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
	updateInfo
} from '../redux/gbx3actions';
import '../../styles/gbx3Campaigns.scss';
import has from 'has';

class Campaigns extends Component {

	constructor(props) {
		super(props);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onClickRemove = this.onClickRemove.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);
		this.optionsUpdated = this.optionsUpdated.bind(this);
		this.getCampaigns = this.getCampaigns.bind(this);
		this.renderCampaigns = this.renderCampaigns.bind(this);
		this.setStyle = this.setStyle.bind(this);
		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.loadGBX = this.loadGBX.bind(this);

		const options = props.options;

		this.state = {
			options,
			hasBeenUpdated: true,
			tab: 'edit'
		};
		this.blockRef = null;
		this.width = null;
		this.height = null;
		this.displayRef = React.createRef();
	}

	componentDidMount() {
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
		if (infoUpdated) this.props.loadGBX3(ID);
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
			block
		} = this.props;

		const {
			hasBeenUpdated
		} = this.state;
		if (type !== 'cancel') {
			const data = {};
			this.props.saveBlock({
				data,
				hasBeenUpdated,
				content: {

				},
				options: {
				}
			});
		} else {
			this.setState({
			}, this.props.closeEditModal);
		}
	}

	optionsUpdated(name, obj) {
		this.setState({ [name]: { ...obj }, hasBeenUpdated: true });
	}

	setTab(tab) {
		this.setState({ tab });
	}

	onClickRemove() {
		console.log('onClickRemove');
	}

	getCampaigns() {
		const {
			orgID,
			name
		} = this.props;

		const filter = `givebox:true`; //`ID:383196%2CID:383193%2CID:383189`;

		this.props.getResource('orgArticles', {
			customName: name,
			orgID,
			reload: true,
			callback: (res, err) => {
				this.setStyle();
			},
			search: {
				filter,
				max: 3
			}
		});
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
			campaignsFetching
		} = this.props;

		const nonremovable = util.getValue(block, 'nonremovable', false);

		return (
			<div className={'campaignsBlock'}>
				{ campaignsFetching ? <Loader msg={'Loading campaigns...'} /> : '' }
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
	const campaigns = util.getValue(state, `resource.${props.name}.data`, {});
	const campaignsTotal = util.getValue(state, `resource.${props.name}.meta.total`, 0);
	const campaignsFetching = util.getValue(state, `resource.${props.name}.isFetching`, false);

	return {
		primaryColor,
		campaigns,
		campaignsTotal,
		campaignsFetching
	}
}

export default connect(mapStateToProps, {
	toggleModal,
	getResource,
	updateInfo
})(Campaigns);
