import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	getResource,
	sendResource,
	updateInfo,
	GBLink,
	util,
	Loader,
	Image,
	types
} from '../../';
import AnimateHeight from 'react-animate-height';

class Shop extends Component {

	constructor(props) {
		super(props);
		this.renderArticles = this.renderArticles.bind(this);
		this.toggleShow = this.toggleShow.bind(this);
		this.state = {
			show: [props.kind]
		};
		this.timeout = false;
	}

	componentDidMount() {
		this.timeout = true;
		this.props.getResource('orgArticles', {
			customName: 'shopArticles',
			orgID: this.props.orgID,
			search: {
				filter: `givebox:true`,
				order: 'asc',
				sort: 'kind%3BorderBy'
			}
		});
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
									<Image url={util.imageUrlWithStyle(value.imageURL, 'medium')} maxSize={200} />
								</div>
								<div className='articleText'>
									<span>{value.title}{value.title}</span>
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
							{util.toTitleCase(types.kind(key).kindPlural)}
						</GBLink>
						<AnimateHeight height={this.state.show.includes(key) ? 'auto' : 0}>
							{!util.isEmpty(items) ?
								<div className='articleList'>{items}</div>
								:
								<span className='noRecord'>No {util.toTitleCase(types.kind(key).kindPlural)} found</span>
							}
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

		if (util.isLoading(this.props.articles)) return <Loader msg='Loading articles...' />

		const {
			globals,
			primaryColor,
			orgName
		} = this.props;

		return (
			<div style={util.getValue(globals, 'gbxStyle', {})}  className='gbx3Container gbx3Shop modalWrapper'>
				<h2>{orgName}</h2>
				<GBLink
					style={{ marginTop: 5 }}
					className='link'
					allowCustom={true}
					customColor={primaryColor}
					onClick={() => {
						this.props.updateInfo({ display: 'layout' });
					}}>
						<span className='icon icon-chevron-left'></span> Go Back
					</GBLink>
					{this.renderArticles()}
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const articles = util.getValue(state.resource, 'shopArticles', {});
	const gbx3 = util.getValue(state, 'gbx3', {});
	const globals = util.getValue(gbx3, 'globals', {});
	const info = util.getValue(gbx3, 'info', {});
	const selecteedArticleID = util.getValue(info, 'articleID');
	const orgID = util.getValue(info, 'orgID');
	const orgName = util.getValue(info, 'orgName');
	const kind = util.getValue(info, 'kind');

	return {
		selecteedArticleID,
		articles,
		globals,
		orgID,
		orgName,
		kind
	}
}

export default connect(mapStateToProps, {
	sendResource,
	getResource,
	updateInfo
})(Shop);
