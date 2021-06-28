import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import Portal from '../../common/Portal';
import Image from '../../common/Image';
import CircularProgress from '../../common/CircularProgress';
import LinearBar from '../../common/LinearBar';
import Slider from 'react-slick';
import '../../styles//slick.css';
import '../../styles/slick-theme.css';
import {
  savingSignup
} from '../redux/gbx3actions';

class SavingSignup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };
  }

  componentDidMount() {
    this.setProgress();
  }

  componentDidUpdate(prevProps) {
  }

  componentWillUnmount() {
    this.props.savingSignup(false);
  }

  setProgress() {
    const progress = this.state.progress + 1;
    if (progress < 100) {
      setTimeout(() => {
        this.setState({ progress }, () => this.setProgress())
      }, 40)
    } else {
      this.setState({ progress: 100 }, () => {
        if (this.props.savingSignupCallback) this.props.savingSignupCallback();
        else console.error('No saving signup callback defined');
      });
    }
  }

  render() {

    const {
      progress
    } = this.state;

    const rootEl = document.getElementById('modal-root');
    const numCompleted = 5;
    const stepNumber = 5;
    const stepsTodo = 6;
    const stepProgress = parseInt((stepNumber / stepsTodo) * 100);
    const oneStep = parseInt(100 / 6);
    const leftPercent = parseInt(stepProgress - oneStep);

    return (
      <Portal id='savingSignup' rootEl={rootEl}>
        <div className='modal gbx3Steps'>
          <div className='modalOverlay'>
            <div className='modalContent' style={{ width: '85%' }}>
              <div className='gbx3Steps modalWrapper'>
                <div className='stepsWrapperTop' style={{ marginBottom: 10 }}>
                  <div className='stepsTopLogo'>
                    <Image size='thumb' maxSize={30} url={'https://cdn.givebox.com/givebox/public/gb-logo5.png'} alt='Givebox' />
                  </div>
                  <div className='stepsTopTitle'>
                    <span className={`icon icon-save`}></span> Saving...
                  </div>
                </div>
                <div className='progressWrapper'>
                  <div className='progressBarArchetype'>
                    <LinearBar
                      progress={stepProgress}
                    />
                  </div>
                  <div className='progressBarReflector'>
                    <LinearBar
                      progress={stepProgress}
                    />
                  </div>
                  <div style={{ left: `${leftPercent}%` }} className='progressStatusText'>
                    Step {stepNumber} of {stepsTodo}
                  </div>
                </div>
                <div className='stepContainer'>
                  <div className={`step`}>
                    <div className='stepTitleContainer'>
                      <div className='stepTitle'>
                        You are seconds away from sharing your fundraiser!
                      </div>
                    </div>
                    <div className={`stepComponent`}>
                      <div className="goalContainer">
                        <div className="goalContainerText">
                          <span className="goalPercentText moneyAmount">{(progress && progress > 0 ? progress : 0)}<span className="symbol">%</span></span>
                        </div>
                        <Image
                          url={'https://cdn.givebox.com/givebox/public/images/step-loader.png'}
                          maxSize={250}
                          alt='Saving Progress'
                          className='stepLoader'
                        />
                        {/*
                        <CircularProgress
                          progress={progress}
                          startDegree={0}
                          progressWidth={20}
                          trackWidth={20}
                          cornersWidth={10}
                          size={220}
                          fillColor='transparent'
                          trackColor={'#fff'}
                          progressColor={'#0e0526'}
                          progressColor2={'#1d01ac'}
                          gradient={true}
                        />
                        */}
                      </div>
                    </div>
                  </div>
                  <div className='button-group'>
                    <div className='button-item' style={{ width: 150 }}>
                    </div>
                    <div className='button-item'>
                    </div>
                    <div className='button-item' style={{ width: 150 }}>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Portal>
    )
  }
}

function mapStateToProps(state, props) {

  const savingSignupValue = util.getValue(state, 'gbx3.savingSignup');
  const savingSignupCallback = util.getValue(state, 'gbx3.savingSignupCallback');

  return {
    savingSignupValue,
    savingSignupCallback
  }
}

export default connect(mapStateToProps, {
  savingSignup
})(SavingSignup);
