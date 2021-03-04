import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import ModalRoute from '../../modal/ModalRoute';
import ModalLink from '../../modal/ModalLink';
import Collapse from '../../common/Collapse';
import Image from '../../common/Image';
import Tabs, { Tab } from '../../common/Tabs';
import * as types from '../../common/types';
import Fade from '../../common/Fade';
import TextField from '../../form/TextField';
import Choice from '../../form/Choice';
import { sendResource } from '../../api/helpers';
import AmountsEdit from './amounts/AmountsEdit';
import AmountsList from './amounts/AmountsList';
import TicketsList from './amounts/TicketsList';
import Button from './Button';
import ButtonEdit from './ButtonEdit';
import RecurringEdit from './amounts/RecurringEdit';
import { amountFieldsConfig } from './amounts/amountFieldsConfig';
import AnimateHeight from 'react-animate-height';
import { toggleModal } from '../../api/actions';
import {
  updateData,
  saveGBX3,
  updateCart
} from '../redux/gbx3actions';
import has from 'has';

class Amounts extends Component {

  constructor(props) {
    super(props);
    this.getAmounts = this.getAmounts.bind(this);
    this.amountsListUpdated = this.amountsListUpdated.bind(this);
    this.customUpdated = this.customUpdated.bind(this);
    this.defaultUpdated = this.defaultUpdated.bind(this);
    this.optionsUpdated = this.optionsUpdated.bind(this);
    this.renderAmountsList = this.renderAmountsList.bind(this);
    this.closeModalAmountsList = this.closeModalAmountsList.bind(this);
    this.closeModalAmountsEdit = this.closeModalAmountsEdit.bind(this);
    this.validateAmountsBeforeSave = this.validateAmountsBeforeSave.bind(this);
    this.resetToDefaults = this.resetToDefaults.bind(this);
    this.saveEditedAmounts = this.saveEditedAmounts.bind(this);
    this.callbackBeforeStep = this.callbackBeforeStep.bind(this);
    this.callbackAfterStep = this.callbackAfterStep.bind(this);
    this.setTab = this.setTab.bind(this);

    const primaryColor = this.props.primaryColor;
    const options = props.options;

    const recurring = util.getValue(options, 'recurring', {});
    const extras = util.getValue(options, 'extras', {});
    const button = util.getValue(options, 'button', {});

    this.state = {
      primaryColor,
      button,
      recurring,
      extras,
      defaultButton: util.deepClone(button),
      defaultRecurring: util.deepClone(recurring),
      defaultExtras: util.deepClone(extras),
      amountsList: [],
      customIndex: 6,
      defaultIndex: 6,
      formError: [],
      tab: 'edit',
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
    this.getAmounts();
  }

  componentDidUpdate(prevProps) {
    this.props.setDisplayHeight(this.displayRef);
  }

  closeModalAmountsEdit(type = 'save') {
    util.toTop(`modalOverlay-${this.props.modalID}`);
    this.setTab('edit');
    const {
      formError
    } = this.state;
    if (type !== 'cancel') {
      if (util.isEmpty(formError)) {
        this.saveEditedAmounts(true);
      } else {
        if (type === 'ok') this.resetToDefaults(this.props.closeEditModal);
      }
    } else {
      this.resetToDefaults(this.props.closeEditModal);
    }
  }

  saveEditedAmounts(saveBlock) {
    const hasBeenUpdated = this.state.hasBeenUpdated;
    const button = { ...this.state.button };
    const recurring = { ...this.state.recurring };
    const extras = { ...this.state.extras };
    const amountsList = [ ...this.state.amountsList ];
    const customIndex = this.state.customIndex;
    const customID = this.state.customID;
    const defaultIndex = this.state.defaultIndex;
    const defaultID = this.state.defaultID;

    this.setState({
      button,
      recurring,
      extras,
      amountsList,
      customIndex,
      customID,
      defaultIndex,
      defaultID,
      defaultButton: util.deepClone(button),
      defaultRecurring: util.deepClone(recurring),
      amountsListDefault: util.deepClone(amountsList),
      customIndexDefault: customIndex,
      customIDDefault: customID,
      defaultIndexDefault: defaultIndex,
      defaultIDDefault: defaultID
    }, () => {
      this.props.updateData({
        amountIndexCustom: customIndex,
        amountIndexDefault: defaultIndex,
        [types.kind(this.props.kind).amountField]: {
          list: amountsList
        }
      });

      if (saveBlock) {
        this.props.saveBlock({
          hasBeenUpdated,
          options: {
            button,
            recurring,
            extras,
            autoHeight: util.getValue(button, 'enabled') ? false : true
          }
        });
      }
    });
  }

  resetToDefaults(callback = () => {}) {
    this.setState({
      button: util.deepClone(this.state.defaultButton),
      recurring: util.deepClone(this.state.defaultRecurring),
      extras: util.deepClone(this.state.defaultExtras),
      amountsList: util.deepClone(this.state.amountsListDefault),
      customIndex: this.state.customIndexDefault,
      customID: this.state.customIDDefault,
      defaultIndex: this.state.defaultIndexDefault,
      defaultID: this.state.defaultIDDefault,
      formError: []
    }, callback);
  }

  amountsListUpdated(amounts, sort = false, save = false) {
    const config = util.getValue(amountFieldsConfig, this.props.kind, {});
    const data = {};
    const amountsList = amounts;
    if (sort || save) {
      let customIndex = null;
      let defaultIndex = null;
      amountsList.forEach((value, key) => {
        customIndex = config.hasCustomField && value.ID === this.state.customID ? key : false;
        defaultIndex = config.hasDefaultField && value.ID === this.state.defaultID ? key : false;
        if (customIndex || customIndex === 0) this.customUpdated(key, value.ID);
        if (defaultIndex || defaultIndex === 0) this.defaultUpdated(key, value.ID);
        amountsList[key].orderBy = key;
      });
      data.amountIndexCustom = customIndex || customIndex === 0 ? customIndex : null;
      data.amountIndexDefault = defaultIndex || defaultIndex === 0 ? defaultIndex : null;
      data[types.kind(this.props.kind).amountField] = {
        list: amountsList
      };
    }
    this.setState({ amountsList, hasBeenUpdated: true }, () => {
      if (save) this.props.saveGBX3('article', { data, callback: (res, err) => {
        if (!err && !util.isEmpty(res)) {
          this.saveEditedAmounts();
        }
      }});
    });
  }

  customUpdated(index, ID) {
    const customIndex = parseInt(index);
    const customID = parseInt(ID);
    this.setState({
      customIndex,
      customID,
      hasBeenUpdated: true
    });
  }

  defaultUpdated(index, ID) {
    const defaultIndex = parseInt(index);
    const defaultID = parseInt(ID);
    this.setState({
      defaultIndex,
      defaultID,
      hasBeenUpdated: true
    });
  }

  optionsUpdated(name, obj) {
    this.setState({ [name]: { ...obj }, hasBeenUpdated: true });
  }

  validateAmountsBeforeSave(formErrorID, error, callback) {
    const formError = this.state.formError;
    if (error) {
      if (!formError.includes(formErrorID)) formError.push(formErrorID);
    } else {
      const index = formError.indexOf(formErrorID);
      if (index !== -1) formError.splice(index, 1);
    }
    this.setState({ formError }, callback)
  }

  closeModalAmountsList() {
    //console.log('execute closeModalAmountsList');
  }

  getAmounts() {
    const {
      data,
      kind
    } = this.props;

    const amountsObj = util.getValue(data, types.kind(kind).amountField, {});
    const amountsList = util.getValue(amountsObj, 'list', []);

    let customIndex = null;
    let defaultIndex = null;

    switch (kind) {
      case 'fundraiser':
      case 'invoice': {
        customIndex = util.getValue(data, 'amountIndexCustom', 6);
        defaultIndex = util.getValue(data, 'amountIndexDefault', 6);
        break;
      }

      case 'sweepstake': {
        const index = amountsList.findIndex(a => a.freeSingleEntry === true);
        if (index >= 0) {
          amountsList.splice(index, 1);
        }
        break;
      }

      // no default
    }

    const customAmount = util.getValue(amountsList, customIndex, {});
    const customID = util.getValue(customAmount, 'ID', null);
    const defaultAmount = util.getValue(amountsList, defaultIndex, {});
    const defaultID = util.getValue(defaultAmount, 'ID', null);

    this.setState({
      amountsList,
      customIndex,
      customID,
      defaultIndex,
      defaultID,
      defaultAmount,
      amountsListDefault: util.deepClone(amountsList),
      customIndexDefault: customIndex,
      customIDDefault: customID,
      defaultIndexDefault: defaultIndex,
      defaultIDDefault: defaultID
    });
  }

  renderAmountsList(embed = false) {

    const {
      data,
      kind,
      primaryColor,
      breakpoint,
      options
    } = this.props;

    const {
      defaultAmount,
      amountsList,
      customIndex,
      customID,
      defaultIndex,
      defaultID,
      button,
      recurring
    } = this.state;

    switch (kind) {
      case 'event':
      case 'membership':
      case 'sweepstake': {
        return (
          <TicketsList
            breakpoint={breakpoint}
            embed={false}
            amountsList={amountsList}
            customIndex={customIndex}
            defaultIndex={defaultIndex}
            width={this.width}
            height={this.height}
            amountsCallback={this.props.amountsCallback}
            color={primaryColor}
            kind={this.props.kind}
            buttonEnabled={util.getValue(button, 'enabled', false)}
            article={data}
            showInStock={util.getValue(options, 'extras.showInStock')}
          />
        )
      }

      case 'fundraiser':
      case 'invoice':
      default: {
        return (
          <AmountsList
            breakpoint={breakpoint}
            embed={embed}
            defaultAmount={defaultAmount}
            amountsList={amountsList}
            customIndex={customIndex}
            customID={customID}
            defaultIndex={defaultIndex}
            defaultID={defaultID}
            width={this.width}
            height={this.height}
            amountsCallback={this.props.amountsCallback}
            color={primaryColor}
            kind={this.props.kind}
            allowRecurring={util.getValue(recurring, 'enabled', true)}
            buttonEnabled={util.getValue(button, 'enabled', false)}
            article={data}
            editModalOpen={this.props.editModalOpen}
          />
        )
      }
    }

  }

  setTab(tab) {
    this.setState({ tab });
  }

  async callbackBeforeStep(key) {
    let validate = true;
    if (!util.isEmpty(this.state.formError)) validate = false;
    return validate;
  }

  callbackAfterStep(tab) {
  }

  render() {

    const {
      modalID,
      data,
      kind,
      primaryColor,
      numCartItems,
      subTotal,
      form,
      breakpoint,
      isVolunteer,
      articleID,
      orgLogo,
      orgName
    } = this.props;

    const {
      amountsList,
      button,
      recurring,
      extras,
      customIndex,
      customID,
      defaultIndex,
      defaultID,
      formError,
      tab
    } = this.state;

    if (util.isEmpty(amountsList)) return <></>;

    const allowPerTicketWinner = util.getValue(extras, 'allowPerTicketWinner') || util.getValue(data, 'allowPerTicketWinner');
    const maxQuantity = util.getValue(extras, 'maxQuantity') || util.getValue(data, 'maxQuantity');
    const showCart = true;
    const shopTitle = util.getValue(form, 'shopTitle', 'Browse More Items');
    const browsePage = util.getValue(form, 'browsePage');
    const shopLinkOpensOrgPage = util.getValue(form, 'shopLinkOpensOrgPage');
    const browseItems = util.getValue(form, 'allowSelection', true);

    return (
      <div className={`block ${util.getValue(button, 'enabled', false) ? util.getValue(button, 'style.align', 'flexCenter') : ''}`}>
        <ModalRoute
          id={modalID}
          className='gbx3 gbx3amountsEdit'
          optsProps={{ closeCallback: this.closeModalAmountsEdit }}
          effect='3DFlipVert' style={{ width: '80%' }}
          draggable={true}
          draggableTitle={`Editing Amounts`}
          closeCallback={this.closeModalAmountsEdit}
          disallowBgClose={true}
          component={() =>
            <div className='modalWrapper'>
              <Tabs
                default={tab}
                className='statsTab'
                callbackBefore={this.callbackBeforeStep}
              >
                <Tab id='edit' label={<span className='stepLabel'>Edit Amounts</span>}>
                  <>
                    <AnimateHeight
                      duration={200}
                      height={!util.isEmpty(formError) ? 'auto' : 0}
                    >
                    <Fade in={!util.isEmpty(formError) ? true : false}>
                      <div className={`flexCenter error`}>You must fix the issues below in red before you can save or switch tabs.</div>
                    </Fade>
                    </AnimateHeight>
                    <Collapse
                      label={'Edit Amounts'}
                      iconPrimary='edit'
                      id={'gbx3-amounts-edit'}
                    >
                      <div className='formSectionContainer'>
                        <div className='formSection'>
                          <AmountsEdit
                            article={data}
                            amountsList={amountsList}
                            kind={kind}
                            modalID={modalID}
                            amountsListUpdated={this.amountsListUpdated}
                            customIndex={customIndex}
                            customID={customID}
                            customUpdated={this.customUpdated}
                            defaultIndex={defaultIndex}
                            defaultID={defaultID}
                            defaultUpdated={this.defaultUpdated}
                            sendResource={this.props.sendResource}
                            validateAmountsBeforeSave={this.validateAmountsBeforeSave}
                            formError={this.state.formError}
                            orgID={util.getValue(data, 'orgID')}
                            breakpoint={breakpoint}
                            isVolunteer={isVolunteer}
                            articleID={articleID}
                            toggleModal={this.props.toggleModal}
                          />
                        </div>
                      </div>
                    </Collapse>
                  </>
                </Tab>
                <Tab id='buttonOption' label={<span className='stepLabel'>Customize Button</span>}>
                  <Collapse
                    label={'Customize Button'}
                    iconPrimary='link-2'
                    id={'gbx3-amounts-button'}
                  >
                    <div className='formSectionContainer'>
                      <div className='formSection'>
                        <ButtonEdit
                          label={'Use a Button Instead of Showing Amounts on the Form'}
                          button={button}
                          optionsUpdated={this.optionsUpdated}
                          allowAutopop={true}
                          modalID={'amountsList'}
                        />
                      </div>
                    </div>
                  </Collapse>
                </Tab>
                <Tab id='amountOptions' label={<span className='stepLabel'>Options</span>}>
                  {!util.isEmpty(extras) ?
                  <Collapse
                    label={`${types.kind(kind).amountDesc} Options`}
                    iconPrimary='chevrons-up'
                    id={'gbx3-amounts-ticketOptions'}
                  >
                    <div className='formSectionContainer'>
                      <div className='formSection'>
                        {has(extras, 'allowPerTicketWinner') ?
                        <div style={{ margin: '10px 0' }}>
                          <Choice
                            type='checkbox'
                            name='enabled'
                            label={'Each Ticket | Prize Field has a Prize'}
                            onChange={(name, value) => {
                              const extras = this.state.extras;
                              const allowPerTicketWinner = extras.allowPerTicketWinner ? false : true;
                              const data = {
                                allowPerTicketWinner
                              };
                              extras.allowPerTicketWinner = allowPerTicketWinner;
                              this.setState({ extras }, () => {
                                this.optionsUpdated('extras', extras);
                                this.props.updateData(data);
                              });
                            }}
                            checked={allowPerTicketWinner}
                            value={allowPerTicketWinner}
                            toggle={true}
                          />
                          <div className='fieldContext'>
                            If toggled on, each Ticket | Prize field will have a winner.<br />
                            If toggled off, only one winner will be selected per Sweepstakes form.
                          </div>
                        </div>
                        : ''}
                        <Choice
                          type='checkbox'
                          name='showInStock'
                          label={`Show How Many ${types.kind(kind).amountLabel} Are Available`}
                          onChange={(name, value) => {
                            const extras = this.state.extras;
                            extras.showInStock = extras.showInStock ? false : true;
                            this.setState({ extras }, () => {
                              this.optionsUpdated('extras', extras);
                            });
                          }}
                          checked={util.getValue(extras, 'showInStock', true)}
                          value={util.getValue(extras, 'showInStock', true)}
                        />
                        <TextField
                          name='maxQuantity'
                          label={`Max ${types.kind(kind).amountLabel} That Can Be Purchased At One Time`}
                          fixedLabel={true}
                          placeholder={99}
                          value={maxQuantity || ''}
                          maxLength={2}
                          onChange={(e) => {
                            const value = +e.currentTarget.value;
                            const maxQuantity = value && value !== 0 ? value > 99 ? 99 : value : '';
                            const data = {
                              maxQuantity
                            };
                            const extras = this.state.extras;
                            extras.maxQuantity = maxQuantity;
                            this.setState({ extras }, () => {
                              this.optionsUpdated('extras', extras);
                              this.props.updateData(data);
                            });
                          }}
                        />
                      </div>
                    </div>
                  </Collapse> : <></> }
                  { !util.isEmpty(recurring) ?
                  <Collapse
                    label={'Recurring Option'}
                    iconPrimary='repeat'
                    id={'gbx3-amounts-recurring'}
                  >
                    <div className='formSectionContainer'>
                      <div className='formSection'>
                        <RecurringEdit
                          recurring={recurring}
                          article={data}
                          kind={kind}
                          updateData={this.props.updateData}
                          optionsUpdated={this.optionsUpdated}
                        />
                      </div>
                    </div>
                  </Collapse> : <></> }
                </Tab>
              </Tabs>
            </div>
          }
          buttonGroup={
            <div className='gbx3'>
              <div style={{ marginBottom: 0 }} className='button-group center'>
                <GBLink className='link' onClick={() => this.closeModalAmountsEdit('cancel')}>Cancel</GBLink>
                <GBLink className='button' onClick={this.closeModalAmountsEdit}>Save</GBLink>
              </div>
            </div>
          }
        />
        <div ref={this.displayRef}>
          {util.getValue(button, 'enabled', false) ?
            <>
              <ModalRoute
                className='gbx3 givebox-paymentform'
                id='amountsList'
                effect='3DFlipVert' style={{ width: '60%' }}
                draggable={false}
                closeCallback={this.closeModalAmountsList}
                disallowBgClose={false}
                component={() =>
                  <div className='modalContainers lightGray'>
                    <div className='topContainer'>
                      <span style={{ fontWeight: 500, padding: 0, margin: 0 }}>{util.getValue(button, 'text', 'Select Amount')}</span>
                      <span style={{ fontWeight: 300 }} className='center'>{util.truncate(util.getValue(data, 'title'), 128)}</span>
                      { orgName ? <span style={{ fontWeight: 300, fontSize: 12 }}>{orgName}</span> : null }
                    </div>
                    <div className='middleContainer'>
                      {this.renderAmountsList()}
                    </div>
                    <div className='bottomContainer spaceBetween'>
                      <div className='cartInfo'>
                        <AnimateHeight height={numCartItems > 0 && parseInt(subTotal) > 0 ? 'auto' : 0}>
                          {showCart ?
                          <GBLink
                            allowCustom={true}
                            customColor={primaryColor}
                            onClick={() => {
                              this.props.updateCart({ open: true });
                              this.props.scrollTo('checkout');
                              this.props.toggleModal('amountsList', false);
                            }}
                          >
                            <span style={{ display: 'block', fontSize: 12 }}>Items in Cart ({numCartItems})</span>
                          </GBLink> : ''}
                          <span style={{ display: 'block' }}><span style={{ fontSize: 12 }}>Sub Total:</span> <span className='strong'>{util.money(subTotal)}</span></span>
                        </AnimateHeight>
                      </div>
                      <div className='button-group'>
                        { browseItems ?
                          shopLinkOpensOrgPage || 1 === 1 ?
                            <GBLink
                              className='hideOnMobile'
                              onClick={() => {
                                this.props.backToOrg(browsePage);
                              }}
                              allowCustom={true}
                              customColor={primaryColor}>
                              {shopTitle}
                            </GBLink>
                          :
                            <ModalLink className='hideOnMobile' id='shop' allowCustom={true} customColor={primaryColor}>{shopTitle}</ModalLink>
                        : null }
                        <GBLink
                          className='button'
                          allowCustom={true}
                          customColor={primaryColor}
                          solidColor={true}
                          onClick={() => {
                            this.props.scrollTo('checkout');
                            this.props.toggleModal('amountsList', false);
                          }}
                        >
                          Pay Now
                        </GBLink>
                      </div>
                    </div>
                  </div>
                }
              />
              <Button
                modalID={`amountsList`}
                button={button}
                allowAutopop={true}
              />
            </>
          :
            this.renderAmountsList(true)
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const data = util.getValue(gbx3, 'data', {});
  const cart = util.getValue(gbx3, 'cart', {});
  const cartItems = util.getValue(cart, 'items', []);
  const subTotal = util.getValue(cart, 'subTotal', 0);
  const form = util.getValue(gbx3, 'blocks.article.paymentForm.options.form', {});
  const numCartItems = cartItems.length;
  const orgLogo = util.getValue(gbx3, 'orgData.imageURL');
  const orgName = util.getValue(gbx3, 'orgData.name');

  return {
    data,
    form,
    numCartItems,
    subTotal,
    orgLogo,
    orgName
  }
}

export default connect(mapStateToProps, {
  toggleModal,
  sendResource,
  saveGBX3,
  updateData,
  updateCart
})(Amounts);
