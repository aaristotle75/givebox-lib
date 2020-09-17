import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	Icon
} from '../../';
import ArticleAdmin from './article/ArticleAdmin';
import OrgAdmin from './org/OrgAdmin';
import Logo from '../Logo';
import AnimateHeight from 'react-animate-height';
import 'react-toggle/style.css';
import {
	updateInfo,
	updateAdmin
} from '../redux/gbx3actions';
import AvatarMenuButton from './AvatarMenuButton';
import { AiOutlineFullscreen } from 'react-icons/ai';

class Admin extends React.Component {

	constructor(props) {
		super(props);
		this.renderAdminDisplay = this.renderAdminDisplay.bind(this);
		this.renderHeaderMiddle = this.renderHeaderMiddle.bind(this);
		this.state = {
			referrerStep: ''
		};
	}

	componentDidMount() {
		this.props.updateInfo({ stage: 'admin' });
	}

	goBack(articleID) {
		this.props.loadGBX3(articleID);
	}

	renderHeaderMiddle() {
		const {
			display,
			isVolunteer,
			articleID,
			step,
			breakpoint,
			access
		} = this.props;

		const isMobile = breakpoint === 'mobile' ? true : false;
		const header = [];

		switch (display) {
			case 'org': {
				header.push(
					<div className='headerMiddle'>
						{ !util.isEmpty(access) ?
						<GBLink style={{ fontSize: '14px' }} className='link' onClick={() => this.props.exitAdmin()}><Icon><AiOutlineFullscreen /></Icon>{ isMobile ? 'Exit' : 'Exit Form Builder' }</GBLink> : <></> }
					</div>
				);
				break;
			}

			case 'article':
			default: {
				header.push(
					<div key='article' className='headerMiddle'>
					{ articleID && !isVolunteer ?
						step === 'create' ?
							<GBLink style={{ fontSize: '14px' }} onClick={() => this.goBack(articleID)}><span className='icon icon-chevron-left'></span> Go Back</GBLink>
						:
							<GBLink style={{ fontSize: '14px' }} className='link' onClick={() => this.props.loadCreateNew()}><span className='icon icon-plus'></span> { isMobile ? 'New' : 'Create New Form' }</GBLink>
					: '' }
					</div>
				);
				break;
			}
		}
	}

	renderAdminDisplay() {
		const {
			display
		} = this.props;

		switch (display) {
			case 'org': {
				return (
					<OrgAdmin

					/>
				)
			}

			case 'article':
			default: {
				return (
					<ArticleAdmin

					 />
				)
			}
		}
	}

	render() {

		const {
			step,
			previewMode,
			saveStatus,
			editable,
			hasAccessToEdit,
			hasAccessToCreate
		} = this.props;

		if (!hasAccessToEdit && !hasAccessToCreate) return  <div className='flexCenter flexColumn centeritems'>You do not have access.</div>;

		let theme = 'dark';
		if (step === 'create') {
			theme = 'light';
		}

		return (
			<div className={`gbx3AdminLayout ${step}Step ${editable ? 'editable' : ''} ${previewMode ? 'previewMode' : ''}`}>
				<AnimateHeight height={saveStatus === 'saving' ? 'auto' : 0 } duration={500}>
					<div className='autoSaved'>Saving...</div>
				</AnimateHeight>
				<div className={`gbx3TopHeader`}>
					<header className={`navbar`}>
						<div className='container'>
							<div className='headerLeftSide'>
								<Logo theme={theme} className='logo' />
							</div>
							{this.renderHeaderMiddle()}
							<div className='headerRightSide'>
								<AvatarMenuButton />
							</div>
						</div>
						<div className='headerMiddle'>
						</div>
					</header>
				</div>
				{this.renderAdminDisplay()}
			</div>
		)
	}
}

Admin.defaultProps = {
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const saveStatus = util.getValue(gbx3, 'saveStatus');
	const info = util.getValue(gbx3, 'info', {});
	const breakpoint = util.getValue(info, 'breakpoint');
	const display = util.getValue(info, 'display');
	const articleID = util.getValue(info, 'articleID');
	const project = util.getValue(info, 'project');
	const admin = util.getValue(gbx3, 'admin', {});
	const step = util.getValue(admin, 'step');
	const isVolunteer = util.getValue(admin, 'isVolunteer');
	const previewMode = util.getValue(admin, 'previewMode');
	const openAdmin = util.getValue(admin, 'open');
	const access = util.getValue(state.resource, 'access');
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
	const hasAccessToCreate = util.getValue(admin, 'hasAccessToCreate');
	const editable = util.getValue(admin, 'editable');

	return {
		project,
		breakpoint,
		display,
		articleID,
		openAdmin,
		step,
		isVolunteer,
		previewMode,
		saveStatus,
		access,
		hasAccessToEdit,
		hasAccessToCreate,
		admin,
		editable
	}
}

export default connect(mapStateToProps, {
	updateInfo,
	updateAdmin
})(Admin);
