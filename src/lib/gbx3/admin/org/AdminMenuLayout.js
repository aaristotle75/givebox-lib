import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import { toggleModal } from '../../../api/actions';
import {
  openOrgAdminMenu
} from '../../redux/orgActions';
import {
  saveOrg
} from '../../redux/gbx3actions';


class AdminMenuLayout extends React.Component {

  constructor(props) {
    super(props);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.state = {
    };
  }

  onMouseEnter(id) {
    const el = document.getElementById(id);
    if (el) el.setAttribute('style', 'display: flex; opacity: 1;');
  }

  onMouseLeave(id) {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = null;
      el.style.opacity = null;
    }
  }

  render() {

    const {
      pageSlug
    } = this.props;

    return (
      <div className='layoutMenu'>
        <ul>
          <li className='listHeader'>Nonprofit Page</li>
          <li
            onClick={() => this.props.openOrgAdminMenu('orgEditTitle')}
            onMouseEnter={() => this.onMouseEnter('orgEditTitle')}
            onMouseLeave={() => this.onMouseLeave('orgEditTitle')}
          >
            Edit Name
          </li>
          <li
            onClick={() => this.props.openOrgAdminMenu('orgEditMenu', () => this.props.saveOrg())}
            onMouseEnter={() => this.onMouseEnter('orgEditMenu')}
            onMouseLeave={() => this.onMouseLeave('orgEditMenu')}
          >
            Edit Navigation
          </li>
          <li
            onClick={() => this.props.openOrgAdminMenu('orgEditProfilePic')}
            onMouseEnter={() => this.onMouseEnter('orgEditProfilePic')}
            onMouseLeave={() => this.onMouseLeave('orgEditProfilePic')}
          >
            Edit Logo
          </li>
          <li
            onClick={() => this.props.openOrgAdminMenu('orgEditCoverPhoto')}
          >
            Edit Cover Photo
          </li>
          <li
            onClick={() => this.props.openOrgAdminMenu('orgEditPage', null, {
              pageSlug,
              tabToDisplay: 'editPage'
            })}
            onMouseEnter={() => this.onMouseEnter('orgEditPage')}
            onMouseLeave={() => this.onMouseLeave('orgEditPage')}
          >
            Edit Page
          </li>
        </ul>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const pageSlug = util.getValue(state, 'gbx3.info.activePageSlug');

  return {
    pageSlug
  }
}

export default connect(mapStateToProps, {
  toggleModal,
  openOrgAdminMenu,
  saveOrg
})(AdminMenuLayout);
