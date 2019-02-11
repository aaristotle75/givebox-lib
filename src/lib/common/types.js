import React from 'react';

export const mime = {
  image: 'image/jpeg, image/gif, image/png, image/bmp, image/tiff, image/x-icon',
  video: 'video/ogg, video/webm, video/mp4, video/mpeg, video/quicktime',
  text: 'text/plain, text/csv, text/tab-separated-values, text/richtext, text/css',
  applications: 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.apple.keynote, application/vnd.apple.numbers, application/vnd.apple.pages, application/vnd.oasis.opendocument.text, application/rtf, application/vnd.ms-excel'
}

export function kinds() {
  const kinds = [
    'fundraiser',
    'event',
    'invoice',
    'membership',
    'sweepstake'
  ];
  return kinds;
}


export function kind(kind) {
  const obj = {};
  switch (kind) {
    case 'events':
    case 'event': {
      obj.name = 'Event';
      obj.namePlural = 'Events';
      obj.amountLabel = 'Tickets';
      obj.btnName = obj.name;
      obj.cta = 'Buy Tickets';
      obj.txName = 'Ticket purchase';
      obj.kind = 'event';
      obj.kindPlural = 'events';
      obj.header = 'Events';
      obj.api = {
        item: 'Event',
        list: 'Events'
      };
      obj.icon = 'calendar';
      obj.desc = <span className='typesDesc'>An all-in-one tool to help you organize and plan every detail of your nonprofit <span className='typeDescBold'>Events</span>. From golf toournaments to fundraisers.</span>;
      break;
    }

    case 'fundraisers':
    case 'fundraiser': {
      obj.name = 'Donation Form';
      obj.namePlural = 'Donation Forms';
      obj.amountLabel = 'Donation Amounts';
      obj.btnName = 'Donate';
      obj.cta = 'Donate Now';
      obj.txName = 'Made donation';
      obj.kind = 'fundraiser';
      obj.kindPlural = 'fundraisers';
      obj.header = 'Donation Forms';
      obj.api = {
        item: 'Fundraiser',
        list: 'Fundraisers'
      };
      obj.icon = 'box';
      obj.desc = <span className='typesDesc'>The most successful fundraising tool can be your <span className='typeDescBold'>Donation Forms</span> collecting money directly from your website or Facebook profile.</span>;
      break;
    }

    case 'invoices':
    case 'invoice': {
      obj.name = 'Invoice';
      obj.namePlural = 'Invoices';
      obj.amountLabel = 'Invoice Amounts';
      obj.btnName = obj.name;
      obj.cta = 'Pay Invoice';
      obj.txName = 'Paid invoice';
      obj.kind = 'invoice';
      obj.kindPlural = 'invoices';
      obj.header = 'Invoices';
      obj.api = {
        item: 'Invoice',
        list: 'Invoices'
      };
      obj.icon = 'briefcase';
      obj.desc = <span className='typesDesc'>Create customized, professional <span className='typeDescBold'>Invoices</span> in a few clicks and send to vendors and large donors through email.</span>;
      break;
    }

    case 'memberships':
    case 'membership': {
      obj.name = 'Membership';
      obj.namePlural = 'Memberships';
      obj.amountLabel = 'Membership Amounts';
      obj.btnName = obj.name;
      obj.cta = 'Purchase Membership';
      obj.txName = 'Membership purchase';
      obj.kind = 'membership';
      obj.kindPlural = 'memberships';
      obj.header = 'Memberships';
      obj.api = {
        item: 'Membership',
        list: 'Memberships'
      };
      obj.icon = 'clipboard';
      obj.desc = <span className='typesDesc'>Engage, grow, track and measure your nonprofit organizations and associations <span className='typeDescBold'>Memberships</span> in a few simple steps.</span>;
      break;
    }

    case 'sweepstakes':
    case 'sweepstake': {
      obj.name = 'Sweepstakes';
      obj.namePlural = 'Sweepstakes';
      obj.amountLabel = 'Tickets';
      obj.btnName = obj.name;
      obj.cta = 'Enter Sweepstakes';
      obj.txName = 'Sweepstake entry';
      obj.kind = 'sweepstake';
      obj.kindPlural = 'sweepstakes';
      obj.header = 'Sweepstakes';
      obj.api = {
        item: 'Sweepstake',
        list: 'Sweepstakes'
      };
      obj.icon = 'gift';
      obj.desc = <span className='typesDesc'>Creating a <span className='typeDescBold'>Sweepstakes</span> campaign offers a fun, engaging way for you to boost fundraising and gather information on your donors.</span>;
      break;
    }

    default:
      obj.name = 'All Money Sources';
      obj.namePlural = 'All Money Sources';
      obj.btnName = obj.name;
      obj.cta = 'Purchase';
      obj.txName = 'Purchase';
      obj.kind = '';
      obj.kindPlural = 'all';
      obj.header = 'Money Sources';
      obj.api = {
        item: 'Article',
        list: 'Articles'
      };
      obj.icon = 'globe';
      obj.desc = '';
      break;
  }
  return obj;
}

export function source(source) {
  let str;
  switch (source) {
    case 'web':
    case 'embed': {
      str = 'Website';
      break;
    }

    case 'swipe': {
      str = 'In-Person';
      break;
    }

    case 'app': {
      str = 'Mobile App';
      break;
    }

    // no default
  }
  return str;
}

export function txAccount(txAccount) {
  let str;
  switch (txAccount) {
    case 'donation': {
      str = 'Charitable Donation';
      break;
    }

    case 'commerce': {
      str = 'Sales Transaction';
      break;
    }

    // no default
  }
  return str;
}

export const accountType = (type) => {
  switch (type) {
    case 'deposit': {
      return 'Withdrawal';
    }
    case 'payee': {
      return 'Payee';
    }

    // no default
  }
}
