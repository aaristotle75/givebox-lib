import React from 'react';
import Icon from '../../common/Icon';
import { AiOutlineBank } from 'react-icons/ai';
import { MdBusiness, MdFingerprint } from 'react-icons/md';
import { FaConnectdevelop, FaMoneyCheck } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go'
import { RiExchangeFundsLine } from 'react-icons/ri';

const orgName = {
  type: 'org',
  slug: 'orgName',
  name: 'Start Here',
  title: 'Start Here',
  icon: 'star',
  desc: 'Welcome to Givebox! Start a fundraiser and raise money in a few short steps.'
};

const mission = {
  type: 'org',
  slug: 'mission',
  name: 'About Organization',
  icon: 'globe',
  title: 'About Organization',
  desc: 'Upload a logo and tell us about your organization.'
};

const title = {
  type: 'gbx3',
  slug: 'title',
  name: 'Fundraiser Details',
  icon: 'heart',
  title: 'Fundraiser Details',
  desc: 'Upload an image and write a title that will make your fundraiser shine!'
};

const themeColor = {
  type: 'org',
  slug: 'themeColor',
  name: 'Fundraiser Boosters',
  icon: 'sun',
  title: 'Fundraiser Boosters',
  desc: 'These are optional, but they really help increase donations!'
};

const account = {
  type: 'account',
  slug: 'account',
  name: 'Save Progress',
  icon: 'save',
  title: 'Save Progress',
  desc: `Create a FREE Givebox account to save your progress.`
}

const createSuccess = {
  type: 'org',
  slug: 'createSuccess',
  name: 'Account Created',
  title: 'Your Account was Successfully Created!',
  icon: 'award',
  desc: ''
};

const previewShare = {
  type: 'previewShare',
  slug: 'previewShare',
  name: 'Accept Donations',
  icon: 'check-circle',
  title: 'Accept Donations',
  desc: ''
}

const connectBank = {
  type: 'merchant',
  slug: 'connectBank',
  name: 'Connect Bank',
  title: 'Connect a Bank Account',
  customIcon: <Icon><AiOutlineBank /></Icon>,
  desc: ''
};


const addBank = {
  type: 'merchant',
  slug: 'addBank',
  name: 'Add Bank Account',
  title: 'Add a Bank Account',
  customIcon: <Icon><FaMoneyCheck /></Icon>,
  desc: ''
};

const principal = {
  type: 'merchant',
  slug: 'principal',
  name: 'Account Holder',
  title: `Account Holder's Information`,
  icon: 'user-check',
  desc: ''
};

const legalEntity = {
  type: 'merchant',
  slug: 'legalEntity',
  name: 'Organization Info',
  title: `Organization/Nonprofit Information`,
  customIcon: <Icon><MdBusiness /></Icon>,
  desc: ''
};

const address = {
  type: 'merchant',
  slug: 'address',
  name: 'Address',
  title: `Organization/Nonprofit Address`,
  customIcon: <Icon><GoLocation /></Icon>,
  //customIcon: <Icon><TiBusinessCard /></Icon>,
  desc: ''
};

const connectStatus = {
  type: 'merchant',
  slug: 'connectStatus',
  name: 'Bank Review',
  title: `Bank Account Review`,
  customIcon: <Icon><FaConnectdevelop /></Icon>,
  desc: ''
};

const identity = {
  type: 'merchant',
  slug: 'identity',
  name: 'Verify Identity',
  title: 'Verify Account Holder Identity',
  customIcon: <Icon><MdFingerprint /></Icon>,
  desc: ''
}

const verifyBank = {
  type: 'merchant',
  slug: 'verifyBank',
  name: 'Verify Bank',
  title: 'Verify Bank Account',
  customIcon: <Icon><AiOutlineBank /></Icon>,
  desc: 'We need to verify your bank account.'
}

const verifyBusiness = {
  type: 'merchant',
  slug: 'verifyBusiness',
  name: 'Verify Organization',
  title: 'Verify Your Organization',
  customIcon: <Icon><MdBusiness /></Icon>,
  desc: 'We need to verify your Organization.'
}

const verifyWeb = {
  type: 'merchant',
  slug: 'verifyWeb',
  name: 'Website Address',
  icon: 'at-sign',
  title: 'Organization/Nonprofit Website Address',
  desc: 'Add Your Website, Facebook, or Social Media URL (Link)'
};

const missionCountries = {
  type: 'merchant',
  slug: 'missionCountries',
  name: 'Countries Serviced',
  customIcon: <Icon><RiExchangeFundsLine /></Icon>,
  title: 'Countries Funds will be Used',
  desc: ''
};

const protect = {
  type: 'merchant',
  slug: 'protect',
  name: 'Protect Account',
  title: 'Protect Your Account',
  icon: 'lock',
  desc: 'Two Factor Authentication.'
}

const transferStatus = {
  type: 'merchant',
  slug: 'transferStatus',
  name: 'Secure Account Status',
  title: 'Secure Your Account Status',
  customIcon: <Icon><FaConnectdevelop /></Icon>,
  desc: ''
}

export const orgSignupFields = {
  org: {
    name: '',
    taxID: '',
    categoryID: null,
    mission: '',
    imageURL: null,
    defaultTheme: '',
    themeColor: '',
    coverPhotoURL: null
  },
  owner: {
    email: '',
    firstName: '',
    lastName: ''
  },
  gbx3: {
    title: '',
    imageURL: null,
    videoURL: null,
    mediaType: 'image'
  }
};

/** Signup Phases Goals */
// signup - Created an Account / Fundraiser
// postSignup - Previewed and Shared first fundraiser
// connectBank - Has merchantIdentiString (MID) assigned
// transferMoney - Underwriting Approved

export const signupPhase = {
  signup: {
    menuHeader: 'Start a Fundraiser',
    modalName: 'orgSignupSteps',
    showStepNumber: true,
    stepsTodo: [
     orgName,
     mission,
     title,
     themeColor,
     account,
     previewShare
   ],
   requiredSteps: [
     orgName,
     mission,
     title,
     themeColor
   ]
  },
  postSignup: {
    menuHeader: 'Raise Money',
    modalName: 'orgPostSignupSteps',
    showStepNumber: true,
    stepsTodo: [
      orgName,
      mission,
      title,
      themeColor,
      account,
      previewShare
   ],
  },
  connectBank: {
    menuHeader: 'Connect a Bank',
    modalName: 'orgConnectBankSteps',
    showStepNumber: true,
    customStepNumber: 'Required Step', // Signup Menu Only
    stepsTodo: [
      connectBank
    ]
  },
  manualConnect: {
    menuHeader: 'Connect a Bank',
    modalName: 'orgConnectBankSteps',
    showStepNumber: true,
    stepsTodo: [
      addBank,
      principal,
      legalEntity,
      address,
      connectStatus
    ]
  },
  transferMoney: {
    menuHeader: 'Verify Identity',
    modalName: 'orgTransferSteps',
    showStepNumber: true,
    stepsTodo: [
      identity,
      protect
    ],
    requiredSteps: [
      'identity',
      'protect'
    ]
  }
};

export const phases = [
  'signup',
  'postSignup',
  'connectBank',
  'transferMoney'
];
