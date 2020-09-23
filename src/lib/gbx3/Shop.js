import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	GBLink,
	util,
	Loader,
	Image,
	types,
	ModalLink
} from '../';
import AnimateHeight from 'react-animate-height';
import {
	getResource,
	sendResource
} from '../api/helpers';
import {
	updateInfo,
	updateAdmin
} from './redux/gbx3actions';

class Shop extends Component {

	constructor(props) {
		super(props);
		this.renderArticles = this.renderArticles.bind(this);
		this.toggleShow = this.toggleShow.bind(this);
		this.updateArticle = this.updateArticle.bind(this);
		this.getArticles = this.getArticles.bind(this);
		const show = [];
		types.kinds().forEach((value) => {
			show.push(value);
		});
		this.state = {
			show,
			loading: false
		};
		this.timeout = false;
	}

	componentDidMount() {
		if (util.isEmpty(this.props.articles)) {
			this.setState({ loading: true });
			this.getArticles();
		}
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	getArticles(reload) {
		const orgID = this.props.orgID;
		if (orgID) {
			this.props.getResource('orgArticles', {
				customName: 'shopArticles',
				orgID,
				reload,
				search: {
					filter: `givebox:true`,
					order: 'asc',
					sort: 'kind%3BorderBy'
				},
				callback: (res, err) => {
					this.setState({ loading: false });
				}
			});
		} else {
			this.setState({ loading: false });
		}
	}

	toggleShow(kind) {
		const show = this.state.show;
		const index = show.findIndex((el) => {
			return el === kind;
		});
		if (index === -1) show.push(kind);
		else show.splice(index, 1);
		this.setState({ show });
	}

	updateArticle(article, type = 'add', callback) {
		const {
			kindID,
			kind,
			orgID
		} = article;

		this.setState({ loading: true });

		let givebox = true;
		let resourcesToLoad = [];

		if (type === 'remove') {
			givebox = false;
			resourcesToLoad.push('shopArticles');
		}

		const apiName = `org${types.kind(kind).api.item}Publish`;
		this.props.sendResource(apiName, {
			orgID,
			resourcesToLoad,
			id: [kindID],
			data: {
				givebox
			},
			method: 'patch',
			callback: (res, err) => {
				this.setState({ loading: false });
				if (callback) callback();
			}
		});
	}

	renderArticles() {
		const {
			primaryColor,
			editable
		} = this.props;

		const rgb = util.hexToRgb(primaryColor);
		const color2 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .1)`;
		const articles = util.getValue(this.props.articles, 'data', []);
		const groups = [];

		const grouped = util.group(articles, 'kind');

		if (!util.isEmpty(grouped)) {
			Object.entries(grouped).forEach(([key, value]) => {
				const items = [];
				if (!util.isEmpty(value)) {
					Object.entries(value).forEach(([key, value]) => {
						items.push(
							<div
								key={key}
								className='articleItem'
								onClick={async () => {
									if (!editable) {
										if (this.props.selecteedArticleID === value.ID) {
											this.props.updateInfo({ display: 'layout' });
										} else {
											const displaySwitched = await this.props.updateInfo({ display: 'layout' });
											if (displaySwitched) this.props.reloadGBX3(value.ID);
										}
									} else {
										// do nothing on item click if editable
									}
								}}
							>
								<div className='editableRowMenu'>
										<GBLink onClick={() => this.updateArticle(value, 'remove')}><span className='icon icon-x'></span> Remove From List</GBLink>
								</div>
								<div className='articleImage'>
									<Image url={util.imageUrlWithStyle(value.imageURL, 'thumb')} size='thumb' maxSize={50} />
								</div>
								<div className='articleText'>
									<span>{value.title}</span>
								</div>
							</div>
						);
					});
				}
				const group =
					<div key={key} className='articleGroup'>
						<GBLink
							style={{ fontSize: 18, borderBottom: `1px solid ${color2}` }}
							allowCustom={true}
							customColor={primaryColor}
							onClick={() => this.toggleShow(key)}
						>
							<span className={`icon icon-${types.kind(key).icon}`}></span> {util.toTitleCase(types.kind(key).kindPlural)}
						</GBLink>
						<AnimateHeight height={this.state.show.includes(key) ? 'auto' : 0}>
							<div className='formSectionContainer'>
								<div className='formSection'>
								{!util.isEmpty(items) ?
									<div className='articleList'>{items}</div>
									:
									<span className='noRecord'>No {util.toTitleCase(types.kind(key).kindPlural)} found</span>
								}
								</div>
							</div>
						</AnimateHeight>
					</div>
				;
				groups.push(group);
			});
		}

		return (
			<div className='articleGroupList'>
				{!util.isEmpty(groups) ? groups : <span className='noRecords'>No Programs are Available</span>}
			</div>
		)
	}

	render() {

		const {
			primaryColor,
			orgName,
			selecteedArticleID,
			hideGoBack,
			editable,
			shopTitle
		} = this.props;

		return (
			<div className={`gbx3Shop modalWrapper ${editable ? 'editable' : ''}`}>
				{ this.state.loading ? <Loader msg='Loading articles...' /> : '' }
				<div className='shopTop'>
					{editable ? <span className='editingText'>Editing</span> : '' }
					<h2>{orgName}</h2>
					<span style={{ fontWeight: 300 }}>{shopTitle}</span>
					{ editable ?
						<div className='flexCenter' style={{ margin: '20px 0 10px 0' }}>
							<ModalLink
								id='articleList'
								style={{ fontSize: 14 }}
								opts={{
									notPublicText: 'This is Set to Private and Cannot be Added',
									selectedText: <span><span className='icon icon-check'></span> Added</span>,
									selectText: 'Add to Browse List',
									filter: 'givebox:false',
									callback: this.updateArticle,
									closeCallback: () => {
										this.getArticles(true);
									}
								}}
							><span className='icon icon-plus'></span> Add a Form to the List</ModalLink>
						</div>
					: '' }
					{ !hideGoBack && !editable ?
					<GBLink
						style={{ display: 'block', margin: '5px 0 20px 0' }}
						className='link'
						allowCustom={true}
						customColor={primaryColor}
						onClick={() => {
							if (selecteedArticleID) {
								this.props.updateInfo({ display: 'layout' });
							} else {
								this.props.updateAdmin({
									step: 'create',
									publicView: false
								});
								this.props.updateInfo({
									stage: 'admin'
								});
							}
					}}>
						<span className='icon icon-chevron-left'></span> Go Back
					</GBLink>
						: '' }
				</div>
				{this.renderArticles()}
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const articles = util.getValue(state.resource, 'shopArticles', {});
	const gbx3 = util.getValue(state, 'gbx3', {});
	const info = util.getValue(gbx3, 'info', {});
	const selecteedArticleID = util.getValue(info, 'articleID');
	const orgID = util.getValue(info, 'orgID');
	const orgName = util.getValue(info, 'orgName');
	const kind = util.getValue(info, 'kind');
	const editable = util.getValue(gbx3, 'admin.editable');
	const shopTitle = util.getValue(gbx3, 'blocks.article.paymentForm.options.form.shopTitle');

	return {
		selecteedArticleID,
		articles,
		orgID,
		orgName,
		kind,
		editable,
		shopTitle
	}
}

export default connect(mapStateToProps, {
	getResource,
	sendResource,
	updateInfo,
	updateAdmin
})(Shop);
