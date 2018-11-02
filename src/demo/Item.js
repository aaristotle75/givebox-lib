import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Form } from '../lib';
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
      case 'delete': {
        return ( <Delete match={match} /> )
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
      routeProps
    } = this.props;

    let id = routeProps.match.params.itemID;

    return (
      <div>
        {id !== 'new' &&
        <div>
          <Link to={`/list/${id}`}>Details {id}</Link>
          <ul>
            <li><Link to={`/list/${id}/edit`}>Edit</Link></li>
            <li><Link to={`/list/${id}/delete`}>Delete</Link></li>
            <li><Link to={`/list/${id}/history`}>View History</Link></li>
          </ul>
        </div>
        }
        {this.loadAction()}
      </div>
    )
  }
}

const Delete = ({ match }) => {
  return (
    <div>Delete {match.params.itemID}</div>
  );
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
