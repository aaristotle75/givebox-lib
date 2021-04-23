import  * as types  from './merchantActionTypes';
import * as util from '../../common/utility';

/**
* See merchantActions.js for details
*/
export function merchantApp(state = {
  loading: false,
  org: {
    hasBeenUpdated: false,
    websiteURL: ''
  },
  legalEntity: {
    hasBeenUpdated: false,
    ID: null,
    name: '',
    type: 'tax_exempt_organization',
    ownershipType: 'public',
    taxID: '',
    annualCreditCardSalesVolume: null,
    hasAcceptedCreditCards: true,
    yearsInBusiness: null,
    contactPhone: ''
  },
  principal: {
    hasBeenUpdated: false,
    ID: null,
    title: 'Manager',
    firstName: '',
    lastName: '',
    emailAddress: '',
    SSN: '',
    contactPhone: '',
    dateOfBirth: null,
    driversLicenseUploaded: null,
    stakePercent: 100,
    metaData: null
  },
  address: {
    hasBeenUpdated: false,
    ID: null,
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  },
  bankAccount: {
    hasBeenUpdated: false,
    ID: null,
    name: '',
    number: null,
    last4: '',
    routingNumber: '',
    kind: 'deposit',
    accountType: 'checking',
    bankName: '',
    status: '',
    voidCheck: null,
    notes: '',
    metaData: null
  },
  plaid: {
    hasBeenUpdated: false,
    accountID: null,
    authMeta: null,
    identityMeta: null
  }
}, action) {
  switch (action.type) {
    case types.UPDATE_MERCHANT_APP:
      return Object.assign({}, state, {
        ...state,
        [action.name]: {
          ...state[action.name],
          ...action.obj
        }
      });
    case types.SET_MERCHANT_APP_LOADING:
      return Object.assign({}, state, {
        ...state,
        loading: action.loading
      });
    default:
      return state
  }
}

export function merchantVitals(state = {
  isActive: true,
  isInstantEnabled: true,
  instantPhase: null,
  instantPhaseEndsAt: null,
  hasMerchantInfo: false,
  legalEntityID: null,
  legalEntityStatus: null,
  legalEntityNotes: '',
  requireSSN: false,
  hasMID: false,
  hasBankInfo: false,
  hasReceivedTransaction: false,
  isUnderwritingApproved: false,
  canProcess: false,
  canTransfer: false
}, action) {
  switch (action.type) {
    case types.SET_MERCHANT_VITALS:
      return Object.assign({}, state, {
        ...state,
        ...action.vitals
      });
    default:
      return state
  }
}
