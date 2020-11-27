import React, { PureComponent } from 'react';
import * as util from '../lib/common/utility';
import CustomCKEditor4 from '../lib/editor/CustomCKEditor4';

export default class EditorTest extends PureComponent {

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
      balloonButtons
    } = this.props;

    const contentCss = 'https://givebox.s3-us-west-1.amazonaws.com/public/css/gbx3contents.css';
    let toolbar =	[ 'Bold', 'Italic', '-', 'FontSize', 'TextColor', 'Styles', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'];
    let height = '150px';
    let removePlugins = 'elementspath';
    let removeButtons = 'Link,Unlink';

    if (subType === 'content') {
      toolbar =	[ 'Bold', 'Italic', '-', 'FontSize', 'TextColor', 'Styles', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', '-', 'Image'];
      height = '300px';
      removePlugins = 'image,elementspath';
    }

    console.log('execute toolbar', toolbar);

    return (
      <CustomCKEditor4
        orgID={orgID}
        articleID={articleID}
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
          editor.focus();
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

EditorTest.defaultProps = {
  type: 'classic',
  width: '100%',
  balloonButtons: 'Image'
}
