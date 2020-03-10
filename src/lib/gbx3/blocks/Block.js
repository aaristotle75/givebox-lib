import React, { Component } from 'react';
import {
  util,
  getResource,
  Loader
} from '../../';
import Loadable from 'react-loadable';

class Block extends Component {

  constructor(props) {
    super(props);
    this.loadBlock = this.loadBlock.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onBlur = this.onBlur.bind(this);
  }

  componentDidMount() {
  }

	onChange(name, content) {
		console.log('Block onChange', name, content);
	}

	onBlur(name, content) {
		console.log('Block onBlur', name, content);
	}

  /**
  * Dynamically load block by module path
  * @param {string} element component to load
  */
  loadBlock() {

    const Block = Loadable({
      loader: () => import(`./${this.props.type}`),
      loading: () => <></>
    });

    return (
      <Block
        {...this.props}
				onChange={this.onChange}
				onBlur={this.onBlur}
      />
    )
  }

  render() {

    return (
      <>
        {this.loadBlock()}
      </>
    )
  }
}
