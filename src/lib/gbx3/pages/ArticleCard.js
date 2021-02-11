import React, {Component} from 'react';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import * as types from '../../common/types';

class ArticleCard extends Component {
  constructor(props){
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

        item.push(
          <div key={kind} className={`cardKindSpecific ${ends ? 'cardKindEventEndDate' : ''}`}>
            {when}{ends ? <div className='cardKindEventTo'>to</div> : null}{ends}
          </div>
        )
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
      item
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

    return (
      <div className='cardContainer'>
        <div className='cardPhotoContainer'>
          <div className='cardPhotoImage'>
            <Image imgID='cardPhoto' url={imageURL} maxWidth='325px' size='medium' alt='Card Photo' />
          </div>
        </div>
        <div className='cardInfoContainer'>
          <div className='cardInfo'>
            <span className='icon icon-eye'></span> Views ({viewCount})
          </div>
        </div>
        <div className='cardTitleContainer'>
          <h2>{util.truncate(title, 64)}</h2>
        </div>
        {this.renderKindSpecific()}
        <div className='cardButtonContainer'>
          <div className='cardButton'>{types.kind(kind).cta}</div>
        </div>
      </div>
    )
  }
};

ArticleCard.defaultProps = {
  item: {}
};


export default ArticleCard;
