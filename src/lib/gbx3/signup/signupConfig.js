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
  title: 'Pick a Theme Color for Your Profile',
  desc: 'Choose a color that compliments your nonprofit logo and/or branding.'
};

const logo = {
  type: 'org',
  slug: 'orgLogo',
  name: 'Profile Pic',
  icon: 'upload-cloud',
  title: 'Upload an Image of Your Logo or a Profile Picture',
  desc: 'A nice logo or profile picture makes you easily identifiable to your supporters.'
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
  name: 'Add Image',
  icon: 'camera',
  title: 'Add an Image for Your Fundraiser',
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

const save = {
  type: 'save',
  slug: 'save',
  name: 'Finish',
  icon: 'save',
  title: 'Finish Your Profile',
  desc: 'You are almost done! Just click "Complete Profile" below.'
}

export const signupSteps = [
  welcome,
  orgName,
  mission,
  logo,
  themeColor,
  title,
  image,
  account,
  save
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
    lastName: '',
    password: ''
  },
  gbx3: {
    title: '',
    imageURL: null,
    videoURL: null,
    mediaType: 'image'
  }
};
