import React, { Component } from 'react';
import { connect } from 'react-redux';
import RichTextEditor from './RichTextEditor';
import ModalLink from '../modal/ModalLink';
import ModalRoute from '../modal/ModalRoute';
import GBLink from '../common/GBLink';

class ContentField extends Component {

  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.state = {
      status: 'idle',
      value: props.value
    }
  }

  componentDidMount() {
    if (this.props.createField) {
      this.props.createField(this.props.name, this.props.params);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value });
    }
  }

  renderEditor(props) {
    return (
      <Editor {...props} />
    );
  }

  onFocus(name, content, hasText) {
    this.setState({status: 'active'});
    if (this.props.onFocusEditor) this.props.onFocusEditor(name, content, hasText);
  }

  onBlur(name, content, hasText) {
    this.setState({status: 'idle'});
    if (this.props.onBlurEditor) this.props.onBlurEditor(name, content, hasText);
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
      id,
      name,
      style,
      label,
      fixedLabel,
      className,
      error,
      errorType,
      modal,
      modalLabel,
      disallowModalBgClose,
      color,
      leftBar
    } = this.props;

    const {
      status,
      value
    } = this.state;

    const labelStyle = {
      color: status === 'active' ? color : ''
    };
    const inputBottomStyle = {
      background: status === 'active' ? color : ''
    };

    const fixedLabelHasValue = this.props.fixedLabelHasValue && value ? true : false;

    return (
      <div style={style} className={`input-group ${className || ''} richtext-group ${error ? 'error tooltip' : ''}`}>
        <div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
        <div className={`floating-label ${this.state.status} ${fixedLabel || fixedLabelHasValue ? 'fixed' : ''}`}>
          {leftBar && !modal ?
            <div className='inputLeftBar'></div>
          : null}
          {modal ?
            <div>
              <ModalRoute id={id} component={(props) => this.renderEditor({ ...this.props, ...props })} />
              <ModalLink opts={{ disallowBgClose: disallowModalBgClose }} className={`input ${value ? 'hasValue' : ''}`} id={id} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>{modalLabel}</ModalLink>
            </div>
          :
            <div className='richtext-embed'>
              <Editor
                {...this.props}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
              />
            </div>
          }
          <label style={labelStyle} htmlFor={name}>{label}</label>
          <div style={inputBottomStyle} className={`input-bottom ${error ? 'error' : this.state.status}`}></div>
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
  modalLabel: 'Open Editor',
  autoFocus: true,
  fixedLabelHasValue: true
}

function mapStateToProps(state, props) {

  let id = `${props.modalID || props.name}-richText`;

  return {
    id
  }
}

export default connect(mapStateToProps, {
})(ContentField);

const Editor = (props) => {

  return (
    <div>
      <RichTextEditor
        onChange={props.onChange}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        placeholder={props.placeholder}
        content={props.value}
        updateContent={props.updateContent}
        fieldName={props.name}
        wysiwyg={props.wysiwyg}
        allowLink={props.allowLink}
        color={props.color}
        autoFocus={props.autoFocus}
      />
      {props.closeModalAndSave && !props.hideCloseModalAndSaveButtons && props.modal ?
      <div className='center button-group'>
        <GBLink className='link' onClick={() => props.closeModalAndSave(props.id, false)}>Cancel</GBLink>
        <GBLink style={{ width: 150 }} className='button' onClick={() => props.closeModalAndSave(props.id)}>Save</GBLink>
      </div> : ''}
    </div>
  )
}
