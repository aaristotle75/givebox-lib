import _objectSpread from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/objectSpread";
import React from 'react';
import Transition from 'react-transition-group/Transition';

var Fade = function Fade(props) {
  var duration = 500;
  var defaultStyle = {
    transition: "opacity ".concat(props.duration || 300, "ms ease-in-out"),
    opacity: 0
  };
  var transitionStyles = {
    entering: {
      opacity: 0
    },
    entered: {
      opacity: 1
    }
  };
  return React.createElement(Transition, {
    in: props.in,
    timeout: duration
  }, function (state) {
    return React.createElement("div", {
      style: _objectSpread({}, defaultStyle, transitionStyles[state])
    }, props.children);
  });
};

export default Fade;