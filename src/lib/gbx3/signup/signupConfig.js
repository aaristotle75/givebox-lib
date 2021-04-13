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
  name: 'Create Account',
  icon: 'user',
  title: 'Create Your Account',
  desc: `Please create a Givebox account to secure your Organization's profile and accept payments.`
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
  title: 'Preview Fundraiser',
  desc: 'You are almost done! Just click "Share Your Fundraiser" below.'
}

const share = {
  type: 'share',
  slug: 'share',
  name: 'Ready to Share',
  icon: 'share',
  title: 'Ready to Share!',
  desc: 'You are almost done! Just click "Share Your Fundraiser" below.'
}

export const signupSteps = [
  welcome,
  orgName,
  mission,
  logo,
  themeColor,
  title,
  image,
  account
];

export const postSignupSteps = [
  createSuccess,
  preview,
  share
];

export const requiredStepsToCreateAccount = [
  orgName,
  //mission,
  //logo,
  title,
  //image
];

export const orgSignupFields = {
  org: {
    name: '',
    taxID: '',
    categoryID: null,
    mission: '',
    imageURL: null,
    themeColor: '',
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
