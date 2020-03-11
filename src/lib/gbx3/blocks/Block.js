import React, { Component } from 'react';
import {
  util,
  Loader
} from '../../';
import Loadable from 'react-loadable';

export default class Block extends Component {

  constructor(props) {
    super(props);
    this.loadBlock = this.loadBlock.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onFocus = this.onFocus.bind(this);
	}

  componentDidMount() {
  }

	onChange(name, content) {
		console.log('Block onChange', name, content);
	}

	onBlur(name, content) {
		console.log('Block onBlur', name, content);
	}

	onFocus(name, content) {
		console.log('Block onFocus', name, content);
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
				onFocus={this.onFocus}
      />
    )
  }

  render() {

    return (
      <div className='block'>
        {this.loadBlock()}
      </div>
    )
  }
}
