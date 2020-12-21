import React, {Component} from 'react';

class CircularProgressGradient extends Component{
  constructor(props){
    super(props);
    this.state = {
    }
  }

  getPoint(r, degree) {
    var size = this.props.size;
    var d = degree/180 * Math.PI;

    return {
      x: r * Math.sin(d) + size/2,
      y: this.props.trackWidth/2 + r * (1 - Math.cos(d))
    }
  }

  render() {
    const {
      progress, startDegree, progressWidth, trackWidth, cornersWidth, size, fillColor, trackColor, progressColor
    } = this.props;

    var r = size/2 - trackWidth/2;
    var endDegree = startDegree + progress * 360 / 100;
    var s = this.getPoint(r, startDegree);
    var e = this.getPoint(r, endDegree);

    var progressPath = null;
    if(progress < 50) {
      progressPath = `M ${s.x} ${s.y} A ${r} ${r}, 0, 0, 1, ${e.x},${e.y}`;
    } else {
      var m = this.getPoint(r, startDegree + 180);
      progressPath =
        `M ${s.x} ${s.y} A ${r} ${r}, 0, 0, 1, ${m.x},${m.y}
        M ${m.x} ${m.y} A ${r} ${r}, 0, 0, 1, ${e.x},${e.y}`;
    }

    var progressStyle = {
      strokeWidth: progressWidth,
      stroke: progressColor,
      fill: 'none'
    };

    var trackStyle = {
      fill: fillColor,
      stroke: trackColor,
      strokeWidth: trackWidth
    };

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size/2}
          cy={size/2}
          r={r}
          style={trackStyle}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00bc9b" />
            <stop offset="100%" stopColor="#5eaefd" />
          </linearGradient>
        </defs>
        {progress > 0 ?
        <path
          d={progressPath}
          stroke="url(#gradient)"
          strokeWidth={progressWidth}
          fill='none'
        /> : null}

        {progress > 0 ?
        <circle
          cx={s.x}
          cy={s.y}
          r={cornersWidth}
          fill="url(#gradient)"
        /> : null}

        {progress > 0 ?
        <circle
          cx={e.x}
          cy={e.y}
          r={cornersWidth}
          fill="url(#gradient)"
        /> : null}

      </svg>
    )
  }
};

CircularProgressGradient.defaultProps = {
  startDegree: 0,
  progress: 0,
  progressWidth: 5,
  trackWidth: 5,
  cornersWidth: 10,
  size: 200
}

export default CircularProgressGradient;
