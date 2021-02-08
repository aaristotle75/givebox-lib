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
      imageURL
    } = this.props.item;

    console.log('execute kind -> ', kind);

    return (
      <div className='cardContainer'>
        <div className='cardPhotoContainer'>
          <div className='cardPhotoImage'>
            <Image imgID='cardPhoto' url={imageURL} maxWidth='325px' size='medium' alt='Card Photo' />
          </div>
        </div>
        <div className='cardInfoContainer'>
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
