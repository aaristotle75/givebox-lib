import React, {Component} from 'react';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import * as types from '../../common/types';
import ModalLink from '../../modal/ModalLink';
import Video from '../../common/Video';
import Dropdown from '../../form/Dropdown';

class ArticleCard extends Component {
  constructor(props) {
    super(props);
    this.renderKindSpecific = this.renderKindSpecific.bind(this);
    this.onClickAdmin = this.onClickAdmin.bind(this);
    this.onClickDropdownItem = this.onClickDropdownItem.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  componentDidMount() {
  }

  onClickAdmin() {
    if (!this.state.dropdownOpen) this.setState({ dropdownOpen: true });
  }

  onClickDropdownItem(value) {
    const {
      item,
      activePage,
      pageSlug,
      resourcesToLoad
    } = this.props;

    const orgID = util.getValue(item, 'orgID');
    const title = util.getValue(item, 'title');
    const articleID = util.getValue(item, 'ID');
    const kindID = util.getValue(item, 'kindID');
    const kind = util.getValue(item, 'kind');

    switch (value) {
      case 'editCard': {
        return this.props.toggleModal('orgEditCard', true, {
          item,
          pageSlug,
          page: activePage,
          resourcesToLoad,
          onClickArticle: this.props.onClickArticle,
          reloadGetArticles: this.props.reloadGetArticles,
          closeCallback: () => console.log('execute closeCallback -> articleCard')
        });
      }

      case 'editForm': {
        return this.props.onClickArticle(articleID, true);
      }

      case 'shareForm': {
        const hasCustomSlug = util.getValue(item, 'hasCustomSlug');
        const slug = util.getValue(item, 'slug');
        const webApp = util.getValue(item, 'publishedStatus.webApp');
        this.props.toggleModal('share', true, {
          getArticleID: articleID,
          forceDisplay: 'article'
        });
        break;
      }

      case 'removeCard': {
        this.props.toggleModal('orgRemove', true, {
          desc: `REMOVE ${title} From Page`,
          subDesc: 'Please confirm you want to remove this card from the page.',
          confirmText: 'Yes, Remove Card',
          callback: () => {
            this.props.removeCard(articleID, kind, kindID, () => this.props.toggleModal('orgRemove', false));
          }
        });
        break;
      }

      case 'makePrivate': {
        this.props.toggleModal('orgRemove', true, {
          desc: `MAKE PRIVATE ${title}`,
          subDesc: `Please confirm you want to make this ${types.kind(kind).name.toLowerCase()} private. Making private will hide it from public view and remove it from this page.`,
          confirmText: 'Yes, Make Private',
          callback: () => {
            this.props.sendResource(types.kind(kind).api.publish, {
              orgID,
              id: [kindID],
              method: 'patch',
              isSending: false,
              data: {
                webApp: kind === 'fundraiser' ? false : true,
                givebox: false,
                landing: false
              },
              callback: (res, err) => {
                this.props.removeCard(articleID, kind, kindID, () => {
                  this.props.toggleModal('orgRemove', false);
                });
              }
            });
          }
        });
        break;
      }

      case 'deleteForm': {
        const resource = `org${types.kind(kind).api.item}`;
        this.props.toggleModal('deleteArticle', true, {
          resource,
          orgID,
          id: kindID,
          desc: `DELETE ${title}`,
          activityDesc: `DELETED ${title}`,
          subDesc: `Please confirm you want to delete ${types.kind(kind).name.toLowerCase()}?`,
          confirmText: 'Yes, Delete',
          modalID: 'deleteArticle',
          callback: () => {
            this.props.removeCard(articleID, kind, kindID);
          }
        });
        break;
      }

      // no default
    };
  }

  renderKindSpecific() {
    const {
      kind
    } = this.props;

    const item = [];

    switch (kind) {
      case 'event': {
        const {
          eventWhen,
          eventWhenShowTime,
          eventEndsAt,
          eventEndsAtShowTime,
          eventNumAvailableTickets,
          virtualEvent
        } = this.props.item;

        const when = eventWhen ? <div className='cardKindEventDate'>{util.getDate(eventWhen, `MMM Do, YYYY${eventWhenShowTime ? ' h:mmA' : ''}`)}</div> : null;

        const ends = eventEndsAt ? <div className='cardKindEventDate'>{util.getDate(eventEndsAt, `MMM Do, YYYY${eventEndsAtShowTime ? ' h:mmA' : ''}`)}</div> : null;

        const available = eventNumAvailableTickets || null;

        if (when) {
          item.push(
            <div key={`${kind}-when`} className={`cardKindSpecific ${ends ? 'cardKindEventEndDate' : ''}`}>
              {when}{ends ? <div className='cardKindSpecificSeparator'>-</div> : null}{ends}
            </div>
          )
        }

        const whereObj = util.getValue(this.props.item, 'givebox.customTemplate.blocks.where.content.where', {});
        const city = util.getValue(whereObj, 'city');
        const state = util.getValue(whereObj, 'state');
        const where = city ? <div className='cardKindWhere'>{city}{state ? `, ${state}` : null}</div> : null;
        const virtualEnabled = util.getValue(virtualEvent, 'isEnabled', false);

        if (virtualEnabled || where || eventNumAvailableTickets) {
          item.push(
            <div key={`${kind}-where`} className={`cardKindSpecific cardKindEventWhere`}>
              {virtualEnabled ? 'This is a Virtual Event' : where}
              {eventNumAvailableTickets > 0 ? <span>Tickets Available</span> : <span>Sold Out</span>}
            </div>
          )
        }
        break;
      }

      // no default
    }

    if (!util.isEmpty(item)) {
      return (
        <div className='cardKindSpecificContainer'>
          {item}
        </div>
      )
    }

    return null;
  }

  render() {

    const {
      kind,
      item,
      activePage,
      pageSlug,
      resourcesToLoad,
      playPreview
    } = this.props;

    const {
      stats,
      ID
    } = item;

    const views = +util.getValue(stats, 'views', 0);
    const viewCount = views > 0 ? views : 1;
    const likes = +util.getValue(stats, 'likes', 0);
    const shares = +util.getValue(stats, 'shares', 0);
    const tag = util.getValue(item, 'tag', types.kind(kind).defaultTag);
    const articleCard = util.getValue(item, 'givebox.customTemplate.articleCard', {});
    const title = util.getValue(articleCard, 'title', item.title);
    const imageURL = util.getValue(articleCard, 'imageURL', item.imageURL);
    const videoURL = util.getValue(articleCard, 'videoURL', item.videoURL);
    const mediaType = util.getValue(articleCard, 'mediaType', 'image');
    const hideViewCount = util.getValue(articleCard, 'hideViewCount', false);

    const media = videoURL && !util.checkImage(imageURL) ?
      <Video
        playing={false}
        url={videoURL}
        style={{
          maxWidth: '100%',
          maxHeight: 'auto'
        }}
        maxHeight={'auto'}
        light={true}
      />
    :
      <Image imgID='cardPhoto' url={imageURL || 'https://s3-us-west-1.amazonaws.com/givebox/assets/img/fundraiser-cover/original'} maxWidth='325px' size='medium' alt='Card Photo' />
    ;

    const formName = `${kind === 'fundraiser' ? 'Donation' : types.kind(kind).name} Form`;

    return (
      <div className='articleCard'>
        <div onClick={this.onClickAdmin} className='articleCardEdit orgAdminEdit'>
          <Dropdown
            open={this.state.dropdownOpen}
            closeCallback={() => {
              this.setState({ dropdownOpen: false });
            }}
            name='createKind'
            portalID={`createKind-dropdown-portal-${kind}`}
            portalClass={'gbx3 articleCardDropdown articleCardSelect'}
            portalLeftOffset={5}
            className='articleCard'
            contentWidth={300}
            label={''}
            selectLabel={''}
            fixedLabel={false}
            onChange={(name, value) => {
              this.setState({ dropdownOpen: false }, () => {
                this.onClickDropdownItem(value);
              });
            }}
            options={[
              { primaryText: <span className='labelIcon'><span className={'icon icon-layout'}></span>Edit {formName}</span>, value: 'editForm' },
              { primaryText: <span className='labelIcon'><span className={'icon icon-share'}></span>Share {formName}</span>, value: 'shareForm' },
              { primaryText: <span className='labelIcon'><span className={'icon icon-x'}></span>Remove From Page</span>, value: 'removeCard' },
              { primaryText: <span className='labelIcon'><span className={'icon icon-eye-off'}></span>Make Private (Remove from Page and Hide From Public View)</span>, value: 'makePrivate' },
              { primaryText: <span className='labelIcon'><span className={'icon icon-trash-2'}></span>Delete {formName}</span>, value: 'deleteForm' }
            ]}
            hideIcons={true}
            hideButton={true}
            showCloseBtn={true}
          >
            <button className='tooltip blockEditButton'>
              <span className='tooltipTop'><i />Click for Edit Options</span>
              <span className='icon icon-edit'></span>
            </button>
          </Dropdown>
        </div>
        <div className='articleCardContainer'>
          <div className='cardPhotoContainer'>
            <div className='cardPhotoImage'>
              { !playPreview || !videoURL ? media : null }
              { videoURL && playPreview ?
                <Video
                  ID={ID}
                  playing={playPreview}
                  url={videoURL}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 'auto'
                  }}
                  maxHeight={'auto'}
                  light={false}
                  muted={true}
                  loop={true}
                  controls={false}
                />
              : null }
            </div>
          </div>
          <div className='cardInfoContainer'>
            <div className='cardArticleTag'>
              {tag}
            </div>
            <div className='cardInfo'>
              { !hideViewCount ?
                <><span className='icon icon-eye'></span> Views ({viewCount})</>
              : null }
            </div>
          </div>
          <div className='cardTitleContainer'>
            <h2>{util.truncate(title, 64)}</h2>
          </div>
          {this.renderKindSpecific()}
          <div className='cardButtonContainer'>
            <div className='cardButton'>
              {types.kind(kind).cta}
            </div>
          </div>
        </div>
      </div>
    )
  }
};

ArticleCard.defaultProps = {
  item: {},
  resourcesToLoad: []
};


export default ArticleCard;
