import React, {Component} from 'react';

export default class GenericOverlay extends Component {

  render() {

    console.log('execute -> ', this.props.content);

    return (
      <div className='genericOverlay'>
        {this.props.content ? this.props.content() : null}
      </div>
    )
  }
}

GenericOverlay.defaultProps = {
  content: null
}
