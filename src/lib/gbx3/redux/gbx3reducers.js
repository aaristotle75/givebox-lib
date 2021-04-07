import  * as types  from './gbx3actionTypes';
import * as util from '../../common/utility';
import {
  defaultCart,
  defaultConfirmation,
  defaultStyle,
  defaultOrgSignupElements,
  defaultGBX3SignupElements
} from './gbx3defaults';
import LZString from 'lz-string';

export function gbx3(state = {
  browse: false,
  loading: true,
  saveStatus: 'done',
  info: {
    activePageSlug: '',
    project: 'share',
    stage: 'public',
    display: 'article',
    preview: false,
    breakpoint: 'desktop',
    sourceType: 'embed',
    sourceLocation: null,
    originTemplate: '',
    checkout: false
  },
  pageSearch: {},
  pageState: {},
  orgSignup: {
    org: defaultOrgSignupElements,
    gbx3: defaultGBX3SignupElements
  },
  orgUpdated: false,
  orgGlobals: {},
  orgPages: [],
  articleCard: {},
  backgrounds: [],
  blocks: {
    card: {},
    org: {},
    article: {},
    receipt: {}
  },
  layouts: {
    org: {},
    article: {},
    receipt: {}
  },
  globals: {
    gbxStyle: {
      ...defaultStyle.gbxStyle
    },
    button: {
      ...defaultStyle.button
    },
    embedButton: {
      ...defaultStyle.embedButton
    }
  },
  data: {},
  orgData: {},
  admin: {
    allowLayoutSave: false,
    loadingLayout: true,
    editBlock: '',
    editBlockJustAdded: false,
    open: true,
    step: 'design',
    subStep: '',
    createType: 'layout',
    previewDevice: 'desktop',
    previewMode: false,
    publicView: false,
    editable: false,
    hasAccessToCreate: false,
    hasAccessToEdit: false,
    preventCollision: true,
    verticalCompact: false,
    outline: false,
    availableBlocks: {
      article: [
        'contentBlock',
        'imageBlock',
        'videoBlock'
      ],
      org: [
        'contentBlock',
        'imageBlock',
        'videoBlock',
        'campaignsBlock'
      ],
      receipt: [
        'contentBlock',
        'imageBlock'
      ]
    },
  },
  helperSteps: {
    step: 0,
    completed: [],
    advancedBuilder: false
  },
  helperBlocks: {
    article: {},
    org: {},
    receipt: {}
  },
  fees: {},
  cart: defaultCart,
  confirmation: defaultConfirmation,
  defaults: {}
}, action) {
  switch (action.type) {
    case types.UPDATE_GBX3:
      return Object.assign({}, state, {
        [action.name]: action.value
      });
    case types.SET_LOADING:
      return Object.assign({}, state, {
        loading: action.loading
      });
    case types.UPDATE_SIGNUP:
      return Object.assign({}, state, {
        signup: {
          ...state.signup,
          [action.name]: {
            ...state.signup[action.name],
            ...action.signup
          }
        }
      });
    case types.RESET_STYLE:
      return Object.assign({}, state, {
        globals: {
          ...state.globals,
          [action.styleType]: {
            ...defaultStyle[action.styleType]
          }
        }
      });
    case types.CLEAR_GBX3:
      return Object.assign({}, state, {
        blocks: {
          org: {},
          article: {},
          receipt: {}
        },
        data: {},
        orgData: action.keepOrgData ? state.orgData : {},
        fees: {},
        globals: {},
        layouts: {
          org: {},
          article: {},
          receipt: {}
        }
      });
    case types.UPDATE_INFO:
      return Object.assign({}, state, {
        info: {
          ...state.info,
          ...action.info,
        }
      });
    case types.UPDATE_PAGE_SEARCH:
      return Object.assign({}, state, {
        pageSearch: {
          ...state.pageSearch,
          [action.page]: {
            ...state.pageSearch[action.page],
            ...action.search
          }
        }
      });
    case types.UPDATE_PAGE_STATE:
      return Object.assign({}, state, {
        pageState: {
          ...state.pageState,
          [action.page]: {
            ...state.pageState[action.page],
            ...action.newState
          }
        }
      });
    case types.RESET_ORG:
      return Object.assign({}, state, {
      });
    case types.UPDATE_ORG_PAGES:
      return Object.assign({}, state, {
        orgUpdated: action.orgUpdated,
        orgPages: {
          ...state.orgPages,
          ...action.orgPages
        }
      });
    case types.ADD_ORG_PAGE: {
      const duplicate = action.duplicate;
      const orgPages = { ...state.orgPages };
      const newPageNumber = Object.keys(orgPages).length + 1;
      const hash = util.uniqueHash(1);
      const name = !util.isEmpty(duplicate) ? `Duplicate ${duplicate.name}` : `Page ${newPageNumber}`;
      const slug = !util.isEmpty(duplicate) ? `${duplicate.slug}-duplicate-${hash}` : `page-${newPageNumber}-${hash}`;
      const newPage = {
        kind: 'all',
        ...duplicate,
        name,
        slug
      };
      const customSlugs = [ ...util.getValue(state.orgGlobals, 'customSlugs', []) ];
      const customSlugIndex = customSlugs.findIndex(s => s.slug === slug);
      if (customSlugIndex === -1) {
        customSlugs.push(
          { slug, customSlug: slug }
        );
      };
      return Object.assign({}, state, {
        orgUpdated: action.orgUpdated,
        orgGlobals: {
          ...state.orgGlobals,
          customSlugs: [ ...customSlugs ]
        },
        orgPages: {
          ...orgPages,
          [slug]: {
            ...newPage
          }
        }
      });
    }
    case types.DELETE_ORG_PAGE: {
      const orgPages = { ...state.orgPages };
      delete orgPages[action.slug];
      const pagesEnabled = [ ...util.getValue(state, 'orgGlobals.pagesEnabled', []) ];
      if (pagesEnabled.includes(action.slug)) pagesEnabled.splice(pagesEnabled.indexOf(action.slug), 1);
      const customSlugs = [ ...util.getValue(state.orgGlobals, 'customSlugs', []) ];
      const customSlugIndex = customSlugs.findIndex(s => s.slug === action.slug);
      if (customSlugIndex !== -1) customSlugs.splice(customSlugIndex, 1);
      return Object.assign({}, state, {
        orgUpdated: true,
        orgPages: {
          ...orgPages
        },
        orgGlobals: {
          ...state.orgGlobals,
          pagesEnabled: [ ...pagesEnabled ],
          customSlugs: [ ...customSlugs ]
        }
      });
    }
    case types.UPDATE_ORG_PAGE:
      return Object.assign({}, state, {
        orgUpdated: true,
        orgPages: {
          ...state.orgPages,
          [action.slug]: {
            ...state.orgPages[action.slug],
            ...action.page
          }
        }
      });
    case types.UPDATE_ORG_PAGE_SLUG: {
      const orgGlobals = { ...state.orgGlobals };
      const customSlugs = [ ...util.getValue(orgGlobals, 'customSlugs', []) ];
      const customSlugObj = customSlugs.find(s => s.slug === action.slug);
      if (util.getValue(customSlugObj, 'customSlug')) {
        customSlugObj.customSlug = action.customSlug;
      } else {
        customSlugs.push(
          { slug: action.slug, customSlug: action.customSlug }
        );
      }
      return Object.assign({}, state, {
        orgUpdated: true,
        orgGlobals: {
          ...orgGlobals
        }
      });
    }
    case types.UPDATE_ORG_GLOBALS:
      return Object.assign({}, state, {
        orgUpdated: action.orgUpdated,
        orgGlobals: {
          ...state.orgGlobals,
          ...action.orgGlobals
        }
      });
    case types.UPDATE_ORG_GLOBAL:
      return Object.assign({}, state, {
        orgUpdated: true,
        orgGlobals: {
          ...state.orgGlobals,
          [action.name]: {
            ...state.orgGlobals[action.name],
            ...action.orgGlobal
          }
        }
      });
    case types.UPDATE_PAGES_ENABLED:
      return Object.assign({}, state, {
        orgUpdated: true,
        orgGlobals: {
          ...state.orgGlobals,
          pagesEnabled: [
            ...action.pagesEnabled
          ]
        }
      });
    case types.UPDATE_LAYOUTS:
      return Object.assign({}, state, {
        layouts: {
          ...state.layouts,
          [action.blockType]: {
            ...state.layouts[action.blockType],
            ...action.layouts,
          }
        }
      });
    case types.UPDATE_ARTICLE_CARD:
      return Object.assign({}, state, {
        articleCard: {
          ...state.articleCard,
          ...action.card
        }
      });
    case types.UPDATE_BLOCKS:
      return Object.assign({}, state, {
        blocks: {
          ...state.blocks,
          [action.blockType]: {
            ...state.blocks[action.blockType],
            ...action.blocks
          }
        }
      });
    case types.UPDATE_BLOCK:
      return Object.assign({}, state, {
        blocks: {
          ...state.blocks,
          [action.blockType]: {
            ...state.blocks[action.blockType],
            [action.name]: {
              ...state.blocks[action.name],
              ...action.block
            }
          }
        }
      });
    case types.REMOVE_BLOCK: {
      const blocks = util.getValue(state, `blocks.${action.blockType}`, {});
      delete blocks[action.name];
      return Object.assign({}, state, {
        blocks: {
          ...state.blocks,
          [action.blockType]: {
            ...blocks
          }
        }
      });
    }
    case types.UPDATE_BACKGROUNDS:
      return Object.assign({}, state, {
        backgrounds: {
          ...state.backgrounds,
          ...action.backgrounds
        }
      });
    case types.UPDATE_BACKGROUND:
      return Object.assign({}, state, {
        backgrounds: {
          ...state.backgrounds,
          [action.index]: {
            ...state.backgrounds[action.index],
            ...action.background
          }
        }
      });
    case types.UPDATE_GLOBALS:
      return Object.assign({}, state, {
        globals: {
          ...state.globals,
          ...action.globals,
        }
      });
    case types.UPDATE_GLOBAL:
      return Object.assign({}, state, {
        globals: {
          ...state.globals,
          [action.name]: {
            ...state.globals[action.name],
            ...action.global
          }
        }
      });
    case types.UPDATE_HELPERS:
      return Object.assign({}, state, {
        helperBlocks: {
          ...state.helperBlocks,
          [action.blockType]: {
            ...state.helperBlocks[action.blockType],
            ...action.helperBlocks
          }
        }
      });
    case types.UPDATE_HELPER_STEPS:
      return Object.assign({}, state, {
        helperSteps: {
          ...state.helperSteps,
          ...action.helperSteps
        }
      });
    case types.UPDATE_DATA:
      return Object.assign({}, state, {
        data: {
          ...state.data,
          ...action.data,
        }
      });
    case types.UPDATE_ORG:
      return Object.assign({}, state, {
        orgData: {
          ...state.orgData,
          ...action.data,
        }
      });
    case types.UPDATE_FEES:
      return Object.assign({}, state, {
        fees: {
          ...state.fees,
          ...action.fees,
        }
      });
    case types.UPDATE_ADMIN:
      return Object.assign({}, state, {
        admin: {
          ...state.admin,
          ...action.admin,
        }
      });
    case types.UPDATE_CART: {
      const cart = {
        ...state.cart,
        ...action.cart
      };
      /*
      const compressed = LZString.compressToUTF16(JSON.stringify(cart));
      util.setCookie('gbx3org', compressed, 30);
      */
      localStorage.setItem('cart', LZString.compressToUTF16(JSON.stringify(cart)));
      return Object.assign({}, state, {
        cart
      });
    }
    case types.RESET_CART:
      return Object.assign({}, state, {
        cart: {
          ...defaultCart,
          customer: {},
          items: []
        }
      });
    case types.UPDATE_CONFIRMATION:
      return Object.assign({}, state, {
        confirmation: {
          ...state.confirmation,
          ...action.confirmation
        }
      });
    case types.RESET_CONFIRMATION: {
      return Object.assign({}, state, {
        confirmation: defaultConfirmation
      });
    }
    case types.UPDATE_DEFAULTS:
      return Object.assign({}, state, {
        defaults: {
          ...state.defaults,
          ...action.defaults,
        }
      });
    case types.UPDATE_DEFAULT:
      return Object.assign({}, state, {
        defaults: {
          ...state.defaults,
          [action.name]: {
            ...state.defaults[action.name],
            ...action.defaults
          }
        }
      });
    default:
      return state;
  }
}
