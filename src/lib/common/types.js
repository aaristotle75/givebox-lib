export const mime = {
  image: 'image/jpeg, image/gif, image/png, image/bmp, image/tiff, image/x-icon',
  video: 'video/ogg, video/webm, video/mp4, video/mpeg, video/quicktime',
  text: 'text/plain, text/csv, text/tab-separated-values, text/richtext, text/css',
  applications: 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.apple.keynote, application/vnd.apple.numbers, application/vnd.apple.pages, application/vnd.oasis.opendocument.text, application/rtf, application/vnd.ms-excel'
}

export function kind(kind) {
  const obj = {};
  switch (kind) {
    case 'events':
    case 'event': {
      obj.name = 'Event';
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
      break;
    }

    case 'fundraisers':
    case 'fundraiser': {
      obj.name = 'Donation Form';
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
      break;
    }

    case 'invoices':
    case 'invoice': {
      obj.name = 'Invoice';
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
      break;
    }

    case 'memberships':
    case 'membership': {
      obj.name = 'Membership';
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
      break;
    }

    case 'sweepstakes':
    case 'sweepstake': {
      obj.name = 'Sweepstakes';
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
      break;
    }

    default:
      obj.name = 'All Money Sources';
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
