/*
* Get the prefix of the resource to auto determine the primary ID
* @param (string) resource
*
* The resource should always include the priamry identifer (e.g. org, user, super) and be
* separated by dashes. The first index shoud always contain the prefix
* (e.g. org-customers where "org" is the prefix to automatically use to the orgID)
*/
export var prefix = function getResourcePrefix(resource) {
  var arr = resource.split("-");
  return arr[0];
};
/*
* Get a Givebox API endpoint
*
* @param (string) resource The name of the resource
* @param (array) ids An array of ID's in order used in the endpoint
*
*/

export var endpoint = function getAPIEndpoint(resource) {
  var ids = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var endpoint;

  switch (resource) {
    // User
    case 'session':
      {
        endpoint = "session";
        break;
      }

    case 'user-memberships':
      {
        endpoint = "users/".concat(ids[0], "/memberships");
        break;
      }
    // Organization

    case 'org':
      {
        endpoint = "orgs/".concat(ids[0]);
        break;
      }

    case 'org-customers':
      {
        endpoint = "orgs/".concat(ids[0], "/customers");
        break;
      }

    case 'org-customer':
      {
        endpoint = "orgs/".concat(ids[0], "/customers/").concat(ids[1]);
        break;
      }
    // no default
  }

  return endpoint;
};