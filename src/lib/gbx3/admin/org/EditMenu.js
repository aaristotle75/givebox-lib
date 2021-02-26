import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import * as types from '../../../common/types';
import GBLink from '../../../common/GBLink';
import ModalLink from '../../../modal/ModalLink';
import Choice from '../../../form/Choice';
import {
  updatePagesEnabled,
  saveOrg
} from '../../redux/gbx3actions';
import {
  toggleModal
} from '../../../api/actions';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
const arrayMove = require('array-move');

const DragHandle = SortableHandle(() => {
  return (
    <GBLink ripple={false} className='tooltip sortable right'>
      <span className='tooltipTop'><i />Drag & drop to change the order.</span>
      <span className='icon icon-move'></span>
    </GBLink>
  )
});

const SortableItem = SortableElement(({value}) => {
  return (
    <div className='gbx3Shop editable sortableElement' >
      {value}
    </div>
  )
});

const SortableList = SortableContainer(({items}) => {
  return (
    <div className='gbx3OrgAdmin'>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </div>
  );
});

class EditMenu extends React.Component {

  constructor(props) {
    super(props);
    this.onSortStart = this.onSortStart.bind(this);
    this.onSortMove = this.onSortMove.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.renderPageList = this.renderPageList.bind(this);
    this.editLink = this.editLink.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  onSortStart(e) {
    util.noSelection();
  }

  onSortMove(e) {
    util.noSelection();
  }

  onSortEnd = ({oldIndex, newIndex, collection}) => {
    const newList = [ ...this.props.pagesEnabled ];
    const pagesEnabled = arrayMove(newList, oldIndex, newIndex);
    this.props.updatePagesEnabled(pagesEnabled);
  };

  editLink(page) {

    const hasCustomList = util.getValue(page, 'hasCustomList', false);

    return (
      <ModalLink
        id={'orgEditPage'}
        className='link tooltip'
        opts={{
          hasCustomList,
          pageSlug: util.getValue(page, 'slug')
        }}
      >
        <span className='tooltipTop'><i />Click Icon to EDIT Page</span>
        <span className='icon icon-edit'></span>
      </ModalLink>
    )

  }

  renderPageList() {
    const {
      pages,
      pagesEnabled
    } = this.props;

    const enabledItems = [];
    const disabledItems = [];
    const disabledArr = [];

    pagesEnabled.forEach((val, key) => {
      const value = util.getValue(pages, val, {});
      enabledItems.push(
        <div
          className='articleItem sortableListItem'
          key={val}
        >
          <div className='editableRowMenu'>
            {this.editLink(value)}
            <Choice
              type='checkbox'
              name='disable'
              label={''}
              onChange={(name, value) => {
                const pagesEnabled = [ ...this.props.pagesEnabled ];
                pagesEnabled.splice(key, 1);
                this.props.updatePagesEnabled(pagesEnabled);
              }}
              checked={true}
              value={true}
              toggle={true}
            />
          </div>
          <div className='articleLeftDrag'>
            <DragHandle />
          </div>
          <div className='articleText'>
            <span>
              {value.name}
              <span className='gray smallText'>{types.kind(value.kind).name}</span>
            </span>
          </div>
        </div>
      );
    });

    const rows =  !util.isEmpty(enabledItems) ? <SortableList onSortStart={this.onSortStart} onSortMove={this.onSortMove} helperClass='sortableHelper' hideSortableGhost={true} useDragHandle={true} items={enabledItems} onSortEnd={this.onSortEnd} /> : [];

    Object.entries(pages).forEach(([key, value]) => {
      const disabled = !pagesEnabled.includes(key) ? true : false;
      if (disabled) {
        disabledArr.push(key);
        disabledItems.push(
          <div
            className='articleItem sortableListItem disabled'
            key={key}
          >
            <div className='editableRowMenu'>
              {this.editLink(value)}
              <Choice
                type='checkbox'
                name='enable'
                label={''}
                onChange={(name, value) => {
                  const pagesEnabled = [ ...this.props.pagesEnabled ];
                  pagesEnabled.push(key);
                  this.props.updatePagesEnabled(pagesEnabled);
                }}
                checked={false}
                value={false}
                toggle={true}
              />
            </div>
            <div className='articleLeftDrag'></div>
            <div className='articleText'>
              <span>
                {value.name}
                <span className='gray smallText'>{types.kind(value.kind).name}</span>
              </span>
            </div>
          </div>
        );
      }
    });

    return (
      <div className='articleGroupList campaignsEdit'>
        <div className='articleGroup'>
          {rows}
          { disabledItems.length > 0 ?
          <div style={{ marginTop: 30 }}>
            <div style={{ marginLeft: 65 }} className='itemsSubHeader'>Disabled Pages</div>
            {disabledItems}
          </div> : null }
        </div>
      </div>
    )
  }

  render() {

    const {
    } = this.props;

    return (
      <div className='modalWrapper gbx3Shop editable'>
        <div className='formSectionContainer'>
          <div className='formSection'>
            {this.renderPageList()}
            <div className='button-group flexCenter'>
              <GBLink
                onClick={() => {
                  this.props.closeCallback();
                  this.props.toggleModal('orgEditMenu', false);
                }}
                className='button'
              >
                Save
              </GBLink>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
    pagesEnabled: util.getValue(state, 'gbx3.orgGlobals.pagesEnabled', []),
    pages: util.getValue(state, 'gbx3.orgPages', {})
  }
}

export default connect(mapStateToProps, {
  updatePagesEnabled,
  toggleModal,
  saveOrg
})(EditMenu);
