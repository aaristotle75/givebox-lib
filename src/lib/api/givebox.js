/*
* Get a Givebox API endpoint
*
* @param {string} resource The name of the resource
* @param {array} ids An array of ID's in order used in the endpoint
* @param {object} opts
*
* // OPTIONS //
* @param {int} orgID
* @param {int} userID
* @param {int} articleID
*
*/
export const endpoint = function getAPIEndpoint(resource, id = [], opts = {}) {
  const {
    userID,
    orgID,
    affiliateID
  } = opts;
  let endpoint;

  switch (resource) {
    // SUPER
    case 'superFeeSettings': {
      endpoint = `super/fee-settings`;
      break;
    }
    case 'superCustomers': {
      endpoint = `super/customers`;
      break;
    }
    case 'superFinanceStats': {
      endpoint = `super/finance-stats`;
      break;
    }
    case 'superTransactions': {
      endpoint = `super/transactions`;
      break;
    }
    case 'superMoneyTransfers': {
      endpoint = `super/money-transfers`;
      break;
    }
    case 'superRecurring': {
      endpoint = `super/recurring`;
      break;
    }
    case 'superStats': {
      endpoint = `super/stats`;
      break;
    }
    case 'superTimeline': {
      endpoint = `super/timeline`;
      break;
    }
    case 'superPaymethodsBlock': {
      endpoint = `paymethods/${id[0]}/block`;
      break;
    }
    case 'superScamProfilesBlock': {
      endpoint = `scam-profiles/${id[0]}/block`;
      break;
    }
    case 'superChargebackTransactions': {
      endpoint = `super/chargeback-transactions`;
      break;
    }
    case 'superChargebackStatus': {
      endpoint = `super/chargeback-transactions/${id[0]}`;
      break;
    }

    // USER
    case 'users': {
      endpoint = `users`;
      break;
    }
    case 'singleUser': {
      endpoint = `users/${userID}`;
      break;
    }
    case 'session': {
      endpoint = `session`;
      break;
    }
    case 'sessionMembership': {
      endpoint = `session/membership/${id[0]}`;
      break;
    }
    case 'masquerade': {
      endpoint = `masquerade`;
      break;
    }
    case 'clientsIdentityTokens': {
      endpoint = `clients/identity-tokens`;
      break;
    }
    case '2fauth': {
      endpoint = `2fauth`;
      break;
    }
    case 'passwordReset': {
      endpoint = `password-reset`;
      break;
    }
    case 'checkPasswordReset': {
      endpoint = `password-reset/${id[0]}`;
      break;
    }
    case 'changePassword': {
      endpoint = `password-change/${id[0]}`;
      break;
    }
    case 'userMemberships': {
      endpoint = `users/${userID}/memberships`;
      break;
    }
    case 'userMembership': {
      endpoint = `users/${userID}/memberships/${id[0]}`;
      break;
    }
    case 'userMembershipDefault': {
      endpoint = `users/${userID}/memberships/default`;
      break;
    }
    case 'userPreferences': {
      endpoint = `users/${userID}/preferences`;
      break;
    }
    case 'userAddresses': {
      endpoint = `users/${userID}/addresses`;
      break;
    }
    case 'userAddresse': {
      endpoint = `users/${userID}/addresses/${id[0]}`;
      break;
    }
    case 'userDonations': {
      endpoint = `users/${userID}/donations`;
      break;
    }
    case 'userPurchases': {
      endpoint = `users/${userID}/purchases`;
      break;
    }
    case 'purchaseRefund': {
      endpoint = `users/${userID}/purchases/${id[0]}/refunds`;
      break;
    }
    case 'purchaseReceipt': {
      endpoint = `users/${userID}/purchases/${id[0]}/receipt`;
      break;
    }
    case 'transactionReceipt': {
      endpoint = `users/${userID}/transactions/${id[0]}/receipt`;
      break;
    }
    case 'userRecurringOrders': {
      endpoint = `users/${userID}/recurring`;
      break;
    }
    case 'userRecurringOrder': {
      endpoint = `users/${userID}/recurring/${id[0]}`;
      break;
    }
    case 'userPaymethods': {
      endpoint = `users/${userID}/paymethods`;
      break;
    }
    case 'userPaymethod': {
      endpoint = `users/${userID}/paymethods/${id[0]}`;
      break;
    }

    // AFFILIATE
    case 'affiliates': {
      endpoint = `affiliates`;
      break;
    }
    case 'affiliate': {
      endpoint = `affiliates/${affiliateID}`;
      break;
    }
    case 'affiliateLegalEntity': {
      endpoint = `affiliates/${affiliateID}/legal-entity`;
      break;
    }
    case 'affiliatePrincipals': {
      endpoint = `affiliates/${affiliateID}/principals`;
      break;
    }
    case 'affiliatePrincipal': {
      endpoint = `affiliates/${affiliateID}/principals/${id[0]} `;
      break;
    }
    case 'affiliateOwner': {
      endpoint = `affiliates/${affiliateID}/owner`;
      break;
    }
    case 'affiliateKeys': {
      endpoint = `affiliates/${affiliateID}/api-keys`;
      break;
    }
    case 'affiliateSelectOrg': {
      endpoint = `affiliates/${affiliateID}/orgs/${id[0]}`;
      break;
    }
    case 'affiliateOrgs': {
      endpoint = `affiliates/${affiliateID}/orgs`;
      break;
    }
    case 'affiliateFeeSettings': {
      endpoint = `affiliates/${affiliateID}/fee-settings`;
      break;
    }
    case 'affiliateBankAccounts': {
      endpoint = `affiliates/${affiliateID}/bank-accounts`;
      break;
    }
    case 'affiliateBankAccount': {
      endpoint = `affiliates/${affiliateID}/bank-accounts/${id[0]}`;
      break;
    }
    case 'affiliateMoneyTransfers': {
      endpoint = `affiliates/${affiliateID}/money-transfers`;
      break;
    }
    case 'affiliateAddresses': {
      endpoint = `affiliates/${affiliateID}/addresses`;
      break;
    }
    case 'affiliateAddress': {
      endpoint = `affiliates/${affiliateID}/addresses/${id[0]}`;
      break;
    }
    case 'affiliateActivities': {
      endpoint = `affiliates/${affiliateID}/activities`;
      break;
    }
    case 'affiliateCustomers': {
      endpoint = `affiliates/${affiliateID}/customers`;
      break;
    }
    case 'affiliateFinanceStats': {
      endpoint = `affiliates/${affiliateID}/finance-stats`;
      break;
    }
    case 'affiliateTransactions': {
      endpoint = `affiliates/${affiliateID}/transactions`;
      break;
    }
    case 'affiliateStats': {
      endpoint = `affiliates/${affiliateID}/stats`;
      break;
    }
    case 'affiliateTimeline': {
      endpoint = `affiliates/${affiliateID}/timeline`;
      break;
    }

    // ORGANIZATION
    case 'orgs': {
      endpoint = `orgs`;
      break;
    }
    case 'org': {
      endpoint = `orgs/${orgID}`;
      break;
    }
    case 'orgOwner': {
      endpoint = `orgs/${orgID}/owner`;
      break;
    }
    case 'orgImage': {
      endpoint = `orgs/${orgID}/image`;
      break;
    }
    case 'orgNotify': {
      endpoint = `orgs/${orgID}/volunteers/${id[0]}/notify`;
      break;
    }
    case 'orgLegalEntity': {
      endpoint = `orgs/${orgID}/legal-entity`;
      break;
    }
    case 'categories': {
      endpoint = `categories`;
      break;
    }
    case 'category': {
      endpoint = `categories/${id[0]}`;
      break;
    }
    case 'orgRoles': {
      endpoint = `orgs/${orgID}/roles`;
      break;
    }
    case 'orgRole': {
      endpoint = `orgs/${orgID}/roles/${id[0]}`;
      break;
    }
    case 'orgMembers': {
      endpoint = `orgs/${orgID}/members`;
      break;
    }
    case 'orgMember': {
      endpoint = `orgs/${orgID}/members/${id[0]}`;
      break;
    }
    case 'orgMemberPermission': {
      endpoint = `orgs/${orgID}/members/${id[0]}/permissions/${id[1]}`;
      break;
    }
    case 'orgPrincipals': {
      endpoint = `orgs/${orgID}/principals`;
      break;
    }
    case 'orgPrincipal': {
      endpoint = `orgs/${orgID}/principals/${id[0]}`;
      break;
    }
    case 'orgCustomers': {
      endpoint = `orgs/${orgID}/customers`;
      break;
    }
    case 'orgCustomer': {
      endpoint = `orgs/${orgID}/customers/${id[0]}`;
      break;
    }
    case 'orgKeys': {
      endpoint = `orgs/${orgID}/apikeys`;
      break;
    }
    case 'orgPermissions': {
      endpoint = `org-permissions`;
      break;
    }
    case 'orgPermission': {
      endpoint = `org-permissions/${id[0]}`;
      break;
    }
    case 'orgBankAccounts': {
      endpoint = `orgs/${orgID}/bank-accounts`;
      break;
    }
    case 'orgBankAccount': {
      endpoint = `orgs/${orgID}/bank-accounts/${id[0]}`;
      break;
    }
    case 'orgAddresses': {
      endpoint = `orgs/${orgID}/addresses`;
      break;
    }
    case 'orgAddress': {
      endpoint = `orgs/${orgID}/addresses/${id[0]}`;
      break;
    }
    case 'orgStats': {
      endpoint = `orgs/${orgID}/stats`;
      break;
    }
    case 'orgTimeline': {
      endpoint = `orgs/${orgID}/timeline`;
      break;
    }
    case 'orgUnderwriting': {
      endpoint = `orgs/${orgID}/underwriting`;
      break;
    }
    case 'orgStatus': {
      endpoint = `orgs/${orgID}/status`;
      break;
    }
    case 'orgContactRequest': {
      endpoint = `orgs/${orgID}/contact-request`;
      break;
    }
    case 'orgChargebacks': {
      endpoint = `orgs/${orgID}/chargeback-transactions`;
      break;
    }
    case 'orgDonations': {
      endpoint = `orgs/${orgID}/donations`;
      break;
    }
    case 'orgRefundDonation': {
      endpoint = `orgs/${orgID}/refunds/${id[0]}`;
      break;
    }
    case 'orgRecurringOrders': {
      endpoint = `orgs/${orgID}/recurring`;
      break;
    }
    case 'orgRecurringOrder': {
      endpoint = `orgs/${orgID}/recurring/${id[0]}`;
      break;
    }
    case 'orgTransactions': {
      endpoint = `orgs/${orgID}/transactions`;
      break;
    }
    case 'orgFinanceStats': {
      endpoint = `orgs/${orgID}/finance-stats`;
      break;
    }
    case 'orgMoneyTransfers': {
      endpoint = `orgs/${orgID}/money-transfers`;
      break;
    }
    case 'orgPurchases': {
      endpoint = `orgs/${orgID}/purchases`;
      break;
    }
    case 'orgRefundPurchase': {
      endpoint = `orgs/${orgID}/purchases/${id[0]}/refunds`;
      break;
    }
    case 'orgPurchaseReceipt': {
      endpoint = `orgs/${orgID}/purchases/${id[0]}/receipt`;
      break;
    }
    case 'orgSources': {
      endpoint = `orgs/${orgID}/sources`;
      break;
    }
    case 'orgFundraisers': {
      endpoint = `orgs/${orgID}/fundraisers`;
      break;
    }
    case 'orgFundraiser': {
      endpoint = `orgs/${orgID}/fundraisers/${id[0]}`;
      break;
    }
    case 'orgFundraiserPublish': {
      endpoint = `orgs/${orgID}/fundraisers/${id[0]}/published`;
      break;
    }
    case 'orgTestFundraiser': {
      endpoint = `orgs/${orgID}/test-fundraiser`;
      break;
    }
    case 'orgFundraiserInvite': {
      endpoint = `orgs/${orgID}/fundraisers/${id[0]}/send`;
      break;
    }
    case 'orgEvents': {
      endpoint = `orgs/${orgID}/events`;
      break;
    }
    case 'orgEvent': {
      endpoint = `orgs/${orgID}/events/${id[0]}`;
      break;
    }
    case 'orgEventTickets': {
      endpoint = `orgs/${orgID}/events/${id[0]}/tickets`;
      break;
    }
    case 'orgEventTicket': {
      endpoint = `orgs/${orgID}/events/${id[0]}/tickets/${id[1]}`;
      break;
    }
    case 'orgEventPublish': {
      endpoint = `orgs/${orgID}/events/${id[0]}/published`;
      break;
    }
    case 'orgEventInvite': {
      endpoint = `orgs/${orgID}/events/${id[0]}/send`;
      break;
    }
    case 'orgInvoices': {
      endpoint = `orgs/${orgID}/invoices`;
      break;
    }
    case 'orgInvoice': {
      endpoint = `orgs/${orgID}/invoices/${id[0]}`;
      break;
    }
    case 'orgInvoicePublish': {
      endpoint = `orgs/${orgID}/invoices/${id[0]}/published`;
      break;
    }
    case 'orgInvoiceSend': {
      endpoint = `orgs/${orgID}/invoices/${id[0]}/send`;
      break;
    }
    case 'orgSweepstakes': {
      endpoint = `orgs/${orgID}/sweepstakes`;
      break;
    }
    case 'orgSweepstake': {
      endpoint = `orgs/${orgID}/sweepstakes/${id[0]}`;
      break;
    }
    case 'orgSweepstakeTickets': {
      endpoint = `orgs/${orgID}/sweepstakes/${id[0]}/tickets`;
      break;
    }
    case 'orgSweepstakeTicket': {
      endpoint = `orgs/${orgID}/sweepstakes/${id[0]}/tickets/${id[1]}`;
      break;
    }
    case 'orgSweepstakePublish': {
      endpoint = `orgs/${orgID}/sweepstakes/${id[0]}/published`;
      break;
    }
    case 'orgSweepstakeWinner': {
      endpoint = `orgs/${orgID}/sweepstakes/${id[0]}/winner`;
      break;
    }
    case 'orgSweepstakeInvite': {
      endpoint = `orgs/${orgID}/sweepstakes/${id[0]}/send`;
      break;
    }
    case 'orgMemberships': {
      endpoint = `orgs/${orgID}/memberships`;
      break;
    }
    case 'orgMembership': {
      endpoint = `orgs/${orgID}/memberships/${id[0]}`;
      break;
    }
    case 'orgMembershipSubscriptions': {
      endpoint = `orgs/${orgID}/memberships/${id[0]}/subscriptions`;
      break;
    }
    case 'orgMembershipSubscription': {
      endpoint = `orgs/${orgID}/memberships/${id[0]}/subscriptions/${id[1]}`;
      break;
    }
    case 'orgMembershioPublish': {
      endpoint = `orgs/${orgID}/memberships/${id[0]}/published`;
      break;
    }
    case 'orgMembershipInvite': {
      endpoint = `orgs/${orgID}/memberships/${id[0]}/send`;
      break;
    }
    case 'orgEmailLists': {
      endpoint = `orgs/${orgID}/email-lists`;
      break;
    }
    case 'orgEmailList': {
      endpoint = `orgs/${orgID}/email-lists/${id[0]}`;
      break;
    }
    case 'orgEmailBlasts': {
      endpoint = `orgs/${orgID}/email-blasts`;
      break;
    }
    case 'orgEmailBlast': {
      endpoint = `orgs/${orgID}/email-blasts/${id[0]}`;
      break;
    }
    case 'orgAlerts': {
      endpoint = `orgs/${orgID}/subscriptions`;
      break;
    }
    case 'orgAlert': {
      endpoint = `orgs/${orgID}/subscriptions/${id[0]}`;
      break;
    }

    // ORDERS
    case 'purchaseOrder': {
      endpoint = `orders`;
      break;
    }

    // ARTICLES
    case 'articles': {
      endpoint = `articles`;
      break;
    }
    case 'article': {
      endpoint = `articles/${id[0]}`;
      break;
    }
    case 'articleView': {
      endpoint = `articles/${id[0]}/views`;
      break;
    }
    case 'articleAvailable': {
      endpoint = `articles/${id[0]}/availability`;
      break;
    }
    case 'articleFeeSettings': {
      endpoint = `articles/${id[0]}/fee-settings`;
      break;
    }
    case 'fundraisers': {
      endpoint = `fundraisers`;
      break;
    }
    case 'activities': {
      endpoint = `activities`;
      break;
    }
    case 'articleComments': {
      endpoint = `articles/${id[0]}/comments`;
      break;
    }
    case 'articleComment': {
      endpoint = `articles/${id[0]}/comments/${id[0]}`;
      break;
    }
    case 'articleFollows': {
      endpoint = `articles/${id[0]}/follows`;
      break;
    }
    case 'articleLikes': {
      endpoint = `articles/${id[0]}/likes`;
      break;
    }
    case 'articleSaves': {
      endpoint = `articles/${id[0]}/saves`;
      break;
    }
    case 'articleShares': {
      endpoint = `articles/${id[0]}/shares`;
      break;
    }

    // IN APP
    case 'inappFeatures': {
      endpoint = `inapp/features`;
      break;
    }
    case 'inappFeature': {
      endpoint = `inapp/features/${id[0]}`;
      break;
    }
    case 'inappProducts': {
      endpoint = `inapp/products`;
      break;
    }
    case 'inappProduct': {
      endpoint = `inapp/products/${id[0]}`;
      break;
    }
    case 'inappPackages': {
      endpoint = `inapp/packages`;
      break;
    }
    case 'inappPackage': {
      endpoint = `inapp/packages/${id[0]}`;
      break;
    }
    case 'inappOrgSubscriptions': {
      endpoint = `orgs/${id[0]}/inapp/subscriptions`;
      break;
    }
    case 'inappOrgSubscription': {
      endpoint = `orgs/${id[0]}/inapp/subscriptions/${id[1]}`;
      break;
    }
    case 'inappOrgCredits': {
      endpoint = `orgs/${id[0]}/inapp/store-credits`;
      break;
    }
    case 'inappOrgCredit': {
      endpoint = `orgs/${id[0]}/inapp/store-credits/${id[1]}`;
      break;
    }
    case 'inappOrgTransactions': {
      endpoint = `orgs/${id[0]}/inapp/transactions`;
      break;
    }
    case 'inappOrgBalance': {
      endpoint = `orgs/${id[0]}/inapp/balance`;
      break;
    }

    // MISC
    case 's3UploadForm': {
      endpoint = `s3/upload-form`;
      break;
    }
    case 'contact': {
      endpoint = `contact`;
      break;
    }
    case 'wepayLabel': {
      endpoint = `wepay/${id[0]}/account-update-uri`;
      break;
    }
    case 'recaptcha': {
      endpoint = `recaptcha/v3`;
      break;
    }

    // DEFAULT
    default:
      console.error('No endpoint found.');
      break;
  }

  return endpoint;
}
