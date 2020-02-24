import React, { Component } from 'react';
import {
  util,
  RichTextField
} from '../../';
import PropertyBar from '../PropertyBar';

export default class Title extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);

    const defaultStyle = {
    };

    const article = props.article;
    const title = util.getValue(article, 'title');
    const orgName = util.getValue(article, 'orgName');

    const content =
      <div style={{ ...defaultStyle, ...props.style }} >
        {title}
        <span className='cardHeaderSubtitle' style={{ display: 'block' }}>{orgName}</span>
      </div>
    ;

    this.state = {
      content
    };
  }

  onBlur(name, value, hasText) {
    const content = hasText ? value : '';
    this.setState({ content });
    if (this.props.propertyCallback) this.props.propertyCallback(this.props.name, hasText ? value : '');
  }

  render() {

    const {
      style,
      article,
      edit
    } = this.props;

    return (
      <>
        {edit === 'title' ?
          <PropertyBar
            {...this.props}
          >
            <div className='editHeader'>Edit Title</div>
            <RichTextField
              label=''
              placeholder='Enter title...'
              modal={false}
              required={false}
              onBlurEditor={this.onBlur}
              value={this.state.content}
            />
          </PropertyBar>
        : <></>}
        {this.state.content}
      </>
    )
  }
}
