import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import { Alert } from '../../common/Alert';
import Loader from '../../common/Loader';
import * as types from '../../common/types';
import TextField from '../../form/TextField';
import { toggleModal } from '../../api/actions';
import { sendResource } from '../../api/helpers';
import { updateData } from '../redux/gbx3actions';

class ShareLinkEdit extends Component {

  constructor(props) {
    super(props);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.updateSlug = this.updateSlug.bind(this);
    const slug = props.slug;
    const hasCustomSlug = props.hasCustomSlug;
    const articleID = props.articleID;
    const newSlug = hasCustomSlug ? slug : articleID;

    this.state = {
      saving: false,
      newSlug,
      newSlugDefault: newSlug,
      error: false,
      errorMsg: 'Invalid characters in the share link name',
      errorUpdating: false,
      success: false,
      successMsg: 'Share Link has been updated successfully'
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  updateSlug() {
    const {
      newSlug,
      error
    } = this.state;

    const {
      kindID,
      orgID,
      apiName,
      orgDisplay
    } = this.props;

    this.setState({ errorUpdating: false, saving: true });

    if (!error) {
      this.props.sendResource(apiName, {
        orgID,
        id: [orgDisplay ? orgID : kindID],
        method: 'patch',
        data: {
          slug: newSlug
        },
        callback: (res, err) => {
          if (!util.isEmpty(res) && !err) {
            this.props.updateData(res, orgDisplay ? 'org' : null);
            if (this.props.callback) this.props.callback();
            this.setState({ success: true });
            this.timeout = setTimeout(() => {
              this.setState({ success: false });
              this.timeout = null;
            }, 3000);
          } else {
            let errorMsg = 'The slug cannot be numbers only';
            const errors = util.getValue(err, 'data.errors', []);
            const error = util.getValue(errors, 0, {});
            const code = util.getValue(error, 'code');
            if (code === 'duplicate') {
              errorMsg = 'Custom Share Name is Not Available. Please Choose Another Name'
            }
            this.setState({ errorMsg, errorUpdating: true });
          }
          this.setState({ saving: false });
        }
      });
    } else {
      this.setState({ errorUpdating: true, saving: false });
    }
  }

  closeEditModal() {
    this.props.toggleModal('editShareLink', false);
  }

  render() {

    const {
      newSlug,
      error,
      errorMsg,
      errorUpdating,
      success,
      successMsg,
      saving
    } = this.state;

    const {
      buttonText,
      subText,
      buttonGroupClassName,
      buttonGroupStyle
    } = this.props;

    return (
      <div className='shareLink formSectionContainer'>
        <div className='formSection'>
          {saving ? <Loader msg='Saving Custom Share Link...' /> : <></> }
          <div className='flexCenter flexColumn'>
            <div className='shareLinkEditable'>
              <Alert alert='error' display={errorUpdating} msg={`Unable to update: ${errorMsg}.`} />
              <Alert alert='success' display={success} msg={`${successMsg}.`} />
              <div className='subText'>
                {subText}
              </div>
              <TextField
                name='slug'
                fixedLabel={true}
                label=''
                placeholder='enter-your-custom-url'
                style={{ width: '100%', paddingBottom: 0, marginBottom: 5 }}
                value={newSlug}
                error={error ? 'Share link name can only contain alphanumeric and !@#%*_+- characters.' : false}
                errorType={'tooltip'}
                onChange={(e) => {
                  let error = false;
                  const newSlug = e.currentTarget.value;
                  const match = /^[a-zA-Z0-9!@#%*_+-]*$/
                  if (!match.exec(newSlug)) {
                    this.setState({ errorMsg: 'Invalid characters in the share link name' });
                    error = true;
                  } else {
                    this.setState({ errorUpdating: false });
                  }
                  this.setState({ newSlug, error });
                }}
              >
                <div className='shareLinkPrefix'>https://givebox.com/</div>
              </TextField>
            </div>
            <div style={buttonGroupStyle} className={buttonGroupClassName}>
              <GBLink className='copyButton' onClick={this.updateSlug}>{buttonText}</GBLink>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ShareLinkEdit.defaultProps = {
  buttonText: 'Check Availability / Update Share Link',
  subText: 'Customize How Customers See the Share Link',
  buttonGroupClassName: 'button-group center',
  buttonGroupStyle: {}
}

function mapStateToProps(state, props) {

  const kind = props.kind || util.getValue(state, 'gbx3.info.kind');
  const kindID = props.kindID || util.getValue(state, 'gbx3.info.kindID');
  const articleID = props.articleID || util.getValue(state, 'gbx3.info.articleID');
  const display = props.display || util.getValue(state, 'gbx3.info.display');
  const orgDisplay = display === 'org' ? true : false;
  const data = props.data || util.getValue(state, `gbx3.${orgDisplay ? 'orgData' : 'data'}`);
  const orgID = props.orgID || util.getValue(data, `${orgDisplay ? 'ID' : 'orgID'}`);
  const slug = props.slug || util.getValue(data, 'slug');
  const hasCustomSlug = props.hasCustomSlug ? props.hasCustomSlug : orgDisplay ? true : util.getValue(data, 'hasCustomSlug');
  const apiName = props.apiName ? props.apiName : orgDisplay ? 'org' : `org${types.kind(kind).api.item}`;

  return {
    kind,
    kindID,
    articleID,
    orgID,
    orgDisplay,
    slug,
    hasCustomSlug,
    apiName
  }
}

export default connect(mapStateToProps, {
  toggleModal,
  updateData,
  sendResource
})(ShareLinkEdit);
