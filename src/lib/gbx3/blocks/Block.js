import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import GBLink from '../../common/GBLink';
import { toggleModal } from '../../api/actions';
import {
  updateAdmin,
  removeBlock,
  saveGBX3,
  updateLayouts
} from '../redux/gbx3actions';

class Block extends React.Component {

  constructor(props) {
    super(props);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
    this.onClickEdit = this.onClickEdit.bind(this);
    this.saveBlock = this.saveBlock.bind(this);
    this.getBlockContent = this.getBlockContent.bind(this);
    this.setDisplayHeight = this.setDisplayHeight.bind(this);
    this.height = null;
    this.width = null;
  }

  componentDidMount() {
  }

  setDisplayHeight(ref) {
    if (ref) {
      if (ref.current) {
        this.height = ref.current.clientHeight;
        this.width = ref.current.clientWidth;
      }
    }
  }

  onClickEdit() {
    const {
      blockType
    } = this.props;

    const editBlock = `${blockType}-${this.props.name}`;

    this.props.toggleModal(this.props.modalID, true);
    this.props.updateAdmin({ editBlock, editBlockJustAdded: false });
  }

  doThisLater() {

  }

  onClickRemove() {
    const {
      blockType
    } = this.props;

    this.props.removeBlock(blockType, this.props.name);
    this.props.updateAdmin({ editBlock: '', editBlockJustAdded: false });
    this.props.toggleModal(this.props.modalID, false);
    if (this.props.removeCallback) this.props.removeCallback(blockType, this.props.name);
  }

  closeEditModal(hasBeenUpdated = false, content) {
    const {
      editBlockJustAdded,
      block
    } = this.props;

    if (editBlockJustAdded && !hasBeenUpdated && util.getValue(block, 'multiple')) {
      this.onClickRemove();
    } else {
      this.props.toggleModal(this.props.modalID, false);
      this.props.updateAdmin({ editBlock: '', editBlockJustAdded: false });
    }
  }

  async saveBlock(params = {}) {
    const {
      name,
      block,
      blockType
    } = this.props;

    const opts = {
      content: {},
      options: {},
      data: {},
      hasBeenUpdated: false,
      autoHeight: true,
      saveGBX3: true,
      callback: this.closeEditModal,
      height: this.height,
      width: this.width,
      ...params
    };

    const grid = {};
    if (opts.autoHeight) {
      if (opts.height) grid.h = Math.ceil(parseFloat(opts.height / 10)) + 1;
    }

    if (this.props.saveBlock) {
      this.props.saveBlock({
        name,
        block,
        blockType,
        grid,
        opts
      });
    }
  }

  getBlockContent() {
    const {
      block
    } = this.props;

    return util.getValue(block, 'content', {});
  }

  renderChildren() {
    const {
      data,
      kind,
      breakpoint,
      articleID,
      orgID,
      name,
      title,
      blockType,
      block,
      blockRef,
      modalID,
      options,
      fieldValue,
      gbxStyle,
      globalButton,
      globalButtonStyle,
      primaryColor,
      scrollTo,
      loadGBX3,
      reloadGBX3,
      isVolunteer,
      previewMode,
      stage,
      backToOrg
    } = this.props;

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        data,
        kind,
        articleID,
        orgID,
        name,
        title,
        blockType,
        block,
        blockRef,
        modalID,
        options,
        fieldValue,
        gbxStyle,
        globalButton,
        globalButtonStyle,
        primaryColor,
        breakpoint,
        scrollTo,
        loadGBX3,
        reloadGBX3,
        isVolunteer,
        previewMode,
        stage,
        backToOrg,
        blockContent: this.getBlockContent(),
        saveBlock: this.saveBlock,
        closeEditModal: this.closeEditModal,
        setDisplayHeight: this.setDisplayHeight,
        onClickRemove: this.onClickRemove
      })
    );
    return childrenWithProps;
  }

  render() {

    const {
      editable,
      name,
      kind,
      type,
      style,
      editBlock,
      nonremovable,
      block,
      options,
      blockType,
      isVolunteer,
      editFormOnly,
      showRemovable
    } = this.props;

    const buttonEnabled = util.getValue(options, 'button.enabled', false);
    const buttonAlign = util.getValue(options, 'button.style.align', 'flexCenter');
    const scrollableBlock = util.getValue(block, 'scrollable');
    const blockIsBeingEdited = editBlock === `${blockType}-${name}` ? true : false;
    const notEditable = util.getValue(block, 'volunteerNoEdit') && isVolunteer ? true : false;
    const title = name === 'paymentForm' ? types.translatePaymentForm(kind) : this.props.title;

    return (
      <div className={`block`}>
        <div id={`blockOption-${name}`} className={`blockOptions ${name}Block ${blockIsBeingEdited || !editable ? 'displayNone' : ''}`}>
          <div className='dragHandle'></div>
          { !notEditable ?
          <div className='blockEdit'>
            {!nonremovable && !editFormOnly && showRemovable ?
              <GBLink className='tooltip blockRemoveButton' onClick={() => this.onClickRemove()}>
                <span className='tooltipTop'><i />Click Icon to REMOVE {title}</span>
                <span className='icon icon-trash-2'></span>
              </GBLink>
            : <></>}
            <GBLink className='tooltip blockEditButton' onClick={this.onClickEdit}>
              <span className='tooltipTop'><i />Click Icon to EDIT {title}</span>
              <span className='icon icon-edit'></span>
            </GBLink>
          </div> : '' }
        </div>
        <div
          style={{
            ...style,
            overflow: buttonEnabled ? 'visible' : ''
          }}
          className={`block block${type} ${name}Block ${blockIsBeingEdited ? 'editingBlock' : ''} ${scrollableBlock && !buttonEnabled ? 'scrollableBlock' : ''} ${buttonEnabled ? buttonAlign : ''}`}
        >
          {this.renderChildren()}
        </div>
      </div>
    )
  }

}

Block.defaultProps = {
  style: {},
  showRemovable: false
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const admin = util.getValue(gbx3, 'admin', {});
  const editable = util.getValue(admin, 'editable');
  const editBlock = util.getValue(admin, 'editBlock');
  const isVolunteer = util.getValue(admin, 'isVolunteer');
  const editBlockJustAdded = util.getValue(admin, 'editBlockJustAdded');
  const globals = util.getValue(gbx3, 'globals', {});
  const gbxStyle = util.getValue(globals, 'gbxStyle', {});
  const gbxPrimaryColor = util.getValue(gbxStyle, 'primaryColor');
  const globalButton = util.getValue(globals, 'button', {});
  const globalButtonStyle = util.getValue(globalButton, 'style', {});
  const primaryColor = util.getValue(globalButtonStyle, 'bgColor', gbxPrimaryColor);
  const info = util.getValue(gbx3, 'info', {});
  const kind = util.getValue(info, 'kind');
  const articleID = util.getValue(info, 'articleID');
  const orgID = util.getValue(info, 'orgID');
  const blockType = props.blockType;
  const layouts = util.getValue(gbx3, `layouts.${blockType}`, {});
  const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
  const block = util.getValue(blocks, props.name, {});
  const title = util.getValue(block, 'title', props.name);
  const nonremovable = util.getValue(block, 'nonremovable');
  const dataField = util.getValue(block, 'field');
  const type = util.getValue(block, 'type');
  const options = util.getValue(block, 'options', {});
  const data = util.getValue(gbx3, blockType === 'org' ? 'orgData' : 'data', {});
  const fieldValue = util.getValue(data, dataField);
  const modalID = `modalBlock-${blockType}-${props.name}`;
  const previewMode = util.getValue(admin, 'previewMode');
  const editFormOnly = util.getValue(admin, 'editFormOnly');
  const stage = util.getValue(info, 'stage');

  return {
    data,
    editable,
    editBlock,
    isVolunteer,
    editBlockJustAdded,
    kind,
    articleID,
    orgID,
    modalID,
    layouts,
    blockType,
    block,
    title,
    type,
    nonremovable,
    options,
    fieldValue,
    gbxStyle,
    globalButtonStyle,
    globalButton,
    primaryColor,
    previewMode,
    editFormOnly,
    stage,

    breakpoint: util.getValue(info, 'breakpoint')
  }
}

export default connect(mapStateToProps, {
  updateAdmin,
  toggleModal,
  removeBlock,
  updateLayouts,
  saveGBX3
})(Block);
