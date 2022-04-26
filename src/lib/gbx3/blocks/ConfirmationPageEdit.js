import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as _v from '../../form/formValidate';
import Editor from './Editor';
import TextField from '../../form/TextField';
import Collapse from '../../common/Collapse';
import AnimateHeight from 'react-animate-height';
import {
  updateData
} from '../redux/gbx3actions';

class ConfirmationPageEdit extends Component {

  constructor(props) {
    super(props);
    this.updateForm = this.updateForm.bind(this);
    this.state = {
      confirmationContent: util.getValue(props.form, 'confirmationContent'),
      confirmationLink: util.getValue(props.form, 'confirmationLink'),
      confirmationLinkError: false
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  updateForm(name, value) {
    const form = { ...this.props.form };
    form[name] = value;
    this.props.optionsUpdated('form', form);
  }

  render() {

    const {
      confirmationLink,
      confirmationContent,
      confirmationLinkError
    } = this.state;

    const {
      articleID,
      orgID,
      receiptDescription
    } = this.props;

    return (
      <div>
        <Collapse
          label={`Confirmation Options`}
          iconPrimary='edit'
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              <TextField
                name='confirmationLink'
                fixedLabel={true}
                label={'Page to Load After Confirmation Page is Closed'}
                placeholder={'Enter a URL'}
                value={confirmationLink}
                onBlur={(e) => {
                  const value = e.currentTarget.value;
                  if (_v.validateURL(value)) {
                    this.updateForm('confirmationLink', value);
                  } else {
                    this.setState({ confirmationLinkError: true });
                  }
                }}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  this.setState({ confirmationLinkError: false, confirmationLink: value });
                }}
                leftBar={true}
                style={{ margin: '0 15px' }}
                error={confirmationLinkError ? 'Please enter a valid URL' : false}
                validate={'url'}
              />
            </div>
          </div>
        </Collapse>
        <Collapse
          label={`Custom Content`}
          iconPrimary='edit'
        >
          <div className='formSectionContainer'>
            <div className='formSection'>     
              <Editor
                orgID={orgID}
                articleID={articleID}
                content={confirmationContent}
                onBlur={(content) => {
                  //console.log('execute onBlur -> ', content);
                }}
                onChange={(content) => {
                  this.updateForm('confirmationContent', content);
                }}
                subType={'content'}
                type={'classic'}
                acceptedMimes={['image']}
                allowLinking={true}
              />
            </div>
          </div>
        </Collapse>
      </div>
    )
  }
}

ConfirmationPageEdit.defaultProps = {
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
      
  return {
    articleID: util.getValue(gbx3, 'info.articleID'),
    orgID: util.getValue(gbx3, 'info.orgID'),
    receiptDescription: util.getValue(gbx3, 'data.receiptDescription')
  }
}

export default connect(mapStateToProps, {
  updateData
})(ConfirmationPageEdit);
