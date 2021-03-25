import React from 'react';
import { connect } from 'react-redux';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import {
  clearGBX3,
  createFundraiser
} from '../redux/gbx3actions';
import history from '../../common/history';
import Dropdown from '../../form/Dropdown';

const GBX_URL = process.env.REACT_APP_GBX_URL;

class CreateArticleCard extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.createFundraiser = this.createFundraiser.bind(this);
    this.createFundraiserCallback = this.createFundraiserCallback.bind(this);
    this.selectKindOptions = this.selectKindOptions.bind(this);
    this.state = {
      createKind: props.defaultKind,
      dropdownOpen: false
    };
  }

  componentDidMount() {
  }

  onClick() {
    const {
      orgID,
      kind
    } = this.props;

    const {
      createKind
    } = this.state;

    if (!orgID) {
      if (this.props.noOrgIDCallback) this.props.noOrgIDCallback();
    } else {
      if (kind !== 'all') {
        this.createFundraiser(createKind);
      }
    }
    if (!this.state.dropdownOpen) this.setState({ dropdownOpen: true });
  }

  async createFundraiser(kind) {
    this.props.createFundraiser(kind, this.createFundraiserCallback, null, { showNewArticle: false });
    //window.parent.postMessage('gbx3Created', '*');
  }

  createFundraiserCallback(res, err) {
    if (this.props.createCallback) this.props.createCallback(res, err);
  }

  selectKindOptions() {
    const options = [];
    types.kinds().forEach((value) => {
      options.push(
        { primaryText: <span className='labelIcon'><span className={`icon icon-${types.kind(value).icon}`}></span> Create {types.kind(value).name}</span>, value }
      );
    });
    return options;
  }

  render() {

    const {
      stage,
      editable,
      hasAccessToEdit,
      kind,
      defaultKind,
      signup,
      hideCard,
      hideNoResults
    } = this.props;

    const tag = signup ? 'How do I raise money?' : `Admin Only`;
    const title = signup ? 'Create Your First Fundraiser' : kind === 'all' ? `Click this Card to Create a New Fundraiser` : `Click this Card to Create a New ${types.kind(kind).name}`;

    const buttonText = signup ? 'Start Fundraiser' : `New ${types.kind(defaultKind).name}`;

    if (!hideCard && stage === 'admin' && editable && !util.isEmpty(hasAccessToEdit)) {
      return (
        <div
          className='listItem createArticleCard'
          onClick={this.onClick}
        >
          <div className='articleCard'>
            <div className='articleCardContainer'>
              <div className='cardPhotoContainer'>
                <div className='cardPhotoImage'>
                  <Image imgID='cardPhoto' url={`https://cdn.givebox.com/givebox/public/images/backgrounds/raise-${defaultKind}-lg.png`} maxWidth='325px' size='medium' alt='Card Photo' />
                </div>
              </div>
              <div className='cardInfoContainer'>
                <div className='cardArticleTag'>
                  {tag}
                </div>
                <div className='cardInfo'>
                </div>
              </div>
              <div className='cardTitleContainer'>
                <h2>{title}</h2>
              </div>
              <div className='cardKindSpecificContainer'>
                <div className={`cardKindSpecific cardKindEventWhere`}>
                  This card is hidden from public view.
                </div>
              </div>
              <div className='cardButtonContainer'>
                {kind === 'all' ?
                  <Dropdown
                    open={this.state.dropdownOpen}
                    closeCallback={() => {
                      this.setState({ dropdownOpen: false });
                    }}
                    name='createKind'
                    portalID={`createKind-dropdown-portal-${kind}`}
                    portal={true}
                    portalClass={'gbx3 dropdown-portal createArticleCard'}
                    className='createArticleCard'
                    contentWidth={300}
                    label={''}
                    selectLabel={''}
                    fixedLabel={false}
                    onChange={(name, value) => {
                      this.setState({ createKind: value, dropdownOpen: false }, () => {
                        this.createFundraiser(value);
                      });
                    }}
                    options={this.selectKindOptions()}
                    hideIcons={true}
                    hideButton={true}
                  >
                    <div className='cardButton'>
                      Create a Fundraiser
                    </div>
                  </Dropdown>
                :
                  <div className='cardButton'>
                    {buttonText}
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        hideNoResults ? null : <span className='noRecords'>No Search Results</span>
      )
    }
  }
}

CreateArticleCard.defaultProps = {
  kind: 'fundraiser'
};

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const stage = util.getValue(gbx3, 'info.stage');
  const orgID = util.getValue(gbx3, 'info.orgID');
  const admin = util.getValue(gbx3, 'admin', {});
  const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
  const editable = util.getValue(admin, 'editable');
  const defaultKind = props.kind === 'all' || !props.kind ? 'fundraiser' : props.kind;

  return {
    stage,
    orgID,
    admin,
    hasAccessToEdit,
    editable,
    defaultKind
  }
}

export default connect(mapStateToProps, {
  clearGBX3,
  createFundraiser
})(CreateArticleCard);
