import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	GBLink,
	util,
	Loader,
	Image,
	types,
	Collapse
} from '../';
import AnimateHeight from 'react-animate-height';
import { getResource } from '../api/helpers';
import {
	updateInfo,
	updateAdmin
} from './redux/gbx3actions';

class Shop extends Component {

	constructor(props) {
		super(props);
		this.renderArticles = this.renderArticles.bind(this);
		this.toggleShow = this.toggleShow.bind(this);
		const show = [props.kind];
		if (props.kind !== 'fundraiser') show.push('fundraiser');
		this.state = {
			show,
			loading: true
		};
		this.timeout = false;
	}

	componentDidMount() {
		const articles = util.getValue(this.props.articles, 'data', []);
		const orgID = this.props.orgID;
		if (orgID && util.isEmpty(articles)) {
			this.props.getResource('orgArticles', {
				customName: 'shopArticles',
				orgID,
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

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
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

	renderArticles() {
		const {
			primaryColor
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
									if (this.props.selecteedArticleID === value.ID) {
										this.props.updateInfo({ display: 'layout' });
									} else {
										const displaySwitched = await this.props.updateInfo({ display: 'layout' });
										if (displaySwitched) this.props.reloadGBX3(value.ID);
									}
								}}
							>
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
							style={{ borderBottom: `1px solid ${color2}` }}
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

		if (util.isLoading(this.props.articles)
		|| this.state.loading) return <Loader msg='Loading articles...' />

		const {
			primaryColor,
			orgName,
			selecteedArticleID,
			hideGoBack
		} = this.props;

		return (
			<div className='gbx3Shop modalWrapper'>
				<div className='shopTop'>
					<h2>{orgName}</h2>
					{ !hideGoBack ?
					<GBLink
						style={{ margin: '5px 0 20px 0' }}
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

	return {
		selecteedArticleID,
		articles,
		orgID,
		orgName,
		kind
	}
}

export default connect(mapStateToProps, {
	getResource,
	updateInfo,
	updateAdmin
})(Shop);
