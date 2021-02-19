import React, {Component} from 'react';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import * as types from '../../common/types';
import ModalLink from '../../modal/ModalLink';

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

        if (virtualEvent || where || eventNumAvailableTickets) {
          item.push(
            <div key={`${kind}-where`} className={`cardKindSpecific cardKindEventWhere`}>
              {virtualEvent ? 'This is a Virtual Event' : where}
              {eventNumAvailableTickets > 0 ? <span>Tickets Available</span> : null}
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
      activePage
    } = this.props;

    const {
      title,
      imageURL,
      stats
    } = item;

    const views = +util.getValue(stats, 'views', 0);
    const viewCount = views > 0 ? views : 1;
    const likes = +util.getValue(stats, 'likes', 0);
    const shares = +util.getValue(stats, 'shares', 0);
    const tag = util.getValue(item, 'tag', util.getValue(activePage, 'name'));

    return (
      <div className='articleCard'>
        <ModalLink
          id='orgEditCard'
          type='div'
          className='articleCardEdit orgAdminEdit'
          opts={{
            item,
            closeCallback: () => console.log('execute closeCallback -> articleCard')
          }}
        >
          <button
            className='tooltip blockEditButton'
          >
            <span className='tooltipTop'><i />Click Icon to EDIT Card</span>
            <span className='icon icon-edit'></span>
          </button>
        </ModalLink>
        <div className='articleCardContainer'>
          <div className='cardPhotoContainer'>
            <div className='cardPhotoImage'>
              <Image imgID='cardPhoto' url={imageURL} maxWidth='325px' size='medium' alt='Card Photo' />
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
  item: {}
};


export default ArticleCard;
