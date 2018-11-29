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
*
*/
export var endpoint = function getAPIEndpoint(resource) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var userID = opts.userID,
      orgID = opts.orgID;
  var endpoint;

  switch (resource) {
    // User
    case 'session':
      {
        endpoint = "session";
        break;
      }

    case 'userMemberships':
      {
        endpoint = "users/".concat(userID, "/memberships");
        break;
      }
    // Organization

    case 'org':
      {
        endpoint = "orgs/".concat(orgID);
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

    default:
      console.error('No endpoint found.');
      break;
  }

  return endpoint;
};