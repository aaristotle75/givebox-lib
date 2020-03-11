import React, { Component } from 'react';
import {
  util,
	GBLink
} from '../../';
import Editor from '../tools/Editor';

export default class Text extends Component {

  constructor(props) {
    super(props);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		const content = this.props.content || this.props.defaultContent;
    this.state = {
			content,
			defaultContent: content,
			edit: false
    };
  }

	componentDidMount() {
	}

  onBlur(content) {
    this.setState({ content });
    if (this.props.onBlur) this.props.onBlur(this.props.name, content);
  }

  onChange(content) {
    this.setState({ content });
    if (this.props.onChange) this.props.onChange(this.props.name, content);
  }

  onFocus(content) {
		console.log('execute onFocus', this.props.name);
    if (this.props.onFocus) this.props.onFocus(this.props.name, content);
  }

  render() {

		const {
			editable,
			overflow
		} = this.props;

		const {
			edit,
			defaultContent,
			content
		} = this.state;

    return (
      <div className='text'>
				{1===2 && editable ?
					<div className='edit-group'>
						<GBLink onClick={() => this.setState({ edit: edit ? false : true })}>{edit ? 'Save' : 'Edit'}</GBLink>
					</div>
				: <></>}
				{editable ?
	        <Editor
	          onChange={this.onChange}
	          onBlur={this.onBlur}
						onFocus={this.onFocus}
						content={defaultContent}
						config={{
							toolbar: {
								items: [
									'heading',
									'fontSize',
									'fontColor',
									'alignment',
									'|',
									'bold',
									'italic',
									'underline',
									'|',
									'undo',
									'redo'
								]
							}
						}}
	        />
				:
					<div style={{ overflow: overflow || 'hidden' }} dangerouslySetInnerHTML={{ __html: content}} />
				}
      </div>
    )
  }
}
