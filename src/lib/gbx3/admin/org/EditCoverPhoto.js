import React from 'react';
import { connect } from 'react-redux';
import MediaLibrary from '../../../form/MediaLibrary';
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
      breakpoint
    } = this.props;

    const library = {
      orgID,
      saveMediaType: 'org',
      borderRadius: 0
    };

    const imageURL = util.getValue(coverPhoto, 'url');

    return (
      <div className='modalWrapper'>
        <MediaLibrary
          image={imageURL}
          preview={imageURL}
          handleSaveCallback={(url) => console.log('execute save callback -> ', url)}
          handleSave={util.handleFile}
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
    )
  }
}

function mapStateToProps(state, props) {

  return {
    orgID: util.getValue(state, 'gbx3.info.orgID'),
    breakpoint: util.getValue(state, 'gbx3.info.breakpoint'),
    coverPhoto: util.getValue(state, 'gbx3.orgHeaders.coverPhoto', {})
  }
}

export default connect(mapStateToProps, {
})(EditCoverPhoto);
