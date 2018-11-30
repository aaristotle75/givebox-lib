import React, {Component} from 'react';

class LinearBar extends Component{
	constructor(props) {
    super(props);

    this.state = {
      completed: 0,
    };
  }

  componentDidMount() {
    this.timer = setTimeout(() => this.progress(this.props.progress), 100);
  }

	componentWillReceiveProps(nextProps) {
		if (this.props.progress !== nextProps.progress) {
    	this.timer = setTimeout(() => this.progress(nextProps.progress), 100);
		}
	}

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  progress(completed) {
    if (completed > 100) {
      this.setState({completed: 100});
    } else {
      this.setState({completed});
    }
  }

  render() {
		const {
			color,
			style
		} = this.props;

		var finalstyle = {
			style,
			width: this.props.progress + '%'
		};

    return (
			<div className="linearProgress">
				<div style={finalstyle} className={`linearProgressBarAnimation ${color}`}></div>
				<div style={finalstyle} className={`linearProgressBar ${color}`}></div>
			</div>
		);
  }
};

export default LinearBar;
