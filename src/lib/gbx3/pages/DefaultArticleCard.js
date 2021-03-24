import React from 'react';
import { connect } from 'react-redux';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import {
  createFundraiser
} from '../redux/gbx3actions';
import history from '../../common/history';
import Dropdown from '../../form/Dropdown';

const GBX_URL = process.env.REACT_APP_GBX_URL;

class DefaultArticleCard extends React.Component {

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
      orgID
    } = this.props;

    const {
      createKind
    } = this.state;

    if (!orgID) {
      if (this.props.noOrgIDCallback) this.props.noOrgIDCallback();
    } else {
      console.log('execute orgID -> ', orgID, createKind);
    }
    if (!this.state.dropdownOpen) this.setState({ dropdownOpen: true });
  }

  async createFundraiser(kind) {
    const cleared = await this.props.clearGBX3(true);
    if (cleared) {
      this.props.createFundraiser(kind, this.createFundraiserCallback);
    }
    window.parent.postMessage('gbx3Created', '*');
  }

  createFundraiserCallback(res, err) {

    this.setState({ loading: false });

    if (!util.isEmpty(res) && !err) {
      const articleID = util.getValue(res, 'articleID', 'new');
      history.push(`${GBX_URL}/${articleID}?admin`);
    }
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
      hideCard
    } = this.props;

    const tag = signup ? 'How do I raise money?' : `${types.kind(defaultKind).name}`;
    const title = signup ? 'Create Your First Fundraiser' : `Create ${types.kind(defaultKind).name}`;
    const kindSpecific = signup ? 'Get your first donation today!' : ``;
    const buttonText = signup ? 'Click Here to Create Fundraiser' : `Create ${types.kind(defaultKind).name}`;

    if (!hideCard && stage === 'admin' && editable && !util.isEmpty(hasAccessToEdit)) {
      return (
        <div className='listContainer defaultArticleCard'>
          <div
            className='listItem'
            onClick={this.onClick}
          >
            <div className='articleCard'>
              <div className='articleCardContainer'>
                <div className='cardPhotoContainer'>
                  <div className='cardPhotoImage'>
                    <Image imgID='cardPhoto' url={`https://cdn.givebox.com/givebox/public/images/backgrounds/raise-${defaultKind}-lg.png`} maxWidth='325px' size='medium' alt='Card Photo' />
                  </div>
                </div>
                {/*
                <div className='cardInfoContainer'>
                  <div className='cardArticleTag'>
                    {tag}
                  </div>
                  <div className='cardInfo'>
                  </div>
                </div>
                <div className='cardTitleContainer'>
                  <h2>{title} <span className='icon icon-chevron-right'></span></h2>
                </div>
                <div className='cardKindSpecificContainer'>
                  <div className={`cardKindSpecific cardKindEventWhere`}>
                    {kindSpecific}
                  </div>
                </div>
                */}
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
                      portalClass={'gbx3 dropdown-portal defaultArticleCard'}
                      contentWidth={300}
                      label={''}
                      selectLabel={''}
                      fixedLabel={false}
                      onChange={(name, value) => {
                        this.setState({ createKind: value, dropdownOpen: false }, () => {
                          console.log('create fundraiser -> ', this.state.createKind);
                        });
                      }}
                      options={this.selectKindOptions()}
                      hideIcons={true}
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
        </div>
      )
    } else {
      return (
        <span className='noRecords'>No Search Results</span>
      )
    }
  }
}

DefaultArticleCard.defaultProps = {
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
  createFundraiser
})(DefaultArticleCard);
