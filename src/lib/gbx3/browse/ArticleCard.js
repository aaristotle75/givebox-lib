import React, {Component} from 'react';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import * as types from '../../common/types';
import ModalLink from '../../modal/ModalLink';
import Video from '../../common/Video';

class ArticleCard extends Component {
  constructor(props) {
    super(props);
    this.renderKindSpecific = this.renderKindSpecific.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
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
    const orgName = util.getValue(item, 'orgName');

    const media =
      <div className='mediaWrapper'>
        { videoURL && !util.checkImage(imageURL) ?
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
          <Image imgID='cardPhoto' url={imageURL} maxWidth='325px' size='medium' alt='Card Photo' />
        }
      </div>
    ;

    return (
      <div className='articleCard'>
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
              <span className='icon icon-eye'></span> Views ({viewCount})
            </div>
          </div>
          <div className='cardTitleContainer'>
            <h2>{util.truncate(title, 64)}</h2>
            <h3>{util.truncate(orgName, 64)}</h3>
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
