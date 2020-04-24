import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
  GBLink,
  ModalRoute,
  toggleModal
} from '../../../';
import {SortableContainer, SortableElement, arrayMove, SortableHandle} from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => {
  return (
    <GBLink ripple={false} className='tooltip sortable right'>
      <span className='tooltipTop'>Drag & Drop to change the order</span>
      <span className='icon icon-move'></span>
    </GBLink>
  )
});

const SortableItem = SortableElement(({value}) => {
  return (
    <div className='sortableElement' >
      {value}
    </div>
  )
});

const SortableList = SortableContainer(({items}) => {
  return (
    <div>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </div>
  );
});

class AmountsEdit extends Component {

  constructor(props) {
    super(props);
    this.onSortStart = this.onSortStart.bind(this);
    this.onSortMove = this.onSortMove.bind(this);
    this.state = {
      amountsList: this.props.amountsList
    };
  }

  componentDidMount() {
    console.log('execute amountsList', this.state.amountsList);
  }

  onSortStart(e) {
    util.noSelection();
  }

  onSortMove(e) {
    util.noSelection();
  }

  render() {

    return (
      <div className='amountsEdit'>
        <h3>Edit Amounts</h3>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(AmountsEdit);
