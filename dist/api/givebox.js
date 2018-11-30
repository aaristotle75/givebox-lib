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
export var endpoint = function getAPIEndpoint(resource) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var userID = opts.userID,
      orgID = opts.orgID,
      affiliateID = opts.affiliateID;
  var endpoint;

  switch (resource) {
    // SUPER
    case 'superFeeSettings':
      {
        endpoint = "super/fee-settings";
        break;
      }

    case 'superCustomers':
      {
        endpoint = "super/customers";
        break;
      }

    case 'superFinanceStats':
      {
        endpoint = "super/finance-stats";
        break;
      }

    case 'superTransactions':
      {
        endpoint = "super/transactions";
        break;
      }

    case 'superMoneyTransfers':
      {
        endpoint = "super/money-transfers";
        break;
      }

    case 'superRecurring':
      {
        endpoint = "super/recurring";
        break;
      }

    case 'superStats':
      {
        endpoint = "super/stats";
        break;
      }

    case 'superTimeline':
      {
        endpoint = "super/timeline";
        break;
      }

    case 'superPaymethodsBlock':
      {
        endpoint = "paymethods/".concat(id[0], "/block");
        break;
      }

    case 'superScamProfilesBlock':
      {
        endpoint = "scam-profiles/".concat(id[0], "/block");
        break;
      }

    case 'superChargebackTransactions':
      {
        endpoint = "super/chargeback-transactions";
        break;
      }

    case 'superChargebackStatus':
      {
        endpoint = "super/chargeback-transactions/".concat(id[0]);
        break;
      }
    // USER

    case 'users':
      {
        endpoint = "users";
        break;
      }

    case 'singleUser':
      {
        endpoint = "users/".concat(userID);
        break;
      }

    case 'session':
      {
        endpoint = "session";
        break;
      }

    case 'sessionMembership':
      {
        endpoint = "session/membership/".concat(id[0]);
        break;
      }

    case 'masquerade':
      {
        endpoint = "masquerade";
        break;
      }

    case 'clientsIdentityTokens':
      {
        endpoint = "clients/identity-tokens";
        break;
      }

    case '2fauth':
      {
        endpoint = "2fauth";
        break;
      }

    case 'passwordReset':
      {
        endpoint = "password-reset";
        break;
      }

    case 'checkPasswordReset':
      {
        endpoint = "password-reset/".concat(id[0]);
        break;
      }

    case 'changePassword':
      {
        endpoint = "password-change/".concat(id[0]);
        break;
      }

    case 'userMemberships':
      {
        endpoint = "users/".concat(userID, "/memberships");
        break;
      }

    case 'userMembership':
      {
        endpoint = "users/".concat(userID, "/memberships/").concat(id[0]);
        break;
      }

    case 'userMembershipDefault':
      {
        endpoint = "users/".concat(userID, "/memberships/default");
        break;
      }

    case 'userPreferences':
      {
        endpoint = "users/".concat(userID, "/preferences");
        break;
      }

    case 'userAddresses':
      {
        endpoint = "users/".concat(userID, "/addresses");
        break;
      }

    case 'userAddresse':
      {
        endpoint = "users/".concat(userID, "/addresses/").concat(id[0]);
        break;
      }

    case 'userDonations':
      {
        endpoint = "users/".concat(userID, "/donations");
        break;
      }

    case 'userPurchases':
      {
        endpoint = "users/".concat(userID, "/purchases");
        break;
      }

    case 'purchaseRefund':
      {
        endpoint = "users/".concat(userID, "/purchases/").concat(id[0], "/refunds");
        break;
      }

    case 'purchaseReceipt':
      {
        endpoint = "users/".concat(userID, "/purchases/").concat(id[0], "/receipt");
        break;
      }

    case 'transactionReceipt':
      {
        endpoint = "users/".concat(userID, "/transactions/").concat(id[0], "/receipt");
        break;
      }

    case 'userRecurringOrders':
      {
        endpoint = "users/".concat(userID, "/recurring");
        break;
      }

    case 'userRecurringOrder':
      {
        endpoint = "users/".concat(userID, "/recurring/").concat(id[0]);
        break;
      }

    case 'userPaymethods':
      {
        endpoint = "users/".concat(userID, "/paymethods");
        break;
      }

    case 'userPaymethod':
      {
        endpoint = "users/".concat(userID, "/paymethods/").concat(id[0]);
        break;
      }
    // AFFILIATE

    case 'affiliates':
      {
        endpoint = "affiliates";
        break;
      }

    case 'affiliate':
      {
        endpoint = "affiliates/".concat(affiliateID);
        break;
      }

    case 'affiliateLegalEntity':
      {
        endpoint = "affiliates/".concat(affiliateID, "/legal-entity");
        break;
      }

    case 'affiliatePrincipals':
      {
        endpoint = "affiliates/".concat(affiliateID, "/principals");
        break;
      }

    case 'affiliatePrincipal':
      {
        endpoint = "affiliates/".concat(affiliateID, "/principals/").concat(id[0], " ");
        break;
      }

    case 'affiliateOwner':
      {
        endpoint = "affiliates/".concat(affiliateID, "/owner");
        break;
      }

    case 'affiliateKeys':
      {
        endpoint = "affiliates/".concat(affiliateID, "/api-keys");
        break;
      }

    case 'affiliateSelectOrg':
      {
        endpoint = "affiliates/".concat(affiliateID, "/orgs/").concat(id[0]);
        break;
      }

    case 'affiliateOrgs':
      {
        endpoint = "affiliates/".concat(affiliateID, "/orgs");
        break;
      }

    case 'affiliateFeeSettings':
      {
        endpoint = "affiliates/".concat(affiliateID, "/fee-settings");
        break;
      }

    case 'affiliateBankAccounts':
      {
        endpoint = "affiliates/".concat(affiliateID, "/bank-accounts");
        break;
      }

    case 'affiliateBankAccount':
      {
        endpoint = "affiliates/".concat(affiliateID, "/bank-accounts/").concat(id[0]);
        break;
      }

    case 'affiliateMoneyTransfers':
      {
        endpoint = "affiliates/".concat(affiliateID, "/money-transfers");
        break;
      }

    case 'affiliateAddresses':
      {
        endpoint = "affiliates/".concat(affiliateID, "/addresses");
        break;
      }

    case 'affiliateAddress':
      {
        endpoint = "affiliates/".concat(affiliateID, "/addresses/").concat(id[0]);
        break;
      }

    case 'affiliateActivities':
      {
        endpoint = "affiliates/".concat(affiliateID, "/activities");
        break;
      }

    case 'affiliateCustomers':
      {
        endpoint = "affiliates/".concat(affiliateID, "/customers");
        break;
      }

    case 'affiliateFinanceStats':
      {
        endpoint = "affiliates/".concat(affiliateID, "/finance-stats");
        break;
      }

    case 'affiliateTransactions':
      {
        endpoint = "affiliates/".concat(affiliateID, "/transactions");
        break;
      }

    case 'affiliateStats':
      {
        endpoint = "affiliates/".concat(affiliateID, "/stats");
        break;
      }

    case 'affiliateTimeline':
      {
        endpoint = "affiliates/".concat(affiliateID, "/timeline");
        break;
      }
    // ORGANIZATION

    case 'orgs':
      {
        endpoint = "orgs";
        break;
      }

    case 'org':
      {
        endpoint = "orgs/".concat(orgID);
        break;
      }

    case 'orgOwner':
      {
        endpoint = "orgs/".concat(orgID, "/owner");
        break;
      }

    case 'orgImage':
      {
        endpoint = "orgs/".concat(orgID, "/image");
        break;
      }

    case 'orgNotify':
      {
        endpoint = "orgs/".concat(orgID, "/volunteers/").concat(id[0], "/notify");
        break;
      }

    case 'orgLegalEntity':
      {
        endpoint = "orgs/".concat(orgID, "/legal-entity");
        break;
      }

    case 'categories':
      {
        endpoint = "categories";
        break;
      }

    case 'category':
      {
        endpoint = "categories/".concat(id[0]);
        break;
      }

    case 'orgRoles':
      {
        endpoint = "orgs/".concat(orgID, "/roles");
        break;
      }

    case 'orgRole':
      {
        endpoint = "orgs/".concat(orgID, "/roles/").concat(id[0]);
        break;
      }

    case 'orgMembers':
      {
        endpoint = "orgs/".concat(orgID, "/members");
        break;
      }

    case 'orgMember':
      {
        endpoint = "orgs/".concat(orgID, "/members/").concat(id[0]);
        break;
      }

    case 'orgMemberPermission':
      {
        endpoint = "orgs/".concat(orgID, "/members/").concat(id[0], "/permissions/").concat(id[1]);
        break;
      }

    case 'orgPrincipals':
      {
        endpoint = "orgs/".concat(orgID, "/principals");
        break;
      }

    case 'orgPrincipal':
      {
        endpoint = "orgs/".concat(orgID, "/principals/").concat(id[0]);
        break;
      }

    case 'orgCustomers':
      {
        endpoint = "orgs/".concat(orgID, "/customers");
        break;
      }

    case 'orgCustomer':
      {
        endpoint = "orgs/".concat(orgID, "/customers/").concat(id[0]);
        break;
      }

    case 'orgKeys':
      {
        endpoint = "orgs/".concat(orgID, "/apikeys");
        break;
      }

    case 'orgPermissions':
      {
        endpoint = "org-permissions";
        break;
      }

    case 'orgPermission':
      {
        endpoint = "org-permissions/".concat(id[0]);
        break;
      }

    case 'orgBankAccounts':
      {
        endpoint = "orgs/".concat(orgID, "/bank-accounts");
        break;
      }

    case 'orgBankAccount':
      {
        endpoint = "orgs/".concat(orgID, "/bank-accounts/").concat(id[0]);
        break;
      }

    case 'orgAddresses':
      {
        endpoint = "orgs/".concat(orgID, "/addresses");
        break;
      }

    case 'orgAddress':
      {
        endpoint = "orgs/".concat(orgID, "/addresses/").concat(id[0]);
        break;
      }

    case 'orgStats':
      {
        endpoint = "orgs/".concat(orgID, "/stats");
        break;
      }

    case 'orgTimeline':
      {
        endpoint = "orgs/".concat(orgID, "/timeline");
        break;
      }

    case 'orgUnderwriting':
      {
        endpoint = "orgs/".concat(orgID, "/underwriting");
        break;
      }

    case 'orgStatus':
      {
        endpoint = "orgs/".concat(orgID, "/status");
        break;
      }

    case 'orgContactRequest':
      {
        endpoint = "orgs/".concat(orgID, "/contact-request");
        break;
      }

    case 'orgChargebacks':
      {
        endpoint = "orgs/".concat(orgID, "/chargeback-transactions");
        break;
      }

    case 'orgDonations':
      {
        endpoint = "orgs/".concat(orgID, "/donations");
        break;
      }

    case 'orgRefundDonation':
      {
        endpoint = "orgs/".concat(orgID, "/refunds/").concat(id[0]);
        break;
      }

    case 'orgRecurringOrders':
      {
        endpoint = "orgs/".concat(orgID, "/recurring");
        break;
      }

    case 'orgRecurringOrder':
      {
        endpoint = "orgs/".concat(orgID, "/recurring/").concat(id[0]);
        break;
      }

    case 'orgTransactions':
      {
        endpoint = "orgs/".concat(orgID, "/transactions");
        break;
      }

    case 'orgFinanceStats':
      {
        endpoint = "orgs/".concat(orgID, "/finance-stats");
        break;
      }

    case 'orgMoneyTransfers':
      {
        endpoint = "orgs/".concat(orgID, "/money-transfers");
        break;
      }

    case 'orgPurchases':
      {
        endpoint = "orgs/".concat(orgID, "/purchases");
        break;
      }

    case 'orgRefundPurchase':
      {
        endpoint = "orgs/".concat(orgID, "/purchases/").concat(id[0], "/refunds");
        break;
      }

    case 'orgPurchaseReceipt':
      {
        endpoint = "orgs/".concat(orgID, "/purchases/").concat(id[0], "/receipt");
        break;
      }

    case 'orgSources':
      {
        endpoint = "orgs/".concat(orgID, "/sources");
        break;
      }

    case 'orgFundraisers':
      {
        endpoint = "orgs/".concat(orgID, "/fundraisers");
        break;
      }

    case 'orgFundraiser':
      {
        endpoint = "orgs/".concat(orgID, "/fundraisers/").concat(id[0]);
        break;
      }

    case 'orgFundraiserPublish':
      {
        endpoint = "orgs/".concat(orgID, "/fundraisers/").concat(id[0], "/published");
        break;
      }

    case 'orgTestFundraiser':
      {
        endpoint = "orgs/".concat(orgID, "/test-fundraiser");
        break;
      }

    case 'orgFundraiserInvite':
      {
        endpoint = "orgs/".concat(orgID, "/fundraisers/").concat(id[0], "/send");
        break;
      }

    case 'orgEvents':
      {
        endpoint = "orgs/".concat(orgID, "/events");
        break;
      }

    case 'orgEvent':
      {
        endpoint = "orgs/".concat(orgID, "/events/").concat(id[0]);
        break;
      }

    case 'orgEventTickets':
      {
        endpoint = "orgs/".concat(orgID, "/events/").concat(id[0], "/tickets");
        break;
      }

    case 'orgEventTicket':
      {
        endpoint = "orgs/".concat(orgID, "/events/").concat(id[0], "/tickets/").concat(id[1]);
        break;
      }

    case 'orgEventPublish':
      {
        endpoint = "orgs/".concat(orgID, "/events/").concat(id[0], "/published");
        break;
      }

    case 'orgEventInvite':
      {
        endpoint = "orgs/".concat(orgID, "/events/").concat(id[0], "/send");
        break;
      }

    case 'orgInvoices':
      {
        endpoint = "orgs/".concat(orgID, "/invoices");
        break;
      }

    case 'orgInvoice':
      {
        endpoint = "orgs/".concat(orgID, "/invoices/").concat(id[0]);
        break;
      }

    case 'orgInvoicePublish':
      {
        endpoint = "orgs/".concat(orgID, "/invoices/").concat(id[0], "/published");
        break;
      }

    case 'orgInvoiceSend':
      {
        endpoint = "orgs/".concat(orgID, "/invoices/").concat(id[0], "/send");
        break;
      }

    case 'orgSweepstakes':
      {
        endpoint = "orgs/".concat(orgID, "/sweepstakes");
        break;
      }

    case 'orgSweepstake':
      {
        endpoint = "orgs/".concat(orgID, "/sweepstakes/").concat(id[0]);
        break;
      }

    case 'orgSweepstakeTickets':
      {
        endpoint = "orgs/".concat(orgID, "/sweepstakes/").concat(id[0], "/tickets");
        break;
      }

    case 'orgSweepstakeTicket':
      {
        endpoint = "orgs/".concat(orgID, "/sweepstakes/").concat(id[0], "/tickets/").concat(id[1]);
        break;
      }

    case 'orgSweepstakePublish':
      {
        endpoint = "orgs/".concat(orgID, "/sweepstakes/").concat(id[0], "/published");
        break;
      }

    case 'orgSweepstakeWinner':
      {
        endpoint = "orgs/".concat(orgID, "/sweepstakes/").concat(id[0], "/winner");
        break;
      }

    case 'orgSweepstakeInvite':
      {
        endpoint = "orgs/".concat(orgID, "/sweepstakes/").concat(id[0], "/send");
        break;
      }

    case 'orgMemberships':
      {
        endpoint = "orgs/".concat(orgID, "/memberships");
        break;
      }

    case 'orgMembership':
      {
        endpoint = "orgs/".concat(orgID, "/memberships/").concat(id[0]);
        break;
      }

    case 'orgMembershipSubscriptions':
      {
        endpoint = "orgs/".concat(orgID, "/memberships/").concat(id[0], "/subscriptions");
        break;
      }

    case 'orgMembershipSubscription':
      {
        endpoint = "orgs/".concat(orgID, "/memberships/").concat(id[0], "/subscriptions/").concat(id[1]);
        break;
      }

    case 'orgMembershioPublish':
      {
        endpoint = "orgs/".concat(orgID, "/memberships/").concat(id[0], "/published");
        break;
      }

    case 'orgMembershipInvite':
      {
        endpoint = "orgs/".concat(orgID, "/memberships/").concat(id[0], "/send");
        break;
      }

    case 'orgEmailLists':
      {
        endpoint = "orgs/".concat(orgID, "/email-lists");
        break;
      }

    case 'orgEmailList':
      {
        endpoint = "orgs/".concat(orgID, "/email-lists/").concat(id[0]);
        break;
      }

    case 'orgEmailBlasts':
      {
        endpoint = "orgs/".concat(orgID, "/email-blasts");
        break;
      }

    case 'orgEmailBlast':
      {
        endpoint = "orgs/".concat(orgID, "/email-blasts/").concat(id[0]);
        break;
      }

    case 'orgAlerts':
      {
        endpoint = "orgs/".concat(orgID, "/subscriptions");
        break;
      }

    case 'orgAlert':
      {
        endpoint = "orgs/".concat(orgID, "/subscriptions/").concat(id[0]);
        break;
      }
    // ORDERS

    case 'purchaseOrder':
      {
        endpoint = "orders";
        break;
      }
    // ARTICLES

    case 'articles':
      {
        endpoint = "articles";
        break;
      }

    case 'article':
      {
        endpoint = "articles/".concat(id[0]);
        break;
      }

    case 'articleView':
      {
        endpoint = "articles/".concat(id[0], "/views");
        break;
      }

    case 'articleAvailable':
      {
        endpoint = "articles/".concat(id[0], "/availability");
        break;
      }

    case 'articleFeeSettings':
      {
        endpoint = "articles/".concat(id[0], "/fee-settings");
        break;
      }

    case 'fundraisers':
      {
        endpoint = "fundraisers";
        break;
      }

    case 'activities':
      {
        endpoint = "activities";
        break;
      }

    case 'articleComments':
      {
        endpoint = "articles/".concat(id[0], "/comments");
        break;
      }

    case 'articleComment':
      {
        endpoint = "articles/".concat(id[0], "/comments/").concat(id[0]);
        break;
      }

    case 'articleFollows':
      {
        endpoint = "articles/".concat(id[0], "/follows");
        break;
      }

    case 'articleLikes':
      {
        endpoint = "articles/".concat(id[0], "/likes");
        break;
      }

    case 'articleSaves':
      {
        endpoint = "articles/".concat(id[0], "/saves");
        break;
      }

    case 'articleShares':
      {
        endpoint = "articles/".concat(id[0], "/shares");
        break;
      }
    // IN APP

    case 'inappFeatures':
      {
        endpoint = "inapp/features";
        break;
      }

    case 'inappFeature':
      {
        endpoint = "inapp/features/".concat(id[0]);
        break;
      }

    case 'inappProducts':
      {
        endpoint = "inapp/products";
        break;
      }

    case 'inappProduct':
      {
        endpoint = "inapp/products/".concat(id[0]);
        break;
      }

    case 'inappPackages':
      {
        endpoint = "inapp/packages";
        break;
      }

    case 'inappPackage':
      {
        endpoint = "inapp/packages/".concat(id[0]);
        break;
      }

    case 'inappOrgSubscriptions':
      {
        endpoint = "orgs/".concat(orgID, "/inapp/subscriptions");
        break;
      }

    case 'inappOrgSubscription':
      {
        endpoint = "orgs/".concat(orgID, "/inapp/subscriptions/").concat(id[0]);
        break;
      }

    case 'inappOrgCredits':
      {
        endpoint = "orgs/".concat(orgID, "/inapp/store-credits");
        break;
      }

    case 'inappOrgCredit':
      {
        endpoint = "orgs/".concat(orgID, "/inapp/store-credits/").concat(id[0]);
        break;
      }

    case 'inappOrgTransactions':
      {
        endpoint = "orgs/".concat(orgID, "/inapp/transactions");
        break;
      }

    case 'inappOrgBalance':
      {
        endpoint = "orgs/".concat(orgID, "/inapp/balance");
        break;
      }
    // MISC

    case 's3UploadForm':
      {
        endpoint = "s3/upload-form";
        break;
      }

    case 'contact':
      {
        endpoint = "contact";
        break;
      }

    case 'wepayLabel':
      {
        endpoint = "wepay/".concat(orgID, "/account-update-uri");
        break;
      }

    case 'recaptcha':
      {
        endpoint = "recaptcha/v3";
        break;
      }
    // DEFAULT

    default:
      console.error('No endpoint found.');
      break;
  }

  return endpoint;
};