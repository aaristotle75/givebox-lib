import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Form, ModalRoute, ModalLink } from '../lib';
import ItemForm from './ItemForm';
import { AppContext } from '../App';

export default class Item extends Component {

  constructor(props) {
    super(props);
    this.loadAction = this.loadAction.bind(this);
  }

  componentWillUnmount() {
  }

  loadAction() {
    let match = this.props.routeProps.match;
    switch (match.params.action) {
      case 'add':
      case 'edit': {
        return (
          <Form
            name='bankAccount'
          >
            <ItemForm id={match.params.itemID} {...this.props} />
          </Form>
        )
      }
      case 'history': {
        return ( <History match={match} /> )
      }
      default: {
        return ( <div>Details</div> )
      }
    }
  }

  render() {

    const {
      routeProps,
      loadComponent
    } = this.props;

    const id = routeProps.match.params.itemID;
    const modalID = `bankaccount-delete-${id}`;
    return (
      <div>
        {id !== 'new' &&
        <div>
          <Link to={`/list/${id}`}>Details {id}</Link>
          <ul>
            <li><Link to={`/list/${id}/edit`}>Edit</Link></li>
            <li>
              <ModalRoute  id={modalID} component={() => loadComponent('modal/lib/common/Delete', { useProjectRoot: false, props: { id, resource: 'bankAccount', desc: `Bank account ${id}`, modalID: modalID, history: routeProps.history, redirect: '/list' } })} effect='3DFlipVert' style={{ width: '50%' }} />
              <ModalLink id={modalID}>Delete</ModalLink>
            </li>
            <li><Link to={`/list/${id}/history`}>View History</Link></li>
          </ul>
        </div>
        }
        {this.loadAction()}
      </div>
    )
  }
}

const History = ({ match }) => {
  return (
    <AppContext.Consumer>
      {(context) => (
        <div>History {match.params.itemID} {context.test}</div>
      )}
    </AppContext.Consumer>
  );
}
