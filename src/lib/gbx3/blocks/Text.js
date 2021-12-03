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

class Text extends Component {

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
      hasBeenUpdated: false,
      tab: 'edit'
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

  componentDidUpdate(prevProps) {
    this.props.setDisplayHeight(this.displayRef);
    if (util.getValue(prevProps.blockContent, 'html') !== util.getValue(this.props.blockContent, 'html')) {
      this.setState({ content: util.getValue(this.props.blockContent, 'html') });
    }
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

  setTab(tab) {
    this.setState({ tab });
  }

  render() {

    const {
      name,
      modalID,
      title,
      articleID,
      orgID,
      block,
      breakpoint,
      primaryColor,
      isVolunteer,
      blockType
    } = this.props;

    const {
      content,
      button,
      tab
    } = this.state;

    const cleanHtml = util.cleanHtml(content);
    const subType = util.getValue(block, 'subType');
    const nonremovable = util.getValue(block, 'nonremovable', false);
    const buttonEnabled = util.getValue(button, 'enabled', false);

    return (
      <div className={`${subType === 'content' ? 'contentBlock' : 'textBlock'}`}>
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
              <Tabs
                default={tab}
                className='statsTab'
              >
                <Tab id='edit' label={<span className='stepLabel'>Edit {title}</span>}>
                  <Collapse
                    label={`Edit ${title}`}
                    iconPrimary='edit'
                  >
                    <div className='formSectionContainer'>
                      <div className='formSection'>
                        <Editor
                          orgID={orgID}
                          articleID={articleID}
                          content={content}
                          onBlur={this.onBlur}
                          onChange={this.onChange}
                          subType={subType}
                          type={breakpoint === 'mobile' ? 'classic' : 'classic'}
                          acceptedMimes={['image']}
                          isVolunteer={isVolunteer}
                          allowLinking={blockType === 'receipt' || blockType === 'emailBlast' ? true : false}
                        />
                      </div>
                    </div>
                  </Collapse>
                </Tab>
                { !util.isEmpty(button) ?
                <Tab id='buttonOption' label={<span className='stepLabel'>Customize Button</span>}>
                  <Collapse
                    label={'Customize Button'}
                    iconPrimary='link-2'
                    id={`${name}-button`}
                  >
                    <div className='formSectionContainer'>
                      <div className='formSection'>
                        <ButtonEdit
                          label={`Use a Button Instead of Showing ${title} on the Form`}
                          button={button}
                          optionsUpdated={this.optionsUpdated}
                          modalID={`${name}-overlay`}
                        />
                      </div>
                    </div>
                  </Collapse>
                </Tab> : <></> }
              </Tabs>
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
        {buttonEnabled ?
        <div ref={this.displayRef}>
          <ModalRoute
            className='gbx3 orgCustomElements'
            id={`${name}-overlay`}
            effect='3DFlipVert' style={{ width: '60%' }}
            draggable={false}
            disallowBgClose={false}
            component={() =>
              <div className='modalContainers'>
                <div className='topContainer'>
                  <h3 style={{ padding: 0, margin: 0 }}>{util.getValue(button, 'text', 'Select Amount')}</h3>
                </div>
                <div className='middleContainer'>
                  <div style={{ padding: '20px 10px' }} ref={this.displayRef} dangerouslySetInnerHTML={{ __html: cleanHtml }} />
                </div>
                <div className='bottomContainer'>
                  <div className='button-group' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <GBLink
                      className='button'
                      allowCustom={true}
                      customColor={primaryColor}
                      solidColor={true}
                      onClick={() => {
                        this.props.toggleModal(`${name}-overlay`, false);
                      }}
                    >
                      Close
                    </GBLink>
                  </div>
                </div>
              </div>
            }
          />
          <Button
            modalID={`${name}-overlay`}
            button={button}
          />
        </div>
        :
          <div ref={this.displayRef} dangerouslySetInnerHTML={{ __html: cleanHtml }} />
        }
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const primaryColor = util.getValue(state, 'gbx3.globals.gbxStyle.primaryColor');
  const mission = util.getValue(state, 'resource.gbx3Org.data.mission');

  return {
    primaryColor,
    mission
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(Text);
