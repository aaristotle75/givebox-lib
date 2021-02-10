import * as types from './gbx3actionTypes';
import * as util from '../../common/utility';
import * as types2 from '../../common/types';
import { getResource, sendResource } from '../../api/helpers';
import { toggleModal } from '../../api/actions';
import { defaultAmountHeight } from '../blocks/amounts/amountsStyle';
import { blockTemplates, defaultBlocks } from '../blocks/blockTemplates';
import { createData } from '../admin/article/createTemplates';
import { helperTemplates } from '../helpers/helperTemplates';
import { builderStepsConfig } from '../admin/article/builderStepsConfig';
import {
  defaultStyle
} from './gbx3defaults';
import has from 'has';
const merge = require('deepmerge');

export function updateGBX3(name, value) {
  return {
    type: types.UPDATE_GBX3,
    name,
    value
  }
}

export function setLoading(loading) {
  return {
    type: types.SET_LOADING,
    loading
  }
}

export function clearGBX3(keepOrgData) {
  return {
    type: types.CLEAR_GBX3,
    keepOrgData
  }
}

export function setPageState(page, newState) {
  return {
    type: types.UPDATE_PAGE_STATE,
    page,
    newState
  }
}

export function updateInfo(info) {
  return {
    type: types.UPDATE_INFO,
    info
  }
}

export function updateLayouts(blockType, layouts = {}) {
  return {
    type: types.UPDATE_LAYOUTS,
    layouts,
    blockType
  }
}

export function addBackground(index, background) {
  return (dispatch, getState) => {
    console.log('execute Add Background');
  }
}

export function removeBackground(index, background) {
  return (dispatch, getState) => {
    console.log('execute Remove Background');
  }
}

export function updateBackgrounds(backgrounds) {
  return {
    type: types.UPDATE_BACKGROUNDS,
    backgrounds
  }
}

export function updateBackground(index, background) {
  return {
    type: types.UPDATE_BACKGROUND,
    index,
    background
  }
}

export function updateBlocks(blockType, blocks = {}) {
  return {
    type: types.UPDATE_BLOCKS,
    blocks,
    blockType
  }
}

export function updateBlock(blockType, name, block) {
  return {
    type: types.UPDATE_BLOCK,
    name,
    block,
    blockType
  }
}

export function addBlock(blockType, type, w = 0, h = 0, ref, callback) {
  return async (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
    const admin = util.getValue(gbx3, 'admin', {});
    const kind = util.getValue(gbx3, 'info.kind');
    const availableBlocks = util.deepClone(util.getValue(admin, `availableBlocks.${blockType}`, []));
    const newBlock = blockType === 'article' ? util.getValue(blockTemplates[blockType][kind], type, {}) : util.getValue(blockTemplates[blockType], type, {});

    if (!util.isEmpty(newBlock)) {
      let blockName = util.getValue(newBlock, 'name', type);
      if (blockName in blocks) {
        const hash = util.uniqueHash();
        blockName = `${blockName}-${hash}`;
        newBlock.name = blockName;
        if (!util.isEmpty(util.getValue(newBlock, 'grid'))) {
          newBlock.grid.desktop.i = blockName;
          newBlock.grid.mobile.i = blockName;
        }
      }
      const y = Math.ceil(parseFloat(h / 10));
      //const positionX = w - current.offsetLeft;
      //const x = +(positionX / current.clientWidth) >= .5 ? 6 : 0;
      const x = 0;

      if (!util.isEmpty(util.getValue(newBlock, 'grid'))) {
        newBlock.grid.desktop.y = y;
        newBlock.grid.desktop.x = x;
      }

      if (!newBlock.multiple) {
        const index = availableBlocks.indexOf(blockName)
        availableBlocks.splice(index, 1);
      }
      dispatch(updateAvailableBlocks(blockType, availableBlocks));
      const blockUpdated = await dispatch(updateBlock(blockType, blockName, newBlock));
      if (blockUpdated) {
        dispatch(updateAdmin({ editBlock: `${blockType}-${blockName}`, editBlockJustAdded: true }));
        dispatch(toggleModal(`modalBlock-${blockType}-${blockName}`, true));
        if (callback) callback();
      }
    }
  }
}

export function removeBlock(blockType, name, callback) {
  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
    const admin = util.getValue(gbx3, 'admin', {});
    const availableBlocks = util.deepClone(util.getValue(admin, `availableBlocks.${blockType}`, []));
    const block = util.getValue(blocks, name, {});
    if (!util.getValue(block, 'multiple')) {
      if (!availableBlocks.includes(name)) {
        availableBlocks.push(name);
      }
    }
    dispatch(updateAvailableBlocks(blockType, availableBlocks));
    dispatch(updateAdmin({ editBlock: '' }));
    dispatch(deleteBlock(name, blockType));
  }
}

function deleteBlock(name, blockType) {
  return {
    type: types.REMOVE_BLOCK,
    name,
    blockType
  }
}

export function updateGlobals(globals = {}) {
  return {
    type: types.UPDATE_GLOBALS,
    globals
  }
}

export function updateGlobal(name, global) {
  return {
    type: types.UPDATE_GLOBAL,
    name,
    global
  }
}

export function updateData(data, blockType) {
  return {
    type: blockType === 'org' ? types.UPDATE_ORG : types.UPDATE_DATA,
    data
  }
}

export function updateFees(fees) {
  return {
    type: types.UPDATE_FEES,
    fees
  }
}

export function updateAdmin(admin) {
  return {
    type: types.UPDATE_ADMIN,
    admin
  }
}

export function closeHelper(blockType) {
  return (dispatch, getState) => {
    dispatch(updateHelperBlocks(blockType, {
      helperOpen: false,
      helperSidebarShow: true
    }));
  }
}

export function checkHelperIfHasDefaultValue(blockType, helper) {
  return (dispatch, getState) => {
    const kind = util.getValue(getState(), `gbx3.info.kind`);
    let data = null;
    let isDefault = false;
    switch (blockType) {
      case 'article':
      default: {
        data = util.getValue(getState(), `gbx3.data`, {});
        break;
      }
    }
    const value = util.getValue(data, util.getValue(helper, 'field'));

    switch (util.getValue(helper, 'defaultCheck')) {
      case 'logo': {
        if (!util.checkImage(value) || !value) isDefault = true;
        break;
      }

      case 'image': {
        if (!util.checkImage(value) || !value) isDefault = true;
        break;
      }

      case 'text': {
        if (value.includes(`New ${types2.kind(kind).name}`) || value.includes('Please add Description') || !value) isDefault = true;
        break;
      }

      case 'color': {
        if (value.includes('#4385f5') || value.includes('#4775f8') || !value) isDefault = true;
        break;
      }

      case 'share':
      default: {
        isDefault = true;
        break;
      }
    }

    return isDefault;
  }
}

export function nextHelperStep(blockType, checkStep, returnNextStepOnly = false) {
  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const helperBlocks = util.getValue(gbx3, `helperBlocks.${blockType}`, {});
    const helperCompleted = util.getValue(helperBlocks, 'completed', []);
    const helperStep = checkStep || checkStep === 0 ? checkStep : util.getValue(helperBlocks, 'helperStep', 0);
    const helpersAvailable = util.getValue(helperBlocks, 'helpersAvailable', []);

    let nextStep = null;
    Object.entries(helpersAvailable).forEach(([key, value]) => {
      if ( (!nextStep && nextStep !== 0) && !helperCompleted.includes(value.blockName) && ( key > helperStep )) {
        nextStep = key;
      }
    });
    if (!nextStep) {
      Object.entries(helpersAvailable).forEach(([key, value]) => {
        if ( (!nextStep && nextStep !== 0) && !helperCompleted.includes(value.blockName)) {
          nextStep = +key;
        }
      });
    }
    if (returnNextStepOnly) {
      return nextStep || 0;
    } else {
      if (nextStep || nextStep === 0) dispatch(checkForHelper(blockType, nextStep));
      else {
        dispatch(updateHelperBlocks(blockType, {
          helperStep: 0,
          helperOpen: false,
          helperSidebarShow: true
        }));
      }
    }
  }
}

export function checkForHelper(blockType, nextStep) {
  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const availableBlocks = util.getValue(gbx3, `admin.availableBlocks.${blockType}`, []);
    const helpersTurnedOff = util.getValue(getState(), `preferences.gbx3Helpers`) === 'off' ? true : false;
    const helperBlocks = util.getValue(gbx3, `helperBlocks.${blockType}`, {});
    const helperCompleted = util.getValue(helperBlocks, 'completed', []);
    const helperStep = ( nextStep || nextStep === 0 ) ? nextStep : util.getValue(helperBlocks, 'helperStep');
    const helpersAvailable = util.getValue(helperBlocks, 'helpersAvailable', []);
    const lastStep = helpersAvailable.length - 1;
    const helper = util.getValue(helpersAvailable, helperStep, {});
    const isVolunteer = util.getValue(gbx3, 'admin.isVolunteer');

    if (!helpersTurnedOff) {
      // If isVolunteer and the helper is volunteerRestricted go to next step
      if ((isVolunteer && util.getValue(helper, 'volunteerRestricted')) || (helperCompleted.includes(helper.blockName))) {
        dispatch(nextHelperStep(blockType));
      } else {
        // If a helperStep is not null and helper exists, open the helper and hide the sidebar
        if ( ( helperStep || helperStep === 0 ) &&  !util.isEmpty(helper)) {
          const isDefault = dispatch(checkHelperIfHasDefaultValue(blockType, helper));
          if (isDefault && !availableBlocks.includes(helper.blockName)) {
            dispatch(updateHelperBlocks(blockType, {
              helperStep,
              helperOpen: true,
              helperSidebarShow: false
            }));
          } else {
            const nextStep = dispatch(nextHelperStep(blockType, helperStep, true));
            if (nextStep === lastStep) {
              dispatch(updateHelperBlocks(blockType, {
                helperOpen: true,
                helperStep: nextStep,
                helperSidebarShow: false
              }));
            } else {
              dispatch(checkForHelper(blockType, nextStep));
            }
          }
        } else {
          // Close the helper, set the step to 1 and hide the sidebar
          dispatch(updateHelperBlocks(blockType, {
            helperOpen: false,
            helperStep: 1,
            helperSidebarShow: true
          }));
        }
      }
    }
  }
}

export function updateHelperBlocks(blockType, helperBlocks) {
  return {
    type: types.UPDATE_HELPERS,
    blockType,
    helperBlocks
  }
}

export function updateHelperSteps(helperSteps) {
  return {
    type: types.UPDATE_HELPER_STEPS,
    helperSteps
  }
}

export function updateAvailableBlocks(blockType, available) {
  return (dispatch, getState) => {
    const availableBlocks = {
      ...util.getValue(getState(), 'gbx3.admin.availableBlocks', {}),
      [blockType]: available
    };
    dispatch(updateAdmin({ availableBlocks }));
  }
}

export function toggleAdminLeftPanel() {
  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const admin = util.getValue(gbx3, 'admin', {});
    const open = util.getValue(admin, 'open');
    dispatch(updateAdmin({ open: open ? false : true }));
  }
}

export function updateConfirmation(confirmation) {
  return {
    type: types.UPDATE_CONFIRMATION,
    confirmation
  }
}

export function resetConfirmation() {
  return {
    type: types.RESET_CONFIRMATION
  }
}

export function shopMoreItems() {
  console.log('execute shopMoreItems');
}

function saveCart(cart) {
  return {
    type: types.UPDATE_CART,
    cart
  }
}

export function resetCart() {
  return {
    type: types.RESET_CART
  }
}

export function updateCart(cart) {
  return async (dispatch, getState) => {
    const cartUpdated = await dispatch(saveCart(cart));
    if (cartUpdated) {
      dispatch(calcCart());
      return true;
    }
  }
}

export function updateCartItem(unitID, item = {}, opts = {}, openCart = true) {
  return async (dispatch, getState) => {

    // options
    const {
      articleIDOverride,
      kindOverride,
      kindIDOverride
    } = opts;

    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const isPublic = util.getValue(gbx3, 'blocks.article.paymentForm.options.form.isPublic', true);
    const fees = util.getValue(gbx3, 'fees', {});
    const info = util.getValue(gbx3, 'info', {});
    const cart = util.getValue(gbx3, 'cart', {});
    const items = util.getValue(cart, 'items', []);
    const numOfItems = items.length;
    const index = items.findIndex(i => i.unitID === unitID);
    const quantity = parseInt(util.getValue(item, 'quantity', 1));
    const amount = parseInt(quantity * util.getValue(item, 'priceper', 0));
    const allowMultiItems = util.getValue(item, 'allowMultiItems', true);

    item.isPublic = isPublic;
    item.amount = amount;
    item.fees = fees;
    item.amountFormatted = amount/100;

    cart.open = cart.open || openCart ? true : false;
    cart.zeroAmountAllowed = util.getValue(item, 'zeroAmountAllowed', false);
    let addedOrRemoved = '';
    if (index === -1) {
      const articleID = articleIDOverride || +util.getValue(info, 'articleID');
      item.articleID = articleID;
      item.orgName = util.getValue(info, 'orgName');
      item.orgID = util.getValue(info, 'orgID');
      item.articleKind = kindOverride || util.getValue(info, 'kind');
      item.kindID = kindIDOverride || util.getValue(info, 'kindID');

      if (allowMultiItems && +amount > 0) {
        items.push(item);
        addedOrRemoved = 'added';
      } else {
        // If multiItems is false find and remove the previous item per articleID
        const removeIndex = items.findIndex(i => i.articleID === articleID);
        if (removeIndex !== -1) {
          items.splice(removeIndex, 1);
          addedOrRemoved = 'removed';
        }
        if (+amount > 0) {
          items.push(item);
          addedOrRemoved = 'added';
        }
      }
    } else {
      if (+amount > 0) items[index] = { ...items[index], ...item };
      else {
        items.splice(index, 1);
        addedOrRemoved = 'removed';
      }
    }
    if (addedOrRemoved === 'added' && item.addedCallback) {
      item.addedCallback();
    }
    if (addedOrRemoved === 'removed' && item.removedCallback) {
      item.removedCallback();
    }
    if (!item.orderBy) item.orderBy = numOfItems + 1;
    const cartUpdated = await dispatch(saveCart(cart));
    if (cartUpdated) dispatch(calcCart());
  }
}

function calcFee(amount = 0, fees = {}) {
  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const cart = util.getValue(gbx3, 'cart', {});
    const passFees = util.getValue(cart, 'passFees');
    const paymethod = util.getValue(cart, 'paymethod', {});
    const cardType = util.getValue(cart, 'cardType');
    const isDebit = util.getValue(cart, 'isDebit');
    const cardLength = +util.getValue(cart, 'cardLength', 0);

    let feePrefix = 'fnd';
    switch (paymethod) {
      case 'creditcard':
      default: {
        switch (cardType) {
          case 'amex': {
            feePrefix = 'amexFnd';
            break;
          }

          // no default
        }
      }
    }

    if (paymethod === 'echeck' && cardLength < 16) {
      feePrefix = 'debit';
    } else if (paymethod === 'echeck' && isDebit) {
      feePrefix = 'debit';
    }

    const pctFee = util.getValue(fees, `${feePrefix}PctFee`, 290);
    const fixFee = amount !== 0 ? util.getValue(fees, `${feePrefix}FixFee`, 29) : 0;
    const percent = +((pctFee/10000).toFixed(4)*parseFloat(amount/100));
    const fixed = +((fixFee/100).toFixed(2));
    const fee = passFees ? +((percent + fixed).toFixed(2)) : 0;
    return fee;
  }
}

export function calcCart() {
  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const cart = util.getValue(gbx3, 'cart', {});
    const passFees = util.getValue(cart, 'passFees');
    const items = util.getValue(cart, 'items', []);
    cart.subTotal = 0;
    cart.fee = 0;
    cart.total = 0;
    if (!util.isEmpty(items)) {
      Object.entries(items).forEach(([key, value]) => {
        value.passFees = passFees; // bad hack to assign passFees
        const amountFormatted = value.amountFormatted || 0;
        const amount = value.amount;
        const fees = value.fees;
        const CRFTFeePct = util.getValue(fees, 'CRFTFeePct', 0);
        const CRFTFeePercent = +((CRFTFeePct/10000).toFixed(4)*parseFloat(amount/100));
        const CRFTFee = CRFTFeePct && passFees ? +((CRFTFeePercent).toFixed(2)) : +((0).toFixed(2));
        cart.subTotal = cart.subTotal + amountFormatted;
        cart.fee = cart.fee + dispatch(calcFee(amount, fees));
        cart.CRFTFee = cart.CRFTFee + CRFTFee;
      });
    }
    cart.total = (cart.subTotal + cart.fee).toFixed(2);
    dispatch(saveCart(cart));
  }
}

export function saveGBX3(blockType, options = {}) {

  const opts = {
    data: {},
    isSending: false,
    callback: null,
    updateLayout: false,
    ...options
  };

  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const gbxData = util.getValue(gbx3, blockType === 'org' ? 'orgData' : 'data', {});
    const settings = util.getValue(gbxData, 'giveboxSettings', {});
    const info = util.getValue(gbx3, 'info', {});
    const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
    const globals = util.getValue(gbx3, 'globals', {});
    const backgrounds = util.getValue(gbx3, 'backgrounds', []);
    const helperBlocks = util.getValue(gbx3, 'helperBlocks', {});
    const helperSteps = util.getValue(gbx3, 'helperSteps', {});
    const giveboxSettings = blockType === 'org' ?
      {
        customTemplate: {
          blocks,
          globals,
          backgrounds,
          helperBlocks,
          helperSteps
        }
      }
    :
      {
        giveboxSettings: {
          ...settings,
          customTemplate: {
            blocks,
            globals,
            backgrounds,
            helperBlocks,
            helperSteps
          }
        }
      }
    ;

    const dataObj = blockType === 'org' ?
      {
        ...giveboxSettings,
        ...opts.data
      }
    :
      {
        ...gbxData,
        ...giveboxSettings,
        ...opts.data
      }
    ;

    if (opts.updateLayout) {
      const layouts = {
        desktop: [],
        mobile: []
      };

      Object.entries(blocks).forEach(([key, value]) => {
        const grid = util.getValue(value, 'grid', {});
        if (!util.isEmpty(grid)) {
          if (!util.isEmpty(util.getValue(grid, 'desktop'))) layouts.desktop.push(value.grid.desktop);
          if (!util.isEmpty(util.getValue(grid, 'mobile'))) layouts.mobile.push(value.grid.mobile);
        }
      });

      dispatch(updateLayouts(blockType, layouts));
    }

    dispatch(updateGBX3('saveStatus', 'saving'));
    dispatch(sendResource(util.getValue(info, 'apiName'), {
      id: [blockType === 'org' ? util.getValue(info, 'orgID') : util.getValue(info, 'kindID')],
      orgID: util.getValue(info, 'orgID'),
      data: dataObj,
      method: 'patch',
      callback: (res, err) => {
        dispatch(updateGBX3('saveStatus', 'done'));
        if (opts.callback) opts.callback(res, err);
      },
      isSending: opts.isSending
    }));
  }
}

export function saveReceipt(options = {}) {

  const opts = {
    isSending: false,
    callback: null,
    ...options
  };

  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const articleData = util.getValue(gbx3, 'data', {});
    const receiptConfig = util.getValue(gbx3, 'data.receiptConfig', {});
    const apiName = util.getValue(gbx3, 'info.apiName');
    const kindID = util.getValue(gbx3, 'info.kindID');
    const orgID = util.getValue(gbx3, 'info.orgID');
    const blocks = util.getValue(gbx3, `blocks.receipt`, {});

    let receiptHTML = '';
    const orderedBlocks = [];
    Object.entries(blocks).forEach(([key, value]) => {
      orderedBlocks.push(value);
    });
    util.sortByField(orderedBlocks, 'order', 'ASC');

    Object.entries(orderedBlocks).forEach(([key, value]) => {
      switch (value.type) {
        case 'Media': {
          const imageURL = util.getValue(value, 'content.image.URL', util.getValue(articleData, `${util.getValue(value, 'field')}`));
          if (imageURL) receiptHTML = receiptHTML + `<p style="text-align:center"><img style="max-width:500px;" src="${util.imageUrlWithStyle(imageURL, util.getValue(value, 'content.image.size', util.getValue(value, 'options.image.size', 'medium')))}" alt="Media" /></p>`;
          break;
        }

        case 'Text':
        default: {
          const fieldValue =  util.getValue(articleData, `${util.getValue(value, 'field')}`);
          const defaultContent = util.getValue(value, 'options.defaultFormat') && fieldValue ? value.options.defaultFormat.replace('{{TOKEN}}', fieldValue) : fieldValue || '';
          const content = util.getValue(value, 'content.html', defaultContent);
          if (content) {
            receiptHTML = receiptHTML + content;
          }
          break;
        }
      }
    });

    const dataObj = {
      receiptHTML,
      receiptConfig: {
        ...receiptConfig,
        blocks
      }
    };

    dispatch(updateGBX3('saveStatus', 'saving'));
    dispatch(sendResource(apiName, {
      id: [kindID],
      orgID,
      data: dataObj,
      method: 'patch',
      callback: (res, err) => {
        dispatch(updateData(res));
        dispatch(updateGBX3('saveStatus', 'done'));
        if (opts.callback) opts.callback(res, err);
      },
      isSending: opts.isSending
    }));
  }
}

export function resetGBX3(blockType = 'article') {
  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const info = util.getValue(gbx3, 'info', {});
    const isOrg = blockType === 'org' ? true : false;
    const data = isOrg ?
      {
        ...util.getValue(gbx3, 'orgData', {}),
        customTemplate: {
          blocks: {},
          globals: {},
          backgrounds: [],
          helperBlocks: {}
        }
      }
    :
      {
        ...util.getValue(gbx3, 'data', {}),
        giveboxSettings: {
          customTemplate: {
            blocks: {},
            globals: {},
            backgrounds: [],
            helperBlocks: {}
          }
        }
      }
    ;

    const orgID = util.getValue(info, 'orgID');
    const kindID = util.getValue(info, 'kindID');

    dispatch(sendResource(util.getValue(info, 'apiName'), {
      id: [isOrg ? orgID : kindID],
      orgID,
      data,
      method: 'patch',
      callback: (res, err) => {
        dispatch(updateBlocks(blockType, {}));
        dispatch(updateGlobals({}));
        dispatch(updateData(res));
        window.location.reload();
      },
      isSending: true
    }));
  }
}

export function processTransaction(data, callback) {
  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const articleData = util.getValue(gbx3, 'data', {});
    const hasCustomReceipt = util.getValue(gbx3, 'data.receiptConfig');
    const version = `&version=${hasCustomReceipt ? 3 : 2}&primary=${util.getValue(articleData, 'articleID')}`;

    const grecaptcha = window.grecaptcha;
    grecaptcha.ready(function() {
      grecaptcha.execute(process.env.REACT_APP_RECAPTCHA_KEY, {action: 'payment'})
      .then(function(token) {
        dispatch(sendResource('purchaseOrder', {
          data,
          callback,
          query: `rc=${token}${version}`
        }));
      })
      .catch(error => console.error('Need to use givebox.local for grecaptcha'))
    });
  }
}

function setCloneFundraiser() {
  return {
    type: types.CLONE_GBX3
  }
}

export function cloneFundraiser(kind, kindID, callback) {
  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const info = util.getValue(gbx3, 'info', {});
    const apiName = `org${types2.kind(kind).api.item}`;
    const orgID = util.getValue(info, 'orgID');
    dispatch(getResource(apiName, {
      customName: 'articleClone',
      id: [kindID],
      reload: true,
      orgID: orgID,
      callback: (res, err) => {
        if (!err && !util.isEmpty(res)) {
          const giveboxSettings = util.getValue(res, 'giveboxSettings', {});
          const customTemplate = util.getValue(giveboxSettings, 'customTemplate', {});
          const blocks = util.getValue(customTemplate, 'blocks', {});
          const titleBlock = util.getValue(blocks, 'title', {});
          const titleContent = util.getValue(titleBlock, 'content', {});
          const form = util.getValue(blocks, 'paymentForm.options.form', {});
          const title = `DUPLICATE ${util.getValue(res, 'title')}`;
          const kindSpecific = {};
          const d = new Date();
          const passFees = util.getValue(form, 'passFees', true);

          giveboxSettings.addressInfo = util.getValue(form, 'addressInfo', 0);
          giveboxSettings.phoneInfo = util.getValue(form, 'phoneInfo', 0);
          giveboxSettings.workInfo = util.getValue(form, 'workInfo', 0);
          giveboxSettings.noteInfo = util.getValue(form, 'noteInfo', 0);
          giveboxSettings.notePlaceholder = util.getValue(form, 'notePlaceholder', '');
          giveboxSettings.allowSelection = util.getValue(form, 'allowSelection', true);
          giveboxSettings.feeOption = util.getValue(form, 'feeOption', true);

          //const oneMonthFromNow = parseInt((d.setMonth(d.getMonth() + 1))/1000);

          switch (kind) {
            case 'sweepstake': {
              kindSpecific.endsAt = null;
              kindSpecific.status = 'open';
              break;
            }

            // no default
          }
          const data = {
            ...res,
            ...kindSpecific,
            title,
            passFees,
            giveboxSettings: {
              ...giveboxSettings,
              customTemplate: {
                ...customTemplate,
                blocks: {
                  ...blocks,
                  title: {
                    ...titleBlock,
                    content: {
                      ...titleContent,
                      html: `<span style="font-size:16px;">${title}</span>`
                    }
                  }
                }
              }
            }
          };
          dispatch(createFundraiser(kind, callback, data));
        } else {
          if (callback) callback(res, err);
        }
      }
    }));
    dispatch(setCloneFundraiser());
  }
}

export function createFundraiser(createKind, callback, cloneData) {

  return (dispatch, getState) => {
    dispatch(setLoading(true));
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const info = util.getValue(gbx3, 'info', {});
    const admin = util.getValue(gbx3, 'admin', {});
    const kind = createKind || util.getValue(info, 'kind', 'fundraiser');
    const orgID = util.getValue(info, 'orgID');
    const resourceName = `org${types2.kind(kind).api.list}`;
    const data = cloneData || createData[kind];
    data.volunteer = util.getValue(admin, 'isVolunteer', null);
    data.volunteerID = util.getValue(admin, 'volunteerID', null);
    dispatch(setLoading(false));
    dispatch(sendResource(resourceName, {
      orgID,
      data,
      callback: (res, err) => {
        if (!err && !util.isEmpty(res)) {
          dispatch(loadGBX3(res.articleID, async () => {
            dispatch(updateInfo({ display: 'article', kind }));
            dispatch(updateAdmin({ step: 'design', editable: true }));
            if (!cloneData) {
              const styleReset = await dispatch(resetStyle('gbxStyle'));
              if (styleReset) dispatch(setStyle());
            }
            if (callback) callback(res, err);
          }));
        } else {
          if (callback) callback(res, err);
        }
      }
    }));
  }
}

export function loadGBX3(articleID, callback) {

  return async (dispatch, getState) => {

    dispatch(setLoading(true));
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const resource = util.getValue(getState(), 'resource', {});
    const access = util.getValue(resource, 'access', {});
    const globalsState = util.getValue(gbx3, 'globals', {});
    const orgData = util.getValue(gbx3, 'orgData', {});
    const admin = util.getValue(gbx3, 'admin', {});
    const blockType = 'article';
    const availableBlocks = util.deepClone(util.getValue(admin, `availableBlocks.article`, []));
    const receiptAvailableBlocks = util.deepClone(util.getValue(admin, `availableBlocks.receipt`, []));

    dispatch(getResource('article', {
      id: [articleID],
      reload: true,
      callback: (res, err) => {
        if (!util.isEmpty(res) && !err) {
          const kind = util.getValue(res, 'kind');
          const kindID = util.getValue(res, 'kindID');
          const orgID = util.getValue(res, 'orgID');
          const orgName = util.getValue(res, 'orgName');

          // If orgData orgID doesn't equal orgID get the orgData
          if (orgID !== util.getValue(orgData, 'ID')) {
            dispatch(getResource('org', {
              id: [orgID],
              reload: true,
              customName: 'gbx3Org',
              callback: (res, err) => {
                if (!util.isEmpty(res) && !err) {
                  dispatch(updateData(res, 'org'));
                }
              }
            }));
          }

          if (kindID) {
            const apiName = `org${types2.kind(kind).api.item}`;
            dispatch(getResource('articleFeeSettings', {
              id: [articleID],
              reload: true,
              callback: (res, err) => {
                if (!err && !util.isEmpty(res)) {
                  dispatch(updateFees(res));
                }
              }
            }));

            dispatch(getResource(apiName, {
              id: [kindID],
              reload: true,
              orgID: orgID,
              callback: (res, err) => {
                if (!err && !util.isEmpty(res)) {
                  const settings = util.getValue(res, 'giveboxSettings', {});
                  const primaryColor = util.getValue(settings, 'primaryColor', '#4775f8');
                  const customTemplate = util.getValue(settings, 'customTemplate', {});
                  const passFees = util.getValue(res, 'passFees');
                  const publishStatus = util.getPublishStatus(kind, util.getValue(res, 'publishedStatus.webApp'));
                  const volunteerID = util.getValue(res, 'volunteerID');
                  const hasAccessToEdit = util.getAuthorizedAccess(access, orgID,  util.getValue(res, 'volunteer') ? volunteerID : null);

                  dispatch(updateCart({ passFees }));
                  dispatch(updateInfo({
                    orgID,
                    orgName,
                    articleID,
                    kindID,
                    kind,
                    apiName,
                    publishStatus,
                    display: 'article',
                    orgImage: util.getValue(access, 'orgImage')
                  }));

                  const blocksCustom = util.getValue(customTemplate, 'blocks', {});
                  const articleBlocks = util.getValue(blockTemplates, `article.${kind}`, {});
                  const blocksDefault = {};
                  defaultBlocks.article[kind].forEach((value) => {
                    if (!util.isEmpty(blocksCustom)) {
                      if (has(blocksCustom, value)) {
                        blocksDefault[value] = articleBlocks[value];
                      }
                    } else {
                      blocksDefault[value] = articleBlocks[value];
                    }
                  });
                  const globalsCustom = util.getValue(customTemplate, 'globals', {});
                  const gbxStyleCustom = util.getValue(globalsCustom, 'gbxStyle', {});
                  const embedButtonCustom = util.getValue(globalsCustom, 'embedButton', {});

                  //const blocks = !util.isEmpty(blocksCustom) ? blocksCustom : blocksDefault;
                  const blocks = merge(blocksDefault, blocksCustom);

                  const globals = {
                    ...globalsState,
                    ...{
                      gbxStyle: {
                        ...defaultStyle.gbxStyle,
                        ...util.getValue(globalsState, 'gbxStyle', {}),
                        ...gbxStyleCustom,
                        primaryColor
                      },
                      button: {
                        ...defaultStyle.button,
                        ...util.getValue(globalsState, 'button', {}),
                        style: {
                          ...defaultStyle.button.style,
                          ...util.getValue(util.getValue(globalsState, 'button', {}), 'style', {}),
                          bgColor: primaryColor
                        }
                      },
                      embedButton: {
                        ...defaultStyle.embedButton,
                        ...util.getValue(globalsState, 'embedButton', {}),
                        text: types2.kind(kind).cta,
                        ...embedButtonCustom
                      }
                    },
                    ...util.getValue(customTemplate, 'globals', {})
                  };

                  const helperBlocksCustom = util.getValue(customTemplate, `helperBlocks.${blockType}`, {});
                  const helperBlocks = !util.isEmpty(helperBlocksCustom) ?
                    {
                      ...helperBlocksCustom,
                      helperStep: 0
                    }
                  : helperTemplates[blockType][kind];

                  const helperStepsCustom = util.getValue(customTemplate, `helperSteps`, {});
                  const helperSteps = !util.isEmpty(helperStepsCustom) ?
                    {
                      ...helperStepsCustom
                    }
                  :
                    {
                      step: 0,
                      completed: [],
                      advancedBuilder: false
                    }
                  ;

                  // Get Step Values
                  const title = util.getValue(res, 'title');
                  const logoBlock = util.getValue(blocks, 'logo', {});
                  const logoURL = util.getValue(logoBlock, 'content.image.URL', util.getValue(res, 'orgImageURL')).replace(/small$/i, 'original');
                  const mediaBlock = util.getValue(blocks, 'media', {});
                  const mediaURL = util.getValue(mediaBlock, 'content.image.URL', '').replace(/medium$/i, 'original');

                  // Get the minimum not completed step
                  const stepsArray = [];
                  const stepConfig = util.getValue(builderStepsConfig, kind, []);
                  const numOfSteps = stepConfig.length - 1;

                  stepConfig.forEach((value, key) => {
                      let isDefault = true;
                      stepsArray.push(key);

                      // Check if step values are completed by checking defaultStyle
                      switch (value.slug) {
                        case 'title': {
                          if (title && !title.includes(`New ${types2.kind(kind).name}`)) {
                            isDefault = false;
                          }
                          break;
                        }

                        case 'logo': {
                          if (logoURL && util.checkImage(logoURL)) {
                            isDefault = false;
                          }
                          break;
                        }

                        case 'image': {
                          if (mediaURL && util.checkImage(mediaURL)) {
                            isDefault = false;
                          }
                          break;
                        }

                        case 'themeColor': {
                          if (primaryColor && !primaryColor.includes('#4385f5') && !primaryColor.includes('#4775f8')) {
                            isDefault = false;
                          }
                          break;
                        }

                        // no default
                      }

                      if (!helperSteps.completed.includes(key) && !isDefault) {
                        helperSteps.completed.push(key);
                      }
                  });
                  const uncompletedSteps = stepsArray.filter(item => !helperSteps.completed.includes(item));
                  const minStepNotCompleted = !util.isEmpty(uncompletedSteps) ? Math.min(...uncompletedSteps) : numOfSteps;

                  helperSteps.step = minStepNotCompleted < 4 ? minStepNotCompleted : 4;

                  const builderPref = util.getValue(getState(), 'preferences.builderPref');
                  helperSteps.advancedBuilder = builderPref === 'advanced' ? true : helperSteps.advancedBuilder;

                  if (!util.isEmpty(blocksCustom)) {
                    // Check if not all default blocks are present
                    // If not, add them to the availableBlocks array
                    // which are blocks available but not used
                    Object.keys(articleBlocks).forEach((key) => {
                      if (!(key in blocks) && !availableBlocks.includes(key)) {
                        availableBlocks.push(key);
                      }
                    })
                  } else {
                    // Check how many amounts and set amounts grid height only for fundraisers or invoices
                    if (kind === 'fundraiser' || kind === 'invoice') {
                      const amountsObj = util.getValue(res, types2.kind(kind).amountField, {});
                      const amountsList = util.getValue(amountsObj, 'list', []);
                      const amountsListEnabled = amountsList.filter(a => a.enabled === true);
                      const amountsSectionHeight = defaultAmountHeight(amountsListEnabled.length);
                      blocks.amounts.grid.desktop.h = amountsSectionHeight;
                    }
                  }

                  const layouts = {
                    desktop: [],
                    mobile: []
                  };

                  Object.entries(blocks).forEach(([key, value]) => {
                    const grid = util.getValue(value, 'grid', {});
                    if (!util.isEmpty(grid)) {
                      if (!util.isEmpty(util.getValue(grid, 'desktop'))) layouts.desktop.push(value.grid.desktop);
                      if (!util.isEmpty(util.getValue(grid, 'mobile'))) layouts.mobile.push(value.grid.mobile);
                    }
                  });

                  const admin = {
                    hasAccessToEdit,
                    editable: hasAccessToEdit ? true : false,
                    step: 'design'
                  };

                  if (util.getValue(hasAccessToEdit, 'isVolunteer')) {
                    admin.isVolunteer = true;
                    admin.volunteerID = volunteerID;
                  }

                  dispatch(updateLayouts(blockType, layouts));
                  dispatch(updateBlocks(blockType, blocks));
                  dispatch(updateGlobals(globals));
                  dispatch(updateHelperBlocks(blockType, helperBlocks));
                  dispatch(updateHelperSteps(helperSteps));
                  dispatch(updateData(res));
                  dispatch(updateAvailableBlocks(blockType, availableBlocks));
                  dispatch(updateAdmin(admin));

                  // Get and Set Thank You Email Receipt
                  const receiptCustom = util.getValue(res, 'receiptConfig.blocks', {});
                  const receiptTemplateBlocks = util.getValue(blockTemplates, `receipt`, {});
                  const receiptDefault = {};
                  defaultBlocks.receipt.forEach((value) => {
                    receiptDefault[value] = receiptTemplateBlocks[value];
                  });
                  const receiptBlocks = merge(receiptDefault, receiptCustom);
                  if (!util.isEmpty(receiptCustom)) {
                    Object.keys(receiptTemplateBlocks).forEach((key) => {
                      if (!(key in receiptBlocks) && !receiptAvailableBlocks.includes(key)) {
                        receiptAvailableBlocks.push(key);
                      }
                    })
                  }

                  dispatch(updateBlocks('receipt', receiptBlocks));

                  callback(res, err)
                }
                dispatch(setLoading(false));
              }
            }));
          } else {
            dispatch(setLoading(false));
          }
        } else {
          dispatch(setLoading(false));
        }
      }
    }));
  }
}

export function loadOrg(orgID, callback) {

  return async (dispatch, getState) => {

    dispatch(setLoading(true));
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const resource = util.getValue(getState(), 'resource', {});
    const access = util.getValue(resource, 'access', {});
    const globalsState = util.getValue(gbx3, 'globals', {});
    const admin = util.getValue(gbx3, 'admin', {});
    const info = util.getValue(gbx3, 'info', {});
    const originTemplate = !util.getValue(info, 'originTemplate') ? 'org' : null;
    const blockType = 'org';
    const availableBlocks = util.deepClone(util.getValue(admin, `availableBlocks.org`, []));

    dispatch(getResource('org', {
      id: [orgID],
      reload: true,
      customName: 'gbx3Org',
      callback: (res, err) => {
        if (!util.isEmpty(res) && !err) {
          const orgID = util.getValue(res, 'ID');
          const orgName = util.getValue(res, 'name');
          const customTemplate = util.getValue(res, 'customTemplate', {});
          const hasAccessToEdit = util.getAuthorizedAccess(access, orgID, null);
          dispatch(updateInfo({
            orgID,
            orgName,
            originTemplate,
            display: 'org',
            orgImage: util.getValue(res, 'imageURL'),
            apiName: 'org'
          }));
          const blocksCustom = util.getValue(customTemplate, 'blocks', {});
          const backgrounds = util.getValue(customTemplate, 'backgrounds', []);
          const orgBlocks = util.getValue(blockTemplates, `org`, {});
          const blocksDefault = {};

          defaultBlocks.org.forEach((value) => {
            if (!util.isEmpty(blocksCustom)) {
              if (has(blocksCustom, value)) {
                blocksDefault[value] = orgBlocks[value];
              }
            } else {
              blocksDefault[value] = orgBlocks[value];
            }
          });
          const globalsCustom = util.getValue(customTemplate, 'globals', {});
          const gbxStyleCustom = util.getValue(globalsCustom, 'gbxStyle', {});
          const embedButtonCustom = util.getValue(globalsCustom, 'embedButton', {});

          //const blocks = !util.isEmpty(blocksCustom) ? blocksCustom : blocksDefault;
          const blocks = {
            ...blocksDefault,
            ...blocksCustom
          };

          //merge(blocksDefault, blocksCustom);

          const globals = {
            ...globalsState,
            ...{
              gbxStyle: {
                ...defaultStyle.gbxStyle,
                ...util.getValue(globalsState, 'gbxStyle', {}),
                ...gbxStyleCustom
              },
              button: {
                ...defaultStyle.button,
                ...util.getValue(globalsState, 'button', {}),
                style: {
                  ...defaultStyle.button.style,
                  ...util.getValue(util.getValue(globalsState, 'button', {}), 'style', {}),
                }
              },
              embedButton: {
                ...defaultStyle.embedButton,
                ...util.getValue(globalsState, 'embedButton', {}),
                ...embedButtonCustom
              }
            },
            ...util.getValue(customTemplate, 'globals', {})
          };

          const helperBlocksCustom = util.getValue(customTemplate, `helperBlocks.${blockType}`, {});
          const helperBlocks = !util.isEmpty(helperBlocksCustom) ?
            {
              ...helperBlocksCustom,
              helperStep: 0
            }
          : helperTemplates[blockType];

          if (!util.isEmpty(blocksCustom)) {
            // Check if not all default blocks are present
            // If not, add them to the availableBlocks array
            // which are blocks available but not used
            Object.keys(orgBlocks).forEach((key) => {
              if (!(key in blocks) && !availableBlocks.includes(key)) {
                availableBlocks.push(key);
              }
            })
          }

          const layouts = {
            desktop: [],
            mobile: []
          };

          Object.entries(blocks).forEach(([key, value]) => {
            const grid = util.getValue(value, 'grid', {});
            if (!util.isEmpty(grid)) {
              if (!util.isEmpty(util.getValue(grid, 'desktop'))) layouts.desktop.push(value.grid.desktop);
              if (!util.isEmpty(util.getValue(grid, 'mobile'))) layouts.mobile.push(value.grid.mobile);
            }
          });

          const admin = {
            hasAccessToEdit,
            editable: hasAccessToEdit ? true : false,
            step: 'design'
          };

          dispatch(updateLayouts(blockType, layouts));
          dispatch(updateBackgrounds(backgrounds));
          dispatch(updateBlocks(blockType, blocks));
          dispatch(updateGlobals(globals));
          dispatch(updateHelperBlocks(blockType, helperBlocks));
          dispatch(updateData(res, 'org'));
          dispatch(updateAvailableBlocks(blockType, availableBlocks));
          dispatch(updateAdmin(admin));
          dispatch(updateInfo({ publishStatus: 'public' }));
        }
        callback(res, err);
        dispatch(setLoading(false));
      }
    }));
  }
}

export function setTextStyle(color) {

}

export function resetStyle(styleType) {
  return {
    styleType,
    type: types.RESET_STYLE
  }
}

export function setStyles(style) {
  return {
    type: types.SET_STYLES
  }
}

export function setStyle(options = {}) {

  const opts = {
    primaryColor: null,
    textColor: null,
    pageColor: null,
    pageOpacity: null,
    pageRadius: null,
    backgroundColor: null,
    backgroundImage: null,
    backgroundOpacity: null,
    backgroundBlur: null,
    placeholderColor: null,
    ...options
  };

  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const globals = util.getValue(gbx3, 'globals', {});
    const gbxStyle = util.getValue(globals, 'gbxStyle', {});
    const info = util.getValue(gbx3, 'info', {});
    const stage = util.getValue(info, 'stage');
    const breakpoint = util.getValue(info, 'breakpoint');
    const color = opts.primaryColor || util.getValue(gbxStyle, 'primaryColor');
    const textColor = opts.textColor || util.getValue(gbxStyle, 'textColor', '#253655');
    const pageColor = opts.pageColor || util.getValue(gbxStyle, 'pageColor', '#ffffff');
    const pageOpacity = opts.pageOpacity || util.getValue(gbxStyle, 'pageOpacity', 1);
    const pageRadius = opts.pageRadius || util.getValue(gbxStyle, 'pageRadius', 10);
    const backgroundColor = opts.backgroundColor || util.getValue(gbxStyle, 'backgroundColor', color);
    const backgroundImage = opts.backgroundImage || util.getValue(gbxStyle, 'backgroundImage');
    const backgroundOpacity = opts.backgroundOpacity || util.getValue(gbxStyle, 'backgroundOpacity', 1);
    const backgroundBlur = opts.backgroundBlur || util.getValue(gbxStyle, 'backgroundBlur', 0);
    const placeholderColor = opts.placeholderColor || util.getValue(gbxStyle, 'placeholderColor');

    let textStyleStr = '';
    let colorStyleStr = '';
    let pageColorStyleStr = '';
    let backgroundColorStyleStr = '';
    let backgroundImageInnerHTML = '';
    let styleInnerHTML = '';

    if (textColor) {
      const rgb = util.hexToRgb(placeholderColor || textColor);
      const textColor2 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${placeholderColor ? 1 : .2})`;
      const textColor3 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${placeholderColor ? .5 : .2})`;

      textStyleStr = `
        .gbx3Layout,
        .gbx3Layout label,
        .gbx3Layout .label {
          color: ${textColor};
        }

        .gbx3Layout .floating-label button.label {
          color: ${textColor};
        }

        .gbx3Layout input {
          color: ${textColor};
        }
        .gbx3Layout .amountInput .moneyAmount {
          color: ${textColor};
        }

        .gbx3 .paymentFormTabs .panel button {
          color: ${textColor};
        }

        .gbx3Layout .radio + label {
          border: 1px solid ${textColor};
        }

        .gbx3Layout input::-webkit-input-placeholder {
          color: ${textColor2};
        }
        .gbx3Layout input::-moz-placeholder {
          color: ${textColor2};
        }
        .gbx3Layout input::-ms-input-placeholder {
          color: ${textColor2};
        }

        .gbx3 .givebox-paymentform .sendEmailNote .public-DraftEditorPlaceholder-inner {
          color: ${textColor2};
        }

        .gbx3 .givebox-paymentform .sendEmailNote .DraftEditor-editorContainer {
          border-bottom: 1px solid ${textColor2};
        }

        .gbx3 .givebox-paymentform input {
          border-bottom: 1px solid ${textColor2};
        }

        .gbx3Layout input {
          border-bottom: 1px solid ${textColor2};
        }
        .gbx3Layout .moneyAmount.noValue .symbol {
          color: ${textColor2};
        }

        .gbx3 .givebox-paymentform .dropdown button:not(.link) {
          border-bottom: 1px solid ${textColor2};
        }

        .gbx3 .gbx3Layout .dropdown button .label.idle {
          color: ${textColor2} !important;
        }

        .gbx3 .gbx3Layout .dropdown button .icon {
           color: ${textColor2};
        }

        .gbx3 .givebox-paymentform .input-bottom.idle {
           background: ${textColor2};
        }

        .gbx3Cart .itemsInCart .cartItemRow {
          border-bottom: 1px dashed ${textColor3};
        }

        .gbx3Cart .paymentFormHeaderTitle {
          color: ${textColor};
        }

      `;
    }

    if (pageColor) {
      const rgb = util.hexToRgb(pageColor);
      const pageColor1 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${pageOpacity})`;

      pageColorStyleStr = `
        .gbx3 .gbx3Container:not(.gbx3ReceiptContainer) {
          border-radius: ${+(pageRadius)}px;
          background: ${pageColor1};
        }
        .gbx3Layout .radio + label {
          background-color: ${pageColor1};
        }
        .gbx3Layout .radio:checked + label {
          background-color: ${pageColor1};
        }
      `;
    }

    if (backgroundColor || color) {
      const bgColor = backgroundColor || color;
      const rgb = util.hexToRgb(bgColor);
      const bgColorLight = util.pSBC(0.2, bgColor);
      const rgbLight = util.hexToRgb(bgColorLight);

      const bgColor1 = `rgba(${rgbLight.r}, ${rgbLight.g}, ${rgbLight.b}, ${backgroundOpacity})`;
      const bgColor2 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${backgroundOpacity})`;

      /*
      backgroundColorStyleStr = `
        .gbx3Layout:not(.gbx3ReceiptLayout) {
          background: ${bgColor1};
          background: -webkit-linear-gradient(to bottom, ${bgColor1} 0%, ${bgColor2} 70%) no-repeat center center fixed;
          background: -moz-linear-gradient(to bottom, ${bgColor1} 0%, ${bgColor2} 70%) no-repeat center center fixed;
          background: linear-gradient(to bottom, ${bgColor1} 0%, ${bgColor2} 70%) no-repeat center center fixed;
          -webkit-background-size: cover;
          -moz-background-size: cover;
          -o-background-size: cover;
          background-size: cover;
        }
      `;
      */

      backgroundImageInnerHTML = `
        .gbx3LayoutBackground {
          background: ${bgColor1};
          background: -webkit-linear-gradient(to bottom, ${bgColor1} 0%, ${bgColor2} 70%), url("${backgroundImage}") no-repeat center center fixed;
          background: -moz-linear-gradient(to bottom, ${bgColor1} 0%, ${bgColor2} 70%), url("${backgroundImage}") no-repeat center center fixed;
          background: linear-gradient(to bottom, ${bgColor1} 0%, ${bgColor2} 70%), url("${backgroundImage}") no-repeat center center fixed;
          -webkit-background-size: cover;
          -moz-background-size: cover;
          -o-background-size: cover;
          background-size: cover;
          filter: blur(${backgroundBlur}px);
          -webkit-filter: blur(${backgroundBlur}px);
        }
      `;
    }

    if (color) {
      const rgb = util.hexToRgb(color);
      //const color2 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .1)`;
      const color3 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .05)`;
      const color4 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .4)`;
      colorStyleStr = `

        .gbx3Layout .radio:checked + label:after {
          border: 1px solid ${color} !important;
          background: ${color};
        }

        .gbx3Layout .dropdown .dropdown-content.customColor::-webkit-scrollbar-thumb {
          background-color: ${color};
        }

        .gbx3Layout .amountsSection::-webkit-scrollbar-thumb {
          background-color: ${color4};
        }

        .modalContent.gbx3 .ticketAmountRow,
        .modalContent.gbx3 .amountRow {
          border-left: 4px solid ${color} !important;
        }

        .modalContent.gbx3 .amountRow:hover {
          background: ${color3};
        }

        .gbx3 .viewMapLink {
          color: ${color};
        }

        .modalContent.givebox-paymentform button.modalToTop:hover {
          background: ${color};
        }

        .gbx3Layout button.modalToTop:hover {
          background: ${color};
        }

        .modal .givebox-paymentform button.modalCloseBtn:hover .icon {
          color: ${color};
        }

        .gbx3Cart .itemsInCart .dropdown button:hover:not(.label) {
          border-bottom: 1px solid ${color};
        }

        .gbx3Cart .itemsInCart .dropdown button:hover:not(.label) .label {
          color: ${color} !important;
        }

        .gbx3Cart .paymentFormHeaderTitle button.closeCart {
          color: ${color};
        }

        .gbx3.dropdown-portal .dropdown-content.customColor::-webkit-scrollbar-thumb {
          background-color: ${color};
        }

        .gbx3Shop:not(.editable) button.link {
          color: ${color};
        }

        .checkoutDonation .react-toggle--checked .react-toggle-track {
          background: linear-gradient(to right, ${color} 0%, ${color4} 100%) !important;
        }

        .sendEmailNote .react-toggle--checked .react-toggle-track {
          background: linear-gradient(to right, ${color} 0%, ${color4} 100%) !important;
        }

      `;
    }

    if (pageColorStyleStr) styleInnerHTML = styleInnerHTML + pageColorStyleStr;
    if (textStyleStr) styleInnerHTML = styleInnerHTML + textStyleStr;
    if (colorStyleStr) styleInnerHTML = styleInnerHTML + colorStyleStr;
    if (backgroundColorStyleStr) styleInnerHTML = styleInnerHTML + backgroundColorStyleStr;
    if (backgroundImageInnerHTML) styleInnerHTML = styleInnerHTML + backgroundImageInnerHTML;

    if (styleInnerHTML) {
      const el = document.getElementById('customGBX3Style');
      if (el) {
        el.innerHTML = styleInnerHTML;
      } else {
        const styleEl = document.head.appendChild(document.createElement('style'));
        styleEl.setAttribute('id', 'customGBX3Style');
        styleEl.innerHTML = styleInnerHTML;
      }
    }
    dispatch(setStyles(styleInnerHTML));
  }
}

export function resetGBX3Receipt(callback) {
  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const info = util.getValue(gbx3, 'info', {});
    const data = {
      receiptHTML: '',
      receiptConfig: {}
    };

    dispatch(sendResource(util.getValue(info, 'apiName'), {
      id: [util.getValue(info, 'kindID')],
      orgID: util.getValue(info, 'orgID'),
      data,
      method: 'patch',
      callback: (res, err) => {
        dispatch(updateBlocks('receipt', {}));
        window.location.reload();
      },
      isSending: true
    }));
  }
}
