import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  getArticles,
  articleCount
} from './zohoDesk';
import {
  Loader
} from '../';

class Articles extends Component {

  constructor(props) {
    super(props);
    this.state = {
      articles: null,
      count: 0
    };
  }

  componentDidMount() {
    getArticles({}, (data, error)=> {
      this.setState({ articles: data });
    });

    articleCount((data) => {
      this.setState({ count: data });
    });
  }

  render() {

    const {
      articles
    } = this.state;

    if (!articles) return <Loader msg='Loading articles...' />
    console.log('execute', articles);

    return (
      <div className='articles'>
        <h2>Frequenty Asked Questions</h2>
      </div>
    )
  }
}

Articles.defaultProps = {
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(Articles);
