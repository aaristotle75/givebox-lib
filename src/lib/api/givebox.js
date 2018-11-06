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
export const endpoint = function getAPIEndpoint(resource, id = [], opts = {}) {
  const {
    userID,
    orgID
  } = opts;
  let endpoint;

  switch (resource) {
    // User
    case 'session': {
      endpoint = `session`;
      break;
    }
    case 'userMemberships': {
      endpoint = `users/${userID}/memberships`;
      break;
    }

    // Organization
    case 'org': {
      endpoint = `orgs/${orgID}`;
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
    case 'bankAccounts': {
      endpoint = `orgs/${orgID}/bank-accounts`;
      break;
    }
    case 'bankAccount': {
      endpoint = `orgs/${orgID}/bank-accounts/${id[0]}`;
      break;
    }

    default:
      console.error('No endpoint found.');
      break;
  }

  return endpoint;
}
