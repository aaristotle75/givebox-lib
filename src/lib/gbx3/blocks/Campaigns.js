import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util
} from '../../';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import Loader from '../../common/Loader';
import * as types from '../../common/types';
import ModalRoute from '../../modal/ModalRoute';
import CampaignsEdit from './CampaignsEdit';
import { toggleModal } from '../../api/actions';
import { getResource } from '../../api/helpers';
import {
  updateInfo,
  clearGBX3
} from '../redux/gbx3actions';
import '../../styles/gbx3Campaigns.scss';
import Pagination from "react-js-pagination";

class Campaigns extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.optionsUpdated = this.optionsUpdated.bind(this);
    this.setInitCampaigns = this.setInitCampaigns.bind(this);
    this.renderCampaigns = this.renderCampaigns.bind(this);
    this.filterCampaigns = this.filterCampaigns.bind(this);
    this.setStyle = this.setStyle.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.loadGBX = this.loadGBX.bind(this);
    this.setCustomListItem = this.setCustomListItem.bind(this);

    const options = util.deepClone(props.options);

    this.state = {
      options,
      defaultOptions: util.deepClone(options),
      hasBeenUpdated: true,
      tab: 'edit',
      loading: false,
      pageNumber: 1
    };
    this.blockRef = null;
    this.width = null;
    this.height = null;
    this.displayRef = React.createRef();
  }

  componentDidMount() {
    const {
      orgID,
      name,
      campaignsInit
    } = this.props;

    const {
      options
    } = this.state;

    const initiated = util.getValue(options, 'initiated');
    const customList = util.getValue(options, 'customList', []);

    if (!initiated || util.isEmpty(customList)) {
      if (!util.isEmpty(campaignsInit)) {
        this.setInitCampaigns();
      } else {
        this.props.getResource('orgArticles', {
          customName: `${name}Init`,
          orgID,
          callback: (res, err) => {
            this.setInitCampaigns();
          },
          search: {
            filter: 'givebox:true',
            max: 1000
          }
        });
      }
    }

    this.blockRef = this.props.blockRef.current;
    if (this.blockRef) {
      this.width = this.blockRef.clientWidth;
      this.height = this.blockRef.clientHeight;
    }

    this.setStyle();
  }

  componentDidUpdate(prevProps) {
    this.props.setDisplayHeight(this.displayRef);
    if (prevProps.primaryColor !== this.props.primaryColor) {
      this.setStyle();
    }
  }

  async loadGBX(ID) {
    const infoUpdated = await this.props.updateInfo({ originTemplate: 'org' });
    if (infoUpdated) this.props.reloadGBX3(ID);
  }

  setStyle() {

    const {
      primaryColor
    } = this.props;

    const rgb = util.hexToRgb(primaryColor);
    const color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .4)`;

    const style = `
      .scrollableCampaignsList::-webkit-scrollbar-thumb {
        background-color: ${color};
      }

      .gbx3 .campaignsBlockList .pagination .page:hover {
        color: ${primaryColor};
      }

      .gbx3 .paginateCampaignsList .pagination a {
        color: ${primaryColor};
      }

      .gbx3 .paginateCampaignsList .pagination a:hover {
        color: ${color};
      }

    `;

    const el = document.getElementById('campaignStyle');
    if (el) {
      el.innerHTML = style;
    } else {
      const styleEl = document.head.appendChild(document.createElement('style'));
      styleEl.setAttribute('id', 'campaignStyle');
      styleEl.innerHTML = style;
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
      options,
      defaultOptions,
      hasBeenUpdated
    } = this.state;

    if (type !== 'cancel') {
      const data = {};
      this.props.saveBlock({
        data,
        hasBeenUpdated,
        options
      });
    } else {
      this.setState({
        options: util.deepClone(defaultOptions)
      }, () => {
        this.props.closeEditModal();
      })
    }
  }

  setCustomListItem(article) {
    const {
      ID,
      kindID,
      kind,
      title,
      imageURL,
      publishedStatus
    } = article;

    return {
      ID,
      kindID,
      kind,
      title,
      imageURL,
      publishedStatus
    }
  }

  setInitCampaigns() {
    const {
      campaignsInit
    } = this.props;

    const customList = [];

    if (!util.isEmpty(campaignsInit)) {
      Object.entries(campaignsInit).forEach(([key, value]) => {
        const status = util.getValue(value, 'publishedStatus', {});
        const webApp = util.getValue(status, 'webApp', null);
        const published = value.kind !== 'fundraiser' && webApp ? false : true;
        if (published) {
          customList.push(this.setCustomListItem(value));
        }
      });
    }

    this.optionsUpdated('initiated', true, () => {
      this.optionsUpdated('customList', customList, () => {
        const defaultOptions = util.deepClone(this.state.options);
        this.setState({
          defaultOptions,
          loading: false
        });
      })
    });
  }

  optionsUpdated(name, value, callback) {
    const options = this.state.options;
    options[name] = value;

    this.setState({
      options,
      hasBeenUpdated: true
    }, () => {
      if (callback) callback();
    });
  }

  setTab(tab) {
    this.setState({ tab });
  }

  onClickRemove() {
    console.log('onClickRemove');
  }

  filterCampaigns(forAdding) {
    const {
      options
    } = this.state;

    const customList = util.getValue(options, 'customList', []);
    let filter = '';

    if (!util.isEmpty(customList)) {
      Object.entries(customList).forEach(([key, value]) => {
        filter = forAdding ? filter + `%3BID:!${value.ID}` : filter + `%2CID:${value.ID}`;
      });
    } else {
      filter = forAdding ? 'givebox:false' : 'givebox:true';
    }
    return filter;
  }

  onMouseEnter(ID) {
    //console.log('execute onMouseEnter');
  }

  onMouseLeave(ID) {
    //console.log('execute onMouseLeave');
  }

  handlePageChange(pageNumber) {
    this.setState({ pageNumber });
  }

  renderCampaigns() {
    const {
      options,
      pageNumber
    } = this.state;

    const items = [];
    const customList = util.deepClone(util.getValue(options, 'customList', []));
    const maxRecords = util.getValue(options, 'maxRecords', 3);
    const length = customList.length;
    const start = (pageNumber - 1) * maxRecords;
    const pageList = customList.splice(start, maxRecords);

    if (!util.isEmpty(pageList)) {
      Object.entries(pageList).forEach(([key, value]) => {

        const imageURL = util.imageUrlWithStyle(value.imageURL, 'medium');
        const imageStyle = {
          background: `url(${imageURL}) no-repeat center`
        };
        const cardStyle = { WebkitBoxShadow: `0px 3px 6px 0px #465965` };

        items.push(
          <li key={key}>
            <div className='articleCardWrapper' id={value.ID} onMouseEnter={() => this.onMouseEnter(value.ID)} onMouseLeave={() => this.onMouseLeave(value.ID)}>
              <div className='articleCardShadow' style={cardStyle}></div>
              <div className='articleCard'>
                <div className='imageContainer'>
                  <div style={imageStyle} className='imageBg'></div>
                  <div className='image'>
                    <GBLink onClick={() => this.loadGBX(value.ID)}><Image maxSize={'250px'} url={imageURL} size='medium' alt={value.imageURL} /></GBLink>
                    <div className='imageCover' onClick={() => this.loadGBX(value.ID)}><div className='imageLink'>Learn More</div></div>
                  </div>
                </div>
                <div className='kind'>
                  <span className={`icon icon-${types.kind(value.kind).icon}`}></span>
                  <span className='kindText'>{value.kind === 'fundraiser' ? 'Fundraiser' : types.kind(value.kind).name}</span>
                </div>
                <GBLink className='link title' onClick={() => this.loadGBX(value.ID)}>{value.title}</GBLink>
              </div>
            </div>
          </li>
        );
      });
    }

    return (
      <div className='campaignsBlockList'>
        <div className='scrollableCampaignsList'>
          <ul className='campaignsList'>
            {!util.isEmpty(items) ? items : <span className='noRecords'></span>}
          </ul>
        </div>
        { length > maxRecords ?
        <div className='paginateCampaignsList'>
          <Pagination
            activePage={pageNumber}
            itemsCountPerPage={maxRecords}
            totalItemsCount={length}
            pageRangeDisplayed={3}
            onChange={this.handlePageChange.bind(this)}
            hideDisabled={true}
            hideFirstLastPages={true}
          />
        </div> : '' }
      </div>
    )
  }

  render() {

    const {
      modalID,
      title,
      block,
      campaignsFetching
    } = this.props;

    const {
      options,
      loading
    } = this.state;

    const nonremovable = util.getValue(block, 'nonremovable', false);
    const initiated = util.getValue(options, 'initiated');

    return (
      <div className={'campaignsBlock'}>
        { campaignsFetching || loading ? <Loader msg={'Loading campaigns...'} /> : '' }
        { initiated ?
          <ModalRoute
            className='gbx3'
            id={modalID}
            effect='3DFlipVert' style={{ width: '70%' }}
            draggable={true}
            draggableTitle={`Editing ${title}`}
            closeCallback={this.closeEditModal}
            disallowBgClose={true}
            component={() =>
              <CampaignsEdit
                {...this.props}
                initiated={initiated}
                optionsUpdated={this.optionsUpdated}
                options={options}
                filterCampaigns={this.filterCampaigns}
                setCustomListItem={this.setCustomListItem}
              />
            }
            buttonGroup={
              <div className='gbx3'>
                <div style={{ marginBottom: 0 }} className='button-group center'>
                  {!nonremovable ? <GBLink className='link remove' onClick={this.onClickRemove}><span className='icon icon-trash-2'></span> <span className='buttonText'>Remove</span></GBLink> : <></>}
                  <GBLink className='link' onClick={() => this.closeEditModal('cancel')}>Cancel</GBLink>
                  <GBLink className='button' onClick={this.closeEditModal}>Save</GBLink>
                </div>
              </div>
            }
          />
        : '' }
        {this.renderCampaigns()}
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const primaryColor = util.getValue(state, 'gbx3.globals.gbxStyle.primaryColor');
  const campaignsInit = util.getValue(state, `resource.${props.name}Init.data`, {});
  const campaigns = util.getValue(state, `resource.${props.name}.data`, {});
  const campaignsTotal = util.getValue(state, `resource.${props.name}.meta.total`, 0);
  const campaignsFetching = util.getValue(state, `resource.${props.name}.isFetching`, false);

  return {
    primaryColor,
    campaigns,
    campaignsInit,
    campaignsTotal,
    campaignsFetching
  }
}

export default connect(mapStateToProps, {
  toggleModal,
  getResource,
  updateInfo,
  clearGBX3
})(Campaigns);
