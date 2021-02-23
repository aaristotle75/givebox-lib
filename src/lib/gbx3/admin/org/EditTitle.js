import React from 'react';
import { connect } from 'react-redux';
import Editor from '../../blocks/Editor';
import * as util from '../../../common/utility';
import GBLink from '../../../common/GBLink';
import {
  toggleModal
} from '../../../api/actions';
import {
  updateOrgGlobal
} from '../../redux/gbx3actions';

class EditTitle extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      title,
      orgID,
      orgData
    } = this.props;

    const content = util.cleanHtml(util.getValue(title, 'content'));

    return (
      <div className='modalWrapper'>
        <div className='formSectionContainer'>
          <div className='formSection'>
            <Editor
              orgID={orgID}
              articleID={null}
              content={content}
              onChange={(newContent) => {
                this.props.updateOrgGlobal('title', { content: newContent });
              }}
              type={'classic'}
              acceptedMimes={['image']}
            />
            <div style={{ marginBottom: 0 }} className='button-group center'>
              <GBLink className='link' onClick={() => {
                this.props.toggleModal('orgEditTitle', false);
                this.props.closeCallback('cancel');
              }}>
                Cancel
              </GBLink>
              <GBLink className='button' onClick={() => {
                this.props.toggleModal('orgEditTitle', false);
                this.props.closeCallback();
              }}>
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

  return {
    orgID: util.getValue(state, 'gbx3.info.orgID'),
    title: util.getValue(state, 'gbx3.orgGlobals.title', {}),
    orgData: util.getValue(state, 'gbx3.orgData')
  }
}

export default connect(mapStateToProps, {
  updateOrgGlobal,
  toggleModal
})(EditTitle);
