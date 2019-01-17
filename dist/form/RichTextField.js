import React, { Component } from 'react';
import RichTextEditor from './RichTextEditor';
import { ModalRoute, ModalLink } from '../';

class ContentField extends Component {
  componentDidMount() {
    if (this.props.createField) {
      this.props.createField(this.props.name, this.props.params);
    }
  }

  renderEditor(props) {
    return React.createElement(Editor, props);
  }

  render() {
    const {
      name,
      style,
      label,
      className,
      error,
      errorType,
      modal,
      modalLabel
    } = this.props;
    let id = `${name}-richText`;
    return React.createElement("div", {
      style: style,
      className: `input-group ${className || ''} richtext-group ${error ? 'error tooltip' : ''}`
    }, label && React.createElement("label", null, label), React.createElement("div", {
      className: `errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`
    }, error), modal ? React.createElement("div", {
      className: "richtext-modal"
    }, React.createElement(ModalRoute, {
      id: id,
      component: () => this.renderEditor(this.props)
    }), React.createElement(ModalLink, {
      id: id
    }, modalLabel)) : React.createElement("div", {
      className: "richtext-embed"
    }, React.createElement(Editor, this.props)), React.createElement("div", {
      className: `tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`
    }, error, React.createElement("i", null)));
  }

}

ContentField.defaultProps = {
  name: 'defaultContentField',
  modalLabel: 'Open Editor'
};
export default ContentField;

const Editor = props => {
  return React.createElement(RichTextEditor, {
    onChange: props.onChange,
    placeholder: props.placeholder,
    content: props.value,
    fieldName: props.name,
    wysiwyg: props.wysiwyg
  });
};