import React from 'react';
import Icon from '../../common/Icon';
import { AiOutlineBank } from 'react-icons/ai';
import { MdBusiness } from 'react-icons/md';
import { FaConnectdevelop, FaMoneyCheck } from 'react-icons/fa';
import { TiBusinessCard } from 'react-icons/ti';


const orgName = {
  type: 'org',
  slug: 'orgName',
  name: 'Organization Details',
  title: 'Organization Details',
  icon: 'star',
  desc: 'Welcome to Givebox! Raise money in a few short steps.'
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
  name: 'Save Account',
  icon: 'user',
  title: 'Save Your Account',
  desc: `Please save your Givebox account to secure your Organization's profile and accept payments.`
}

const createSuccess = {
  type: 'org',
  slug: 'createSuccess',
  name: 'Account Created',
  title: 'Your Account was Successfully Created!',
  icon: 'award',
  desc: ''
};


const preview = {
  type: 'preview',
  slug: 'preview',
  name: 'Preview Fundraiser',
  icon: 'eye',
  title: 'Preview Your Fundraiser',
  desc: 'You are almost done! Just click "Share Your Fundraiser" below.'
}

const share = {
  type: 'share',
  slug: 'share',
  name: 'Ready to Share',
  icon: 'share',
  title: 'Share Your Fundraiser!',
  desc: 'Customize your share link, copy and paste into an email, and/or click a social media icon below to share your fundraising form and start raising money!'
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
  name: 'Add a Bank Account',
  title: 'Add a Bank Account',
  customIcon: <Icon><FaMoneyCheck /></Icon>,
  desc: ''
};

const principal = {
  type: 'merchant',
  slug: 'principal',
  name: 'Account Holder',
  title: `Primary Account Holder's Information`,
  icon: 'user-check',
  desc: ''
};

const legalEntity = {
  type: 'merchant',
  slug: 'legalEntity',
  name: 'Business Info',
  title: `Information About Your Nonprofit/Business`,
  customIcon: <Icon><MdBusiness /></Icon>,
  desc: ''
};

const address = {
  type: 'merchant',
  slug: 'address',
  name: 'Address',
  title: `Nonprofit/Business Address`,
  customIcon: <Icon><MdBusiness /></Icon>,
  //customIcon: <Icon><TiBusinessCard /></Icon>,
  desc: ''
};

const connectStatus = {
  type: 'merchant',
  slug: 'connectStatus',
  name: 'Connect Status',
  title: `Your Bank Account Connect Status`,
  customIcon: <Icon><FaConnectdevelop /></Icon>,
  desc: ''
};

const identity = {
  type: 'merchant',
  slug: 'identity',
  name: 'Verify Identity',
  title: 'Verify Account Holder Identity',
  customIcon: <Icon><TiBusinessCard /></Icon>,
  desc: ''
}

const verifyBank = {
  type: 'merchant',
  slug: 'verifyBank',
  name: 'Verify Bank',
  title: 'Verify Your Bank Account',
  customIcon: <Icon><AiOutlineBank /></Icon>,
  desc: 'We need to verify your bank account.'
}

const verifyBusiness = {
  type: 'merchant',
  slug: 'verifyBusiness',
  name: 'Verify Business',
  title: 'Verify Your Business',
  customIcon: <Icon><MdBusiness /></Icon>,
  desc: 'We need to verify your Business.'
}

const verifyWeb = {
  type: 'merchant',
  slug: 'verifyWeb',
  name: 'Website Address',
  icon: 'at-sign',
  title: 'Business/Nonprofit Website Address',
  desc: ''
};

const missionCountries = {
  type: 'merchant',
  slug: 'missionCountries',
  name: 'Countries Serviced',
  icon: 'map-pin',
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
  name: 'Approval Status',
  title: 'Approval Status',
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
    defaultTheme: 'dark',
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
    menuHeader: 'Create Fundraiser Steps',
    modalName: 'orgSignupSteps',
    showStepNumber: true,
    stepsTodo: [
     orgName,
     mission,
     title,
     themeColor,
     account
   ],
   requiredSteps: [
     orgName,
     mission,
     title,
     themeColor
   ]
  },
  postSignup: {
    menuHeader: 'Raise Money Steps',
    modalName: 'orgPostSignupSteps',
    showStepNumber: true,
    stepsTodo: [
      createSuccess,
      preview,
      share
   ],
  },
  connectBank: {
    menuHeader: 'Connect Bank Steps',
    modalName: 'orgConnectBankSteps',
    showStepNumber: true,
    stepsTodo: [
      connectBank,
      connectStatus
    ]
  },
  manualConnect: {
    menuHeader: 'Add Bank Steps',
    modalName: 'orgConnectBankSteps',
    showStepNumber: true,
    stepsTodo: [
      addBank,
      principal,
      address,
      connectStatus
    ]
  },
  transferMoney: {
    menuHeader: 'Transfer Money Steps',
    modalName: 'orgTransferSteps',
    showStepNumber: true,
    stepsTodo: [
      identity,
      verifyBank,
      verifyBusiness,
      verifyWeb,
      missionCountries,
      protect,
      transferStatus
    ],
    requiredSteps: [
      'identity',
      'verifyBank',
      'verifyBusiness',
      'verifyWeb',
      'missionCountries',
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
