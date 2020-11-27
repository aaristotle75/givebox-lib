import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util
} from '../../';
import GBLink from '../../common/GBLink';
import Loader from '../../common/Loader';
import ModalRoute from '../../modal/ModalRoute';
import ModalLink from '../../modal/ModalLink';
import WhereEdit from './WhereEdit';
import Map from './Map';
import { toggleModal } from '../../api/actions';
import sanitizeHtml from 'sanitize-html';

class Where extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.optionsUpdated = this.optionsUpdated.bind(this);
    this.contentUpdated = this.contentUpdated.bind(this);
    this.setHTML = this.setHTML.bind(this);

    const data = props.data;
    const options = props.options;
    const content = {
      ...util.getValue(props.block, 'content', {}),
      where: {
        ...util.getValue(props.block, 'content.where', {}),
        ...util.getValue(data, 'where', {})
      }
    }

    this.state = {
      html: '',
      htmlEditable: '',
      content,
      defaultContent: util.deepClone(content),
      options,
      defaultOptions: util.deepClone(options),
      hasBeenUpdated: false
    };
    this.blockRef = null;
    this.width = null;
    this.height = null;
    this.displayRef = React.createRef();
  }

  componentDidMount() {
    this.blockRef = this.props.blockRef.current;
    if (this.blockRef) {
      this.width = this.blockRef.clientWidth;
      this.height = this.blockRef.clientHeight;
    }
    this.setHTML();
  }

  componentDidUpdate() {
    this.props.setDisplayHeight(this.displayRef);
  }

  onBlur(date) {
    this.setState({ date });
    if (this.props.onBlur) this.props.onBlur(this.props.name, date);
  }

  onChange(date) {
    this.setState({ date, hasBeenUpdated: true });
    if (this.props.onChange) this.props.onChange(this.props.name, date);
  }

  closeEditModal(type = 'save') {
    const {
      block
    } = this.props;

    const {
      content,
      defaultContent,
      options,
      defaultOptions,
      hasBeenUpdated
    } = this.state;

    if (type !== 'cancel') {
      const data = {
        where: util.getValue(content, 'where', null)
      };

      this.props.saveBlock({
        data,
        hasBeenUpdated,
        content,
        options
      });
    } else {
      this.setState({
        content: defaultContent,
        options: defaultOptions
      }, this.props.closeEditModal);
    }
  }

  optionsUpdated(options) {
    this.setState({
      options: {
        ...this.state.options,
        ...options
      },
      hasBeenUpdated: true
    }, this.setHTML);
  }

  contentUpdated(content, callback) {
    this.setState({
      content: {
        ...this.state.content,
        ...content
      },
      hasBeenUpdated: true
    }, () => { this.setHTML(callback);});
  }

  setHTML(callback) {
    const {
      where,
      htmlTemplate
    } = this.state.content;

    const address = util.getValue(where, 'address');
    const city = util.getValue(where, 'city');
    const state = util.getValue(where, 'state');
    const zip = util.getValue(where, 'zip');
    const country = util.getValue(where, 'country');
    const citystatezip = `${city ? '{{city}}' : ''}${state ? ` {{state}}`: ''} ${zip ? ` {{zip}}`: ''}`;

    let locationHTML = '';
    if (address) locationHTML = `<p>{{streetaddress}}</p>`;
    if (city || state || zip) locationHTML = locationHTML + `<p>${citystatezip}</p>`;
    if (country) locationHTML = locationHTML + `<p>{{country}}</p>`;

    const tokens = {
      '{{streetaddress}}': address,
      '{{city}}': city,
      '{{state}}': state,
      '{{zip}}': zip,
      '{{country}}': country
    };

    const defaultTemplate = `
      ${locationHTML}
    `;

    const htmlEditable = htmlTemplate || defaultTemplate;
    const html = util.replaceAll(htmlEditable, tokens);

    this.setState({ html, htmlEditable }, () => { if (callback) callback() });
  }

  render() {

    const {
      modalID,
      title,
      block,
      data,
      previewMode,
      stage
    } = this.props;

    const {
      content,
      options,
      html,
      htmlEditable
    } = this.state;

    const {
      where
    } = content;

    const {
      coordinates
    } = where;

    const {
      lat,
      long
    } = coordinates;

    const nonremovable = util.getValue(block, 'nonremovable', false);
    const cleanHtml = util.cleanHtml(html).trim();

    const strippedHtml = util.stripHtml(cleanHtml);
    const hasContent = strippedHtml ? true : false;

    return (
      <div className={`whereBlock`}>
        <ModalRoute
          className='gbx3'
          optsProps={{ closeCallback: this.onCloseUploadEditor }}
          id={modalID}
          effect='3DFlipVert' style={{ width: '70%' }}
          draggable={true}
          draggableTitle={`Editing ${title}`}
          closeCallback={this.closeEditModal}
          disallowBgClose={true}
          component={() =>
            <WhereEdit
              {...this.props}
              content={content}
              options={options}
              contentUpdated={this.contentUpdated}
              optionsUpdated={this.optionsUpdated}
              html={html}
              htmlEditable={htmlEditable}
              closeEditModal={this.closeEditModal}
            />
          }
          buttonGroup={
            <div className='gbx3'>
              <div style={{ marginBottom: 0 }} className='button-group center'>
                {!nonremovable ? <GBLink className='link remove' onClick={this.props.onClickRemove}><span className='icon icon-trash-2'></span> <span className='buttonText'>Remove</span></GBLink> : <></>}
                <GBLink className='link' onClick={() => this.closeEditModal('cancel')}>Cancel</GBLink>
                <GBLink className='button' onClick={this.closeEditModal}>Save</GBLink>
              </div>
            </div>
          }
        />
        <div ref={this.displayRef}>
          { util.getValue(options, 'mapLink') && ( lat && long )  ?
            <>
              <ModalRoute
                id='whereMap'
                className='gbx3'
                component={() =>
                  <Map
                    markerTitle={util.getValue(data, 'title')}
                    where={where}
                  />
                }
              />
              <ModalLink type='div' id='whereMap' className='whereMapLink'>
                <div className='viewMapLink'>View Map</div>
                { hasContent || previewMode || stage === 'public' ? <div dangerouslySetInnerHTML={{ __html: cleanHtml }} /> : <span className='blockPlaceholderHtml'>Where is the Event?</span> }
              </ModalLink>
            </>
          :
            hasContent || previewMode || stage === 'public' ? <div dangerouslySetInnerHTML={{ __html: cleanHtml }} /> : <span className='blockPlaceholderHtml'>Where is the Event?</span>
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const primaryColor = util.getValue(state, 'gbx3.globals.gbxStyle.primaryColor');

  return {
    primaryColor
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(Where);
