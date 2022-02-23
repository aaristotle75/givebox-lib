import React from 'react';

export function bankStatus(status, voidCheck) {
  const obj = {};
  switch(status) {
    case 'approved': {
      obj.name = 'Approved';
      obj.color = 'green';
      break;
    }

    case 'declined': {
      obj.name = voidCheck ? 'Declined' : 'Please Upload Another Bank Statement';
      obj.color = voidCheck ? 'red' : 'orange';
      break;
    }

    case 'pending':
    default: {
      obj.name = voidCheck ? 'Bank Account Under Review' : 'Upload Bank Statement';
      obj.color = voidCheck ? 'green' : 'orange';
      break;
    }
  }
  return obj;
}

export const imageTypes = [
  'jpg',
  'jpeg',
  'gif',
  'bmp',
  'png'
];

export const allMimes = {
  image: 'image/jpeg, image/gif, image/png, image/bmp, image/tiff, image/x-icon',
  video: 'video/ogg, video/webm, video/mp4, video/mpeg, video/quicktime',
  text: 'text/plain, text/csv, text/tab-separated-values, text/richtext, text/css, .csv',
  applications: 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.apple.keynote, application/vnd.apple.numbers, application/vnd.apple.pages, application/vnd.oasis.opendocument.text, application/rtf, application/vnd.ms-excel'
}

export const mime = {
  image: 'image/jpeg, image/gif, image/png',
  video: 'video/ogg, video/webm, video/mp4, video/mpeg, video/quicktime',
  text: 'text/plain, text/csv, text/tab-separated-values, .csv',
  applications: 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.apple.keynote, application/vnd.apple.numbers, application/vnd.apple.pages, application/vnd.oasis.opendocument.text, application/rtf, application/vnd.ms-excel'
}

export const mimeReadable = {
  image: 'PNG, JPG, GIF',
  video: 'MPEG, MP4, OGG, WEBM, QUICKTIME',
  text: 'TXT, CSV',
  applications: 'PDF, MSWORD, VMD, MSEXCEL, PAGES, NUMBERS, KEYNOTE'
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

export function kindOptions(all = true, allName = 'All Payment Forms') {
  const options = [];
  if (all) options.push({ primaryText: allName, value: 'all' });
  kinds().forEach((key) => {
    options.push(
      { primaryText: kind(key).namePlural, value: key }
    );
  });
  return options;
}


export function kind(kind, allName = 'All Money Sources') {
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
      obj.txLabel = 'Ticket Sales';
      obj.txType = 'purchase';
      obj.kind = 'event';
      obj.kindPlural = 'events';
      obj.header = 'Events';
      obj.defaultTag = 'Event';
      obj.amountField = 'tickets';
      obj.amountDesc = 'Ticket';
      obj.api = {
        item: 'Event',
        list: 'Events',
        amount: 'orgEventTicket',
        publish: 'orgEventPublish'
      };
      obj.icon = 'calendar';
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
      obj.txLabel = 'Donations';
      obj.txType = 'donation';
      obj.kind = 'fundraiser';
      obj.kindPlural = 'fundraisers';
      obj.header = 'Donation Forms';
      obj.defaultTag = 'Donate';
      obj.amountField = 'amounts';
      obj.amountDesc = 'Amount';
      obj.api = {
        item: 'Fundraiser',
        list: 'Fundraisers',
        amount: 'orgFundraiserAmount',
        publish: 'orgFundraiserPublish'
      };
      obj.icon = 'heart';
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
      obj.txLabel = 'Invoice Payments';
      obj.txType = 'payment';
      obj.kind = 'invoice';
      obj.kindPlural = 'invoices';
      obj.header = 'Invoices';
      obj.defaultTag = 'Invoice';
      obj.amountField = 'amounts';
      obj.amountDesc = 'Amount';
      obj.api = {
        item: 'Invoice',
        list: 'Invoices',
        amount: 'orgInvoiceAmount',
        publish: 'orgInvoicePublish'
      };
      obj.icon = 'briefcase';
      break;
    }

    case 'memberships':
    case 'membership': {
      obj.name = 'Membership';
      obj.namePlural = 'Memberships';
      obj.amountLabel = 'Subscriptions';
      obj.btnName = obj.name;
      obj.cta = 'Purchase Membership';
      obj.txName = 'Membership purchase';
      obj.txLabel = 'Memberships';
      obj.txType = 'subscription';
      obj.kind = 'membership';
      obj.kindPlural = 'memberships';
      obj.header = 'Memberships';
      obj.defaultTag = 'Membership';
      obj.amountField = 'subscriptions';
      obj.amountDesc = 'Subscription';
      obj.api = {
        item: 'Membership',
        list: 'Memberships',
        amount: 'orgMembershipSubscription',
        publish: 'orgMembershipPublish'
      };
      obj.icon = 'clipboard';
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
      obj.txLabel = 'Sweepstake Entries';
      obj.txType = 'purchase';
      obj.kind = 'sweepstake';
      obj.kindPlural = 'sweepstakes';
      obj.header = 'Sweepstakes';
      obj.defaultTag = 'Sweepstakes';
      obj.amountField = 'tickets';
      obj.amountDesc = 'Ticket';
      obj.api = {
        item: 'Sweepstake',
        list: 'Sweepstakes',
        amount: 'orgSweepstakeTicket',
        publish: 'orgSweepstakePublish'
      };
      obj.icon = 'gift';
      break;
    }

    default:
      obj.name = allName;
      obj.namePlural = allName;
      obj.btnName = obj.name;
      obj.cta = 'Purchase';
      obj.txName = 'Purchase';
      obj.kind = '';
      obj.kindPlural = 'all';
      obj.header = 'Money Sources';
      obj.defaultTag = 'Featured';
      obj.api = {
        item: 'Article',
        list: 'Articles'
      };
      obj.icon = 'globe';
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
      str = 'Givebox Swipe App';
      break;
    }

    case 'app': {
      str = 'Givebox Donor App';
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

export const socialIcons = (type, size = 50) => {
  return <img style={{ height: size, width: size }} src={`https://cdn.givebox.com/givebox/public/images/social-${type}.png`} alt={`${type}`} />;
}


export const fontSizeOptions = (r1, r2) => {
  const items = [];
  for (let i = r1; i <= r2; i++) {
    if (i % 2 === 0) {
      items.push(
        {
          primaryText: `${i}px`,
          secondaryText: <span style={{ fontSize: i }}>Example Font Size</span>,
          value: i
        }
      );
    }
  }
  return items;
}

export function alignOptions() {
  const items = [
    { primaryText: 'Left', value: 'flexStart' },
    { primaryText: 'Center', value: 'flexCenter' },
    { primaryText: 'Right', value: 'flexEnd' }
  ];
  return items;
}

export function recurringName(value) {
  const obj = {};
  switch (value) {
    case 'once':
      obj.name = 'One-time';
      obj.alt = 'Once';
      obj.alt2 = 'once';
      break;
    case 'monthly':
      obj.name = 'Monthly';
      obj.alt = 'Months';
      obj.alt2 = 'month';
      break;
    case 'quarterly':
      obj.name = 'Quarterly';
      obj.alt = 'Quarters';
      obj.alt2 = 'quarter';
      obj.short = '';
      break;
    case 'annually':
      obj.name = 'Yearly';
      obj.alt = 'Years';
      obj.alt2 = 'year';
      break;
    default:
      break;
  }
  return obj;
}

export const renderRecurringName = (kind, interval, max = null) => {
  const obj = {};
  let name = '';

  switch (kind) {
    case 'invoice': {
      name = 'Payment';
      break;
    }

    case 'fundraiser': {
      name = 'Donation';
      break;
    }

    // no default
  }

  let text = `One-Time ${name}`;

  switch (interval) {
    case 'monthly':
      text = `Monthly ${name} ${max ? `for ${max} Month${max > 1 ? 's' : ''}` : ''}`;
      break;
    case 'quarterly':
      text = `Quarterly ${name} ${max ? `for ${max} Quarter${max > 1 ? 's' : ''}`: ''}`;
      break;
    case 'annually':
      text = `Yearly ${name} ${max ? `for ${max} Year${max > 1 ? 's' : ''}` : ''}`;
      break;

    // no default
  }
  obj.name = name;
  obj.text = text;
  return obj;
}

export function getRatingInfo(rating) {
  const info = {
    color: '#dde0e2',
    color2: '#e83b2e',
    text: 'Low',
    rating,
    noCredit: rating >= 500 ? false : true
  };

  if (rating >= 500 && rating < 650) {
    info.color = '#e83b2e';
    info.color2 = '#dde0e2';
    info.text = 'Fair';
    info.rating = rating;
  } else if (rating >= 650 && rating < 750) {
    info.color = '#ffb156';
    info.color2 = '#e83b2e';
    info.text = 'Good';
    info.rating = rating;
  } else if (rating >= 750 && rating <= 799) {
    info.color = '#29eee6';
    info.color2 = '#698df4';
    info.text = 'Very Good';
    info.rating = rating;
  } else if (rating >= 800) {
    info.color = '#29eee6';
    info.color2 = '#698df4';
    info.text = 'Excellent';
    info.rating = rating;
  }

  return info;
}

export const factorTypes = [
  'processingHistory',
  'processingVolume',
  'transactionCount',
  'transactionLast',
  'balanceRatio',
  'repaymentHistory'
];

export function translatePaymentForm(formKind) {
  const kindName = kind(formKind).name;
  return `${kindName} ${formKind !== 'fundraiser' ? 'Form' : ''} Options`;
}

export const defaultArticleImageURL = 'https://cdn.givebox.com/givebox/assets/img/fundraiser-cover/original';

export const defaultArticleTitles = {
  fundraiser: 'New Donation Form',
  event: 'New Event',
  invoice: 'New Invoice',
  membership: 'New Membership',
  sweepstake: 'New Sweepstakes'
};
