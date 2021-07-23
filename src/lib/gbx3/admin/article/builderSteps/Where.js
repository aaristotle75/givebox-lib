import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../../common/utility';
import Choice from '../../../../form/Choice';
import {
  updateBlock
} from '../../../redux/gbx3actions';

class Where extends React.Component {

  constructor(props) {
    super(props);
    this.whereCallback = this.whereCallback.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  whereCallback(where) {

    const {
      whereBlock
    } = this.props;

    const {
      coordinates
    } = where;

    const {
      lat,
      long
    } = coordinates;

    const options = util.getValue(whereBlock, 'options', {});
    const mapLink = util.getValue(options, 'mapLink');

    if (!lat || !long) {
      this.props.updateBlock('article', 'where', {
        ...whereBlock,
        options: {
          ...options,
          mapLink: false
        }
      });
    }

    this.props.fieldProp('where', {
      where
    })
  }

  render() {

    const {
      whereBlock,
      data
    } = this.props;

    const where = {
      ...util.getValue(whereBlock, 'content.where', {}),
      ...util.getValue(data, 'where', {})
    };

    const options = util.getValue(whereBlock, 'options', {});
    const mapLink = util.getValue(options, 'mapLink');

    return (
      <div className='fieldGroup'>
        {this.props.whereField('where', {
          where,
          group: 'where',
          fixedLabel: true,
          label: 'Current Event Location',
          embed: true,
          whereCallback: this.whereCallback
        })}
        <Choice
          type='checkbox'
          name='mapLink'
          label={'Show User a Link to View Map'}
          onChange={(name, value) => {
            this.props.updateBlock('article', 'where', {
              ...whereBlock,
              options: {
                ...options,
                mapLink: mapLink ? false : true
              }
            });
          }}
          checked={mapLink}
          value={mapLink}
          toggle={true}
        />
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const whereBlock = util.getValue(state, 'gbx3.blocks.article.where', {});

  return {
    whereBlock
  }
}

export default connect(mapStateToProps, {
  updateBlock
})(Where);
