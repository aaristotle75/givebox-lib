import React from 'react';
import { connect } from 'react-redux';
import {
	GBLink,
	util,
	toggleAdminLeftPanel
} from '../../../';
import ArticleMenuLayout from './ArticleMenuLayout';
import ArticleMenuStyle from './ArticleMenuStyle';
import ArticleMenuTools from './ArticleMenuTools';

class ArticleMenu extends React.Component {

	constructor(props) {
		super(props);
		this.switchPanelType = this.switchPanelType.bind(this);
		this.renderPanel = this.renderPanel.bind(this);
		this.state = {
			panelType: 'layout'
		};
	}

	switchPanelType(panelType) {
		this.setState({ panelType });
	}

	renderPanel() {
		switch (this.state.panelType) {
			case 'style': {
				return (
					<ArticleMenuStyle />
				)
			}

			case 'tools': {
				return (
					<ArticleMenuTools />
				)
			}

			case 'layout':
			default: {
				return (
					<ArticleMenuLayout />
				)
			}
		}
	}

	render() {

		const {
			panelType
		} = this.state;

		const {
			openAdmin: open
		} = this.props;

		return (
			<div className='leftPanelContainer'>
				<div className='leftPanelTop'>
					<div className='leftPanelHeader'>
						Payment Form Menu
						<GBLink onClick={this.props.toggleAdminLeftPanel} className={`link leftPanelClose ${open ? 'open' : 'close'}`}><span className='icon icon-x'></span></GBLink>
					</div>
					<div className='middle centerAlign adminPanelTabs'>
						<GBLink className={`ripple link ${panelType === 'layout' ? 'selected' : ''}`} onClick={() => this.switchPanelType('layout')}>Elements</GBLink>
						<GBLink className={`ripple link ${panelType === 'style' ? 'selected' : ''}`} onClick={() => this.switchPanelType('style')}>Style</GBLink>
						<GBLink className={`ripple link ${panelType === 'tools' ? 'selected' : ''}`} onClick={() => this.switchPanelType('tools')}>Tools</GBLink>
					</div>
				</div>
				<div className={`leftPanelScroller`}>
					{this.renderPanel()}
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const openAdmin = util.getValue(admin, 'open');

	return {
		openAdmin
	}
}

export default connect(mapStateToProps, {
	toggleAdminLeftPanel
})(ArticleMenu);
