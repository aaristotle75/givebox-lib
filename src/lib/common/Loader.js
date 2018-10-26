import React, {Component} from 'react';
import Portal from './Portal';

export default class Loader extends Component {

	constructor(props){
		super(props);
		this.state = {
			end: false,
      rootEl: null
		};
	}

  componentDidMount() {
    this.setState({rootEl: document.getElementById('app-root')});
  }

	componentWillUnmount() {
		this.setState({end: true});
	}

	createSVG() {
		var svg = <img className={`loaderSVG ${this.state.end ? 'fadeOut' : ''}`} src="https://s3-us-west-1.amazonaws.com/givebox/public/gb-logo3.svg" type="image/svg+xml" />
		return svg;
	}

  render() {

		const { msg, primaryColor, className, textColor, forceText } = this.props;

    if (!this.state.rootEl) return ( <div></div> );
		var showMsg = !!forceText;

    return (
      <Portal rootEl={this.state.rootEl}>
				<div className="loader" />
				<div className="loaderContent">
					<div className='loadingText'>
					 	<div>{this.createSVG()}</div>
						<span className={`${showMsg ? '' : 'displayNone'}`} style={{color: `${textColor ? textColor : '#fff'}` }}>{msg}</span>
					</div>
				</div>
      </Portal>
    )
  }
}
