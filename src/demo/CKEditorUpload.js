import React, { Component } from 'react';
import {
  util
} from '../lib';


export default class ckeditorUpload extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

	componentDidMount() {
		const funcNum = this.props.queryParams.CKEditorFuncNum;
		window.opener.CKEDITOR.tools.callFunction( funcNum, 'https://givebox-staging.s3.amazonaws.com/gbx%2Fe132c6e9a186b5338ab9ac5276358e87%2F2019-05-30%2Fimage-png%2Fmedium' );
		window.close();
	}

  render() {

		console.log('execute', this.props.queryParams);

    return (
			<div>
				Browse and upload file
			</div>
    )
  }
}
