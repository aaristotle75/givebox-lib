import React from 'react';
import { connect } from 'react-redux';
import Loader from '../common/Loader';
import Image from '../common/Image';
import GBLink from '../common/GBLink';
import * as util from '../common/utility';
import FileViewer from 'react-file-viewer';
import * as types from '../common/types';
import {
  getResource
} from '../api/helpers';
import {
  toggleModal
} from '../api/actions';

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
        <div className='flexCenter'>
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
            <Image key={`preview-${type}`} url={url} alt={url} maxSize={1000} style={{ maxWidth: 'auto', height: 'auto', maxHeight: 'auto' }} />
          }
        </div>
        <div className='button-group flexCenter'>
          <GBLink className='button' onClick={() => this.props.toggleModal('uploadPrivateViewer', false)}>Close</GBLink>
        </div>
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
  getResource,
  toggleModal
})(UploadPrivateViewer);
