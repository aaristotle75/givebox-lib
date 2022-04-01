import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import HelpfulTip from '../../common/HelpfulTip';
import GBLink from '../../common/GBLink';
import Loader from '../../common/Loader';
import {
  setSignupStep,
  openStep
} from '../redux/gbx3actions';
import {
  toggleModal,
  openLaunchpad
} from '../../api/actions';
import Icon from '../../common/Icon';
import { AiOutlineBank } from 'react-icons/ai';
import { phases, signupPhase as signupPhases } from '../signup/signupConfig';

class MoneyRaised extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      signupPhase,
      completedPhases,
      completed,
      balance
    } = this.props;

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
          Step 1) Click Share Fundraiser below.<br />
          Step 2) Click a social media icon.<br />
          Step 3) Share your form.<br />
          <span style={{ marginTop: 10, display: 'block' }}>
            Bonus Step) Add a video to your form. Donors LOVE videos.
          </span>
          <div className='button-group flexCenter'>
            <GBLink className='button' onClick={() => this.props.openStep('previewShare', 'orgPostSignupSteps')}>
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
                <GBLink className='button' onClick={() => this.props.openStep('connectBank', 'orgConnectBankSteps')}>
                  Connect Bank
                </GBLink>
              </div>
            </div>
          ;
          break;
        }

        case 'transferMoney': {
          const requiredSteps = signupPhases.transferMoney.requiredSteps;
          const readyToCheckApproval = requiredSteps.every(c => completed.includes(c));
          const stepToOpen = readyToCheckApproval ? 'transferStatus' : 'identity';
          content.headerIcon = <Icon><AiOutlineBank /></Icon>;
          content.headerText = 'Enable Money Transfers';
          content.text =
            <div className='moneyRaisedTooltipContent'>
              To enable money transfers you must secure your account.
              <div className='button-group flexCenter'>
                <GBLink className='button' onClick={() => {
                  this.props.openStep(stepToOpen, 'orgTransferSteps');
                }}>
                  Secure Your Account
                </GBLink>
              </div>
            </div>
          ;
          break;
        }

        // no default
      }
    }

    let dollarAmount = <span className='dollarAmount'>{balance[0]}</span>;
    let centAmount = `.${balance[1]}`;

    if (balance[0].includes(',')) {
      let dollarArr = balance[0].split(',');
      dollarAmount =
        <span className='dollarAmount'>
          {dollarArr[0]}
          <span><span className='dollarComma'>,</span>{dollarArr[1]}</span>
          {dollarArr[2] && <span><span className='dollarComma'>,</span>{dollarArr[2]}</span>}
        </span>
    }

    return (
      <div className='moneyRaisedContainer'>
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
            <span className='symbol'>$</span>{dollarAmount}<span className='centAmount'><span className='centSymbol'></span>{centAmount}</span>
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

  return {
    signupPhase,
    completedPhases,
    completed
  }
}

export default connect(mapStateToProps, {
  setSignupStep,
  toggleModal,
  openLaunchpad,
  openStep
})(MoneyRaised);
