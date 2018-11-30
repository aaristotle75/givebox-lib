import React, {Component} from 'react';

class CharacterCount extends Component{

	render() {
		const {
			max,
      count,
      style
		} = this.props;

		return (
			<div style={style} className='characterCount'>
        <span className='text'>Max characters <strong>{count}/{max}</strong></span>
			</div>
		)
	}
};

export default CharacterCount;
