import * as types from './gbx3actionTypes';
import * as util from '../../common/utility';
import * as types2 from '../../common/types';
import { getResource, sendResource } from '../../api/helpers';
import { toggleModal } from '../../api/actions';
import { defaultAmountHeight } from '../blocks/amounts/amountsStyle';
import { blockTemplates, defaultBlocks } from '../blocks/blockTemplates';
import { createData } from '../admin/article/createTemplates';
import { builderStepsConfig } from '../admin/article/builderStepsConfig';
import { signupPhase as signupPhaseConfig } from '../signup/signupConfig';
import {
  primaryColor as defaultPrimaryColor,
  defaultStyle,
  defaultOrgGlobals,
  defaultOrgPages
} from './gbx3defaults';
import LZString from 'lz-string';
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

export function savingSignup(saving, savingSignupCallback) {
  return {
    type: types.SAVING_SIGNUP,
    saving,
    savingSignupCallback
  }
}

export function signupGBX3Data() {
  return (dispath, getState) => {
    const state = getState();
    const orgSignup = util.getValue(state, 'gbx3.orgSignup', {});
    const fields = util.getValue(orgSignup, 'fields', {});
    const {
      org,
      gbx3
    } = fields;

    const theme = util.getValue(org, 'defaultTheme', 'dark');

    const gbx3Data = {
      ...createData.fundraiser,
      ...gbx3,
    };

    const primaryColor = org.themeColor || defaultPrimaryColor;
    const gbx3Blocks = blockTemplates.article.fundraiser;
    const blocksDefault = {};
    defaultBlocks.article.fundraiser.forEach((value) => {
      blocksDefault[value] = gbx3Blocks[value];
    });

    const gbx3Template = {
      globals: {
        theme,
        gbxStyle: {
          ...defaultStyle[theme],
          //backgroundColor: primaryColor,
          backgroundImage: gbx3.imageURL,
          primaryColor
        }
      },
      blocks: {
        ...blocksDefault,
        media: {
          ...blocksDefault.media,
          content: {
            image: {
              size: 'medium',
              borderRadius: 5,
              URL: gbx3.imageURL
            },
            video: {
              URL: gbx3.videoURL,
              auto: false,
              validatedURL: gbx3.videoURL
            }
          },
          options: {
            ...blocksDefault.media.options,
            mediaType: gbx3.mediaType
          }
        }
      }
    }

    gbx3Data.giveboxSettings.customTemplate = {
      ...gbx3Template
    };

    if (org.themeColor) {
      gbx3Data.giveboxSettings.primaryColor = org.themeColor;
    };

    return gbx3Data;
  }
}

export function getSignupStep(value, phase = null) {
  return (dispatch, getState) => {
    const orgSignup = util.getValue(getState(), 'gbx3.orgSignup', {});
    const {
      signupPhase
    } = orgSignup;

    const stepsTodo = signupPhaseConfig[phase || signupPhase].stepsTodo;
    const step = isNaN(value) ? stepsTodo.findIndex(s => s.slug === value) : value;
    return step;
  }
}

export function setSignupStep(value, callback) {
  return async (dispatch, getState) => {
    const orgSignup = util.getValue(getState(), 'gbx3.orgSignup', {});
    const {
      signupPhase
    } = orgSignup;

    const stepsTodo = signupPhaseConfig[signupPhase].stepsTodo;
    const step = isNaN(value) ? stepsTodo.findIndex(s => s.slug === value) : value;
    const updated = await dispatch(updateOrgSignup({ step }));
    if (callback && updated) callback(step);
  }
}

export function updateOrgSignup(orgSignup = {}, phaseCompleted = null) {
  return {
    type: types.UPDATE_ORG_SIGNUP,
    orgSignup,
    phaseCompleted
  }
}

export function updateOrgSignupField(name, fields) {
  return {
    type: types.UPDATE_ORG_SIGNUP_FIELD,
    name,
    fields
  }
}

function getMinStepNotCompleted(array, haystack) {
  // Get the minimum not completed step
  const numOfSteps = array.length - 1;
  const uncompletedSteps = [];
  array.forEach((value, key) => {
    if (!haystack.completed.includes(value.slug)) {
      uncompletedSteps.push(key);
    }
  });
  const minStepNotCompleted = !util.isEmpty(uncompletedSteps) ? Math.min(...uncompletedSteps) : numOfSteps;
  return minStepNotCompleted;
}

export function loadOrgSignup(forceStep = null, openModal = true) {
  return async (dispatch, getState) => {
    const signupFromCookie = LZString.decompressFromUTF16(localStorage.getItem('signup'));
    const signupJSON = signupFromCookie ? JSON.parse(signupFromCookie) : {};
    const orgSignup = {
      ...util.getValue(getState(), 'gbx3.orgSignup', {}),
      ...signupJSON,
      signupPhase: 'signup'
    };
    orgSignup.step = forceStep || getMinStepNotCompleted(signupPhaseConfig.signup.stepsTodo, orgSignup);

    if (!orgSignup.completed.includes('welcome')) orgSignup.completed.push('welcome');

    const updated = await dispatch(updateOrgSignup(orgSignup));
    if (updated) {
      dispatch(setOrgStyle({
        backgroundColor: util.getValue(orgSignup, 'fields.org.themeColor')
      }));
      dispatch(setLoading(false));
      dispatch(updateInfo({ display: 'signup', originTemplate: 'signup' }));
      if (openModal) dispatch(toggleModal('orgSignupSteps', true));
    }
  }
}

export function checkSignupPhase(options = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const signupPhase = util.getValue(state, 'gbx3.orgSignup.signupPhase');
    const completedPhases = util.getValue(state, 'gbx3.orgSignup.completedPhases', []);
    const hasReceivedTransaction = util.getValue(state, 'resource.gbx3Org.data.hasReceivedTransaction');

    switch (signupPhase) {
      case 'postSignup': {
        dispatch(loadSignupPhase({
          phase: 'postSignup',
          modalName: 'orgPostSignupSteps',
          ...options
        }));
        break;
      }

      case 'manualConnect':
      case 'connectBank': {
        dispatch(loadSignupPhase({
          phase: signupPhase,
          modalName: 'orgConnectBankSteps',
          openAdmin: hasReceivedTransaction ? true : false,
          openModal: hasReceivedTransaction ? true : false,
          ...options
        }));
        break;
      }

      case 'transferMoney': {
        if (!completedPhases.includes('transferMoney')) {
          dispatch(loadSignupPhase({
            phase: signupPhase,
            modalName: 'orgTransferSteps',
            openAdmin: false,
            openModal: false,
            ...options
          }));
        }
        break;
      }

      // no default
    }
  }
}

export function loadSignupPhase(options = {}) {
  const opts = {
    phase: null,
    modalName: null,
    forceStep: null,
    openModal: true,
    openAdmin: true,
    ...options
  }

  if (!opts.phase || !opts.modalName) return console.error('No signup phase');

  return async (dispatch, getState) => {

    const orgSignup = util.getValue(getState(), 'gbx3.orgSignup', {});
    orgSignup.step = opts.forceStep || getMinStepNotCompleted(signupPhaseConfig[opts.phase].stepsTodo, orgSignup);

    if (!orgSignup.completed.includes('createSuccess')) orgSignup.completed.push('createSuccess');

    const updated = await dispatch(updateOrgSignup(orgSignup));
    if (updated) {
      if (opts.openAdmin) dispatch(updateAdmin({ open: true }));
      if (opts.openModal) dispatch(toggleModal(opts.modalName, true));
    }
  }
}

export function clearGBX3(keepOrgData) {
  return {
    type: types.CLEAR_GBX3,
    keepOrgData
  }
}

export function setPageSearch(page, search) {
  return {
    type: types.UPDATE_PAGE_SEARCH,
    page,
    search
  }
}

export function setPageState(page, newState) {
  return {
    type: types.UPDATE_PAGE_STATE,
    page,
    newState
  }
}

/**
* Page State Properties
*
* @param {object} newState Following props are available
*
* // newState props //
* @prop {array} list List of article items
* @prop {int} pageNumber
* @prop {object} search
* @prop {int} total Total number of article items
*/
export function updatePageState(newState = {}, callback) {
  return async (dispatch, getState) => {
    const pageSlug = util.getValue(getState(), 'gbx3.info.activePageSlug');
    const stateUpdated = await dispatch(setPageState(pageSlug, newState));
    if (stateUpdated && callback) {
      callback();
    }
  }
}

export function resetPageSearch() {
  return (dispatch) => {
    dispatch(updatePageState({ search: {} }, () => {
      dispatch(updatePageSearch({
        query: ''
      }));
    }));
  }
}

export function updatePageSearch(search, callback) {
  return async (dispatch, getState) => {
    const pageSlug = util.getValue(getState(), 'gbx3.info.activePageSlug');
    const stateUpdated = await dispatch(setPageSearch(pageSlug, search));
    if (stateUpdated && callback) {
      callback();
    }
  }
}

export function orgAddPage(duplicate = {}) {
  return {
    type: types.ADD_ORG_PAGE,
    duplicate
  }
}

export function orgDeletePage(slug) {
  return {
    type: types.DELETE_ORG_PAGE,
    slug
  }
}

export function updateOrgPages(orgPages = {}, orgUpdated = true) {
  return {
    type: types.UPDATE_ORG_PAGES,
    orgPages,
    orgUpdated
  }
}

export function updateOrgPage(slug, page) {
  return {
    type: types.UPDATE_ORG_PAGE,
    slug,
    page
  }
}

export function updateOrgPageSlug(slug, customSlug) {
  return {
    type: types.UPDATE_ORG_PAGE_SLUG,
    slug,
    customSlug
  }
}

export function updateOrgGlobals(orgGlobals = {}, orgUpdated = true) {
  return {
    type: types.UPDATE_ORG_GLOBALS,
    orgGlobals,
    orgUpdated
  }
}

export function updatePagesEnabled(pagesEnabled = []) {
  return {
    type: types.UPDATE_PAGES_ENABLED,
    pagesEnabled
  }
}

export function updateOrgGlobal(name, orgGlobal = {}) {
  return {
    type: types.UPDATE_ORG_GLOBAL,
    name,
    orgGlobal
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
        dispatch(updateAdmin({ allowLayoutSave: true, editBlock: `${blockType}-${blockName}`, editBlockJustAdded: true }));
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
    dispatch(updateAdmin({ allowLayoutSave: true }));
    dispatch(updateAvailableBlocks(blockType, availableBlocks));
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
    type: types.UPDATE_DATA,
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

export function setCartOnLoad(cartObj = {}) {
  return async (dispatch, getState) => {
    const cartFromCookie = LZString.decompressFromUTF16(localStorage.getItem('cart'));
    const cookieJSON = cartFromCookie ? JSON.parse(cartFromCookie) : {};
    const cartState = util.getValue(getState(), 'gbx3.cart', {});
    const cart = {
      ...cartState,
      ...cookieJSON,
      ...cartObj
    };
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

export function saveOrg(options = {}) {

  const opts = {
    data: {},
    orgID: null,
    isSending: false,
    callback: null,
    orgUpdated: false,
    showSaving: true,
    ...options
  };

  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const orgUpdated = opts.orgUpdated || util.getValue(gbx3, 'orgUpdated', false);
    const orgData = util.getValue(getState(), 'resource.gbx3Org.data', {});
    const customTemplate = util.getValue(orgData, 'customTemplate', {});
    const orgSignup = util.getValue(gbx3, 'orgSignup', {});
    const orgPages = util.getValue(gbx3, 'orgPages', {});
    const orgGlobals = util.getValue(gbx3, 'orgGlobals', {});
    const info = util.getValue(gbx3, 'info', {});
    const orgID = opts.orgID || util.getValue(info, 'orgID');

    const dataObj = {
      ...orgData,
      customTemplate: {
        ...customTemplate,
        orgSignup: {
          ...orgSignup
        },
        orgPages: {
          ...orgPages
        },
        orgGlobals: {
          ...orgGlobals
        }
      },
      ...opts.data
    };

    if (orgUpdated) {
      if (opts.showSaving) dispatch(updateGBX3('saveStatus', 'saving'));
      dispatch(sendResource('org', {
        orgID,
        data: dataObj,
        method: 'patch',
        callback: (res, err) => {
          if (opts.showSaving) dispatch(updateGBX3('saveStatus', 'done'));
          dispatch(updateGBX3('orgUpdated', false));
          if (opts.callback) opts.callback(res, err);
        },
        isSending: opts.isSending
      }));
    }
  }
}

export function saveCustomTemplate(resourceName, options = {}) {

  const opts = {
    ID: null,
    orgID: null,
    data: {},
    customTemplate: {},
    isSending: false,
    showSaving: true,
    callback: null,
    resourcesToLoad: [],
    ...options
  };

  return (dispatch, getState) => {
    const customTemplate = util.getValue(getState(), `resource.${resourceName}.data.giveboxSettings.customTemplate`, {});

    const dataObj = {
      ...opts.data,
      giveboxSettings: {
        customTemplate: {
          ...customTemplate,
          ...opts.customTemplate
        }
      }
    };

    if (!resourceName || util.isEmpty(customTemplate) || !opts.orgID || !opts.ID) {
      console.error('Cannot save, missing resourceName, customTemplate, orgID or ID');
    } else {
      if (opts.showSaving) dispatch(updateGBX3('saveStatus', 'saving'));
      dispatch(sendResource(resourceName, {
        orgID: opts.orgID,
        id: [opts.ID],
        data: dataObj,
        method: 'patch',
        callback: (res, err) => {
          if (opts.showSaving) dispatch(updateGBX3('saveStatus', 'done'));
          if (opts.callback) opts.callback(res, err);
        },
        isSending: opts.isSending,
        resourcesToLoad: opts.resourcesToLoad
      }));
    }
  }
}

export function saveGBX3(blockType, options = {}) {

  const opts = {
    kindID: null,
    data: {},
    isSending: false,
    callback: null,
    updateLayout: false,
    ...options
  };

  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const gbxData = util.getValue(gbx3, 'data', {});
    const settings = util.getValue(gbxData, 'giveboxSettings', {});
    const customTemplate = util.getValue(settings, 'customTemplate', {});
    const info = util.getValue(gbx3, 'info', {});
    const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
    const globals = util.getValue(gbx3, 'globals', {});
    const backgrounds = util.getValue(gbx3, 'backgrounds', []);
    const helperSteps = util.getValue(gbx3, 'helperSteps', {});
    const giveboxSettings = blockType === 'org' ?
      {
        customTemplate: {
          ...customTemplate,
          blocks,
          globals,
          backgrounds,
          helperSteps
        }
      }
    :
      {
        giveboxSettings: {
          ...settings,
          customTemplate: {
            ...customTemplate,
            blocks,
            globals,
            backgrounds,
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
          const imageLink = util.getValue(value, 'content.image.link');
          const imageURL = util.getValue(value, 'content.image.URL', util.getValue(articleData, `${util.getValue(value, 'field')}`));
          if (imageURL) receiptHTML = receiptHTML + `${imageLink ? `<a href="${imageLink}">` : ''}<p style="text-align:center"><img style="max-width:500px;" src="${util.imageUrlWithStyle(imageURL, util.getValue(value, 'content.image.size', util.getValue(value, 'options.image.size', 'medium')))}" alt="Media" /></p>${imageLink ? '</a>' : ''}`;
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

export function createFundraiser(createKind, callback, cloneData = {}, options = {}) {

  const opts = {
    showNewArticle: true,
    data: {},
    ...options
  };

  return (dispatch, getState) => {
    dispatch(setLoading(true));
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const info = util.getValue(gbx3, 'info', {});
    const admin = util.getValue(gbx3, 'admin', {});
    const kind = createKind || util.getValue(info, 'kind', 'fundraiser');
    const orgID = util.getValue(info, 'orgID');
    const resourceName = `org${types2.kind(kind).api.list}`;
    const templateData = !util.isEmpty(cloneData) ? cloneData : createData[kind];
    const data = {
      ...templateData,
      ...opts.data
    };
    data.volunteer = util.getValue(admin, 'isVolunteer', null);
    data.volunteerID = util.getValue(admin, 'volunteerID', null);
    dispatch(setLoading(false));
    dispatch(sendResource(resourceName, {
      orgID,
      data,
      callback: (res, err) => {
        if (!err && !util.isEmpty(res)) {
          if (opts.showNewArticle) {
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
        } else {
          if (callback) callback(res, err);
        }
      }
    }));
  }
}

function GBX3Loaded() {
  return {
    type: types.LOAD_GBX3
  }
}

export function loadGBX3(articleID, callback) {

  return async (dispatch, getState) => {

    dispatch(setLoading(true));
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const resource = util.getValue(getState(), 'resource', {});
    const access = util.getValue(resource, 'access', {});
    const globalsState = util.getValue(gbx3, 'globals', {});
    const orgData = util.getValue(getState(), 'resource.gbx3Org.data', {});
    const admin = util.getValue(gbx3, 'admin', {});
    const editFormOnly = util.getValue(admin, 'editFormOnly');
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
            dispatch(getResource('orgPublic', {
              customName: 'gbx3Org',
              id: [orgID],
              reload: true,
              callback: (res, err) => {
                if (!util.isEmpty(res) && !err) {
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

                  dispatch(setCartOnLoad({ passFees }));
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

                  if (editFormOnly) helperSteps.advancedBuilder = true;

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

                  helperSteps.step = minStepNotCompleted < 4 ? minStepNotCompleted : 5;

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
                    step: 'design',
                    open: editFormOnly ? false : true
                  };

                  if (util.getValue(hasAccessToEdit, 'isVolunteer')) {
                    admin.isVolunteer = true;
                    admin.volunteerID = volunteerID;
                  }

                  dispatch(updateLayouts(blockType, layouts));
                  dispatch(updateBlocks(blockType, blocks));
                  dispatch(updateGlobals(globals));
                  dispatch(updateHelperSteps(helperSteps));
                  dispatch(updateData(res));
                  dispatch(updateAvailableBlocks(blockType, availableBlocks));
                  dispatch(updateAdmin(admin));
                  dispatch(updateGBX3('browse', false));

                  // Get and Set Thank You Email Receipt
                  const receiptCustom = util.getValue(res, 'receiptConfig.blocks', {});
                  const receiptTemplateBlocks = util.getValue(blockTemplates, `receipt`, {});
                  const receiptDefault = {};
                  defaultBlocks.receipt.forEach((value) => {
                    if (!util.isEmpty(receiptCustom)) {
                      if (has(receiptCustom, value)) {
                        receiptDefault[value] = receiptTemplateBlocks[value];
                      }
                    } else {
                    receiptDefault[value] = receiptTemplateBlocks[value];
                    }
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
                  dispatch(updateAvailableBlocks('receipt', receiptAvailableBlocks));

                  dispatch(GBX3Loaded());
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

export function loadOrg(orgID, callback, hideLoading = false) {

  return async (dispatch, getState) => {

    if (!hideLoading) dispatch(setLoading(true));
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const resource = util.getValue(getState(), 'resource', {});
    const access = util.getValue(resource, 'access', {});
    const admin = util.getValue(gbx3, 'admin', {});
    const info = util.getValue(gbx3, 'info', {});
    const originTemplate = !util.getValue(info, 'originTemplate') ? 'org' : null;
    const blockType = 'org';
    const hasAccessToEdit = util.getAuthorizedAccess(access, orgID, null);
    const endpoint = hasAccessToEdit ? 'org' : 'orgPublic';

    dispatch(getResource(endpoint, {
      customName: 'gbx3Org',
      id: [orgID],
      reload: true,
      callback: (res, err) => {
        if (!util.isEmpty(res) && !err) {
          const orgID = util.getValue(res, 'ID');
          const orgName = util.getValue(res, 'name');
          const orgImage = util.getValue(res, 'imageURL');
          const customTemplate = util.getValue(res, 'customTemplate', {});
          const orgPages = {
            ...defaultOrgPages,
            ...util.getValue(customTemplate, 'orgPages', {})
          };
          const orgSignup = util.getValue(customTemplate, 'orgSignup', {});

          const orgGlobalsDefault = {
            ...defaultOrgGlobals,
            profilePicture: {
              ...defaultOrgGlobals.profilePicture,
              url: orgImage
            },
            title: {
              content: `<p style="text-align:center"><span style="font-weight:400;font-size:22px">${orgName}</span></p>`
            }
          };

          const orgGlobals = {
            ...orgGlobalsDefault,
            ...util.getValue(customTemplate, 'orgGlobals', {})
          };

          const pagesEnabled = util.getValue(orgGlobals, 'pagesEnabled', []);
          const queryPageSlug = util.getValue(info, 'queryParams.page');

          let activePageSlug = util.getValue(info, 'activePageSlug', util.getValue(pagesEnabled, 0, 'featured'));
          if (queryPageSlug) {
            const customSlugs = util.getValue(orgGlobals, 'customSlugs', []);
            let customSlugObj = customSlugs.find(s => s.customSlug === queryPageSlug);
            if (!customSlugObj) customSlugObj = customSlugs.find(s => s.slug === queryPageSlug);
            activePageSlug = util.getValue(customSlugObj, 'slug', activePageSlug);
          }

          dispatch(updateInfo({
            orgID,
            orgName,
            originTemplate,
            activePageSlug,
            display: 'org',
            orgImage: util.getValue(res, 'imageURL'),
            apiName: 'org'
          }));


          const admin = {
            hasAccessToEdit,
            editable: hasAccessToEdit ? true : false,
            step: 'design',
            open: false
          };

          dispatch(setCartOnLoad());
          dispatch(updateOrgPages(orgPages, false));
          dispatch(updateOrgGlobals(orgGlobals, false));
          dispatch(updateOrgSignup(orgSignup));
          dispatch(updateAdmin(admin));
          dispatch(updateInfo({ publishStatus: 'public' }));
        }
        callback(res, err);
        if (!hideLoading) dispatch(setLoading(false));
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

export function setOrgStyle(options = {}) {

  const opts = {
    primaryColor: null,
    textColor: null,
    backgroundColor: null,
    ...options
  };

  return (dispatch, getState) => {
    const globalStyles = util.getValue(getState(), 'gbx3.orgGlobals.globalStyles', {});
    const backgroundColor = opts.backgroundColor || util.getValue(globalStyles, 'backgroundColor');
    const primaryColor = opts.primaryColor || util.getValue(globalStyles, 'primaryColor');

    let styleInnerHTML = '';
    let backgroundColorInnerHTML = '';
    let primaryColorInnerHTML = '';

    backgroundColorInnerHTML = `
      .gbx3OrgContentHeader.gbx3OrgContentOuterContainer {
        background: linear-gradient(to bottom, ${backgroundColor} 0%, #ffffff 70%) !important;
      }
    `;

    primaryColorInnerHTML = `
      .gbx3OrgSubHeader .navigationContainer button.link.active {
        color: ${primaryColor} !important;
        border-bottom: 3px solid ${primaryColor} !important;
      }

      .gbx3OrgPages .gbx3OrgPagesSearch .input-bottom.active {
        background: ${primaryColor} !important;
      }
    `;

    if (backgroundColorInnerHTML) {
      styleInnerHTML = styleInnerHTML + backgroundColorInnerHTML;
    }

    if (primaryColorInnerHTML) {
      styleInnerHTML = styleInnerHTML + primaryColorInnerHTML;
    }

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

export function setResetOrg() {
  return {
    type: types.RESET_ORG
  }
}

export function resetOrg(callback) {
  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const info = util.getValue(gbx3, 'info', {});
    const data = {
      ...util.getValue(getState(), 'resource.gbx3Org.data', {}),
      customTemplate: {
        orgPages: null,
        orgGlobals: null,
        orgSignup: {
          ...util.getValue(gbx3, 'orgSignup', {})
        },
        blocks: {},
        globals: {},
        backgrounds: []
      }
    };

    const orgID = util.getValue(info, 'orgID');

    dispatch(setResetOrg());
    dispatch(sendResource(util.getValue(info, 'apiName'), {
      id: [orgID],
      orgID,
      data,
      method: 'patch',
      callback: (res, err) => {
        if (callback) callback();
        window.location.reload();
      },
      isSending: true
    }));
  }
}

export function resetGBX3(blockType = 'article') {
  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const info = util.getValue(gbx3, 'info', {});
    const data = {
      ...util.getValue(gbx3, 'data', {}),
      giveboxSettings: {
        customTemplate: {
          blocks: {},
          globals: {},
          backgrounds: []
        }
      }
    };

    const orgID = util.getValue(info, 'orgID');
    const kindID = util.getValue(info, 'kindID');

    dispatch(sendResource(util.getValue(info, 'apiName'), {
      id: [kindID],
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

export function resetGBX3Receipt() {
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
        dispatch(updateData(res));
        window.location.reload();
      },
      isSending: true
    }));
  }
}
