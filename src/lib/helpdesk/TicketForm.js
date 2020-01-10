import React, {Component} from 'react';
import { connect } from 'react-redux';
import { searchContacts } from './zoho';
import {
  Form,
  util,
  GBLink
} from '../';
import Dropzone from 'react-dropzone';
import { mime } from '../common/types';
import Image from '../common/Image';
import { Line } from 'rc-progress';

class TicketFormClass extends Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.clearImage = this.clearImage.bind(this);
    this.restoreImage = this.restoreImage.bind(this);
    this.imageOnLoad = this.imageOnLoad.bind(this);
    this.handleDropAccepted = this.handleDropAccepted.bind(this);
    this.handleDropRejected = this.handleDropRejected.bind(this);
    this.readFile = this.readFile.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.setPreview = this.setPreview.bind(this);
    this.state = {
      file: null,
      preview: this.props.value || null,
      original: this.props.value || null,
      imageLoading: true,
      error: false
    };
    this.uploadImageRef = React.createRef();
  }

  componentDidMount() {
    /*
    searchContacts('', (response) => {
      this.setState({ contacts: response });
    });
    */
  }

  formSavedCallback() {
    if (this.props.callback) {
      this.props.callback(arguments[0]);
    }
  }

  processCallback(res, err) {
    if (!err) {
      this.props.formSaved(() => this.formSavedCallback());
    } else {
      if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
    }
    return;
  }

  processForm(fields) {
    const data = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) data[key] = value.value;
      if (key === 'name') {
    		data.firstName = util.splitName(value.value).first;
    		data.lastName = util.splitName(value.value).last;
      }
      if (key === 'description') {
        data.description = util.stripHtml(value.value);
      }
    });
    console.log('execute processForm', data, this.state.file);
  }

  onDrop(accepted, rejected) {
  }

  clearImage() {
    this.setState({ file: null, preview: null, imageLoading: false, percent: 0 });
  }

  restoreImage() {
    this.setState({ preview: this.state.original });
  }

  imageOnLoad() {
    this.setState({ imageLoading: false });
  }

  setPreview(URL) {
    this.setState({ preview: URL, imageLoading: false, percent: 100 });
  }

  setLoading(loading) {
    this.setState({ loading });
  }

  readFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
      callback(e.target.result, file);
    };
    reader.readAsDataURL(file);
  }

  handleDropAccepted(files) {
    this.setState({ imageLoading: 'Accepting file...', file: files[0] });
    this.readFile(files[0], this.setPreview);
  }

  handleDropRejected(files) {
    console.log('rejected');
  }

  render() {

    const {
      preview
    } = this.state;

    const mimes = mime.image + ',' + mime.text + ',' + mime.applications;

    return (
      <div className='formSectionContainer'>
        <div className='formSection'>
          {this.props.textField('name', { placeholder: 'Enter your name', label: 'Your Name', fixedLabel: true })}
          {this.props.textField('email', { placeholder: 'Enter your email', label: 'Email', fixedLabel: true, validate: 'email' })}
          {this.props.textField('subject', { placeholder: 'A short description of your question or issue', label: 'Subject', fixedLabel: true })}
          {this.props.richText('description', { placeholder: 'Please describe the reason for contacting Givebox Help Desk...', label: 'Description', wysiwyg: false, hideCloseModalAndSaveButtons: true })}
          <div className='attachment'>
            {preview && !this.state.loading ?
              <div className='dropzoneImageContainer'>
                {!this.state.imageLoading && (this.props.customLink || '')}
                <Image maxSize='175px' url={preview} alt={preview} className='dropzoneImage' onLoad={this.imageOnLoad} />
                {!this.state.imageLoading &&
                  <GBLink onClick={this.clearImage} className='link'>Remove Image</GBLink>
                }
              </div>
            :
              <div className='dropzoneImageContainer'>
                { this.state.loading &&
                <div className='loadImage'>
                  <div className='loadingBarWrap'>
                    <span className='loadingText'>{this.state.loading}</span>
                    <Line className='loadingBar' percent={this.state.percent} strokeWidth='5' strokeColor='#4775f8' trailWidth='5' trailColor='#f7fdff' strokeLinecap='square' />
                  </div>
                </div>
                }
                <Dropzone
                  className='dropzone'
                  onDrop={this.handleDrop}
                  onDropAccepted={this.handleDropAccepted}
                  onDropRejected={this.handleDropRejected}
                  accept={mimes}
                >
                  <span className='text'>Attach file</span>
                  <span className='icon dropzone-icon icon-instagram'></span>
                  <span className='text'>Drag & drop file</span>
                </Dropzone>
                {this.state.original && <GBLink onClick={this.restoreImage} className='link'>Restore Original</GBLink>}
              </div>
            }
          </div>
          <div className='button-group center'>
            {this.props.saveButton(this.processForm, { label: 'Submit Ticket', style: { width: 150 } })}
          </div>
        </div>
      </div>
    )
  }
}

TicketFormClass.defaultProps = {
  firstName: '',
  lastName: '',
  email: '',
  orgName: '',
  orgID: '',
  channel: ''
}

function mapStateToProps(state, props) {

  return {
  }
}

const TicketFormConnect = connect(mapStateToProps, {
})(TicketFormClass);


export default class TicketForm extends Component {

  render() {

    //console.log('execute', this.state.contacts);

    return (
      <Form id='ticketForm' name='ticketForm' options={{ required: true }}>
        <TicketFormConnect />
      </Form>
    )
  }
}
