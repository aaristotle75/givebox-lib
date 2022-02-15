import Form from './form/Form';
import Select from './form/Select';
import Dropdown from './form/Dropdown';
import TextField from './form/TextField';
import RichTextField from './form/RichTextField';
import Choice from './form/Choice';
import CalendarField from './form/CalendarField';
import CalendarRange from './form/CalendarRange';
import ColorPicker from './form/ColorPicker';
import WhereField from './form/WhereField';
import Upload from './form/Upload';
import UploadLibrary from './form/UploadLibrary';
import MediaLibrary from './form/MediaLibrary';
import UploadPrivate from './form/UploadPrivate';
import * as _v from './form/formValidate';
import * as selectOptions from './form/selectOptions';

import ModalLink from './modal/ModalLink';
import ModalRoute from './modal/ModalRoute';
import Popup from './modal/Popup';
import Balloon from './modal/Balloon';

import ActionsMenu from './table/ActionsMenu';
import Search from './table/Search';
import Table from './table/Table';
import MaxRecords from './table/MaxRecords';
import NoRecords from './table/NoRecords';
import Paginate from './table/Paginate';
import Export, { DownloadFileConnect } from './table/Export';
import Filter from './table/Filter';

import StatBlock from './block/StatBlock';
import ActionBar from './block/ActionBar';
import CodeBlock from './block/CodeBlock';

import { Alert } from './common/Alert';
import CircularProgress from './common/CircularProgress';
import Collapse from './common/Collapse';
import CustomBtn from './common/CustomBtn';
import Delete from './common/Delete';
import Error from './common/Error';
import Fade from './common/Fade';
import GBLink from './common/GBLink';
import GBX from './common/GBX';
import GBXWidget from './common/GBXWidget';
import Icon from './common/Icon';
import Iframe from './common/Iframe';
import Image from './common/Image';
import ImageDisplay from './common/ImageDisplay';
import history from './common/history';
import LinearBar from './common/LinearBar';
import Loader from './common/Loader';
import NetworkError from './common/NetworkError';
import Portal from './common/Portal';
import Redirect from './common/Redirect';
import Remove from './common/Remove';
import ScrollTop from './common/ScrollTop';
import Tabs, { Tab } from './common/Tabs';
import * as types from './common/types';
import * as util from './common/utility';
import Video from './common/Video';

import FeesGlossary from './glossary/Fees';

import {
  toggleLeftMenu,
  openLaunchpad,
  toggleModal,
  removeResource,
  setAccess,
  resourceProp,
  getAPI,
  sendAPI,
  setAppRef,
  setModalRef,
  setProp,
  setPrefs,
  setCustomProp,
  sendResponse,
  startMasquerade,
  endMasquerade
} from './api/actions';

import {
  loadGBX3,
  createFundraiser,
  updateGBX3,
  clearGBX3,
  updateInfo,
  updateLayouts,
  updateBlocks,
  updateBlock,
  addBlock,
  removeBlock,
  updateGlobals,
  updateGlobal,
  updateData,
  updateFees,
  updateAdmin,
  updateAvailableBlocks,
  toggleAdminLeftPanel,
  updateCart,
  updateCartItem,
  updateConfirmation,
  updateHelperSteps,
  saveGBX3,
  saveReceipt,
  resetGBX3,
  resetGBX3Receipt,
  resetCart,
  resetConfirmation,
  setLoading,
  setStyle,
  resetStyle,
  processTransaction,
  getMinStepNotCompleted
} from './gbx3/redux/gbx3actions';

import {
  gbx3 as gbx3reducer
} from './gbx3/redux/gbx3reducers';

import {
  getLinkToken,
  accessToken,
  getPlaidInfo,
  setMerchantApp
} from './gbx3/redux/merchantActions';

import {
  merchantApp as merchantAppReducer
} from './gbx3/redux/merchantReducers';

import GBX3 from './gbx3/GBX3';
import Block from './gbx3/blocks/Block';
import Text from './gbx3/blocks/Text';
import Media from './gbx3/blocks/Media';
import ButtonLink from './gbx3/blocks/ButtonLink';
import GBX3Editor from './gbx3/blocks/Editor';
import { blockTemplates, defaultBlocks } from './gbx3/blocks/blockTemplates';

import * as launchpadConfig from './gbx3/admin/launchpad/launchpadConfig';

import {
  app,
  resource,
  send,
  modal,
  preferences,
  custom
} from './api/reducers';

import {
  getResource,
  reloadResource,
  sendResource,
  savePrefs
} from './api/helpers';

import * as giveboxAPI from './api/givebox';

// Help Desk
import HelpDesk from './helpdesk/HelpDesk';
import TicketForm from './helpdesk/TicketForm';
import { zohoCats } from './helpdesk/zohoCats';
import Articles from './helpdesk/Articles';
import HelpDeskButton from './helpdesk/HelpDeskButton';

// Editor
import CustomCKEditor4 from './editor/CustomCKEditor4';
import CKEditorUpload from './editor/CKEditorUpload';

export {
  // Form
  Form,
  _v,
  selectOptions,
  Select,
  TextField,
  Dropdown,
  RichTextField,
  Choice,
  CalendarField,
  CalendarRange,
  ColorPicker,
  Upload,
  UploadLibrary,
  UploadPrivate,
  WhereField,
  MediaLibrary,

  // actions
  toggleLeftMenu,
  openLaunchpad,
  toggleModal,
  removeResource,
  setAccess,
  resourceProp,
  getAPI,
  sendAPI,
  setAppRef,
  setModalRef,
  setProp,
  setPrefs,
  setCustomProp,
  sendResponse,
  startMasquerade,
  endMasquerade,

// gbx3
  GBX3,
  gbx3reducer,
  launchpadConfig,
  blockTemplates,
  defaultBlocks,
  Block,
  Text,
  Media,
  ButtonLink,
  GBX3Editor,

// gbx3 actions
  loadGBX3,
  createFundraiser,
  updateGBX3,
  clearGBX3,
  updateInfo,
  updateLayouts,
  updateBlocks,
  removeBlock,
  addBlock,
  updateBlock,
  updateGlobals,
  updateGlobal,
  updateData,
  updateFees,
  updateAdmin,
  updateAvailableBlocks,
  toggleAdminLeftPanel,
  updateCart,
  updateCartItem,
  updateConfirmation,
  updateHelperSteps,
  saveGBX3,
  saveReceipt,
  resetGBX3,
  resetGBX3Receipt,
  resetCart,
  setLoading,
  resetConfirmation,
  setStyle,
  resetStyle,
  processTransaction,
  getMinStepNotCompleted,

  // Merchant Actions
  getLinkToken,
  accessToken,
  getPlaidInfo,
  setMerchantApp,

  // Merchant Reducers
  merchantAppReducer,

  // API
  giveboxAPI,
  getResource,
  reloadResource,
  sendResource,
  savePrefs,

  // reducers
  app,
  resource,
  send,
  modal,
  preferences,
  custom,

  // Modal
  ModalLink,
  ModalRoute,

  // Table
  ActionsMenu,
  Search,
  Table,
  MaxRecords,
  NoRecords,
  Paginate,
  Export,
  DownloadFileConnect,
  Filter,

  // Block
  StatBlock,
  ActionBar,
  CodeBlock,

  // common
  Alert,
  CircularProgress,
  Collapse,
  CustomBtn,
  Delete,
  Error,
  Fade,
  GBLink,
  GBX,
  GBXWidget,
  Icon,
  Iframe,
  Image,
  ImageDisplay,
  history,
  LinearBar,
  Loader,
  NetworkError,
  Popup,
  Balloon,
  Portal,
  Redirect,
  Remove,
  ScrollTop,
  Tabs,
  Tab,
  types,
  util,
  Video,

  // Glossary
  FeesGlossary,

  // Help Desk
  HelpDesk,
  TicketForm,
  zohoCats,
  Articles,
  HelpDeskButton,

  // Editor
  CustomCKEditor4,
  CKEditorUpload
};
