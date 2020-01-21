import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  Loader
} from '../';
import ReactIframeResizer from 'react-iframe-resizer-super';

const iframeResizerOptions = { checkOrigin: false };

class Articles extends Component {

  constructor(props) {
    super(props);
    this.state = {
      articles: null,
      count: 0
    };
  }

  componentDidMount() {
    /*
    getArticles({}, (data, error)=> {
      this.setState({ articles: data });
    });

    articleCount((data) => {
      this.setState({ count: data });
    });
    */
  }

  render() {

    /*
    const {
      articles
    } = this.state;

    if (!articles) return <Loader msg='Loading articles...' />
    console.log('execute', articles);
    */

    return (
      <div className='articles'>
        <h2>Frequenty Asked Questions</h2>
        <ReactIframeResizer
          iframeResizerOptions={iframeResizerOptions}
          src={'https://help.givebox.com'}
        />
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
