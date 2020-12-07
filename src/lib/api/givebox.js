import { getIndex } from '../common/utility';

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
    affiliateID,
    enterpriseID
  } = opts;

  const obj = {
    endpoint: ''
  };

  let endpoint = '';

  switch (resource) {

    // CreditLine

    case 'creditlineInfo': {
      endpoint = `creditline-info`;
      break;
    }

    case 'orgCreditlineInfo': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/creditline-info`;
      break;
    }

    case 'creditlineRatings': {
      endpoint = `creditline-ratings`;
      break;
    }

    case 'orgCreditlineRatings': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/creditline-ratings`;
      break;
    }

    case 'orgCreditlineRatingLatest': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/creditline-ratings/latest`;
      break;
    }

    case 'creditlineAsks': {
      endpoint = `creditline-asks`;
      break;
    }

    case 'orgCreditlineAsks': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/creditline-asks`;
      break;
    }

    case 'orgCreditlineAsk': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/creditline-asks/${id[1]}`;
      break;
    }

    case 'creditlinePayments': {
      endpoint = `creditline-paymentsdue`;
      break;
    }

    case 'orgCreditlinePayments': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/creditline-paymentsdue`;
      break;
    }

    case 'orgCreditlinePaymentDue': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/creditline-paymentsdue/${id[1]}`;
      break;
    }

    case 'creditlineTransactions': {
      endpoint = `creditline-transactions`;
      break;
    }

    case 'orgCreditlineTransactions': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/creditline-transactions`;
      break;
    }

    case 'orgCreditlineTransaction': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/creditline-transactions/${id[1]}`;
      break;
    }


    // SUPER

    case 'orgResendVerification': {
      endpoint = `orgs/${id[0]}/verifications`;
      break;
    }

    case 'superInstantFundraising': {
      endpoint = `orgs/${id[0]}/instant-fundraising`;
      break;
    }

    case 'superInstantFundraisingRefund': {
      endpoint = `orgs/${id[0]}/instant-fundraising/refund`;
      break;
    }

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
    case 'superScamProfilesList': {
      endpoint = `scam-profiles`;
      break;
    }
    case 'superScamProfiles': {
      endpoint = `scam-profiles/${id[0]}`;
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
    case 'superRiskInfo': {
      endpoint = `risk-info`;
      break;
    }
    case 'superRiskStats': {
      endpoint = `risk-stats`;
      break;
    }
    case 'superRiskTriggers': {
      endpoint = `risk-triggers`;
      break;
    }
    case 'superRiskTrigger': {
      endpoint = `risk-triggers/${id[0]}`;
      break;
    }
    case 'deletedOrgs': {
      endpoint = `orgs/soft-deleted`;
      break;
    }
    case 'deletedOrg': {
      endpoint = `orgs/soft-deleted/${id[0]}`;
      break;
    }
    case 'orgRiskInfo': {
      endpoint = `orgs/${id[0]}/risk-info`;
      break;
    }
    case 'orgRiskStats': {
      endpoint = `orgs/${id[0]}/risk-stats`;
      break;
    }
    case 'orgRiskTriggers': {
      endpoint = `orgs/${id[0]}/risk-triggers`;
      break;
    }
    case 'orgRiskTrigger': {
      endpoint = `orgs/${id[0]}/risk-triggers/${id[1]}`;
      break;
    }
    case 'orgRiskActivities': {
      endpoint = `orgs/${id[0]}/risk-activity`;
      break;
    }
    case 'orgRiskActivity': {
      endpoint = `orgs/${id[0]}/risk-activity/${id[1]}`;
      break;
    }
    case 'refund': {
      endpoint = `orgs/${id[0]}/purchases/${id[1]}/refunds`;
      break;
    }
    case 'receipt': {
      endpoint = `orgs/${id[0]}/purchases/${id[1]}/receipt`;
      break;
    }
    case 'superRecurringOrders': {
      endpoint = `super/recurring`;
      break;
    }
    case 'recurringOrders': {
      endpoint = `orgs/${id[0]}/recurring`;
      break;
    }
    case 'recurringOrder': {
      endpoint = `orgs/${id[0]}/recurring/${id[1]}`;
      break;
    }
    case 'bankAccounts': {
      endpoint = `bank-accounts`;
      break;
    }
    case 'bankAccount': {
      endpoint = `bank-accounts/${id[0]}`;
      break;
    }
    case 'bankAccountStatus': {
      endpoint = `bank-accounts/${id[0]}/status`;
      break;
    }
    case 'orgFee': {
      endpoint = `enterprises/1/orgs/${id[0]}/fee-settings`;
      break;
    }
    case 'rewardCategories': {
      endpoint = `reward-categories`;
      break;
    }
    case 'rewardMilestones': {
      endpoint = `reward-milestones`;
      break;
    }
    case 'superOrgMediaItems': {
      endpoint = `orgs/${id[0]}/media-items`;
      break;
    }
    case 'superOrgMediaItem': {
      endpoint = `orgs/${id[0]}/media-items/${id[1]}`;
      break;
    }

    // Underwriting
    case 'underwritingStatus': {
      endpoint = `orgs/${id[0]}/underwriting`;
      break;
    }
    case 'underwritingList': {
      endpoint = `underwriting-info`;
      break;
    }
    case 'underwriting': {
      endpoint = `orgs/${id[0]}/underwriting-info`;
      break;
    }
    case 'orgUnderwritingInfo': {
      endpoint = `orgs/${orgID}/underwriting-info`;
      break;
    }
    case 'underwritingDocs': {
      endpoint = `orgs/${id[0]}/underwriting-documents`;
      break;
    }
    case 'underwritingDocsConfirm': {
      endpoint = `orgs/${id[0]}/underwriting-documents/confirm`;
      break;
    }
    case 'underwritingDoc': {
      endpoint = `orgs/${id[0]}/underwriting-documents/${id[1]}`;
      break;
    }
    case 'underwritingDownload': {
      endpoint = `orgs/${id[0]}/underwriting-documents/download`;
      break;
    }
    case 'underwritingSnapshot': {
      endpoint = `orgs/${id[0]}/underwriting-snapshot`;
      break;
    }
    case 'ofac': {
      endpoint = `orgs/${id[0]}/ofac`;
      break;
    }
    case 'underwritingPrincipal': {
      endpoint = `orgs/${id[0]}/principals/${id[1]}`;
      break;
    }



    // USER
    case 'users': {
      endpoint = `users`;
      break;
    }
    case 'singleUser': {
      endpoint = `users/${getIndex(id, 0, userID)}`;
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
    case 'userFundraisers': {
      endpoint = `users/${userID}/volunteer-articles`;
      break;
    }

    // Enterprise
    case 'enterpriseBankAccounts': {
      endpoint = `enterprises/${id[0] || enterpriseID}/bank-accounts`;
      break;
    }
    case 'enterpriseBankAccount': {
      endpoint = `enterprises/${id[0] || enterpriseID}/bank-accounts/${id[1]}`;
      break;
    }

    // AFFILIATE
    case 'affiliates': {
      endpoint = `affiliates`;
      break;
    }
    case 'affiliate': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}`;
      break;
    }
    case 'affiliateLegalEntity': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/legal-entity`;
      break;
    }
    case 'affiliatePrincipals': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/principals`;
      break;
    }
    case 'affiliatePrincipal': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/principals/${id[1]} `;
      break;
    }
    case 'affiliateOwner': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/owner`;
      break;
    }
    case 'affiliateKeys': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/api-keys`;
      break;
    }
    case 'affiliateSelectOrg': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/orgs/${id[1]}`;
      break;
    }
    case 'affiliateOrgs': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/orgs`;
      break;
    }
    case 'affiliateFeeSettings': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/fee-settings`;
      break;
    }
    case 'affiliateBankAccounts': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/bank-accounts`;
      break;
    }
    case 'affiliateBankAccount': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/bank-accounts/${id[1]}`;
      break;
    }
    case 'affiliateMoneyTransfers': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/money-transfers`;
      break;
    }
    case 'affiliateAddresses': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/addresses`;
      break;
    }
    case 'affiliateAddress': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/addresses/${id[1]}`;
      break;
    }
    case 'affiliateActivities': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/activities`;
      break;
    }
    case 'affiliateCustomers': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/customers`;
      break;
    }
    case 'affiliateFinanceStats': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/finance-stats`;
      break;
    }
    case 'affiliateTransactions': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/transactions`;
      break;
    }
    case 'affiliateStats': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/stats`;
      break;
    }
    case 'affiliateTimeline': {
      endpoint = `affiliates/${getIndex(id, 0, affiliateID)}/timeline`;
      break;
    }

    // ORGANIZATION
    case 'orgs': {
      endpoint = `orgs`;
      break;
    }

    case 'orgVerification': {
      endpoint = `orgs/${orgID}/verifications/${id[0]}`;
      break;
    }

    case 'gbx3Org': {
      endpoint = `orgs/${orgID}`;
      break;
    }

    case 'gbxPreview': {
      endpoint = `articles/${id[0]}/gbx-preview`;
      break;
    }

    case 'org': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}`;
      break;
    }
    case 'orgOwner': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/owner`;
      break;
    }
    case 'claimOrg': {
      endpoint = `orgs/${id[0]}/owner`;
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
      endpoint = `orgs/${getIndex(id, 0, orgID)}/legal-entity`;
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
      endpoint = `orgs/${getIndex(id, 0, orgID)}/principals`;
      break;
    }
    case 'orgPrincipal': {
      endpoint = `orgs/${orgID}/principals/${id[0]}`;
      break;
    }
    case 'orgCustomers': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/customers`;
      break;
    }
    case 'orgCustomer': {
      if (orgID) endpoint = `orgs/${orgID}/customers/${id[0]}`;
      else endpoint = `orgs/${id[0]}/customers/${id[1]}`;
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
      endpoint = `orgs/${getIndex(id, 0, orgID)}/bank-accounts`;
      break;
    }
    case 'orgBankAccount': {
      endpoint = `orgs/${orgID}/bank-accounts/${id[0]}`;
      break;
    }
    case 'orgBankAccountAdded': {
      endpoint = `orgs/${orgID}/bank-accounts/${id[0]}/email`;
      break;
    }
    case 'orgAddresses': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/addresses`;
      break;
    }
    case 'orgAddress': {
      endpoint = `orgs/${orgID}/addresses/${id[0]}`;
      break;
    }
    case 'orgStats': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/stats`;
      break;
    }
    case 'orgTimeline': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/timeline`;
      break;
    }
    case 'orgUnderwriting': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/underwriting`;
      break;
    }
    case 'orgStatus': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/status`;
      break;
    }
    case 'orgSubmitToVantiv': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/vantiv`;
      break;
    }
    case 'orgContactRequest': {
      endpoint = `orgs/${orgID}/contact-request`;
      break;
    }
    case 'orgChargebacks': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/chargeback-transactions`;
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
      endpoint = `orgs/${getIndex(id, 0, orgID)}/transactions`;
      break;
    }
    case 'orgFinanceStats': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/finance-stats`;
      break;
    }
    case 'orgMoneyTransfers': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/money-transfers`;
      break;
    }
    case 'orgPurchases': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/purchases`;
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
    case 'orgArticles': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/articles`;
      break;
    }
    case 'orgArticlesOrder': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/articles/orderby`;
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
    case 'orgFundraiserAmounts': {
      endpoint = `orgs/${orgID}/fundraisers/${id[0]}/amounts`;
      break;
    }
    case 'orgFundraiserAmount': {
      endpoint = `orgs/${orgID}/fundraisers/${id[0]}/amounts/${id[1]}`;
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
    case 'superOrgEventTickets': {
      endpoint = `orgs/${id[0]}/events/${id[1]}/tickets`;
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
    case 'orgInvoiceAmounts': {
      endpoint = `orgs/${orgID}/invoices/${id[0]}/amounts`;
      break;
    }
    case 'orgInvoiceAmount': {
      endpoint = `orgs/${orgID}/invoices/${id[0]}/amounts/${id[1]}`;
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
    case 'orgMembershipPublish': {
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
    case 'orgEmailActivities': {
      endpoint = `orgs/${orgID}/email-activities`;
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
    case 'orgMediaItems': {
      endpoint = `orgs/${getIndex(id, 0, orgID)}/media-items`;
      break;
    }
    case 'orgMediaItem': {
      endpoint = `orgs/${orgID}/media-items/${id[0]}`;
      break;
    }
    case 'orgBackgroundTasks': {
      endpoint = `orgs/${orgID}/background-tasks`;
      break;
    }
    case 'orgBackgroundTask': {
      endpoint = `orgs/${orgID}/background-tasks/${id[0]}`;
      break;
    }
    case 'orgRewardProgress': {
      endpoint = `orgs/${orgID}/reward-progress`;
      break;
    }
    case 'orgRewardPoints': {
      endpoint = `orgs/${orgID}/reward-points`;
      break;
    }
    case 'orgActivities': {
      endpoint = `orgs/${orgID}/audit-activities`;
      break;
    }
    case 'orgActivityArchives': {
      endpoint = `orgs/${orgID}/audit-activity-archives`;
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
    case 'articleMediaItems': {
      endpoint = `articles/${id[0]}/media-items`;
      break;
    }
    case 'articleMediaItem': {
      endpoint = `articles/${id[0]}/media-items/${id[1]}`;
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
      endpoint = `orgs/${orgID}/inapp/subscriptions`;
      break;
    }
    case 'inappOrgSubscription': {
      endpoint = `orgs/${orgID}/inapp/subscriptions/${id[0]}`;
      break;
    }
    case 'inappOrgCredits': {
      endpoint = `orgs/${orgID}/inapp/store-credits`;
      break;
    }
    case 'inappOrgCredit': {
      endpoint = `orgs/${orgID}/inapp/store-credits/${id[0]}`;
      break;
    }
    case 'inappOrgTransactions': {
      endpoint = `orgs/${orgID}/inapp/transactions`;
      break;
    }
    case 'inappOrgBalance': {
      endpoint = `orgs/${orgID}/inapp/balance`;
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
    case 'googleLink': {
      endpoint = `google/oauth2link`;
      break;
    }
    case 'googleImport': {
      endpoint = `google/contacts/emails`;
      break;
    }
    case 'googleList': {
      endpoint = `google/contact-customers`;
      break;
    }
    case 'hubspot': {
      endpoint = `hubspot/contacts`;
      break;
    }
    case 'zohoContacts': {
      endpoint = `zoho/contacts`;
      break;
    }
    case 'zohoAccounts': {
      endpoint = `zoho/accounts`;
      break;
    }

    // DEFAULT
    default:
      console.error('No endpoint found: ', resource);
      break;
  }

  obj.endpoint = endpoint;

  return obj;
}
