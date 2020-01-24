import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getArticle } from './zohoHelpCenterAPI';
import {
  Loader,
  util
} from '../';

class Article extends Component {

  constructor(props) {
    super(props);
    this.state = {
      article: null
    };
  }

  componentDidMount() {

    getArticle(this.props.id, (data, error) => {
      this.setState({ article: data });
    });

  }

  render() {

    const {
      article
    } = this.state;

    if (!article) return <Loader msg='Loading article...' />

    console.log('execute article', article);

    return (
      <div className='article'>
        <h2>Article</h2>
      </div>
    )
  }
}

Article.defaultProps = {
  id: '458931000000314017'
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(Article);
