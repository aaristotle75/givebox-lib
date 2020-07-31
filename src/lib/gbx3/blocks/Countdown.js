import React, {Component} from 'react';
import { connect } from 'react-redux';
import CircularProgress from '../../common/CircularProgress';
import Moment from 'moment';
import {
	util,
	ModalRoute,
	GBLink
} from '../../';
import CountdownEdit from './CountdownEdit';

class Countdown extends Component {

	constructor(props){
		super(props);
		this.closeEditModal = this.closeEditModal.bind(this);
		this.optionsUpdated = this.optionsUpdated.bind(this);
		this.contentUpdated = this.contentUpdated.bind(this);
		this.setTimers = this.setTimers.bind(this);
		this.daysProgress = this.daysProgress.bind(this);
		this.hoursProgress = this.hoursProgress.bind(this);
		this.minsProgress = this.minsProgress.bind(this);
		this.secsProgress = this.secsProgress.bind(this);
		this.timeProgress = this.timeProgress.bind(this);
		this.getEndTime = this.getEndTime.bind(this);
		this.daysInitialProgress = this.daysInitialProgress.bind(this);
		this.hoursInitialProgress = this.hoursInitialProgress.bind(this);
		this.minsInitialProgress = this.minsInitialProgress.bind(this);
		this.secsInitialProgress = this.secsInitialProgress.bind(this);

		const data = props.data;
		const options = props.options;
		const content = {
			...util.getValue(props.block, 'content', {}),
			endsAt: util.getValue(data, 'endsAt', null)
		}


		this.state = {
			content,
			defaultContent: util.deepClone(content),
			options,
			defaultOptions: util.deepClone(options),
			hasBeenUpdated: false,
			daysProgress: 100,
			days: 0,
			hoursProgress: 100,
			hours: 0,
			minsProgress: 100,
			mins: 0,
			secsProgress: 100,
			secs: 0,
			secsCache: 0,
			completed: false,
			noEndsAt: null,
			secondaryColor: '#EEEEEE'
		}
	}

	componentDidMount() {
		if (this.props.data.status !== 'open') {
			this.setState({completed: true});
		} else {
			this.setTimes();
			this.setTimers();
		}

		var colorObj = util.hexToRgb(this.props.primaryColor);
		var secondaryColor = 'rgba(' + colorObj.r + ',' + colorObj.g + ',' + colorObj.b + ', 0.2)';
		this.setState({
			secondaryColor: secondaryColor
		});
	}

	componentWillUnmount() {
		clearTimeout(this.daysInitialTimer);
		clearTimeout(this.hoursInitialTimer);
		clearTimeout(this.minsInitialTimer);
		clearTimeout(this.secsInitialTimer);
		clearTimeout(this.daysTimer);
		clearTimeout(this.hoursTimer);
		clearTimeout(this.minsTimer);
		clearTimeout(this.secsTimer);
	}

	componentWillUpdate(nextProps) {
		if (util.getValue(nextProps.data, 'ID') !== util.getValue(this.props.data, 'ID')) {
			// Reset timers
			this.setTimers();
		}
	}

	setTimers() {
		var obj = this.getEndTime();
		this.daysInitialTimer = setTimeout(() => this.daysInitialProgress(100, obj.secs), 1000);
		this.hoursInitialTimer = setTimeout(() => this.hoursInitialProgress(100, obj.secs), 1000);
		this.minsInitialTimer = setTimeout(() => this.minsInitialProgress(100, obj.secs), 1000);
		this.secsInitialTimer = setTimeout(() => this.secsInitialProgress(100, obj.secs), 1000);
		this.daysTimer = setTimeout(() => this.daysProgress(100, this.state.hours), 1000);
	}

	setTimes() {
		var obj = this.getEndTime();
		var days = obj.secs > 86400 ? Math.floor(obj.secs/86400) : 0;
		var hours = Math.floor((obj.secs - (days * 86400))/3600);
		var mins = Math.floor((obj.secs - ((days * 86400) + (hours * 3600)))/60);
		var secs = Math.floor(obj.secs - ((days * 86400) + (hours * 3600) + (mins * 60)));
		this.setState({
			days: days,
			hours: hours,
			mins: mins,
			secs: secs
		});
		return {
			secs: secs,
			endsAt: obj
		};
	}

	closeEditModal(type = 'save') {
		const {
			block
		} = this.props;

		const {
			content,
			defaultContent,
			options,
			defaultOptions,
			hasBeenUpdated
		} = this.state;

		if (type !== 'cancel') {
			const data = {
				status: util.getValue(content, 'status', null),
				endsAt: util.getValue(content, 'endsAt', null)
			};

			this.props.saveBlock({
				data,
				hasBeenUpdated,
				content,
				options
			});
		} else {
			this.setState({
				content: defaultContent,
				options: defaultOptions
			}, this.props.closeEditModal);
		}
	}

	optionsUpdated(options) {
		this.setState({
			options: {
				...this.state.options,
				...options
			},
			hasBeenUpdated: true
		}, this.setTimers);
	}

	contentUpdated(content) {
		this.setState({
			content: {
				...this.state.content,
				...content
			},
			hasBeenUpdated: true
		}, this.setTimers);
	}

	getEndTime() {
		const {
			data
		} = this.props;

		var endsAtDate, newDate, startDate;
		if (util.getValue(data, 'endsAt')) {
			endsAtDate =  this.props.data.endsAt;
		} else {
			if (!this.state.noEndsAt) {
				var i = 1;
				 do {
					newDate = Moment.utc(Moment.unix(util.getValue(data, 'createdAt'))).add(i, 'months');
					i++;
				}
				while (newDate < Moment.utc(Moment()).add(1, 'days'))
				endsAtDate = Moment.utc(newDate).format('X');
				if (i <= 2) i = 1;
				startDate = Moment.utc(Moment.unix(util.getValue(data, 'createdAt'))).add(i-1, 'months');
				startDate = startDate.format('X');
				this.setState({
					noEndsAt: endsAtDate,
					startDate: startDate
				});
			} else {
				endsAtDate = this.state.noEndsAt;
			}
		}

		var endsAt = Moment.utc(Moment.unix(endsAtDate));
		var obj = {
			endsAt: endsAt
		};
		var ms = Moment.utc(Moment()).diff(endsAt);
		var d = Moment.duration(ms);
		var s = Math.floor(d.asDays()) + Moment.utc(ms).format(":hh:mm:ss");
		if (Moment.utc(Moment()) < endsAt) {
			obj.d = d;
			obj.secs = Math.abs(Math.floor(d.asSeconds()));
		} else {
			obj.d = d;
			obj.secs = 0;
		}
		return obj;
	}

	daysInitialProgress(progress) {
		const {
			data
		} = this.props;

		var obj = this.getEndTime();
		var startDate = this.state.startDate ? this.state.startDate : util.getValue(data, 'createdAt');
		var ms = Moment.utc(Moment.unix(startDate)).diff(obj.endsAt);
		var d = Moment.duration(ms);
		var numDays = Math.floor(Math.abs(d.asDays()));
		var progression = obj.secs > 86400 ? Math.ceil((this.state.days/numDays)*100) : 0;
		if (progression === 0) this.setState({daysProgress: 0});
		if (progress >= 0 && progression < progress && this.state.hours !== 0) {
			this.setState({daysProgress: progress});
			this.daysInitialTimer = setTimeout(() => this.daysInitialProgress(progress - this.props.diff60), 10);
		}
	}

	hoursInitialProgress(progress) {
		var obj = this.getEndTime();
		var progression = obj.secs > 3600 ? Math.ceil((this.state.hours/24)*100) : 0;
		if (progression === 0) {
			this.setState({hoursProgress: 0});
		} else {
			if (progress >= 0 && progression < progress) {
				this.setState({hoursProgress: progress});
				this.hoursInitialTimer = setTimeout(() => this.hoursInitialProgress(progress - this.props.diff60), 10);
			} else {
				this.hoursTimer = setTimeout(() => this.hoursProgress(progress), 1000);
			}
		}
	}

	minsInitialProgress(progress) {
		var obj = this.getEndTime();
		var progression = obj.secs > 60 ? Math.ceil((this.state.mins/60)*100) : 0;
		if (progression === 0) {
			this.setState({minsProgress: 0});
		} else {
			if (progress >= 0 && progression < progress) {
				this.setState({minsProgress: progress});
				this.minsInitialTimer = setTimeout(() => this.minsInitialProgress(progress - this.props.diff60), 10);
			} else {
				this.minsTimer = setTimeout(() => this.minsProgress(progress), 1000);
			}
		}
	}

	secsInitialProgress(progress) {
		var obj = this.getEndTime();
		var progression = obj.secs > 0 ? Math.ceil((this.state.secs/60)*100) : 0;
		if (progression === 0) {
			this.setState({secsProgress: 0});
		} else {
			if (progress >= 0 && progression < progress) {
				this.setState({secsProgress: progress});
				this.secsInitialTimer = setTimeout(() => this.secsInitialProgress(progress - this.props.diff60), 10);
			} else {
				this.secsTimer = setTimeout(() => this.secsProgress(progress), 1000);
			}
		}
	}

	daysProgress(progress) {
		progress = this.state.daysProgress !== 0 ? this.state.daysProgress : 0;
		const obj = this.setTimes();
		if (obj.endsAt.secs > 86400) {
			if (progress >= 0 && this.state.days > 0) {
				this.daysTimer = setTimeout(() => this.daysProgress(progress - .003), 60000);
				this.setState({daysProgress: progress - .003});
			} else {
				this.daysTimer = setTimeout(() => this.daysProgress(100), 10);
				this.setState({daysProgress: 0});
			}
		} else {
			this.setState({daysProgress: 0});
		}
	}

	hoursProgress(progress) {
		progress = this.state.hoursProgress !== 0 ? this.state.hoursProgress : 0;
		const obj = this.setTimes();
		if (obj.endsAt.secs > 3600) {
			if (progress >= 0 && this.state.hours > 0) {
				this.hoursTimer = setTimeout(() => this.hoursProgress(progress - .07), 60000);
				this.setState({hoursProgress: progress - .07});
			} else {
				this.hoursTimer = setTimeout(() => this.hoursProgress(100), 10);
				this.setState({hoursProgress: 0});
			}
		} else {
			this.setState({hoursProgress: 0});
		}
	}

	minsProgress(progress) {
		progress = this.state.minsProgress !== 0 ? this.state.minsProgress : 0;
		const obj = this.setTimes();
		if (obj.endsAt.secs > 59) {
			if (progress >= 0 && this.state.mins > 0) {
				this.minsTimer = setTimeout(() => this.minsProgress(progress - .42), 15000);
				this.setState({minsProgress: progress - .42});
			} else {
				this.minsTimer = setTimeout(() => this.minsProgress(100), 10);
				this.setState({minsProgress: 0});
			}
		} else {
			this.setState({minsProgress: 0});
		}
	}

	secsProgress(progress) {
		const obj = this.setTimes();
		var secs = obj.secs;
		var interval = 1000;
		if (obj.endsAt.secs > 0) {
			if (progress >= 0 && secs !== 0) {
				this.secsTimer = setTimeout(() =>  {
					this.secsProgress(progress - 1.67);
				}, Math.max(0, interval));
				this.setState({secsProgress: progress});
			} else {
				this.secsTimer = setTimeout(() => this.secsProgress(100), 10);
				this.setState({secsProgress: 0});
			}
		} else {
			this.setState({secsProgress: 0});
			this.setState({completed: true});
		}
		if (this.state.mins === 0) this.setState({minsProgress: 0});
		if (this.state.mins === 59) this.setState({minsProgress: 98.4});
		if (this.state.hours === 0) this.setState({hoursProgress: 0});
		if (this.state.hours === 23) this.setState({hoursProgress: 98.4});
		if (this.state.days === 0) this.setState({daysProgress: 0});
	}

	timeProgress() {
		var bindthis = this;
		var secsProgress = this.state.secsProgress;
		var interval = 100; // ms
		var expected = Date.now() + interval;
		setTimeout(step, interval);
		function step() {
				var obj = bindthis.setTimes();
				var dt = Date.now() - expected; // the drift (positive for overshooting)
				if (dt > interval) {
						// something really bad happened. Maybe the browser (tab) was inactive?
						// possibly special handling to avoid futile "catch up" run
				}
				expected += interval;

				secsProgress = secsProgress >= 10 ? secsProgress - 10 : 100;
				bindthis.secsProgress(secsProgress, obj.endsAt.secs);
				setTimeout(step, Math.max(0, interval - dt)); // take into account drift
		}
	}

	render() {

		const {
			modalID,
			primaryColor,
			title,
			block
		} = this.props;

		const {
			content,
			daysProgress,
			days,
			hoursProgress,
			hours,
			minsProgress,
			mins,
			secsProgress,
			secs,
			completed
		} = this.state;

		var size = 80;
		var corners = 2;

		const nonremovable = util.getValue(block, 'nonremovable', false);

		return (
			<div className={`countdownTimer ${completed ? 'completedStyle' : ''}`}>
				<ModalRoute
					className='gbx3'
					optsProps={{ closeCallback: this.onCloseUploadEditor }}
					id={modalID}
					effect='3DFlipVert' style={{ width: '70%' }}
					draggable={true}
					draggableTitle={`Editing ${title}`}
					closeCallback={this.closeEditModal}
					disallowBgClose={true}
					component={() =>
						<CountdownEdit
							{...this.props}
							content={content}
							contentUpdated={this.contentUpdated}
							optionsUpdated={this.optionsUpdated}
						/>
					}
					buttonGroup={
						<div className='gbx3'>
							<div style={{ marginBottom: 0 }} className='button-group center'>
								{!nonremovable ? <GBLink className='link remove' onClick={this.props.onClickRemove}><span className='icon icon-trash-2'></span> <span className='buttonText'>Remove</span></GBLink> : <></>}
								<GBLink className='link' onClick={() => this.closeEditModal('cancel')}>Cancel</GBLink>
								<GBLink className='button' onClick={this.closeEditModal}>Save</GBLink>
							</div>
						</div>
					}
				/>
				{completed &&
				<div className="completed">
					<h2>The Sweepstakes has ended.</h2>
				</div>
				}
				<div className="timer">
					<div className="timerContainer">
					<div className="timerInfo">
						<span className="number">{days}</span>
						<span className="text">Days</span>
					</div>
					</div>
					<CircularProgress
						progress={this.state.completed ? 0 : daysProgress}
						startDegree={0}
						progressWidth={5}
						trackWidth={5}
						cornersWidth={corners}
						size={size}
						fillColor="transparent"
						trackColor={this.state.secondaryColor}
						progressColor={primaryColor}>
					</CircularProgress>
				</div>
				<div className="timer">
					<div className="timerContainer">
					<div className="timerInfo">
						<span className="number">{hours}</span>
						<span className="text">Hours</span>
					</div>
					</div>
					<CircularProgress
						progress={this.state.completed ? 0 : hoursProgress}
						startDegree={0}
						progressWidth={5}
						trackWidth={5}
						cornersWidth={corners}
						size={size}
						fillColor="transparent"
						trackColor={this.state.secondaryColor}
						progressColor={primaryColor}>
					</CircularProgress>
				</div>
				<div className="timer">
					<div className="timerContainer">
					<div className="timerInfo">
						<span className="number">{mins}</span>
						<span className="text">Minutes</span>
					</div>
					</div>
					<CircularProgress
						progress={this.state.completed ? 0 : minsProgress}
						startDegree={0}
						progressWidth={5}
						trackWidth={5}
						cornersWidth={corners}
						size={size}
						fillColor="transparent"
						trackColor={this.state.secondaryColor}
						progressColor={primaryColor}>
					</CircularProgress>
				</div>
				<div className="timer">
					<div className="timerContainer">
					<div className="timerInfo">
						<span className="number">{secs}</span>
						<span className="text">Seconds</span>
					</div>
					</div>
					<CircularProgress
						progress={this.state.completed ? 0 : secsProgress}
						startDegree={0}
						progressWidth={5}
						trackWidth={5}
						cornersWidth={corners}
						size={size}
						fillColor="transparent"
						trackColor={this.state.secondaryColor}
						progressColor={primaryColor}>
					</CircularProgress>
				</div>
			</div>
		)
	}
};

Countdown.defaultProps = {
	diff60: 1.67,
	diff24: 4.17
};

function mapStateToProps(state, props) {

	const data = util.getValue(state, 'gbx3.data', {});
	const primaryColor = util.getValue(state, 'gbx3.globals.gbxStyle.primaryColor');

	return {
		data,
		primaryColor
	}
}

export default connect(mapStateToProps, {
})(Countdown);
