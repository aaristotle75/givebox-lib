import React, { PureComponent } from 'react';
import {
	util
} from '../../';
import CustomCKEditor4 from '../../editor/CustomCKEditor4';

export default class Editor extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
	}

	render() {

		const {
			orgID,
			articleID,
			content,
			subType,
			onBlur,
			onChange,
			type,
			width,
			loaderClass,
			acceptedMimes
		} = this.props;

		const contentCss = 'https://givebox.s3-us-west-1.amazonaws.com/public/css/gbx3contents.css';
		let toolbar =	[ 'Bold', 'Italic', '-', 'FontSize', 'TextColor', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'];
		let height = '150px';
		let removePlugins = 'elementspath';
		let removeButtons = 'Link,Unlink';

		if (subType === 'content') {
			toolbar =	[ 'Bold', 'Italic', '-', 'FontSize', 'TextColor', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', '-', 'Image'];
			height = '300px';
			removePlugins = 'image,elementspath';
		}

		return (
			<CustomCKEditor4
				orgID={orgID}
				articleID={articleID}
				content={content}
				onBlur={onBlur}
				onChange={onChange}
				width={width}
				height={this.props.height || height}
				type={type}
				toolbar={[toolbar]}
				contentCss={contentCss}
				removePlugins={removePlugins}
				removeButtons={removeButtons}
				balloonButtons={'Image'}
				loaderClass={loaderClass}
				acceptedMimes={acceptedMimes}
				initCallback={(editor) => {
					editor.focus();
					const CKEDITOR = window.CKEDITOR;
					const selection = editor.getSelection();
					const getRanges = selection ? selection.getRanges() : [];
					if (!util.isEmpty(getRanges)) {
						const range = getRanges[0];
						const pCon = range.startContainer.getAscendant('p',true);
						const newRange = new CKEDITOR.dom.range(range.document);
						newRange.moveToPosition(pCon, CKEDITOR.POSITION_AFTER_END);
						newRange.select();
					}
				}}
			/>
		)
	}
}

Editor.defaultProps = {
	type: 'classic',
	width: '100%'
}
