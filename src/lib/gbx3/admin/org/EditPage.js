import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import TextField from '../../../form/TextField';
import GBLink from '../../../common/GBLink';
import {
  updateOrgPages
} from '../../redux/gbx3actions';
import {
  toggleModal
} from '../../../api/actions';

class EditPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      pageSlug,
      page
    } = this.props;

    const navText = util.getValue(page, 'navText', page.name);
    const pageTitle = util.getValue(page, 'pageTitle', page.name);

    return (
      <div className='modalWrapper'>
        <div className='formSectionContainer'>
          <div className='formSection'>
            <h2 className='flexCenter'>Edit {util.getValue(page, 'name')}</h2>
            <TextField
              name='navText'
              label='Navigation Text'
              fixedLabel={true}
              placeholder='Enter Navigation Text'
              value={navText}
              onChange={(e) => {
                const value = e.currentTarget.value;
                this.props.updateOrgPages(pageSlug, {
                  navText: value
                });
              }}
            />
            <TextField
              name='pageText'
              label='Page Title'
              fixedLabel={true}
              placeholder='Enter Page Title'
              value={pageTitle}
              onChange={(e) => {
                const value = e.currentTarget.value;
                this.props.updateOrgPages(pageSlug, {
                  pageTitle: value
                });
              }}
            />
            <div className='button-group flexCenter'>
              <GBLink
                onClick={() => {
                  this.props.closeCallback();
                  this.props.toggleModal('orgEditPage', false);
                }}
                className='button'
              >
                Save
              </GBLink>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const pages = util.getValue(state, 'gbx3.orgPages', {});
  const page = util.getValue(pages, props.pageSlug, {});

  return {
    page
  }
}

export default connect(mapStateToProps, {
  updateOrgPages,
  toggleModal
})(EditPage);
