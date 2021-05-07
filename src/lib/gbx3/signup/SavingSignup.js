import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import Loader from '../../common/Loader';
import Slider from 'react-slick';
import '../../../../node_modules/slick-carousel/slick/slick.css';
import '../../../../node_modules/slick-carousel/slick/slick-theme.css';
import LinearBar from '../../common/LinearBar';
import {
  savingSignup
} from '../redux/gbx3actions';

class SavingSignup extends React.Component {

  constructor(props) {
    super(props);
    this.renderSlider = this.renderSlider.bind(this);
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
      }, 140)
    } else {
      this.setState({ progress: 100 }, () => {
        this.props.savingSignupCallback();
      });
    }
  }

  renderSlider() {
    const items = [];

    const settings = {
      arrows: false,
      dots: false,
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4000,
      afterChange: (index) => {
        if (index === 2) {
          this.slider.slickPause();
        }
      }
    };

    const quotes = [
      'You can create as many fundraisers as you want with Givebox.',
      'Consider creating a Givebox Sweepstakes. It is a fun and great way to raise money.',
      'Sharing your fundraiser on social media substantially increases the money you raise.'
    ];

    for (let i=0; i <= 3; i++) {
      items.push(
        <div key={i}>
          {quotes[i]}
        </div>
      )
    }
    return (
      <Slider ref={c => (this.slider = c)} {...settings}>
        {items}
      </Slider>
    );
  }

  render() {

    const {
      progress
    } = this.state;

    return (
      <div className='savingSignup gbx3Steps'>
        <Loader
          forceText={true}
          msg='Please wait while your account is created...'
          infinite={true}
        >
          <div className='savingSignup gbx3Steps'>
            <div className='savingQuotes'>
              {this.renderSlider()}
              <div className='progressWrapper'>
                <LinearBar
                  progress={progress}
                />
                <div className='progressStatusText'>
                  {progress}% Loaded
                </div>
              </div>
            </div>
          </div>
        </Loader>
      </div>
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
