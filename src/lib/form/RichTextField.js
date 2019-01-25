import React, { Component } from 'react';
import RichTextEditor from './RichTextEditor';
import { ModalRoute, ModalLink } from '../';

class ContentField extends Component {

  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.state = {
      status: 'idle'
    }
  }

  componentDidMount() {
    if (this.props.createField) {
      this.props.createField(this.props.name, this.props.params);
    }
  }

  renderEditor(props) {
    return (
      <Editor {...props} />
    );
  }

  onFocus(e) {
    e.preventDefault();
    this.setState({status: 'active'});
    if (this.props.onFocus) this.props.onFocus(e);
  }

  onBlur(e) {
    e.preventDefault();
    this.setState({status: 'idle'});
    if (this.props.onBlur) this.props.onBlur(e);
  }

  onMouseEnter(e) {
    e.preventDefault();
    if (!this.props.error) this.setState({status: 'active'});
  }

  onMouseLeave(e) {
    e.preventDefault();
    this.setState({status: 'idle'});
  }

  render() {

    const {
      name,
      style,
      label,
      fixedLabel,
      className,
      error,
      errorType,
      modal,
      modalLabel,
      value
    } = this.props;

    let id = `${name}-richText`;

    return (
      <div style={style} className={`input-group ${className || ''} richtext-group ${error ? 'error tooltip' : ''}`}>
        <div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
        {!modal && label && <label htmlFor={name}>{label}</label>}
        <div className={`floating-label ${this.state.status} ${fixedLabel && 'fixed'}`}>
          {modal ?
            <div>
              <ModalRoute id={id} component={() => this.renderEditor(this.props)} />
              <ModalLink className={`input ${value ? 'hasValue' : ''}`} id={id} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>{modalLabel}</ModalLink>
            </div>
          :
            <div className='richtext-embed'>
              <Editor {...this.props} />
            </div>
          }
          {modal && label && <label htmlFor={name}>{label}</label>}
          <div className={`input-bottom ${error ? 'error' : this.state.status}`}></div>
        </div>
        <div className={`tooltipTop ${errorType !=='tooltip' && 'displayNone'}`}>
          {error}
          <i></i>
        </div>
      </div>
    );
  }
}

ContentField.defaultProps = {
  name: 'defaultContentField',
  modalLabel: 'Open Editor'
}

export default ContentField;

const Editor = (props) => {

  return (
    <RichTextEditor
      onChange={props.onChange}
      placeholder={props.placeholder}
      content={props.value}
      updateContent={props.updateContent}
      fieldName={props.name}
      wysiwyg={props.wysiwyg}
    />
  )
}
