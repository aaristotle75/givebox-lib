const primaryColor = '#698df4';

export const defaultOrgGlobals = {
  globalStyles: {
    backgroundColor: primaryColor,
    primaryColor: primaryColor,
    textColor: '#000000'
  },
  pagesEnabled: [
    'featured',
    'fundraisers',
    'events'
  ],
  coverPhoto: {
    url: null,
    style: {}
  },
  profilePicture: {
    url: null,
    style: {}
  },
  title: {
    content: null
  },
  footer: {
    content: null
  }
};

export const defaultOrgPages = {
  featured: {
    name: 'Featured',
    slug: 'featured',
    kind: 'all',
    style: {},
    content: {}
  },
  fundraisers: {
    name: 'Donate',
    slug: 'fundraisers',
    kind: 'fundraiser',
    style: {},
    content: {}
  },
  events: {
    name: 'Events',
    slug: 'events',
    kind: 'event',
    style: {},
    content: {}
  },
  memberships: {
    name: 'Memberships',
    slug: 'memberships',
    kind: 'membership',
    style: {},
    content: {}
  },
  sweepstakes: {
    name: 'Sweepstakes',
    slug: 'sweepstakes',
    kind: 'sweepstake',
    style: {},
    content: {}
  }
};


export const defaultCart = {
  processing: false,
  open: false,
  zeroAmountAllowed: false,
  paymethod: 'creditcard',
  cardType: 'default',
  subTotal: 0,
  total: 0,
  fee: 0,
  passFees: false,
  acceptedTerms: true,
  items: [],
  customer: {},
  cardLength: 0
};

export const defaultConfirmation = {
  email: 'jane_smitht@test.com',
  firstname: 'Jane',
  lastname: 'Smith',
  paymethod: 'creditCard',
  bankName: 'US Bank',
  cardType: 'VISA',
  cartTotal: 100
}

export const defaultStyle = {
  gbxStyle: {
    maxWidth: 850,
    primaryColor: '#4385f5',
    bgColor: '',
    textColor: '#253655',
    pageColor: '#ffffff',
    pageRadius: 10,
    pageOpacity: 1,
    backgroundColor: '#4385f5',
    backgroundOpacity: .6,
    placeholderColor: ''
  },
  button: {
    embedAllowed: false,
    enabled: false,
    type: 'button',
    text: 'Button Example',
    style: {
      textColor: '#ffffff',
      bgColor: '#4385f5',
      fontSize: 16,
      borderRadius: 10,
      width: 200,
      align: 'flexCenter'
    }
  },
  embedButton: {
    autoPop: true,
    type: 'button',
    text: 'Button Text',
    textColor: '#ffffff',
    bgColor: '#4385f5',
    fontSize: 16,
    borderRadius: 10,
    textAlign: 'center',
    padding: '10px 20px;'
  }
}
