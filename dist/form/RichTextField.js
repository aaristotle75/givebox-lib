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
    return React.createElement(Editor, props);
  }

  onFocus(e) {
    e.preventDefault();
    this.setState({
      status: 'active'
    });
    if (this.props.onFocus) this.props.onFocus(e);
  }

  onBlur(e) {
    e.preventDefault();
    this.setState({
      status: 'idle'
    });
    if (this.props.onBlur) this.props.onBlur(e);
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
      disallowModalBgClose
    } = this.props;
    return React.createElement("div", {
      style: style,
      className: `input-group ${className || ''} richtext-group ${error ? 'error tooltip' : ''}`
    }, React.createElement("div", {
      className: `errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`
    }, error), !modal && label && React.createElement("label", {
      htmlFor: name
    }, label), React.createElement("div", {
      className: `floating-label ${this.state.status} ${fixedLabel && 'fixed'}`
    }, modal ? React.createElement("div", null, React.createElement(ModalRoute, {
      id: id,
      component: props => this.renderEditor({ ...this.props,
        ...props
      })
    }), React.createElement(ModalLink, {
      opts: {
        disallowBgClose: disallowModalBgClose
      },
      className: `input ${value ? 'hasValue' : ''}`,
      id: id,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave
    }, modalLabel)) : React.createElement("div", {
      className: "richtext-embed"
    }, React.createElement(Editor, this.props)), modal && label && React.createElement("label", {
      htmlFor: name
    }, label), React.createElement("div", {
      className: `input-bottom ${error ? 'error' : this.state.status}`
    })), React.createElement("div", {
      className: `tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`
    }, error, React.createElement("i", null)));
  }

}

ContentField.defaultProps = {
  name: 'defaultContentField',
  modalLabel: 'Open Editor'
};

function mapStateToProps(state, props) {
  let id = `${props.modalID || props.name}-richText`;
  return {
    id
  };
}

export default connect(mapStateToProps, {})(ContentField);

const Editor = props => {
  return React.createElement("div", null, React.createElement(RichTextEditor, {
    onChange: props.onChange,
    placeholder: props.placeholder,
    content: props.value,
    updateContent: props.updateContent,
    fieldName: props.name,
    wysiwyg: props.wysiwyg
  }), React.createElement("div", {
    className: "center button-group"
  }, React.createElement(GBLink, {
    className: "button",
    onClick: () => props.closeModalAndSave(props.id)
  }, "Save")));
};