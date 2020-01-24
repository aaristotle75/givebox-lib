import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  util
} from '../';

class KB extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }


  componentDidMount() {

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
      </div>
    )
  }
}

KB.defaultProps = {
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(KB);
