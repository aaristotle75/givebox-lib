import  * as types  from './merchantActionTypes';
import * as util from '../../common/utility';

/**
* See merchantActions.js for details
*/
export function merchantApp(state = {
  org: {
    websiteURL: ''
  },
  legalEntity: {
    created: false,
    name: '',
    type: 'tax_exempt_organization',
    ownershipType: 'public',
    taxID: '',
    annualCreditCardSalesVolume: '',
    hasAcceptedCreditCards: true,
    yearsInBusiness: '',
    contactPhone: ''
  },
  principal: {
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
    ID: null,
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  },
  bankAccount: {
    name: '',
    number: '',
    routingNumber: '',
    kind: 'deposit',
    accountType: 'checking',
    bankName: '',
    voidCheck: null,
    notes: '',
    metaData: null
  },
  plaid: null
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
