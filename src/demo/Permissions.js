import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCustomProp } from '../lib/api/actions';
import { getResource, sendResource } from '../lib/api/helpers';
import Loader from '../lib/common/Loader';
import {
  util,
  GBLink
} from '../lib/'
import { prodPerms } from './prodPerms';

class Permissions extends Component {

  constructor(props) {
    super(props);
    this.renderPerms = this.renderPerms.bind(this);
    this.renderStagePerms = this.renderStagePerms.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.copyMissionToStaging = this.copyMissionToStaging.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.getResource('orgPermissions', { reload: true });
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  deleteAll() {
    console.log('execute deleteAll');
    const stagePerms = util.getValue(this.props.orgPermissions, 'data', []);
    Object.entries(stagePerms).forEach(([key, value]) => {
      this.props.sendResource('orgPermission', {
        id: [value.ID],
        method: 'delete'
      });
    });
  }

  copyMissionToStaging() {
    const stagePerms = util.getValue(this.props.orgPermissions, 'data', []);
    const perms = util.getValue(prodPerms, 'data', []);
    const items = [];
    Object.entries(perms).forEach(([key, value]) => {
    });
  }

  renderPerms() {
    const stagePerms = util.getValue(this.props.orgPermissions, 'data', []);
    const perms = util.getValue(prodPerms, 'data', []);
    const items = [];
    Object.entries(perms).forEach(([key, value]) => {
      const onStaging = stagePerms.find(p => p.ID === value.ID) ? true : false;
      if (!onStaging) {
        items.push(
          <div
            key={key}
            style={{
              display: 'block',
              margin: '5px 0',
              fontSize: 12
            }}
          >
            {value.ID} {value.name} <span style={{ color: onStaging ? 'green' : 'red' }}>{onStaging ? 'On Staging' : 'Not On Staging'}</span>
          </div>
        )
      }
    });
    return items;
  }

  renderStagePerms() {
    const items = [];
    const stagePerms = util.getValue(this.props.orgPermissions, 'data', []);
    Object.entries(stagePerms).forEach(([key, value]) => {
      items.push(
        <div
          key={key}
          style={{
            display: 'block',
            margin: '5px 0',
            fontSize: 12
          }}
        >
          {value.ID} {value.name}
        </div>
      )
    });
    return items;
  }

  render() {

    if (util.isLoading(this.props.orgPermissions)) return <Loader msg='Loading Permissions...' />

    return (
      <div>
        <h2>Permissions</h2>
        <div>
          <div style={{ width: '50%', display: 'inline-block', verticalAlign: 'top' }}>
            <GBLink onClick={() => this.copyMissionToStaging()}>
              Copy Missing Perms to Staging
            </GBLink>
            {this.renderPerms()}
          </div>
          <div style={{ width: '50%', display: 'inline-block', verticalAlign: 'top' }}>
            <GBLink onClick={() => this.deleteAll()}>
              Delete All Staging Perms
            </GBLink>
            {this.renderStagePerms()}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
    orgPermissions: util.getValue(state, 'resource.orgPermissions', {})
  }
}


export default connect(mapStateToProps, {
  setCustomProp,
  getResource,
  sendResource
})(Permissions)
