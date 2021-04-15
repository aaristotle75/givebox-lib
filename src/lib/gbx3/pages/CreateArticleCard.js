import React from 'react';
import { connect } from 'react-redux';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import history from '../../common/history';
import Dropdown from '../../form/Dropdown';

const GBX_URL = process.env.REACT_APP_GBX_URL;

class CreateArticleCard extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
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
        this.props.createFundraiser(createKind);
      }
    }
    if (!this.state.dropdownOpen) this.setState({ dropdownOpen: true });
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

    const buttonText = signup ? 'Start Fundraiser' : kind === 'all' ? 'Create a Fundraiser' : `Create ${types.kind(defaultKind).name}`;

    const editButton =
      <button className='tooltip blockEditButton'>
        <span className='tooltipTop'><i />Click to {buttonText}</span>
        <span className='icon icon-plus'></span>
      </button>
    ;

    if ( signup || (!hideCard && stage === 'admin' && editable && !util.isEmpty(hasAccessToEdit))) {
      return (
        <div className={`listItem createArticleCard`}>
          <div className='articleCard'>
            <div onClick={this.onClick} className='articleCardEdit orgAdminEdit'>
            {kind === 'all' ?
              <Dropdown
                open={this.state.dropdownOpen}
                closeCallback={() => {
                  this.setState({ dropdownOpen: false });
                }}
                name='createKind'
                portalID={`createKind-dropdown-portal-${kind}`}
                portal={false}
                portalClass={'gbx3 articleCardDropdown createArticleCard'}
                portalLeftOffset={5}
                className='articleCard'
                contentWidth={300}
                label={''}
                selectLabel={''}
                fixedLabel={false}
                onChange={(name, value) => {
                  this.setState({ createKind: value, dropdownOpen: false }, () => {
                    this.props.createFundraiser(value);
                  });
                }}
                options={this.props.selectKindOptions}
                hideIcons={true}
                hideButton={true}
                showCloseBtn={true}
              >
                {editButton}
              </Dropdown>
            :
              editButton
            }
            </div>
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
                <div className='cardButton'>
                  {buttonText}
                </div>
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
})(CreateArticleCard);
