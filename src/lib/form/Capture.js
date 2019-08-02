import React, { Component } from 'react';
import Webcam from "react-webcam";

class Capture extends Component {

  constructor(props) {
    super(props);
    this.testWebcam = this.testWebcam.bind(this);
    this.state = {
      capture: null
    };
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const capture = this.webcam.getScreenshot();
    this.setState({ capture });
    if (this.props.callback) this.props.callback(capture);
  };

  testWebcam() {
    console.log('testWebcam', this.webcam);
  }

  render() {

    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };

    return (
      <div className='capture'>
        <Webcam
          audio={false}
          height={350}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={350}
          videoConstraints={videoConstraints}
          onUserMedia={() => {
            console.log('onUserMedia', arguments);
          }}
        />
        <button onClick={this.capture}>Capture photo</button>
        <button onClick={this.testWebcam}>Test Webcam</button>
        <div className='screenCapture'>
          {this.state.capture ? <img src={this.state.capture} alt='Screen Capture' /> : 'No preview'}
        </div>
      </div>
    );
  }
}

Capture.defaultProps = {
  name: 'defaultSelect',
  buttonLabel: 'Select One'
}

export default Capture;
