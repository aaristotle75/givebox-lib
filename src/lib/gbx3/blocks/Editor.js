import React, { PureComponent } from 'react';
import * as util from '../../common/utility';
import CustomCKEditor4 from '../../editor/CustomCKEditor4';

export default class Editor extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      orgID,
      articleID,
      content,
      subType,
      onBlur,
      onChange,
      type,
      width,
      loaderClass,
      acceptedMimes,
      widgets,
      balloonButtons,
      isVolunteer,
      autoFocus
    } = this.props;

    const contentCss = 'https://cdn.givebox.com/common/css/gbx3contents.css';
    let toolbar =	[ 'Bold', 'Italic', '-', 'FontSize', 'TextColor', 'Styles', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'];
    let height = '150px';
    let removePlugins = 'elementspath';
    let removeButtons = 'Link,Unlink';

    if (subType === 'content') {
      toolbar =	[ 'Bold', 'Italic', '-', 'FontSize', 'TextColor', 'Styles', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', '-', 'Image'];
      height = '300px';
      removePlugins = 'image,elementspath';
    }

    return (
      <CustomCKEditor4
        orgID={orgID}
        articleID={articleID}
        isVolunteer={isVolunteer}
        content={content}
        onBlur={onBlur}
        onChange={onChange}
        width={width}
        height={this.props.height || height}
        type={type}
        toolbar={[toolbar]}
        contentCss={contentCss}
        removePlugins={removePlugins}
        removeButtons={removeButtons}
        balloonButtons={balloonButtons}
        loaderClass={loaderClass}
        acceptedMimes={acceptedMimes}
        widgets={widgets}
        initCallback={(editor) => {
          if (autoFocus) editor.focus();
          const CKEDITOR = window.CKEDITOR;
          const selection = editor.getSelection();
          const getRanges = selection ? selection.getRanges() : [];
          if (!util.isEmpty(getRanges)) {
            const range = getRanges[0];
            const pCon = range.startContainer.getAscendant('p',true);
            const newRange = new CKEDITOR.dom.range(range.document);
            newRange.moveToPosition(pCon, CKEDITOR.POSITION_AFTER_END);
            newRange.select();
          }
        }}
      />
    )
  }
}

Editor.defaultProps = {
  type: 'classic',
  width: '100%',
  balloonButtons: 'Image',
  autoFocus: true
}
