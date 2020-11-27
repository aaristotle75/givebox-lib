import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getArticles, getArticle, searchArticles } from './zohoHelpCenterAPI';
import { zohoCats } from './zohoCats';
import AnimateHeight from 'react-animate-height';
import Breadcrumbs from './Breadcrumbs';
import has from 'has';
import {
  util
} from '../';
import GBLink from '../common/GBLink';
import Loader from '../common/Loader';
import Search from '../table/Search';

class Articles extends Component {

  constructor(props) {
    super(props);
    this.listArticles = this.listArticles.bind(this);
    this.showDetails = this.showDetails.bind(this);
    this.getArticleDetail = this.getArticleDetail.bind(this);
    this.searchArticles = this.searchArticles.bind(this);
    this.getArticles = this.getArticles.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.state = {
      articles: null,
      count: 0,
      details: [],
      articlesDetails: {},
      category: this.props.category,
      searchValue: ''
    };
  }

  componentDidMount() {
    this.getArticles();
  }

  componentDidUpdate(prev) {
    if (prev.category !== this.props.category) {
      this.setState({ category: this.props.category }, this.getArticles);
    }
  }

  getArticles() {
    this.setState({ searchValue: '' });
    const category = this.state.category ? util.getValue(zohoCats, this.state.category, {}) : null;
    const categoryID = util.getValue(category, 'id', null);
    getArticles((data, error) => {
      this.setState({ articles: data });
    }, categoryID, this.props.channel);
  }

  searchArticles(value) {
    if (value) {
      this.setState({ search: true });
      searchArticles((data, error) => {
        this.setState({ articles: data, searchValue: value });
      }, value);
    } else {
      this.getArticles();
    }
  }

  setCategory(categoryName = '') {
    this.setState({ searchValue: '' });
    const category = categoryName ? util.getValue(zohoCats, categoryName, {}) : null;
    const categoryID = util.getValue(category, 'id', null);
    getArticles((data, error) => {
      this.setState({ articles: data });
    }, categoryID, this.props.channel);
  }

  listArticles() {
    const bindthis = this;
    const items = [];
    const articles = this.state.articles;
    const details = this.state.details;
    const articlesDetails = this.state.articlesDetails;
    if (!util.isEmpty(articles)) {
      Object.entries(articles).forEach(([key, value]) => {
        const ref = React.createRef();
        const article = util.getValue(articlesDetails, value.id);
        items.push(
          <li id={value.id} ref={ref} key={key}>
            <GBLink onClick={() => bindthis.showDetails(ref)}><span className={`icon icon-${details.includes(value.id) ? 'minus' : 'plus'}`}></span> {value.title}</GBLink>
            <AnimateHeight
              duration={500}
              height={details.includes(value.id) ? 'auto' : 0}
            >
              <div className='details'>
                {article ?
                  <div dangerouslySetInnerHTML={{ __html: util.getValue(article, 'answer', value.summary) }} />
                :
                  <div className='imageLoader'>
                    Loading article <img src='https://s3-us-west-1.amazonaws.com/givebox/public/images/squareLoader.gif' alt='Loader' />
                  </div>
                }
              </div>
            </AnimateHeight>
          </li>
        );
      });
    }

    return (
      <ul className='articleList'>
        {!util.isEmpty(items) ?
          items
        :
          <li>
            <span className='noRecords'>No articles found</span>
          </li>
        }
        <li>
          <GBLink className='link visitHelpCenterLink' onClick={() => window.open(`https://help.givebox.com/portal/kb/${this.props.kb}`, '_blank')}>Visit Givebox Help Center <span className='icon icon-chevron-right'></span></GBLink>
        </li>
      </ul>
    );
  }

  async showDetails(ref) {
    const current = ref.current;
    const selected = current.id;
    const details = this.state.details;
    const index = details.findIndex(function(el) {
      return el === selected;
    });
    if (index === -1) {
      details.push(selected);
    } else {
      details.splice(index, 1);
    }

    this.setState({ ...this.state, ...details }, async () => {
      // check if article details exists
      const articlesDetails = this.state.articlesDetails;
      if (!has(articlesDetails, selected)) {
        articlesDetails[selected] = await this.getArticleDetail(selected);
      }
      this.setState({ articlesDetails });
    });
  }

  async getArticleDetail(id) {

    return new Promise((resolve, reject) => {
      getArticle(id, (data, error) => {
        setTimeout(() => resolve(data), 1000);
      });
    });
  }

  render() {

    const {
      articles
    } = this.state;

    if (!articles) return <Loader msg='Loading articles...' />

    return (
      <div className='sectionContainer'>
        <div className='section'>
          <div className='articles'>
            <div className={`search`}>
              <Search
                name={'searchZohoArticles'}
                placeholder={'Search Articles'}
                getSearch={this.searchArticles}
                resetSearch={this.getArticles}
              />
            </div>
            <Breadcrumbs
              category={this.state.category}
              searchValue={this.state.searchValue}
              setCategory={this.setCategory}
            />
            <div style={{ height: this.props.scrollHeight }} className='scrollContainer'>
              {this.listArticles()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Articles.defaultProps = {
  kb: ''
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(Articles);
