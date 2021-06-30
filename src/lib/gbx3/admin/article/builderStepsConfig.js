const title = {
  slug: 'title',
  name: 'Fundraiser Details',
  icon: 'heart'
};

const logo = {
  slug: 'logo',
  name: 'Upload Logo',
  icon: 'upload-cloud'
};

const image = {
  slug: 'image',
  name: 'Add Image/Video',
  icon: 'camera'
};

const preview = {
  slug: 'preview',
  name: 'Preview',
  icon: 'eye'
};

const previewShare = {
  slug: 'previewShare',
  name: 'Preview & Share',
  icon: 'eye'
};

const share = {
  slug: 'share',
  name: 'Ready to Share',
  icon: 'share'
};

const amounts = {
  slug: 'amounts',
  name: 'Add Amounts'
};

const eventTickets = {
  slug: 'eventTickets',
  name: 'Add Event Tickets'
};

const where = {
  slug: 'where',
  name: 'Where is Event'
};

const when = {
  slug: 'when',
  name: 'When is Event'
};

const sweepstakesTickets = {
  slug: 'sweepstakesTickets',
  name: 'Add Sweepstakes Tickets'
};

const sweepstakesEnds = {
  slug: 'sweepstakesEnds',
  name: 'Sweepstakes Ends At'
};

const membershipSubscriptions = {
  slug: 'membershipSubscriptions',
  name: 'Add Subscriptions'
};

const themeColor = {
  slug: 'themeColor',
  name: 'Fundraiser Boosters',
  icon: 'sun'
};

const defaultSteps = [
  title,
  themeColor,
  previewShare
];

const fundraiser = [
  ...defaultSteps
];

const invoice = [
  ...defaultSteps
];

const event = [
  title,
  logo,
  image,
  themeColor,
  eventTickets,
  when,
  where,
  preview,
  share
];

const sweepstakes = [
  title,
  logo,
  image,
  themeColor,
  sweepstakesTickets,
  sweepstakesEnds,
  preview,
  share
];

const membership = [
  title,
  logo,
  image,
  themeColor,
  membershipSubscriptions,
  preview,
  share
];

export const builderStepsConfig = {
  fundraiser,
  invoice,
  event,
  sweepstakes,
  membership
};
