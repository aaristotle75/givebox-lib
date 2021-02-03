import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import { blockTemplates } from '../blocks/blockTemplates';
import {
  updateAdmin,
  addBlock
} from '../redux/gbx3actions';
import { toggleModal } from '../../api/actions';

class AdminMenuLayout extends React.Component {

  constructor(props) {
    super(props);
    this.renderActiveBlocks = this.renderActiveBlocks.bind(this);
    this.renderAvailableBlocks = this.renderAvailableBlocks.bind(this);
    this.editBlock = this.editBlock.bind(this);
    this.state = {
    };
  }

  editBlock(name) {
    const {
      blockType
    } = this.props;
    const modalID = `modalBlock-${blockType}-${name}`;
    this.props.toggleModal(modalID, true);
    this.props.updateAdmin({ editBlock: `${blockType}-${name}` });
  }

  renderActiveBlocks() {
    const {
      blocks
    } = this.props;
    const items = [];
    const orderedBlocks = [];

    Object.entries(blocks).forEach(([key, value]) => {
      if (!util.getValue(value, 'multiple') && value) {
        orderedBlocks.push(value);
      }
    });
    util.sortByField(orderedBlocks, 'order', 'ASC');

    Object.entries(orderedBlocks).forEach(([key, value]) => {
      const name = util.getValue(value, 'name');
      const title = util.getValue(value, 'title');
      if (name && title) {
        items.push(
          <li
            key={key}
            onClick={() => this.editBlock(name)}
            onMouseEnter={() => {
              const el = document.getElementById(`blockOption-${name}`);
              el.setAttribute('style', 'display: flex;');
            }}
            onMouseLeave={() => {
              const el = document.getElementById(`blockOption-${name}`);
              el.style.display = null;
            }}
          >
            {title}
          </li>
        );
      }
    });

    return (
      <ul>
        {items}
      </ul>
    );
  }

  renderAvailableBlocks() {
    const {
      blockType,
      availableBlocks,
      kind
    } = this.props;

    const items = [];
    const blockTemplate = blockType === 'article' ? blockTemplates.article[kind] : blockTemplates.org;

    availableBlocks.forEach((value) => {
      const block = util.getValue(blockTemplate, value, {});
      items.push(
        <li
          key={value}
          className='draggableBlock'
          onMouseUp={() => {
            const paymentForm = document.getElementById('block-paymentForm');
            const dropArea = document.getElementById('gbx3DropArea');
            const dropAreaheight = dropArea.clientHeight;
            let height = dropAreaheight;

            if (paymentForm) {
              const paymentFormHeight = paymentForm.clientHeight;
              height = dropAreaheight - paymentFormHeight;
            }
            this.props.addBlock(blockType, value, 0, height);
          }}
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', value);
            const el = document.getElementById('gbx3DropArea');
            if (el) {
              if (!el.classList.contains('dragOver')) el.classList.add('dragOver');
            }
          }}
          onDragEnd={(e) => {
            const el = document.getElementById('gbx3DropArea');
            if (el) {
              if (el.classList.contains('dragOver')) el.classList.remove('dragOver');
            }
          }}
        >
          Add {block.title}
        </li>
      );
    });

    return (
      <ul>
        <li className='listHeader'>Add Page Elements</li>
        {items}
      </ul>
    )
  }

  render() {

    return (
      <div className='layoutMenu'>
        {this.renderActiveBlocks()}
        {this.renderAvailableBlocks()}
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const blockType = props.blockType;
  const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
  const admin = util.getValue(gbx3, 'admin', {});
  const kind = util.getValue(gbx3, 'info.kind');
  const availableBlocks = util.getValue(admin, `availableBlocks.${blockType}`, []);

  return {
    blockType,
    blocks,
    kind,
    availableBlocks
  }
}

export default connect(mapStateToProps, {
  toggleModal,
  updateAdmin,
  addBlock
})(AdminMenuLayout);
