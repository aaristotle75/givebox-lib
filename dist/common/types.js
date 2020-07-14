import React from 'react';
export function bankStatus(status, voidCheck) {
  const obj = {};

  switch (status) {
    case 'approved':
      {
        obj.name = 'Verified';
        obj.color = 'green';
        break;
      }

    case 'declined':
      {
        obj.name = voidCheck ? 'Declined' : 'Please upload another void check or bank statement';
        obj.color = voidCheck ? 'red' : 'orange';
        break;
      }

    case 'pending':
    default:
      {
        obj.name = voidCheck ? 'Bank account under review' : 'Upload void check or bank statement';
        obj.color = voidCheck ? 'green' : 'orange';
        break;
      }
  }

  return obj;
}
export const imageTypes = ['jpg', 'jpeg', 'gif', 'bmp', 'png'];
export const mime = {
  image: 'image/jpeg, image/gif, image/png, image/bmp, image/tiff, image/x-icon',
  video: 'video/ogg, video/webm, video/mp4, video/mpeg, video/quicktime',
  text: 'text/plain, text/csv, text/tab-separated-values, text/richtext, text/css, .csv',
  applications: 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.apple.keynote, application/vnd.apple.numbers, application/vnd.apple.pages, application/vnd.oasis.opendocument.text, application/rtf, application/vnd.ms-excel'
};
export function kinds() {
  const kinds = ['fundraiser', 'event', 'invoice', 'membership', 'sweepstake'];
  return kinds;
}
export function kindOptions(all = true, allName = 'All Payment Forms') {
  const options = [];
  if (all) options.push({
    primaryText: allName,
    value: 'all'
  });
  kinds().forEach(key => {
    options.push({
      primaryText: kind(key).namePlural,
      value: key
    });
  });
  return options;
}
export function kind(kind) {
  const obj = {};

  switch (kind) {
    case 'events':
    case 'event':
      {
        obj.name = 'Event';
        obj.namePlural = 'Events';
        obj.amountLabel = 'Tickets';
        obj.btnName = obj.name;
        obj.cta = 'Buy Tickets';
        obj.txName = 'Ticket purchase';
        obj.txLabel = 'Ticket Sales';
        obj.kind = 'event';
        obj.kindPlural = 'events';
        obj.header = 'Events';
        obj.amountField = 'tickets';
        obj.amountDesc = 'Ticket';
        obj.api = {
          item: 'Event',
          list: 'Events',
          amount: 'orgEventTicket'
        };
        obj.icon = 'calendar';
        break;
      }

    case 'fundraisers':
    case 'fundraiser':
      {
        obj.name = 'Donation Form';
        obj.namePlural = 'Donation Forms';
        obj.amountLabel = 'Donation Amounts';
        obj.btnName = 'Donate';
        obj.cta = 'Donate Now';
        obj.txName = 'Made donation';
        obj.txLabel = 'Donations';
        obj.kind = 'fundraiser';
        obj.kindPlural = 'fundraisers';
        obj.header = 'Donation Forms';
        obj.amountField = 'amounts';
        obj.amountDesc = 'Amount';
        obj.api = {
          item: 'Fundraiser',
          list: 'Fundraisers',
          amount: 'orgFundraiserAmount'
        };
        obj.icon = 'heart';
        break;
      }

    case 'invoices':
    case 'invoice':
      {
        obj.name = 'Invoice';
        obj.namePlural = 'Invoices';
        obj.amountLabel = 'Invoice Amounts';
        obj.btnName = obj.name;
        obj.cta = 'Pay Invoice';
        obj.txName = 'Paid invoice';
        obj.txLabel = 'Invoice Payments';
        obj.kind = 'invoice';
        obj.kindPlural = 'invoices';
        obj.header = 'Invoices';
        obj.amountField = 'amounts';
        obj.amountDesc = 'Amount';
        obj.api = {
          item: 'Invoice',
          list: 'Invoices',
          amount: 'orgInvoiceAmount'
        };
        obj.icon = 'briefcase';
        break;
      }

    case 'memberships':
    case 'membership':
      {
        obj.name = 'Membership';
        obj.namePlural = 'Memberships';
        obj.amountLabel = 'Membership Amounts';
        obj.btnName = obj.name;
        obj.cta = 'Purchase Membership';
        obj.txName = 'Membership purchase';
        obj.txLabel = 'Memberships';
        obj.kind = 'membership';
        obj.kindPlural = 'memberships';
        obj.header = 'Memberships';
        obj.amountField = 'subscriptions';
        obj.amountDesc = 'Subscription';
        obj.api = {
          item: 'Membership',
          list: 'Memberships',
          amount: 'orgMembershipSubscription'
        };
        obj.icon = 'clipboard';
        break;
      }

    case 'sweepstakes':
    case 'sweepstake':
      {
        obj.name = 'Sweepstakes';
        obj.namePlural = 'Sweepstakes';
        obj.amountLabel = 'Tickets';
        obj.btnName = obj.name;
        obj.cta = 'Enter Sweepstakes';
        obj.txName = 'Sweepstake entry';
        obj.txLabel = 'Sweepstake Entries';
        obj.kind = 'sweepstake';
        obj.kindPlural = 'sweepstakes';
        obj.header = 'Sweepstakes';
        obj.amountField = 'tickets';
        obj.amountDesc = 'Ticket';
        obj.api = {
          item: 'Sweepstake',
          list: 'Sweepstakes',
          amount: 'orgSweepstakeTicket'
        };
        obj.icon = 'gift';
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
      break;
  }

  return obj;
}
export function source(source) {
  let str;

  switch (source) {
    case 'web':
    case 'embed':
      {
        str = 'Website';
        break;
      }

    case 'swipe':
      {
        str = 'Givebox Swipe App';
        break;
      }

    case 'app':
      {
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
    case 'donation':
      {
        str = 'Charitable Donation';
        break;
      }

    case 'commerce':
      {
        str = 'Sales Transaction';
        break;
      }
    // no default
  }

  return str;
}
export const accountType = type => {
  switch (type) {
    case 'deposit':
      {
        return 'Withdrawal';
      }

    case 'payee':
      {
        return 'Payee';
      }
    // no default
  }
};
export const socialIcons = (type, size = 50) => {
  return (/*#__PURE__*/React.createElement("img", {
      style: {
        height: size,
        width: size
      },
      src: `https://givebox.s3-us-west-1.amazonaws.com/public/images/social-${type}.png`,
      alt: `${type}`
    })
  );
};
export const fontSizeOptions = (r1, r2) => {
  const items = [];

  for (let i = r1; i <= r2; i++) {
    if (i % 2 === 0) {
      items.push({
        primaryText: `${i}px`,
        secondaryText: /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: i
          }
        }, "Example Font Size"),
        value: i
      });
    }
  }

  return items;
};
export function alignOptions() {
  const items = [{
    primaryText: 'Left',
    value: 'flexStart'
  }, {
    primaryText: 'Center',
    value: 'flexCenter'
  }, {
    primaryText: 'Right',
    value: 'flexEnd'
  }];
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
    case 'invoice':
      {
        name = 'Payment';
        break;
      }

    case 'fundraiser':
      {
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
      text = `Quarterly ${name} ${max ? `for ${max} Quarter${max > 1 ? 's' : ''}` : ''}`;
      break;

    case 'annually':
      text = `Yearly ${name} ${max ? `for ${max} Year${max > 1 ? 's' : ''}` : ''}`;
      break;
    // no default
  }

  obj.name = name;
  obj.text = text;
  return obj;
};