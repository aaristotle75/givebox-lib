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
    this.onChange = this.onChange.bind(this);
    const defaultStyle = {
    };
    const article = props.article;
    const orgName = util.getValue(article, 'orgName');
    const content = `<p className='cardHeaderSubtitle'>${orgName}</p>`;

    this.state = {
      content
    };
  }

  onBlur(name, value, hasText) {
    const content = hasText ? value : '';
    this.setState({ content });
    if (this.props.propertyCallback) this.props.propertyCallback(this.props.name, hasText ? value : '');
  }

  onChange(name, value, hasText) {
    const content = hasText ? value : '';
    this.setState({ content });
    if (this.props.propertyCallback) this.props.propertyCallback(this.props.name, hasText ? value : '');
  }

  render() {

    const {
      edit
    } = this.props;

    return (
      <>
        {edit === 'orgName' ?
          <PropertyBar
            {...this.props}
          >
            <div className='editHeader'>Edit Organization Name</div>
            <RichTextField
              label=''
              placeholder='Enter name of organization...'
              modal={false}
              required={false}
              onChange={this.onChange}
              onBlurEditor={this.onBlur}
              value={this.state.content}
            />
          </PropertyBar>
        : <></>}
        <div dangerouslySetInnerHTML={{ __html: this.state.content}} />
      </>
    )
  }
}
