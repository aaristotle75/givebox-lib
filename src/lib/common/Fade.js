import React from 'react';
import Transition from 'react-transition-group/Transition';


const Fade = (props) => {
  const duration = props.duration || 300;

  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
  }

  const transitionStyles = {
    entering: { opacity: 0 },
    entered:  { opacity: 1 }
  };
  return (
    <Transition in={props.in} timeout={duration}>
      {(state) => (
        <div style={{
          ...defaultStyle,
          ...transitionStyles[state]
        }}>
          {props.children}
        </div>
      )}
    </Transition>
  )
};

export default Fade;
