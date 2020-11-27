import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  util
} from '../../';
import Collapse from '../../common/Collapse';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import Loader from '../../common/Loader';
import Tabs, { Tab } from '../../common/Tabs';
import * as types from '../../common/types';
import Dropdown from '../../form/Dropdown';
import ModalRoute from '../../modal/ModalRoute';
import ModalLink from '../../modal/ModalLink';
import { getResource } from '../../api/helpers';
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
    <div>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </div>
  );
});

class CampaignsEdit extends Component{
  constructor(props){
    super(props);
    this.onSortStart = this.onSortStart.bind(this);
    this.onSortMove = this.onSortMove.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.updateCustomList = this.updateCustomList.bind(this);
    this.maxRecordsOptions = this.maxRecordsOptions.bind(this);
    this.renderArticles = this.renderArticles.bind(this);
    this.updateCampaign = this.updateCampaign.bind(this);
    this.state = {
      customList: util.getValue(props.options, 'customList', [])
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
    const customList = [ ...this.state.customList ];
    this.updateCustomList(arrayMove(customList, oldIndex, newIndex));
  };

  updateCustomList(customList = []) {
    this.setState({
      customList
    }, () => {
      this.props.optionsUpdated('customList', customList);
      this.forceUpdate();
    });
  }

  maxRecordsOptions() {
    const items = [];
    for (let i=1; i <= 20; i++) {
      const number = i * 3;
      items.push({ primaryText: `${number} Per Page`, value: number});
    }
    return items;
  }

  updateCampaign(article, type = 'add', callback) {

    const customList = util.deepClone(this.state.customList);
    const {
      ID
    } = article;

    switch (type) {
      case 'remove': {
        const index = customList.findIndex(c => c.ID === ID);
        if (index >= 0) customList.splice(index, 1);
        break;
      }

      case 'add':
      default: {
        customList.unshift(this.props.setCustomListItem(article));
        break;
      }
    }
    this.setState({ customList }, () => {
      this.props.optionsUpdated('customList', customList);
      this.forceUpdate();
    });
  }

  renderArticles() {
    const {
      options
    } = this.props;

    const items = [];
    const customList = util.getValue(options, 'customList', []);

    if (!util.isEmpty(customList)) {
      Object.entries(customList).forEach(([key, value]) => {
        items.push(
          <div
            key={key}
            className='articleItem sortableListItem'
          >
            <div className='editableRowMenu'>
              <GBLink onClick={() => this.updateCampaign(value, 'remove')}><span className='icon icon-x'></span> Remove</GBLink>
              <DragHandle />
            </div>
            <div className='articleImage'>
              <Image url={util.imageUrlWithStyle(value.imageURL, 'thumb')} size='thumb' maxSize={50} />
            </div>
            <div className='articleText'>
              <span>
                {value.title}
                <span className='gray smallText'>{types.kind(value.kind).name}</span>
              </span>
            </div>
          </div>
        );
      });
    }

    const rows =  !util.isEmpty(items) ? <SortableList onSortStart={this.onSortStart} onSortMove={this.onSortMove} helperClass='sortableHelper' hideSortableGhost={true} useDragHandle={true} items={items} onSortEnd={this.onSortEnd} /> : [];

    return (
      <div className='articleGroupList campaignsEdit'>
        <div className='articleGroup'>
        {!util.isEmpty(rows) ? rows : <span className='noRecords flexCenter'>Please Add a Form to the List</span>}
        </div>
      </div>
    )
  }

  render() {

    const {
      options
    } = this.props;

    const maxRecords = util.getValue(options, 'maxRecords', 3);

    return (
      <div className='modalWrapper gbx3Shop editable'>
        <Tabs
          default={'edit'}
          className='statsTab'
        >
          <Tab id='edit' label={<span className='stepLabel'>Form List</span>}>
            <Collapse
              label={`Edit Form List`}
              iconPrimary='edit'
              id={'gbx3-campaignsBlock-edit'}
            >
              <div className='formSectionContainer'>
                <div className='formSection'>
                  <div className='flexCenter' style={{ margin: '20px 0 0px 0' }}>
                    <ModalLink
                      id='articleList'
                      style={{ fontSize: 14 }}
                      opts={{
                        title: 'Select Forms to Add to List',
                        notPublicText: 'This is Set to Private and Cannot be Added',
                        selectedText: <span><span className='icon icon-check'></span> Added</span>,
                        selectText: 'Add to Form List',
                        filterFunc: () => this.props.filterCampaigns(true),
                        callback: this.updateCampaign,
                        closeCallback: () => {
                          console.log('execute closeCallback');
                        }
                      }}
                    ><span className='icon icon-plus'></span> Add a Form to the List</ModalLink>
                  </div>
                  {this.renderArticles()}
                </div>
              </div>
            </Collapse>
          </Tab>
          <Tab id='options' label={<span className='stepLabel'>Options</span>}>
            <Collapse
              label={`Edit Options`}
              iconPrimary='edit'
              id={'gbx3-campaignsBlock-options'}
            >
              <div className='formSectionContainer'>
                <div className='formSection'>
                  <Dropdown
                    portalClass={'dropdown-left-portal'}
                    portalID={`campaignsEdit-maxRecords`}
                    portal={true}
                    name='maxRecords'
                    contentWidth={200}
                    portalLeftOffset={5}
                    label={'Forms Per Page'}
                    fixedLabel={true}
                    defaultValue={+maxRecords}
                    onChange={(name, value) => {
                      this.props.optionsUpdated('maxRecords', +value);
                    }}
                    options={this.maxRecordsOptions()}
                  />
                </div>
              </div>
            </Collapse>
          </Tab>
        </Tabs>
      </div>
    )
  }
};

CampaignsEdit.defaultProps = {
}

function mapStateToProps(state, props) {

  const name = 'campaignsBlockEditList';
  const campaigns = util.getValue(state, `resource.${name}.data`, {});
  const campaignsTotal = util.getValue(state, `resource.${name}.meta.total`, 0);
  const campaignsFetching = util.getValue(state, `resource.${name}.isFetching`, false);
  const isMobile = util.getValue(state, 'gbx3.info.breakpoint') === 'mobile' ? true : false;

  return {
    name,
    campaigns,
    campaignsTotal,
    campaignsFetching,
    isMobile
  }
}

export default connect(mapStateToProps, {
  getResource
})(CampaignsEdit);
