import React, {Component} from 'react';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import * as types from '../../common/types';

class ArticleCard extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      kind
    } = this.props;

    const {
      title,
      imageURL,
      stats
    } = this.props.item;

    const views = util.getValue(stats, 'views', 0);
    const likes = util.getValue(stats, 'likes', 0);
    const shares = util.getValue(stats, 'shares', 0);

    return (
      <div className='cardContainer'>
        <div className='cardPhotoContainer'>
          <div className='cardPhotoImage'>
            <Image imgID='cardPhoto' url={imageURL} maxWidth='325px' size='medium' alt='Card Photo' />
          </div>
        </div>
        <div className='cardInfoContainer'>
          <div className='cardInfo'>
            <span className='icon icon-eye'></span> Views ({views})
          </div>
        </div>
        <div className='cardTitleContainer'>
          <h2>{util.truncate(title, 64)}</h2>
        </div>
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
