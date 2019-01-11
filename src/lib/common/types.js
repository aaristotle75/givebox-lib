export const mime = {
  image: 'image/jpeg, image/gif, image/png, image/bmp, image/tiff, image/x-icon',
  video: 'video/ogg, video/webm, video/mp4, video/mpeg, video/quicktime',
  text: 'text/plain, text/csv, text/tab-separated-values, text/richtext, text/css',
  applications: 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.apple.keynote, application/vnd.apple.numbers, application/vnd.apple.pages, application/vnd.oasis.opendocument.text, application/rtf, application/vnd.ms-excel'
}

export function kind(kind) {
  const obj = {};
  switch (kind) {
    case 'event': {
      obj.name = 'Event';
      obj.txName = 'Ticket purchase';
      break;
    }

    case 'fundraiser': {
      obj.name = 'Fundraiser';
      obj.txName = 'Made donation';
      break;
    }

    case 'invoice': {
      obj.name = 'Invoice';
      obj.txName = 'Paid invoice';
      break;
    }

    case 'membership': {
      obj.name = 'Membership';
      obj.txName = 'Membership purchase';
      break;
    }

    case 'sweepstake': {
      obj.name = 'Sweepstake';
      obj.txName = 'Sweepstake entry';
      break;
    }

    // no default
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
