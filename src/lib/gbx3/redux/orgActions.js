import * as util from '../../common/utility';
import {
  getResource
} from '../../api/helpers';
import {
  toggleModal
} from '../../api/actions';
import {
  updateOrgGlobal,
  saveOrg,
  updatePageState,
  resetPageSearch
} from './gbx3actions';
import has from 'has';

export function saveGlobal(name, obj = {}, callback) {
  return async (dispatch) => {
    const globalUpdated = await dispatch(updateOrgGlobal(name, obj));
    if (globalUpdated) {
      dispatch(saveOrg({
        callback: (res, err) => {
          if (callback) callback();
        }
      }));
    }
  }
}

export function getArticles(options = {}) {
  return (dispatch, getState) => {
    const opts = {
      reset: false,
      max: 50,
      reload: false,
      filter: '',
      query: '',
      search: false,
      showFetching: true,
      pageNumber: null,
      ...options
    };

    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const pages = util.getValue(gbx3, 'orgPages', {});
    const pageStateFromState = util.getValue(gbx3, 'pageState', {});
    const orgID = util.getValue(gbx3, 'info.orgID');
    const pageSlug = util.getValue(gbx3, 'info.activePageSlug');
    const activePage = util.getValue(pages, pageSlug, {});
    const customList = util.getValue(activePage, 'customList', []);
    const useCustomList = util.getValue(activePage, 'useCustomList', false);
    const kind = util.getValue(activePage, 'kind');

    const pageState = opts.reset ? {} : {
      ...pageStateFromState[pageSlug]
    };

    const pageNumber = opts.pageNumber ? opts.pageNumber : opts.search ? util.getValue(pageState, 'search.pageNumber', 1) : util.getValue(pageState, 'pageNumber', 1);
    const kindFilter = kind === 'all' || !kind ? '' : `%3Bkind:"${kind}"`;
    const customFilter = !util.isEmpty(customList) ? util.customListFilter(customList) : null;
    const baseFilter = customFilter && useCustomList ? customFilter : `landing:true%3Bvolunteer:false${kindFilter}`;
    const filter = `${baseFilter}${opts.filter ? `%3B${opts.filter}` : ''}`;

    dispatch(getResource('orgArticles', {
      orgID,
      customName: `${pageSlug}List`,
      reload: opts.reload,
      search: {
        filter,
        query: opts.query,
        max: opts.max,
        page: pageNumber,
        sort: useCustomList ? 'orderBy,createdAt' : 'createdAt,orderBy',
        order: useCustomList ? 'asc' : 'desc'
      },
      callback: (res, err) => {
        if (opts.search) {
          dispatch(getArticleSearchCallback(res, err, opts.query));
        } else {
          dispatch(getArticlesCallback(res, err, opts.reset));
        }
      }
    }));
  }
}

function getArticleSearchCallback(res, err, query) {

  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const pageStateFromState = util.getValue(gbx3, 'pageState', {});
    const pageSearchFromState = util.getValue(gbx3, 'pageSearch', {});
    const pageSlug = util.getValue(gbx3, 'info.activePageSlug');

    const pageState = {
      ...pageStateFromState[pageSlug]
    };

    const pageSearch = util.getValue(pageSearchFromState, pageSlug);
    const data = util.getValue(res, 'data', []);
    const pageNumber = util.getValue(pageState, 'search.pageNumber', 1);
    const list = util.getValue(pageState, 'search.list', []);
    const total = +util.getValue(res, 'total', 0);

    if (!util.isEmpty(data)) {
      if (!has(pageState, 'search')) pageState.search = {};
      pageState.search.pageNumber = total > list.length ? pageNumber + 1 : pageNumber;
      pageState.search.list = pageSearch === query ? [...list, ...data] : [...data];
      pageState.search.total = total;
      dispatch(updatePageState(pageState));
    } else {
      dispatch(resetPageSearch());
    }
  }
}

function getArticlesCallback(res, err, reset) {
  return (dispatch, getState) => {
    const gbx3 = util.getValue(getState(), 'gbx3', {});
    const pageStateFromState = util.getValue(gbx3, 'pageState', {});
    const pageSlug = util.getValue(gbx3, 'info.activePageSlug');

    const pageState = {
      ...pageStateFromState[pageSlug]
    };

    const data = util.getValue(res, 'data', []);
    const pageNumber = util.getValue(pageState, 'pageNumber', 1);
    const list = util.getValue(pageState, 'list', []);
    const total = +util.getValue(res, 'total', 0);

    if (!util.isEmpty(data)) {
      pageState.pageNumber = total > list.length ? pageNumber + 1 : pageNumber;
      pageState.list = [...list, ...data];
      pageState.total = total;
      pageState.search = {};
      dispatch(updatePageState(pageState));
    }
  }
}

export function reloadGetArticles(debug = 'unknown') {
  return async (dispatch) => {
    dispatch(updatePageState({
      list: [],
      search: {},
      pageNumber: 1,
      total: 0
    }, () => dispatch(getArticles({ reset: true, reload: true, pageNumber: 1 }))));
  }
}

export function openOrgAdminMenu(modalName, closeCallback, options = {}) {
  return (dispatch, getState) => {
    //const gbx3 = util.getValue(getState(), 'gbx3', {});
    dispatch(toggleModal(modalName, true, {
      saveGlobal: (name, obj, callback) => dispatch(saveGlobal(name, obj, callback)),
      closeCallback,
      reloadGetArticles: (debug) => dispatch(reloadGetArticles(debug)),
      getArticles: (options) => dispatch(getArticles(options)),
      ...options
    }));
  }
}
