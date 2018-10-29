
/*
* Get a Givebox API endpoint
*
* @param (string) resource The name of the resource
* @param (array) ids An array of ID's in order used in the endpoint
*
*/
export const endpoint = function getAPIEndpoint(resource, ids = []) {
  let endpoint;
  switch (resource) {
    // User
    case 'session': {
      endpoint = `session`;
      break;
    }
    case 'userMemberships': {
      endpoint = `users/${ids[0]}/memberships`;
      break;
    }

    // Organization
    case 'org': {
      endpoint = `orgs/${ids[0]}`;
      break;
    }

    // Customer
    case 'orgCustomers': {
      endpoint = `orgs/${ids[0]}/customers`;
      break;
    }
    case 'orgCustomer': {
      endpoint = `orgs/${ids[0]}/customers/${ids[1]}`;
      break;
    }

    // no default
  }

  return endpoint;
}
