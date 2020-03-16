import React from 'react';
import {
  util,
	GBLink
} from '../../';


export const BlockOption = ({ edit, editOnClick, removeOnClick, noRemove }) => {
	return (
		<div className={`blockOptions ${edit ? 'displayNone' : ''}`}>
      <GBLink disallowCustom={true} className='blockEdit' onClick={editOnClick}><span className='icon icon-edit'></span>Edit</GBLink>
			<div className='dragHandle blockEdit'><span className='icon icon-move'></span></div>
      {!noRemove ? <GBLink disallowCustom={true} className='link blockRemove' onClick={removeOnClick}><span className='icon icon-x'></span></GBLink> : ''}
		</div>
	)
}
