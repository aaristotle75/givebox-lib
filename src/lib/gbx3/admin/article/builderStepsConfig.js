const title = {
  slug: 'title',
  name: 'Enter Title',
  icon: 'message-circle'
};

const logo = {
  slug: 'logo',
  name: 'Upload Logo',
  icon: 'upload-cloud'
};

const image = {
  slug: 'image',
  name: 'Add Image',
  icon: 'camera'
};

const preview = {
  slug: 'preview',
  name: 'Preview Form',
  icon: 'eye'
};

const share = {
  slug: 'share',
  name: 'Share',
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
  name: 'Theme Color',
  icon: 'sun'
};

const defaultSteps = [
  title,
  logo,
  image,
  themeColor,
  preview,
  share
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
