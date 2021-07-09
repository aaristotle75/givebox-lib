import React from 'react';
import { connect } from 'react-redux';
import MediaLibrary from '../../../form/MediaLibrary';
import {
  toggleModal
} from '../../../api/actions';
import * as util from '../../../common/utility';

class EditProfilePic extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      orgID,
      saveMediaType,
      profilePicture,
      breakpoint
    } = this.props;

    const library = {
      orgID,
      saveMediaType,
      borderRadius: 0
    };

    const imageURL = util.checkImage(util.getValue(profilePicture, 'url'));

    return (
      <div className='modalWrapper'>
        <div style={{ margin: '20px 0' }} className='flexCenter'>
          <h2>Edit Logo</h2>
        </div>
        <div className='formSectionContainer'>
          <div className='formSection'>
            <MediaLibrary
              image={imageURL}
              preview={imageURL}
              handleSaveCallback={(url) => {
                this.props.saveGlobal('profilePicture', {
                  url
                }, () => this.props.toggleModal('orgEditProfilePic', false))
              }}
              handleSave={this.props.handleSave}
              library={library}
              showBtns={'hide'}
              saveLabel={'close'}
              mobile={breakpoint === 'mobile' ? true : false }
              uploadEditorSaveStyle={{ width: 250 }}
              uploadEditorSaveLabel={'Click Here to Save Image'}
              imageEditorOpenCallback={(editorOpen) => {
                this.setState({ editorOpen })
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}

EditProfilePic.defaultProps = {
  saveMediaType: 'org',
  handleSave: util.handleFile
};

function mapStateToProps(state, props) {

  return {
    orgID: util.getValue(state, 'gbx3.info.orgID'),
    breakpoint: util.getValue(state, 'gbx3.info.breakpoint'),
    profilePicture: util.getValue(state, 'gbx3.orgGlobals.profilePicture', {})
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(EditProfilePic);
