/*
* Get a Givebox API endpoint
*
* @param (string) resource The name of the resource
* @param (array) ids An array of ID's in order used in the endpoint
*
*/
export var endpoint = function getAPIEndpoint(resource) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
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
        endpoint = "users/".concat(id[0], "/memberships");
        break;
      }
    // Organization

    case 'org':
      {
        endpoint = "orgs/".concat(id[0]);
        break;
      }

    case 'orgCustomers':
      {
        endpoint = "orgs/".concat(id[0], "/customers");
        break;
      }

    case 'orgCustomer':
      {
        endpoint = "orgs/".concat(id[0], "/customers/").concat(id[1]);
        break;
      }
    // no default
  }

  return endpoint;
};