/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import * as util from '../../../common/utility';
import Block from '../../blocks/Block';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import {
  addBlock,
  updateAdmin,
  updateBlock,
  updateBlocks,
  saveReceipt
} from '../../redux/gbx3actions';
import Moment from 'moment';

const orderConfirmationTemplate = require('html-loader!./receiptConfirmationTemplate.html');
const receiptSweepstakesTemplate = require('html-loader!./receiptSweepstakesTemplate.html');

const arrayMove = require('array-move');

const SortableItem = SortableElement(({value}) => {
  return (
    <div className='gbx3 sortableElement' >
      {value}
    </div>
  )
});

const SortableList = SortableContainer(({items}) => {
  return (
    <div>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </div>
  );
});

class ReceiptEmailLayout extends React.Component {

  constructor(props) {
    super(props);
    this.renderRelativeBlocks = this.renderRelativeBlocks.bind(this);
    this.setOrderedBlocks = this.setOrderedBlocks.bind(this);
    this.saveBlock = this.saveBlock.bind(this);
    this.removeCallback = this.removeCallback.bind(this);
    this.renderOrderConfirmation = this.renderOrderConfirmation.bind(this);
    this.renderSpecificKind = this.renderSpecificKind.bind(this);
    this.gridRef = React.createRef();
    this.state = {
      orderedBlocks: []
    }
  }

  componentDidMount() {
    const {
      receiptHTML
    } = this.props;

    if (!receiptHTML) {
      this.props.saveReceipt();
    }
    this.setOrderedBlocks();
  }

  componentDidUpdate(prevProps) {
    if (Object.keys(prevProps.blocks).length !== Object.keys(this.props.blocks).length) {
      this.setOrderedBlocks();
    }
  }

  componentWillUnmount() {
  }

  setOrderedBlocks() {
    const {
      blocks
    } = this.props;

    const blocksArr = [];
    Object.entries(blocks).forEach(([key, value]) => {
      if (value) blocksArr.push(value);
    });
    util.sortByField(blocksArr, 'order', 'ASC');

    const orderedBlocks = [];
    Object.entries(blocksArr).forEach(([key, value]) => {
      if (value) orderedBlocks.push(value.name);
    });
    this.setState({ orderedBlocks });
  }

  onSortStart(e) {
    util.noSelection();
  }

  onSortMove(e) {
    util.noSelection();
  }

  onSortEnd = async ({oldIndex, newIndex, collection}) => {
    const {
      orderedBlocks
    } = this.state;

    const blocks = util.deepClone(this.props.blocks);

    if (oldIndex !== newIndex) {
      const newOrder = arrayMove(orderedBlocks, oldIndex, newIndex);
      newOrder.forEach((value, key) => {
        const block = util.getValue(blocks, value, {});
        if (!util.isEmpty(block)) {
          block.order = key;
        }
      });
      this.setState({ orderedBlocks: newOrder });
      const blocksUpdated = await this.props.updateBlocks('receipt', blocks);
      if (blocksUpdated) this.props.saveReceipt();
    }
  };

  removeCallback() {
    this.props.saveReceipt({
      callback: () => {
        this.setOrderedBlocks();
      }
    });
  }

  async saveBlock(args) {
    const {
      name,
      block,
      opts
    } = args;

    const {
      content,
      options,
      hasBeenUpdated,
      callback
    } = opts;

    if (hasBeenUpdated) {

      const blockToUpdate = {
        ...block,
        content,
        options: {
          ...block.options,
          ...options
        }
      }
      const blocksUpdated = await this.props.updateBlock('receipt', name, blockToUpdate);
      if (blocksUpdated) {
        this.props.saveReceipt({
          callback
        });
      }
    } else {
      callback();
    }
  }

  renderOrderConfirmation() {

    const descriptor = util.getValue(this.props.org, 'billingDescriptor', 'BillingDescription');
    const orderConfirmation = util.replaceAll(orderConfirmationTemplate, {
      '{{ordername}}': `Customer Name`,
      '{{orderdate}}' : Moment().format('MMMM Do, YYYY'),
      '{{descriptor}}' : `GBX*${descriptor}`
    });

    return orderConfirmation;
  }


  renderSpecificKind() {

    let template = util.replaceAll(receiptSweepstakesTemplate, {
      '{{descriptor}}' : ``
    });

    return template;
  }

  renderRelativeBlocks() {
    const {
      outline,
      blocks,
      breakpoint
    } = this.props;

    const items = [];
    const orderedBlocks = [];
    Object.entries(blocks).forEach(([key, value]) => {
      if (!util.isEmpty(value)) {
        orderedBlocks.push(value);
      }
    });
    util.sortByField(orderedBlocks, 'order', 'ASC');

    if (!util.isEmpty(orderedBlocks)) {
      Object.entries(orderedBlocks).forEach(([key, value]) => {
        const BlockComponent = Loadable({
          loader: () => import(`../../blocks/${value.type}`),
          loading: () => <></>
        });
        const ref = React.createRef();
        items.push(
          <div
            className={`sortableListItem react-grid-item mobileClassName ${outline ? 'outline' : ''}`}
            id={`block-${value.name}`}
            key={value.name}
            ref={ref}
          >
            <Block
              name={value.name}
              blockRef={React.createRef()}
              style={{ position: 'relative' }}
              blockType={'receipt'}
              saveBlock={this.saveBlock}
              removeCallback={this.removeCallback}
            >
              <BlockComponent />
            </Block>
          </div>
        );
      });
    }

    const rows =  <SortableList onSortStart={this.onSortStart} onSortMove={this.onSortMove} helperClass='sortableHelper' hideSortableGhost={true} useDragHandle={false} items={items} onSortEnd={this.onSortEnd} />;

    return breakpoint === 'mobile' ? items : rows;
  }

  render() {

    const {
      editable,
      hasAccessToEdit,
      reloadGBX3
    } = this.props;

    const isEditable = hasAccessToEdit && editable ? true : false;

    return (
      <>
        <div className='layout-column'>
          <div
            id='gbx3DropArea'
            ref={this.gridRef}
            className={`dropArea`}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (isEditable) {
                const w = e.clientX;
                const h = e.clientY;
                const block = e.dataTransfer.getData('text');
                const current = this.gridRef.current;
                if (current.classList.contains('dragOver')) current.classList.remove('dragOver');
                this.props.addBlock('receipt', block, w, h, this.gridRef, () => {
                  console.log('execute addBlock callback');
                });
              }
            }}
          >
            <div className='dragOverText'>Drop Page Element Here</div>
            {this.renderRelativeBlocks()}
            <div
              className={`react-grid-item receiptBlock`}
              id='block-receiptBottom'
              ref={React.createRef()}
            >
              <div className='receiptBottomText'>Everything below is non-editable and dynamically generated by the system per order.</div>
              <div className='block'>
                <div dangerouslySetInnerHTML={{ __html: this.renderOrderConfirmation() }} />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const info = util.getValue(gbx3, 'info', {});
  const blockType = 'receipt';
  const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
  const breakpoint = util.getValue(info, 'breakpoint');
  const admin = util.getValue(gbx3, 'admin', {});
  const editable = util.getValue(admin, 'editable');
  const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
  const receiptHTML = util.getValue(gbx3, 'data.receiptHTML');
  const org = util.getValue(state, 'resource.gbx3Org.data', {});

  return {
    breakpoint,
    blockType,
    blocks,
    editable,
    hasAccessToEdit,
    receiptHTML,
    org,
    globals: util.getValue(gbx3, 'globals', {})
  }
}

export default connect(mapStateToProps, {
  addBlock,
  updateAdmin,
  updateBlock,
  updateBlocks,
  saveReceipt
})(ReceiptEmailLayout);
