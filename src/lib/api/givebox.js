/*
* Get a Givebox API endpoint
*
* @param (string) resource The name of the resource
* @param (array) ids An array of ID's in order used in the endpoint
*
*/
export const endpoint = function getAPIEndpoint(resource, id = []) {
  let endpoint;
  switch (resource) {
    // User
    case 'session': {
      endpoint = `session`;
      break;
    }
    case 'userMemberships': {
      endpoint = `users/${id[0]}/memberships`;
      break;
    }

    // Organization
    case 'org': {
      endpoint = `orgs/${id[0]}`;
      break;
    }
    case 'orgCustomers': {
      endpoint = `orgs/${id[0]}/customers`;
      break;
    }
    case 'orgCustomer': {
      endpoint = `orgs/${id[0]}/customers/${id[1]}`;
      break;
    }

    // no default
  }

  return endpoint;
}
