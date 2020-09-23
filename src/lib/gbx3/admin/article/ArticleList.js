import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
	util,
	Loader,
	Image,
	types,
	GBLink,
	Paginate
} from '../../../';
import {
	getResource
} from '../../../api/helpers';
import {
	toggleModal
} from '../../../api/actions';

class ArticleList extends Component {
	constructor(props){
		super(props);
		this.renderArticles = this.renderArticles.bind(this);
		this.onClickArticle = this.onClickArticle.bind(this);
		this.getArticles = this.getArticles.bind(this);
		this.state = {
			loading: false,
			selected: [],
			count: 0
		};
	}

	componentDidMount() {
		this.getArticles();
	}

	getArticles() {
		const {
			filter
		} = this.props;

		this.props.getResource('orgArticles', {
			customName: 'articlesList',
			orgID: this.props.orgID,
			reload: true,
			search: {
				sort: 'kind',
				order: 'ASC',
				filter
			}
		});
	}

	createFundraiserSelect() {
		console.log('execute handle create fundraiser select');
	}

	onClickArticle(article) {
		const selected = this.state.selected;
		selected.push(article.ID);
		this.setState({ selected });
		if (this.props.callback) this.props.callback(article, 'add', this.getArticles);
	}

	renderArticles() {
		const {
			selectedText,
			selectText,
			notPublicText,
			checkPublic
		} = this.props;

		const items = []
		const articles = util.getValue(this.props.articles, 'data', {});

		Object.entries(articles).forEach(([key, value]) => {
			const notPublic = (value.kind === 'fundraiser' && !value.publishedStatus.webApp) || (value.kind !== 'fundraiser' && value.publishedStatus.webApp) ? true : false;
			items.push(
				<div className='articleItem' onClick={() => this.onClickArticle(value)} key={key}>
					<div className='editableRowMenu'>
						{notPublic && checkPublic ?
								<span style={{ fontSize: 14 }} className='gray'>{notPublicText}</span>
							:
							this.state.selected.includes(value.ID) ?
								<span style={{ fontSize: 14 }} className='green'>{selectedText}</span>
							:
								<GBLink onClick={() => this.onClickArticle(value)}><span className='icon icon-x'></span> {selectText}</GBLink>
						}
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
		})

		return (
			<div className='articleGroupList'>
				<div className='articleGroup'>
					{!util.isEmpty(items) ? items : <span className='noRecords'>No Articles are Available</span>}
				</div>
			</div>
		)
	}

	render() {

		const {
			editable
		} = this.props;

		if (util.isLoading(this.props.articles)) return <Loader msg='Load Form List' />
		const meta = util.getValue(this.props.articles, 'meta', {});
		const totalRecords = util.getValue(meta, 'total');

		return (
			<div className={`gbx3Shop modalWrapper ${editable ? 'editable' : ''}`}>
				{ this.state.loading ? <Loader msg='Selecting Forms...' /> : ''}
				<h2 style={{ marginBottom: 20 }} className='center'>Select Forms</h2>
				<div className='formSectionContainer'>
					<div className='formSection'>
						{this.renderArticles()}
						{ totalRecords > 50 ?
						<div className='column'>
							<Paginate
								customName={'articlesList'}
							/>
						</div> : '' }
					</div>
				</div>
			</div>
		)
	}
};

ArticleList.defaultProps = {
	notPublicText: 'Set to Private',
	checkPublic: true,
	selectedText: 'Selected',
	selectText: 'SELECT'
}

function mapStateToProps(state, props) {

	const editable = util.getValue(state, 'gbx3.admin.editable');
	const articles = util.getValue(state, 'resource.articlesList', {});

	return {
		editable,
		articles
	}
}

export default connect(mapStateToProps, {
	getResource,
	toggleModal
})(ArticleList);
