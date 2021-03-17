import { defaultArticleTitles } from '../../../common/types';

const primaryColor = '#4775f8';

const dataTemplate = {
  'description': '',
  'summary': '',
  'videoURL': '',
  'isEcard': null,
  'volunteer': null,
  'volunteerID': null,
  'receiptDescription': null,
  'recipientMessage': null,
  'receiptHTML': null,
  'receiptConfig': null,
  'SEOKeywords': null,
  'imageURL': null,
  'goal': null,
  'passFees': true,
  'giveboxSettings': {
    'template': 'default',
    'feeOption': true,
    'videoAutoplay': false,
    'allowSelection': false,
    'primaryColor': primaryColor,
    'addressInfo': 0,
    'phoneInfo': 0,
    'workInfo': 0,
    'customData': null,
    'customTemplate': null
  },
}

const fundraiser = {
  ...dataTemplate,
  title: defaultArticleTitles.fundraiser,
  amountIndexDefault: 0,
  amountIndexCustom: 0,
  amounts: {
    list: [{
      enabled: true,
      orderBy: 0
    }]
  }
};

const invoice = {
  ...fundraiser,
  title: defaultArticleTitles.invoice
};

const event = {
  ...dataTemplate,
  title: defaultArticleTitles.event,
  status: 'open',
  maxQuantity: 10,
  maxTickets: null,
  soldTickets: null,
  numAvailableTickets: null,
  when: null,
  whenShowTime: false,
  endsAt: null,
  endsAtShowTime: false,
  where: {
    address: null,
    city: null,
    state: null,
    zip: null,
    country: null,
    coordinates: {
      lat: null,
      long: null
    }
  },
  tickets: {
    list: [{
      enabled: true,
      max: 100,
      orderBy: 0
    }]
  }
};

const membership = {
  ...dataTemplate,
  title: defaultArticleTitles.membership,
  status: 'open',
  maxQuantity: 10,
  recurringIntervals: [
    'once',
    'monthly',
    'annually'
  ],
  recurringDefaultInterval: 'once',
  subscriptions: {
    list: [{
      enabled: true,
      max: 100,
      orderBy: 0
    }]
  }
};

const sweepstake = {
  ...dataTemplate,
  title: defaultArticleTitles.sweepstake,
  status: 'open',
  maxQuantity: 10,
  endsAt: null,
  goal: null,
  allowPerTicketWinner: true,
  tickets: {
    list: [{
      enabled: true,
      entries: 1,
      orderBy: 0
    }]
  }
};

export const createData = {
  fundraiser,
  invoice,
  event,
  membership,
  sweepstake
};
