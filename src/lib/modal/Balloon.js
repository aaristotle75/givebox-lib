import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Fade,
  GBLink,
  getResource,
	savePrefs
} from '../';
import '../styles/balloon.scss';

class Balloon extends Component {

  constructor(props) {
    super(props);
		this.buttonClick = this.buttonClick.bind(this);
    this.state = {
      open: false
    };
  }

	componentDidMount() {
		const prefs = this.props.prefs;
		console.log('prefs', prefs);
		const open = this.props.open;
		this.setState({ open });
	}

	componentDidUpdate(prev) {
		if (prev.open !== this.props.open) {
			this.setState({ open: this.props.open });
		}
	}

	buttonClick(type) {
		if (type === 'noshow') {

		}
		if (this.props.buttonCallback) this.props.buttonCallback(type, false);
	}

  render() {

    const {
      open
    } = this.state;

		const {
			style,
			pointer
		} = this.props;

    return (
			<>
				{open ?
	        <div style={style} className={`balloon ${pointer}`}>
	          <GBLink className='removeBtn' onClick={() => this.buttonClick('ok')}><span className='icon icon-x'></span></GBLink>
	          <Fade in={open}>
	            {this.props.children}
	          </Fade>
						<div className='button-group'>
							<GBLink className='balloonLink' onClick={() => this.buttonClick('noshow')}>Do not show again</GBLink>
						</div>
	        </div>
				: <></>}
			</>
    )
  }
}

Balloon.defaultProps = {
	pointer: 'top'
};

function mapStateToProps(state) {
  return {
    prefs: state.preferences ? state.preferences : {}
  }
}

export default connect(mapStateToProps, {
  getResource,
  savePrefs
})(Balloon);
