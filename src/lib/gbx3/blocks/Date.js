import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util
} from '../../';
import GBLink from '../../common/GBLink';
import Loader from '../../common/Loader';
import ModalRoute from '../../modal/ModalRoute';
import DateEdit from './DateEdit';
import { toggleModal } from '../../api/actions';

class Date extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.optionsUpdated = this.optionsUpdated.bind(this);
    this.contentUpdated = this.contentUpdated.bind(this);
    this.dateFormat = this.dateFormat.bind(this);
    this.setHTML = this.setHTML.bind(this);

    const data = props.data;
    const options = props.options;
    const content = {
      ...util.getValue(props.block, 'content', {}),
      range1: util.getValue(data, util.getValue(options, 'range1DataField')),
      range2: util.getValue(data, util.getValue(options, 'range2DataField')),
      range1Time: util.getValue(data, util.getValue(options, 'range1TimeDataField')),
      range2Time: util.getValue(data, util.getValue(options, 'range2TimeDataField'))
    }

    this.state = {
      html: '',
      htmlEditable: '',
      content,
      defaultContent: util.deepClone(content),
      options,
      hasBeenUpdated: false
    };
    this.blockRef = null;
    this.width = null;
    this.height = null;
    this.displayRef = React.createRef();
  }

  componentDidMount() {
    this.blockRef = this.props.blockRef.current;
    if (this.blockRef) {
      this.width = this.blockRef.clientWidth;
      this.height = this.blockRef.clientHeight;
    }
    this.setHTML();
  }

  componentDidUpdate() {
    this.props.setDisplayHeight(this.displayRef);
  }

  onBlur(date) {
    this.setState({ date });
    if (this.props.onBlur) this.props.onBlur(this.props.name, date);
  }

  onChange(date) {
    this.setState({ date, hasBeenUpdated: true });
    if (this.props.onChange) this.props.onChange(this.props.name, date);
  }

  closeEditModal(type = 'save') {
    const {
      block
    } = this.props;

    const {
      content,
      defaultContent,
      options,
      hasBeenUpdated
    } = this.state;

    if (type !== 'cancel') {
      const data = {
        [options.range1DataField]: content.range1 || null,
        [options.range2DataField]: content.range2 || null,
        [options.range1TimeDataField]: content.range1Time,
        [options.range2TimeDataField]: content.range2Time
      };
      const updateOptions = util.getValue(block, 'updateOptions');

      this.props.saveBlock({
        data,
        hasBeenUpdated,
        content,
        options: {
        }
      });
    } else {
      this.setState({
        content: defaultContent
      }, this.props.closeEditModal);
    }
  }

  optionsUpdated(options) {
    this.setState({
      options: {
        ...this.state.options,
        ...options
      },
      hasBeenUpdated: true
    }, this.setHTML);
  }

  contentUpdated(content, setHTML = true, updateHTMLTemplate = false) {
    this.setState({
      content: {
        ...this.state.content,
        ...content
      },
      hasBeenUpdated: true
    }, () => { if (setHTML) this.setHTML(updateHTMLTemplate); });
  }

  dateFormat(name) {
    const {
      content
    } = this.state;

    const value = util.getValue(content, name);
    const time = util.getValue(content, `${name}Time`);
    const timeFormat = 'h:mmA';
    const dateFormat = util.getValue(content, 'dateFormat');

    if (value) return util.getDate(value, `${dateFormat}${time ? `  ${timeFormat}` : ''}`);
    return '';
  }

  setHTML(updateHTMLTemplate) {
    const {
      range1,
      range2,
      range1Label,
      range2Label,
      htmlTemplate
    } = this.state.content;

    const {
      range1Token,
      range2Token
    } = this.state.options;

    const range1Value = this.dateFormat('range1');
    const range1HTML = range1Value ?
      `<p><span style="color:#B0BEC5;">${range1Label}</span> ${range1Token}</p>`
    : '';
    const range2Value = this.dateFormat('range2');
    const range2HTML = range2Value ?
      `<p><span style="color:#B0BEC5;">${range2Label}</span> ${range2Token}</p>`
    : '';

    const tokens = {
      [range1Token]: range1Value,
      [range2Token]: range2Value
    };

    const defaultTemplate = `
      ${range1HTML}
      ${range2HTML}
    `;

    const htmlEditable = range1 || range2 ? !updateHTMLTemplate && htmlTemplate ? htmlTemplate : defaultTemplate : '';
    const html = range1 || range2 ? util.replaceAll(htmlEditable, tokens) : '';

    this.contentUpdated({
      htmlTemplate: htmlEditable
    }, false);

    this.setState({ html, htmlEditable });
  }

  render() {

    const {
      modalID,
      title,
      block,
      previewMode,
      stage
    } = this.props;

    const {
      content,
      options,
      html,
      htmlEditable
    } = this.state;

    const nonremovable = util.getValue(block, 'nonremovable', false);
    const cleanHtml = util.cleanHtml(html).trim();

    return (
      <div className={`dateBlock`}>
        <ModalRoute
          className='gbx3'
          optsProps={{ closeCallback: this.onCloseUploadEditor }}
          id={modalID}
          effect='3DFlipVert' style={{ width: '70%' }}
          draggable={true}
          draggableTitle={`Editing ${title}`}
          closeCallback={this.closeEditModal}
          disallowBgClose={true}
          component={() =>
            <DateEdit
              {...this.props}
              content={content}
              options={options}
              contentUpdated={this.contentUpdated}
              optionsUpdated={this.optionsUpdated}
              html={html}
              htmlEditable={htmlEditable}
              dateFormat={this.dateFormat}
            />
          }
          buttonGroup={
            <div className='gbx3'>
              <div style={{ marginBottom: 0 }} className='button-group center'>
                {!nonremovable ? <GBLink className='link remove' onClick={this.props.onClickRemove}><span className='icon icon-trash-2'></span> <span className='buttonText'>Remove</span></GBLink> : <></>}
                <GBLink className='link' onClick={() => this.closeEditModal('cancel')}>Cancel</GBLink>
                <GBLink className='button' onClick={this.closeEditModal}>Save</GBLink>
              </div>
            </div>
          }
        />
        { cleanHtml || previewMode || stage === 'public' ? <div dangerouslySetInnerHTML={{ __html: cleanHtml }} /> : <span className='blockPlaceholderHtml'>When is the Event?</span> }
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const primaryColor = util.getValue(state, 'gbx3.globals.gbxStyle.primaryColor');

  return {
    primaryColor
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(Date);
