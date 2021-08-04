import React from 'react';
import { connect } from 'react-redux';
import MediaLibrary from '../../../form/MediaLibrary';
import {
  toggleModal
} from '../../../api/actions';
import * as util from '../../../common/utility';

class EditCoverPhoto extends React.Component {

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
      coverPhoto,
      breakpoint,
      uploadOnly,
      imageURL
    } = this.props;

    const library = {
      orgID,
      saveMediaType: 'org',
      borderRadius: 0
    };

    return (
      <div className='modalWrapper'>
        <div style={{ margin: '20px 0' }} className='flexCenter'>
          <h2>Edit Cover Photo</h2>
        </div>
        <div className='formSectionContainer'>
          <div className='formSection'>
            <MediaLibrary
              image={imageURL}
              preview={imageURL}
              handleSaveCallback={(url) => {
                this.props.saveGlobal('coverPhoto', {
                  url
                }, () => this.props.toggleModal('orgEditCoverPhoto', false))
              }}
              handleSave={util.handleFile}
              library={library}
              showBtns={'hide'}
              saveLabel={'close'}
              mobile={breakpoint === 'mobile' ? true : false }
              uploadEditorSaveStyle={{ width: 250 }}
              uploadEditorSaveLabel={'Click Here to Save Image'}
              uploadOnly={uploadOnly}
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

EditCoverPhoto.defaultProps = {
  uploadOnly: false
}

function mapStateToProps(state, props) {

  const coverPhotoURL = util.getValue(state, 'gbx3.orgGlobals.coverPhoto.url', '');
  const imageURL = props.imageURL || coverPhotoURL;

  return {
    imageURL,
    orgID: util.getValue(state, 'gbx3.info.orgID'),
    breakpoint: util.getValue(state, 'gbx3.info.breakpoint')
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(EditCoverPhoto);
