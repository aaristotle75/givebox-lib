import React, {Component} from 'react';
import { LinearBar } from '../';

class PasswordStrength extends Component{
	constructor(props){
		super(props);
    this.checkStrength = this.checkStrength.bind(this);
    this.state = {
      strength: '',
      progress: 0,
      color: ''
    };
	}

  componentWillReceiveProps(nextProps) {
    if (this.props.password !== nextProps.password) {
      this.checkStrength(nextProps.password);
    }
  }

  checkStrength(password) {
    let strength = 0;
    let progress = 0;
    let text = '';
    let color = '';
    let validate = false
    if (password.length > 7) validate = true;
    strength += validate ? 1 : 0;
    strength += /[A-Z]/.test(password) && validate ? 1 : 0;
    strength += /[0-9]/.test(password) && validate ? 1: 0;
    strength += /[!@#$&*]/.test(password) && validate ? 1: 0;

    switch (strength) {
      case 1:
        progress = 25;
        text = 'Weak';
        color = 'yellow';
        break;
      case 2:
        progress = 50;
        text = 'Moderate';
        color = 'orange';
        break;
      case 3:
        progress = 75;
        text = 'Strong';
        color = 'green';
        break;
      case 4:
        progress = 100;
        text = 'Very Strong';
        color = 'green';
        break;
      default:
        if (password.length > 0) {
          const needed = 8 - parseInt(password.length);
          progress += password.length * 3;
          color = 'red';
          text = 'enter ' + needed + ' more characters';
        }
        break;
    }

    this.setState({
      strength: text,
      progress: progress,
      color: color
    });
  }

	render() {

		const {
			error
		} = this.props;

    const {
      strength,
      progress,
      color
    } = this.state;

		return (
      <div className='passwordStrength'>
        <div className='indicator'>
          <LinearBar progress={progress} style={{backgroundColor: 'rgb(189, 189, 189)'}} color={color} />
				</div>
				<div>
	       	<div className={`${error && 'error'} label tooltip`}>Password strength {strength}
		        <div className='tooltipTop'>Passwords must be at least 8 characters long. The stongest passwords have at least one upper case letter, at least one number and one of these special characters !@#$&*
            <i></i>
						</div>
					</div>
				</div>
      </div>
		)
	}
};


export default PasswordStrength;
