import React from 'react';
import Icon from './Icon';
import { FiSmile } from 'react-icons/fi';

const HelpfulTip = (props) => {

  const headerText = props.headerText || 'Friendly Tip';
  const headerIcon = props.headerIcon || <Icon><FiSmile /></Icon>;
  const text = props.text;
  const style = props.style || {};

  return (
    <div className='helpfulTip' style={style}>
      <div className='helpfulTipBar'></div>
      <div className='helpfulTipContent'>
        <span className='helpfulTipHeader'>{headerIcon} {headerText}</span>
        {text}
      </div>
    </div>
  )
};

export default HelpfulTip;
