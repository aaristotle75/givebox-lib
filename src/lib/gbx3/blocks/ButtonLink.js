import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import Collapse from '../../common/Collapse';
import GBLink from '../../common/GBLink';
import Tabs, { Tab } from '../../common/Tabs';
import ModalRoute from '../../modal/ModalRoute';
import Editor from './Editor';
import Button from './Button';
import ButtonEdit from './ButtonEdit';
import { toggleModal } from '../../api/actions';
import { blockTemplates } from './blockTemplates';

class ButtonLink extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.optionsUpdated = this.optionsUpdated.bind(this);

    const options = props.options;

    let defaultContent = options.defaultFormat && props.fieldValue ? options.defaultFormat.replace('{{TOKEN}}', props.fieldValue) : props.fieldValue ? `<p>${props.fieldValue}</p>` : `<p>${options.defaultFormat || `Please add ${props.title}`}</p>`;

    if (props.name === 'description' && !props.fieldValue) {
      defaultContent = props.mission;
    }

    const button = util.getValue(options, 'button', {});
    const content = util.getValue(props.blockContent, 'html', defaultContent);

    this.state = {
      content,
      button,
      defaultButton: util.deepClone(button),
      defaultContent: content,
      hasBeenUpdated: false
    };
    this.editor = null;
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
  }

  componentDidUpdate() {
    this.props.setDisplayHeight(this.displayRef);
  }

  onBlur(content) {
    this.setState({ content });
    if (this.props.onBlur) this.props.onBlur(this.props.name, content);
  }

  onChange(content) {
    this.setState({ content, hasBeenUpdated: true });
    if (this.props.onChange) this.props.onChange(this.props.name, content);
  }

  closeEditModal(type = 'save') {
    const {
      name,
      block,
      blockType,
      kind
    } = this.props;

    const {
      content,
      defaultContent,
      button,
      defaultButton,
      hasBeenUpdated
    } = this.state;
    if (type !== 'cancel') {
      const blockTemplateConfig = util.getValue(blockTemplates, `${blockType}.${kind}.${name}`, {});
      const blockTemplate = !util.isEmpty(blockTemplateConfig) ? blockTemplateConfig : block;

      const data = {};
      const updateOptions = util.getValue(blockTemplate, 'updateOptions');
      const updateMax = util.getValue(blockTemplate, 'updateMax');
      if (updateOptions) data[block.field] = updateOptions === 'string' ? util.remove_non_ascii(util.stripHtml(content)) : content;
      if (updateOptions && updateMax) {
        data[block.field] = data[block.field].replace(/\r?\n|\r/g, '').trim().substring(0, updateMax);
      }
      this.props.saveBlock({
        data,
        hasBeenUpdated,
        content: {
          html: content
        },
        options: {
          button
        }
      });
    } else {
      this.setState({
        content: defaultContent,
        button: util.deepClone(defaultButton),
      }, () => this.props.closeEditModal(false, defaultContent));
    }
  }

  optionsUpdated(name, obj) {
    this.setState({ [name]: { ...obj }, hasBeenUpdated: true });
  }

  render() {

    const {
      modalID,
      onClick,
      button,
      globalButtonStyle
    } = this.props;

    const type = util.getValue(button, 'type', 'button');
    const style = { ...globalButtonStyle, ...util.getValue(button, 'style', {}) };

    const fontSize = parseInt(util.getValue(style, 'fontSize', 16));
    const paddingTopBottom = fontSize >= 20 ? 15 : 10;


    style.width = util.getValue(style, 'width', 150);
    style.fontSize = fontSize;
    style.padding = `${paddingTopBottom}px 25px`;
    style.minWidth = 150;

    return (
      <div className={`orgCustomElements`}>
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
            <div className='modalWrapper'>
              <div className='formSectionContainer'>
                <div className='formSection'>
                  Edit Button
                  {/*
                  <ButtonEdit
                    label={`Use a Button Instead of Showing ${title} on the Form`}
                    button={button}
                    optionsUpdated={this.optionsUpdated}
                    modalID={`${name}-overlay`}
                  />
                  */}
                </div>
              </div>
            </div>
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
        <GBLink style={style} customColor={util.getValue(style, 'bgColor', null)} solidColor={type === 'button' ? true : false} allowCustom={true} solidTextColor={util.getValue(style, 'textColor', null)} className={`${type}`} onClick={onClick}>
          {util.getValue(button, 'text', 'Button Text')}
        </GBLink>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const stage = util.getValue(gbx3, 'info.stage');
  const globals = util.getValue(gbx3, 'globals', {});
  const gbxStyle = util.getValue(globals, 'gbxStyle', {});
  const gbxPrimaryColor = util.getValue(gbxStyle, 'primaryColor');
  const globalButton = util.getValue(globals, 'button', {});
  const globalButtonStyle = util.getValue(globalButton, 'style', {});
  const primaryColor = util.getValue(globalButton, 'bgColor', gbxPrimaryColor);

  return {
    stage,
    primaryColor,
    globalButton,
    globalButtonStyle
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(ButtonLink);
