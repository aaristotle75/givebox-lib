import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	Fade,
	GBLink,
	Icon
} from '../../';
import '../../styles/gbx3Helper.scss';
import {
	updateAdmin,
	updateHelperBlocks,
	nextHelperStep,
	checkForHelper
} from '../redux/gbx3actions';
import { GoChecklist } from 'react-icons/go';

class HelperSidebar extends React.Component {

	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
		this.state = {
		}
	}

	componentDidMount() {
	}

	onClick() {
		const {
			blockType
		} = this.props;

		this.props.nextHelperStep(blockType, true, true);
	}

	render() {

		const {
			helperSidebarShow,
			helperOpen
		} = this.props;

		if (helperSidebarShow && !helperOpen) {
			return (
				<div onClick={this.onClick} className='helperSidebar'>
					<Icon><GoChecklist /></Icon>
				</div>
			)
		} else {
			return <></>;
		}
	}
}

function mapStateToProps(state, props) {

	const blockType = props.blockType;
	const helperBlocks = util.getValue(state, `gbx3.admin.helperBlocks.${blockType}`, {});
	const helperOpen = util.getValue(helperBlocks, 'helperOpen');
	const helperSidebarShow = util.getValue(helperBlocks, `helperSidebarShow`);

	return {
		helperOpen,
		helperSidebarShow
	}
}

export default connect(mapStateToProps, {
	updateAdmin,
	updateHelperBlocks,
	nextHelperStep,
	checkForHelper
})(HelperSidebar);
