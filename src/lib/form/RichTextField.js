import React, {Component} from 'react';
import RichTextEditor from './RichTextEditor';
import ModalRoute from '../common/ModalRoute';
import ModalLink from '../common/ModalLink';

class ContentField extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.createField) this.props.createField(this.props.name, this.props.params);
  }

  renderEditor(props) {
    return (
      <Editor {...props} />
    );
  }

  render() {

    const {
      params,
      name,
      value,
      placeholder,
      onChange,
      onBlur,
      required,
      style,
      label,
      className,
      error,
      errorType,
      modal,
      modalLabel
    } = this.props;

    let id = `${name}-richText`;

    return (
      <div style={style} className={`input-group ${className || ''} richtext-group ${error ? 'error tooltip' : ''}`}>
        {label && <label>{label}</label>}
        <div className={`errorMsg ${!error || errorType !== 'normal' && 'displayNone'}`}>{error}</div>
        {modal ?
          <div className="richtext-modal">
            <ModalRoute id={id} component={() => this.renderEditor(this.props)} />
            <ModalLink id={id}>{modalLabel}</ModalLink>
          </div>
        :
          <div className="richtext-embed">
            <Editor {...this.props} />
          </div>
        }
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
      fieldName={props.name}
    />
  )
}
