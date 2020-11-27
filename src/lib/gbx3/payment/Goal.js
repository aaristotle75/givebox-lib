import React, {Component} from 'react';
import * as util from '../../common/utility';
import CircularProgress from '../../common/CircularProgress';

class Goal extends Component {
  constructor(props){
    super(props);
    this.calculateGoalProgress = this.calculateGoalProgress.bind(this);
    this.progress = this.progress.bind(this);
    this.state = {
      progress: 0
    }
  }

  componentDidMount() {
     this.goaltimer = setTimeout(() => this.progress(0), 500);
  }

  componentWillUnmount() {
    clearTimeout(this.goaltimer);
  }

  componentWillUpdate(nextProps) {
    /*
    if (nextProps.campaign.ID != this.props.campaign.ID) {
      // Reset goal progress
      this.goaltimer = setTimeout(() => this.progress(0), 500);
    }
    */
  }

  calculateGoalProgress() {
    const raised = (this.props.raised/100).toFixed(0);
    const goal = (this.props.goal/100).toFixed(0);
    return parseInt(Math.ceil(raised/goal*100).toFixed(0))
  }

  progress(goalProgress) {
    var progress = this.calculateGoalProgress();
    if (goalProgress > progress) {
      this.setState({ progress });
    }
    if (goalProgress <= 100 && goalProgress < progress) {
      if (goalProgress === 0) {
        goalProgress =+ 1;
      }
      this.setState({progress: goalProgress});
      const diff = 1;
      this.goaltimer = setTimeout(() => this.progress(goalProgress + diff), 20);
    }
  }

  render() {

    const {
      raised,
      primaryColor,
      placeholderColor
    } = this.props;

    const {
      progress,
    } = this.state;

    return (
      <div className="goal">
        <div className="goalContainerText">
          <span className="goalText">{util.money((raised/100).toFixed(0), '$', false)}</span>
          <span className="goalPercentText moneyAmount">{(progress && progress > 0 ? progress : 0)}<span className="symbol">%</span></span>
          <span className='goalText'>of goal</span>
        </div>
        <CircularProgress
          progress={progress}
          startDegree={0}
          progressWidth={5}
          trackWidth={5}
          cornersWidth={1}
          size={90}
          fillColor="transparent"
          trackColor={placeholderColor}
          progressColor={primaryColor}>
        </CircularProgress>
      </div>
    )
  }
};

export default Goal;
