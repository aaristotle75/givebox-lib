import React from 'react';
import { connect } from 'react-redux';
import Loader from '../common/Loader';
import * as util from '../common/utility';
import FileViewer from 'react-file-viewer';
import * as types from '../common/types';
import {
  getResource
} from '../api/helpers';

class UploadPrivateViewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      url: ''
    };
  }

  componentDidMount() {
    this.props.getResource('underwritingDoc', {
      reload: true,
      id: [this.props.orgID, this.props.docID],
      callback: (res, err) => {
        if (!util.isEmpty(res)) {
          const request = util.getValue(res, 'presignedRequest', {});
          const signedURL = !util.isEmpty(request) ? util.getValue(request[0], 'signedURL', '') : '';
          this.setState({ url: signedURL, loading: false });
        }
      }
    });
  }

  render() {

    const {
      url,
      loading
    } = this.state;

    if (loading) return <Loader msg='Loading Preview...' />

    const info = util.getFileInfo(url);
    const type = info.type;

    return (
      <div className='modalWrapper'>
        { !types.imageTypes.includes(type) ?
          <FileViewer
            key={`fileviewer-${type}`}
            fileType={type}
            filePath={url}
            errorComponent={
              <div>
                Error
              </div>
            }
            onError={(e) => console.error('error in file-viewer')}
          />
        :
          <img key={`preview-${type}`} src={url} alt={url} style={{ maxWidth: 'auto', height: 'auto', maxHeight: 'auto' }} />
        }
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const orgID = props.orgID || util.getValue(state, 'gbx3.info.orgID');

  return {
    orgID
  }
}

export default connect(mapStateToProps, {
  getResource
})(UploadPrivateViewer);
