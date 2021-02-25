import React from 'react';
import { connect } from 'react-redux';
import Editor from '../../blocks/Editor';
import * as util from '../../../common/utility';
import GBLink from '../../../common/GBLink';
import {
  toggleModal
} from '../../../api/actions';

class EditTitle extends React.Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      content: util.getValue(props.title, 'content')
    };
  }

  componentDidMount() {
  }

  onBlur(content) {
    this.setState({ content });
    if (this.props.onBlur) this.props.onBlur(this.props.name, content);
  }

  onChange(content) {
    this.setState({ content, hasBeenUpdated: true });
    if (this.props.onChange) this.props.onChange(this.props.name, content);
  }

  render() {

    const {
      orgID
    } = this.props;

    const content = this.state.content;

    return (
      <div className='modalWrapper'>
        <div className='formSectionContainer'>
          <div className='formSection'>
            <Editor
              orgID={orgID}
              articleID={null}
              content={content}
              onBlur={this.onBlur}
              onChange={this.onChange}
              type={'classic'}
              acceptedMimes={['image']}
            />
            <div style={{ marginBottom: 0 }} className='button-group center'>
              <GBLink className='link' onClick={() => {
                this.props.toggleModal('orgEditTitle', false);
              }}>
                Cancel
              </GBLink>
              <GBLink className='button' onClick={() => {
                this.props.toggleModal('orgEditTitle', false);
                this.props.saveGlobal('title', { content });
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
    title: util.getValue(state, 'gbx3.orgGlobals.title', {})
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(EditTitle);
