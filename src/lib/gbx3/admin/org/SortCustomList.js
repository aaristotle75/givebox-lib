import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import * as types from '../../../common/types';
import GBLink from '../../../common/GBLink';
import Image from '../../../common/Image';
import Loader from '../../../common/Loader';
import Choice from '../../../form/Choice';
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


class SortCustomList extends React.Component {

  constructor(props) {
    super(props);
    this.onSortStart = this.onSortStart.bind(this);
    this.onSortMove = this.onSortMove.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.getArticles = this.getArticles.bind(this);
    this.renderList = this.renderList.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
    this.getArticles();
  }

  onSortStart(e) {
    util.noSelection();
  }

  onSortMove(e) {
    util.noSelection();
  }

  onSortEnd = ({oldIndex, newIndex, collection}) => {
    const newList = [ ...this.props.customList ];
    const customList = arrayMove(newList, oldIndex, newIndex);
    this.props.updateCustomList(null, customList, true);
  };

  getArticles(options = {}) {
    const opts = {
      max: 50,
      reload: false,
      filter: '',
      query: '',
      search: false,
      showFetching: true,
      pageNumber: null,
      ...options
    };

    const {
      customList,
      customName,
      orgID
    } = this.props;

    const baseFilter = 'givebox:true';
    const filter = `${baseFilter}${opts.filter ? `%3B${opts.filter}` : ''}`;

    this.props.getResource('orgArticles', {
      orgID,
      customName,
      reload: true,
      search: {
        filter,
        max: 1000,
        sort: 'orderBy',
        order: 'asc'
      },
      callback: (res, err) => {
        if (!util.isEmpty(res) && !err) {
          const data = util.getValue(res, 'data', []);
          customList.forEach((value, key) => {
            const index = data.findIndex(a => a.ID === value);
            if (index === -1) {
              this.props.updateCustomList(value);
            }
          });
        }
      }
    });
  }

  renderList() {

    const {
      customList
    } = this.props;

    const articles = util.getValue(this.props.articles, 'data', []);
    const items = [];

    customList.forEach((key, num) => {
      const value = articles.find(a => a.ID === key);
      if (value) {
        items.push(
          <div
            className='articleItem sortableListItem'
            key={key}
          >
            <div className='editableRowMenu'>
              <Choice
                type='checkbox'
                name='enable'
                label={''}
                onChange={(name, value) => {
                  this.props.updateCustomList(key);
                }}
                checked={true}
                value={true}
                toggle={true}
              />
            </div>
            <div className='articleImage'>
              <DragHandle />
            </div>
            <div className='articleImage'>
              <Image url={value.imageURL} maxSize={50} size={'thumb'} alt={value.title} />
            </div>
            <div className='articleText'>
              <span>
                {value.title}
                <span className='gray smallText'>{types.kind(value.kind).name}</span>
              </span>
            </div>
          </div>
        );
      }
    });

    const rows =  <SortableList onSortStart={this.onSortStart} onSortMove={this.onSortMove} helperClass='sortableHelper' hideSortableGhost={true} useDragHandle={false} items={items} onSortEnd={this.onSortEnd} />;

    return (
      <div className='articleGroupList campaignsEdit'>
        <div className='articleGroup'>
          {!util.isEmpty(items) ? rows : <span className='noRecords flexCenter'>None Enabled</span>}
        </div>
      </div>
    )
  }

  render() {

    const {
    } = this.props;

    return (
      <div className='articleGroupTopContainer'>
        { util.isFetching(this.props.articles) ? <Loader msg='Loading Sortable List...' /> : null }
        {this.renderList()}
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const customName = `articleSort`;
  const articles = util.getValue(state, `resource.${customName}`, {});

  return {
    customName,
    articles
  }
}

export default connect(mapStateToProps, {
})(SortCustomList);
