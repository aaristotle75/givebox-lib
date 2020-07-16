function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { Component } from 'react';
import { connect } from 'react-redux';
import RichTextEditor from './RichTextEditor';
import { ModalRoute, ModalLink, GBLink } from '../';

class ContentField extends Component {
  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.state = {
      status: 'idle'
    };
  }

  componentDidMount() {
    if (this.props.createField) {
      this.props.createField(this.props.name, this.props.params);
    }
  }

  renderEditor(props) {
    return /*#__PURE__*/React.createElement(Editor, props);
  }

  onFocus(name, content, hasText) {
    this.setState({
      status: 'active'
    });
    if (this.props.onFocusEditor) this.props.onFocusEditor(name, content, hasText);
  }

  onBlur(name, content, hasText) {
    this.setState({
      status: 'idle'
    });
    if (this.props.onBlurEditor) this.props.onBlurEditor(name, content, hasText);
  }

  onMouseEnter(e) {
    e.preventDefault();
    if (!this.props.error) this.setState({
      status: 'active'
    });
  }

  onMouseLeave(e) {
    e.preventDefault();
    this.setState({
      status: 'idle'
    });
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
      value,
      disallowModalBgClose,
      color
    } = this.props;
    const {
      status
    } = this.state;
    const labelStyle = {
      color: status === 'active' ? color : ''
    };
    const inputBottomStyle = {
      background: status === 'active' ? color : ''
    };
    return /*#__PURE__*/React.createElement("div", {
      style: style,
      className: `input-group ${className || ''} richtext-group ${error ? 'error tooltip' : ''}`
    }, /*#__PURE__*/React.createElement("div", {
      className: `errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`
    }, error), !modal && label && /*#__PURE__*/React.createElement("label", {
      style: labelStyle,
      className: `${this.state.status}`,
      htmlFor: name
    }, label), /*#__PURE__*/React.createElement("div", {
      className: `floating-label ${this.state.status} ${fixedLabel && 'fixed'}`
    }, modal ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ModalRoute, {
      id: id,
      component: props => this.renderEditor({ ...this.props,
        ...props
      })
    }), /*#__PURE__*/React.createElement(ModalLink, {
      opts: {
        disallowBgClose: disallowModalBgClose
      },
      className: `input ${value ? 'hasValue' : ''}`,
      id: id,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave
    }, modalLabel)) : /*#__PURE__*/React.createElement("div", {
      className: "richtext-embed"
    }, /*#__PURE__*/React.createElement(Editor, _extends({}, this.props, {
      onBlur: this.onBlur,
      onFocus: this.onFocus
    }))), modal && label && /*#__PURE__*/React.createElement("label", {
      style: labelStyle,
      htmlFor: name
    }, label), /*#__PURE__*/React.createElement("div", {
      style: inputBottomStyle,
      className: `input-bottom ${error ? 'error' : this.state.status}`
    })), /*#__PURE__*/React.createElement("div", {
      className: `tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`
    }, error, /*#__PURE__*/React.createElement("i", null)));
  }

}

ContentField.defaultProps = {
  name: 'defaultContentField',
  modalLabel: 'Open Editor',
  autoFocus: true
};

function mapStateToProps(state, props) {
  let id = `${props.modalID || props.name}-richText`;
  return {
    id
  };
}

export default connect(mapStateToProps, {})(ContentField);

const Editor = props => {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RichTextEditor, {
    onChange: props.onChange,
    onBlur: props.onBlur,
    onFocus: props.onFocus,
    placeholder: props.placeholder,
    content: props.value,
    updateContent: props.updateContent,
    fieldName: props.name,
    wysiwyg: props.wysiwyg,
    allowLink: props.allowLink,
    color: props.color,
    autoFocus: props.autoFocus
  }), props.closeModalAndSave && !props.hideCloseModalAndSaveButtons && props.modal ? /*#__PURE__*/React.createElement("div", {
    className: "center button-group"
  }, /*#__PURE__*/React.createElement(GBLink, {
    className: "link",
    onClick: () => props.closeModalAndSave(props.id, false)
  }, "Cancel"), /*#__PURE__*/React.createElement(GBLink, {
    style: {
      width: 150
    },
    className: "button",
    onClick: () => props.closeModalAndSave(props.id)
  }, "Save")) : '');
};