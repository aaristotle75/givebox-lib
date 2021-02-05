import React, {Component} from 'react';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';

class ListItem extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      title,
      imageURL
    } = this.props.item;

    return (
      <li>
        <div className='cardContainer'>
          <div className='cardPhotoContainer'>
            <div className='cardPhotoImage'>
              <Image imgID='cardPhoto' url={imageURL} maxWidth='325px' size='medium' alt='Card Photo' />
            </div>
          </div>
          <div className='cardInfoContainer'>
            <h2>{util.truncate(title, 64)}</h2>
          </div>
        </div>
      </li>
    )
  }
};

ListItem.defaultProps = {
  item: {}
};


export default ListItem;
