import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import HelpfulTip from '../../common/HelpfulTip';
import GBLink from '../../common/GBLink';
import Loader from '../../common/Loader';
import {
  setSignupStep
} from '../redux/gbx3actions';
import {
  toggleModal,
  openLaunchpad
} from '../../api/actions';
import {
  getResource
} from '../../api/helpers';
import Icon from '../../common/Icon';
import { AiOutlineBank } from 'react-icons/ai';
import { phases } from '../signup/signupConfig';

class MoneyRaised extends React.Component {

  constructor(props) {
    super(props);
    this.openStep = this.openStep.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
    this.getTransactions();
  }

  getTransactions() {
    this.props.getResource('orgFinanceStats', {
      reload: true,
      isSending: false
    });
    this.props.getResource('orgStats', { reload: true, isSending: false });
    this.props.getResource('orgTransactions', {
      customName: 'latestTransactions',
      search: {
        sort: 'updatedAt',
        order: 'desc',
        filter: '(state:"approved"%2Cstate:"if_batch")%3BtxType:"credit"',
        max: 10
      },
      reload: true,
      isSending: false
    });
  }

  openStep(value, modalName) {
    this.props.setSignupStep(value, () => {
      this.props.toggleModal(modalName, true);
    });
  }

  render() {

    const {
      signupPhase,
      completedPhases,
      completed
    } = this.props;

    if (util.isLoading(this.props.orgStats) || util.isLoading(this.props.latestTransactions)) return <Loader msg='Loading latest transacitons and stats...' />

    const orgStats = util.getValue(this.props.orgStats, 'data', {});
    const netTotal = util.numberWithCommas(parseFloat(util.getValue(orgStats, 'netTotal', 0)/100).toFixed(2));

    const content = {};

    if (!signupPhase || completedPhases.length === phases.length) {
      content.headerIcon = <Icon><AiOutlineBank /></Icon>;
      content.headerText = 'Manage Money';
      content.text =
        <div className='moneyRaisedTooltipContent'>
          Click the button below to manage your money raised.
          <span style={{ marginTop: 10, display: 'block' }}>
            If you have an approved bank account you can transfer money.
          </span>
          <div className='button-group flexCenter'>
            <GBLink className='button' onClick={() => this.props.openLaunchpad({ autoOpenSlug: 'money' })}>
              Manage Money
            </GBLink>
          </div>
        </div>
      ;
    } else {
      content.headerIcon = <span className='icon icon-trending-up'></span>;
      content.headerText = 'How do I Raise Money?';
      content.text =
        <div className='moneyRaisedTooltipContent'>
          Simply share your fundraiser on social media or send an email to all your supporters with your share link.
          <span style={{ marginTop: 10, display: 'block' }}>
            Make sure you have a nice image or video in your fundraiser form. Your supporters are more likely to give if they know what you are raising money for.
          </span>
          <div className='button-group flexCenter'>
            <GBLink className='button' onClick={() => this.openStep('share', 'orgPostSignupSteps')}>
              Share Fundraiser
            </GBLink>
          </div>
        </div>
      ;

      switch (signupPhase) {
        case 'connectBank': {
          content.headerIcon = <Icon><AiOutlineBank /></Icon>;
          content.headerText = 'Connect Your Bank';
          content.text =
            <div className='moneyRaisedTooltipContent'>
              You must connect a bank account to be able to access any money you receive.
              <span style={{ marginTop: 10, display: 'block' }}>
                Givebox uses Plaid to connect to your bank account. Simply select your bank and login using your bank account credentials. You will then be able to choose the account to associate to Givebox.
              </span>
              <div className='button-group flexCenter'>
                <GBLink className='button' onClick={() => this.openStep('connectBank', 'orgConnectBankSteps')}>
                  Connect Bank
                </GBLink>
              </div>
            </div>
          ;
          break;
        }

        case 'transferMoney': {
          const requiredToCheckApproval = ['identity', 'verifyBank', 'verifyBusiness', 'protect'];
          const readyToCheckApproval = requiredToCheckApproval.every(c => completed.includes(c));
          const stepToOpen = readyToCheckApproval ? 'transferStatus' : 'identity';
          content.headerIcon = <Icon><AiOutlineBank /></Icon>;
          content.headerText = 'Transfer Money Steps';
          content.text =
            <div className='moneyRaisedTooltipContent'>
              To transfer money we must verify identity and banking information.
              <span style={{ marginTop: 10, display: 'block' }}>
                After you verify your identity and banking information you will not have to do this again unless you add a new bank account.
              </span>
              <div className='button-group flexCenter'>
                <GBLink className='button' onClick={() => {
                  this.openStep(stepToOpen, 'orgTransferSteps');
                }}>
                  Transfer Money Steps
                </GBLink>
              </div>
            </div>
          ;
          break;
        }

        // no default
      }
    }

    return (
      <div className='moneyRaisedContainer orgAdminOnly'>
        <div className='tooltip moneyRaised'>
          <div className='tooltipTop'>
            <HelpfulTip
              headerIcon={content.headerIcon}
              headerText={content.headerText}
              text={content.text}
              style={{ marginTop: 0 }}
            />
          </div>
          <span className='moneyRaisedLabel'>Money Raised</span>
          <span className='moneyRaisedText moneyAmount'>
            <span className='symbol'>$</span>{netTotal}
          </span>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const signupPhase = util.getValue(state, 'gbx3.orgSignup.signupPhase');
  const completedPhases = util.getValue(state, 'gbx3.orgSignup.completedPhases', []);
  const completed = util.getValue(state, 'gbx3.orgSignup.completed', []);
  const orgStats = util.getValue(state, 'resource.orgStats');
  const latestTransactions = util.getValue(state, 'resource.latestTransactions');

  return {
    signupPhase,
    completedPhases,
    completed,
    orgStats,
    latestTransactions
  }
}

export default connect(mapStateToProps, {
  setSignupStep,
  toggleModal,
  getResource,
  openLaunchpad
})(MoneyRaised);
