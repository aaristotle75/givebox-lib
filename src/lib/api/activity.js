import {
	sendResource,
	getResource
} from './helpers';
import * as util from '../common/utility';
import Moment from 'moment';

export function trackActivity(resourceName, method, data, endpoint, res) {
	return (dispatch, getState) => {
		const resource = util.getValue(getState(), 'resource', {});
		const session = util.getValue(resource, 'session', {});
		const user = getSessionUser(util.getValue(session, 'data', {}));
		const desc = getActivity(resourceName, method, data, res);
		if (!util.isEmpty(desc)) {
			const activityData = {
				userID: util.getValue(user, 'ID', null),
				URLPath: endpoint,
				description: desc,
				method: method,
				slug: resourceName
			};
			dispatch(shouldSaveActivity(activityData, resourceName));
		}
	}
}

function shouldSaveActivity(data, slug) {
	return (dispatch, getState) => {
		const checkTime = parseInt(Moment().subtract(1, 'minute').format('x')/1000);
		const orgID = util.getValue(getState().resource, 'orgID', null);

		if (orgID) {
			dispatch(getResource('orgActivities', {
				orgID,
				reload: true,
				search: {
					filter: `slug:"${slug}"%3BcreatedAt:>d${checkTime}`
				},
				callback: (res, err) => {
					const total = !util.isEmpty(res) ? util.getValue(res, 'total', 0) : 0;
					if (total === 0) {
						dispatch(saveActivity(data));
					}
				}
			}));
		}
	}
}

function saveActivity(data) {
	return (dispatch, getState) => {
		const orgID = util.getValue(getState().resource, 'orgID', null);
		if (orgID) {
			dispatch(sendResource('orgActivities', {
				orgID,
				method: 'post',
				data,
				isSending: false,
				trackActivity: false,
				reload: false
			}));
		}
	}
}

function getSessionUser(session) {
	const user = {};
	if (util.getValue(session, 'masker')) {
		Object.assign(user, util.getValue(session, 'masker', {}));
	} else {
		Object.assign(user, util.getValue(session, 'user', {}));
	}
	return user;
}

function getActivity(resource, method, data, res) {
	let methodDesc = '';
	switch (method.toLowerCase()) {
		case 'post': {
			methodDesc = 'Added';
			break;
		}

		case 'put':
		case 'patch': {
			methodDesc = 'Edited';
			break;
		}

		case 'delete': {
			methodDesc = 'Deleted';
			break;
		}

		// no default
	}
	let desc =  util.getValue(data, 'activityDesc');
	const user = util.getValue(data, 'user', {});
	switch(resource) {
		case 'org': {
			desc = desc || `Nonprofit Profile`;
			break;
		}

		case 'orgLegalEntity': {
			desc = desc || `Nonprofit Merchant Application`;
			break;
		}

		case 'orgMembers':
		case 'orgMember': {
			desc = desc || `Team Member: ${util.getValue(user, 'firstName')} ${util.getValue(user, 'lastName')} <${util.getValue(user, 'email')}>`;
			break;
		}

		case 'orgCustomers': {
			methodDesc = '';
			desc = desc || `Imported Customers`;
			break;
		}

		case 'orgCustomer': {
			desc = desc || `Customer: ${util.getValue(user, 'firstName')} ${util.getValue(user, 'lastName')} <${util.getValue(user, 'email')}>`;
			break;
		}

		case 'orgKeys': {
			desc = desc || `API Keys`;
			break;
		}

		case 'orgBankAccounts':
		case 'orgBankAccount': {
			desc = desc || `Bank Account: ${util.getValue(data, 'name')}`;
			break;
		}

		case 'orgRecurringOrder': {
			desc = desc || `Recurring Order`;
			break;
		}

		case 'orgMoneyTransfers': {
			methodDesc = '';
			desc = desc || `Made Money Transfer in amount of ${util.getValue(data, 'amount', 0)/100}`;
			break;
		}

		case 'orgRefundPurchase': {
			methodDesc = '';
			desc = desc || `Issued Refund to ${util.getValue(res, 'cardName')}, ${util.getValue(res, 'cardType')} ${util.getValue(res, 'cardLast4')}, in amount of ${util.getValue(res, 'gross')}`;
			break;
		}

		case 'orgFundraisers':
		case 'orgFundraiser': {
			desc = desc || `Donation Form: ${util.getValue(data, 'title')}`;
			break;
		}

		case 'orgEvents':
		case 'orgEvent': {
			desc = desc || `Event Form: ${util.getValue(data, 'title')}`;
			break;
		}

		case 'orgInvoices':
		case 'orgInvoice': {
			desc = desc || `Invoice Form: ${util.getValue(data, 'title')}`;
			break;
		}

		case 'orgSweepstakes':
		case 'orgSweepstake': {
			desc = desc || `Sweepstakes Form: ${util.getValue(data, 'title')}`;
			break;
		}

		case 'orgMemberships':
		case 'orgMembership': {
			desc = desc || `Membership Form: ${util.getValue(data, 'title')}`;
			break;
		}

		case 'orgEmailLists':
		case 'orgEmailList': {
			desc = desc || `Email List: ${util.getValue(data, 'label')}`;
			break;
		}

		case 'orgEmailBlasts':
		case 'orgEmailBlast': {
			methodDesc = util.getValue(data, 'send') ? 'Sent' : methodDesc;
			desc = desc || `Email Blast: ${util.getValue(data, 'messageSubject')}`;
			break;
		}

		case 'orgAlert': {
			desc = desc || `Alerts`;
			break;
		}

		// no default
	}
	const activityDesc = !util.isEmpty(desc) ? `${methodDesc} ${desc}` : '';
	return activityDesc;
}
