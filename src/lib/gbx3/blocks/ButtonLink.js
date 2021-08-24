import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import GBLink from '../../common/GBLink';
import ModalRoute from '../../modal/ModalRoute';
import { toggleModal } from '../../api/actions';
import ButtonLinkEdit from './ButtonLinkEdit';

const GBX_URL = process.env.REACT_APP_GBX_SHARE;

class ButtonLink extends Component {

  constructor(props) {
    super(props);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.buttonUpdated = this.buttonUpdated.bind(this);

    const text = util.getValue(props.blockContent, 'text', types.kind(props.kind).cta);
    const link = util.getValue(props.blockContent, 'link', `${GBX_URL}/${props.articleID}`);
    const style = {
      textColor: '#ffffff',
      backgroundColor: props.primaryColor,
      fontSize: 16,
      borderRadius: 15,
      width: 200,
      display: 'inline-block',
      align: 'center',
      padding: '10px 0px',
      ...util.getValue(props.blockContent, 'style', {})
    };

    const type = util.getValue(props.blockContent, 'type', 'button');

    this.state = {
      type,
      text,
      defaultText: text,
      link,
      defaultLink: link,
      style,
      defaultStyle: util.deepClone(style),
      hasBeenUpdated: false
    };
    this.editor = null;
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
  }

  componentDidUpdate() {
    this.props.setDisplayHeight(this.displayRef);
  }

  closeEditModal(type = 'save') {
    const {
      name,
      block,
      blockType,
      kind,
      editBlockJustAdded
    } = this.props;

    const {
      text,
      link,
      style,
      defaultText,
      defaultLink,
      defaultStyle,
      hasBeenUpdated
    } = this.state;

    if (type !== 'cancel') {
      this.props.saveBlock({
        hasBeenUpdated: editBlockJustAdded ? true : hasBeenUpdated,
        content: {
          text,
          link,
          style
        }
      });
    } else {
      this.setState({
        text: defaultText,
        link: defaultLink,
        style: defaultStyle
      }, () => this.props.closeEditModal(false));
    }
  }

  buttonUpdated(name, value) {
    this.setState({ [name]: value, hasBeenUpdated: true });
  }

  render() {

    const {
      name,
      modalID,
      onClick,
      button,
      globalButtonStyle,
      block,
      primaryColor
    } = this.props;

    const {
      text,
      link,
      type
    } = this.state;

    const nonremovable = util.getValue(block, 'nonremovable', false);
    const style = { ...this.state.style };

    const fontSize = parseInt(util.getValue(style, 'fontSize', 16));
    style.width = util.getValue(style, 'width', 150);
    style.fontSize = fontSize;
    style.minWidth = 150;

    return (
      <div className={`orgCustomElements`}>
        <ModalRoute
          className='gbx3'
          optsProps={{
            closeCallback: this.closeEditModal
          }}
          id={modalID}
          effect='3DFlipVert' style={{ width: '70%' }}
          draggable={true}
          draggableTitle={`Editing Button`}
          disallowBgClose={true}
          component={() =>
            <div className='modalWrapper'>
              <div style={{ margin: '20px 0' }} className='flexCenter'>
                <h2>Edit Button</h2>
              </div>
              <div className='formSectionContainer'>
                <div className='formSection'>
                  <ButtonLinkEdit
                    link={link}
                    style={style}
                    text={text}
                    type={type}
                    primaryColor={primaryColor}
                    buttonUpdated={this.buttonUpdated}
                    modalID={`${name}-overlay`}
                  />
                </div>
              </div>
            </div>
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
        <div style={{ margin: '5px 0', textAlign: util.getValue(style, 'align', 'center') }}>
          <GBLink style={style} customColor={util.getValue(style, 'backgroundColor', null)} solidColor={type === 'button' ? true : false} allowCustom={true} solidTextColor={util.getValue(style, 'textColor', null)} className={`${type}`} onClick={() => window.open(link)}>
            {text}
          </GBLink>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const kind = util.getValue(gbx3, 'info.kind', 'fundraiser');
  const articleID = util.getValue(gbx3, 'info.articleID');
  const primaryColor = util.getValue(gbx3, 'globals.gbxStyle.primaryColor', '#698df4');

  return {
    kind,
    articleID,
    primaryColor
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(ButtonLink);
