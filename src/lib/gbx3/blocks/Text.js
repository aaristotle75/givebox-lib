import React, { Component } from 'react';
import {
  util
} from '../../';
import Editor from '../tools/Editor';

export default class Text extends Component {

  constructor(props) {
    super(props);
    this.state = {
			content: ''
    };
  }

  onBlur(content) {
    this.setState({ content });
    if (this.props.onBlur) this.props.blockOnChangeCallback(this.props.name, content);
  }

  onChange(content) {
    this.setState({ content });
    if (this.props.onChange) this.props.propertyCallback(this.props.name, content);
  }

  render() {

    return (
      <div className='text'>
        <Editor
          onChange={this.onChange}
          onBlur={this.onBlur}
        />
        <div dangerouslySetInnerHTML={{ __html: this.state.content}} />
      </div>
    )
  }
}
