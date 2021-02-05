import React, {Component} from 'react';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';

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
      title
    } = this.props.item;

    return (
      <li>
        <div className='cardContainer'>
          <div className='cardHeader'>

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
