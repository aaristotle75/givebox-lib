import React from 'react';
import Icon from '../../../common/Icon';
import { HiOutlineTicket } from 'react-icons/hi';
import { MdCardMembership } from 'react-icons/md';

const title = {
  slug: 'title',
  name: 'Fundraiser Details',
  icon: 'heart',
  desc: 'Upload an image and write a title that will make your fundraiser shine.'
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
  name: 'Add Amounts',
  icon: 'list'
};

const tickets = {
  slug: 'tickets',
  name: 'Event Tickets',
  customIcon: <Icon><HiOutlineTicket /></Icon>,
  desc: 'Add event ticket amounts and the number available for sale.'
};

const where = {
  slug: 'where',
  name: 'Where is Event',
  icon: 'map-pin',
  desc: 'This is optional, add the location of the event.'
};

const when = {
  slug: 'when',
  name: 'When is Event',
  icon: 'calendar',
  desc: 'This is optional, add a date and time for the event.'
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
  icon: 'sun',
  desc: 'These are optional, but they really help increase donations.'
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
  {
    ...title,
    name: 'Invoice Details',
    desc: 'Upload an image and write a title that will make your invoice shine.'
  },
  {
    ...themeColor,
    name: 'Invoice Boosters',
    desc: 'These are optional, but they really help increase invoice conversions.'
  },
  previewShare
];

const event = [
  {
    ...title,
    name: 'Event Details',
    desc: 'Upload an image and write a title that will make your event shine.'
  },
  tickets,
  when,
  where,
  {
    ...themeColor,
    name: 'Event Boosters',
    desc: 'These are optional, but they really help increase ticket sales.'
  },
  previewShare
];

const sweepstake = [
  {
    ...title,
    name: 'Sweepstakes Details',
    desc: 'Upload an image and write a title that will make your sweepstakes shine.'
  },
  {
    ...tickets,
    name: 'Sweepstakes Tickets',
    desc: 'Add sweepstakes ticket amounts and the number of entries per ticket.'
  },
  sweepstakesEnds,
  {
    ...themeColor,
    name: 'Sweepstakes Boosters',
    desc: 'These are optional, but they really help increase ticket sales.'
  },
  previewShare
];

const membership = [
  {
    ...title,
    name: 'Membership Details',
    desc: 'Upload an image and write a title that will make your membership shine.'
  },
  {
    ...tickets,
    name: 'Membership Subscriptions',
    desc: 'Add membership subscription amounts and the number of subscriptions for sale.',
    customIcon: <Icon><MdCardMembership /></Icon>
  },
  {
    ...themeColor,
    name: 'Membership Boosters',
    desc: 'These are optional, but they really help increase subscription sales.'
  },
  previewShare
];

export const builderStepsConfig = {
  fundraiser,
  invoice,
  event,
  sweepstake,
  membership
};
