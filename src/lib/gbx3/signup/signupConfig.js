import React from 'react';
import Icon from '../../common/Icon';
import { AiOutlineBank } from 'react-icons/ai';
import { TiBusinessCard } from 'react-icons/ti';
import { MdBusiness } from 'react-icons/md';

const welcome = {
  type: 'org',
  slug: 'welcome',
  name: 'Welcome',
  title: 'Welcome to Givebox!',
  icon: 'heart',
  desc: ''
};

const orgName = {
  type: 'org',
  slug: 'orgName',
  name: 'Organization Name',
  title: 'What is the Name and Tax ID of Your Organization',
  icon: 'star',
  desc: ''
};

const mission = {
  type: 'org',
  slug: 'mission',
  name: 'Your Mission',
  icon: 'globe',
  title: 'Tell Us About Your Organization',
  desc: 'Add a short description of what your organization does and/or your mission to the world.'
};

const themeColor = {
  type: 'org',
  slug: 'themeColor',
  name: 'Theme Color',
  icon: 'sun',
  title: 'Pick a Theme Color',
  desc: 'Choose a color that compliments your Organization logo and/or branding.'
};

const logo = {
  type: 'org',
  slug: 'logo',
  name: 'Upload Logo',
  icon: 'upload-cloud',
  title: 'Upload an Image of Your Logo',
  desc: 'A nice logo makes you easily identifiable to your supporters.'
};

const title = {
  type: 'gbx3',
  slug: 'title',
  name: 'Fundraiser Title',
  icon: 'message-circle',
  title: 'Title of Your First Givebox Fundraiser',
  desc: 'Please enter a captivating title below to let your supporters know what you are raising money for.'
};

const image = {
  type: 'gbx3',
  slug: 'image',
  name: 'Add Image/Video',
  icon: 'camera',
  title: 'Add an Image or Video for Your Fundraiser',
  desc: 'A picture speaks a thousand words. Upload an image that inspires people to support your fundraiser.'
}

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

const addBank = {
  type: 'merchant',
  slug: 'addBank',
  name: 'Add a Bank Account',
  title: 'Add a Bank Account',
  customIcon: <Icon><AiOutlineBank /></Icon>,
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
  title: `Business Information About Your Organization`,
  customIcon: <Icon><TiBusinessCard /></Icon>,
  desc: ''
};

const address = {
  type: 'merchant',
  slug: 'address',
  name: 'Address',
  title: `Business Address`,
  customIcon: <Icon><MdBusiness /></Icon>,
  desc: ''
};

export const orgSignupFields = {
  org: {
    name: '',
    taxID: '',
    categoryID: null,
    mission: '',
    imageURL: null,
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
     welcome,
     orgName,
     mission,
     logo,
     themeColor,
     title,
     image,
     account
   ],
   requiredSteps: [
     orgName,
     mission,
     logo,
     title,
     image
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
      addBank,
      principal,
      legalEntity,
      address
    ]
  },
  transferMoney: {
    menuHeader: 'Transfer Money Steps'
  }
};

export const phases = [
  'signup',
  'postSignup',
  'connectBank',
  'transferMoney'
];
