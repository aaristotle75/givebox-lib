import React from 'react';
import { connect } from 'react-redux';
import {
	GBLink,
	Image,
	util
} from '../';
import Social from './blocks/Social';
import Moment from 'moment';

class Footer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount() {
	}

	render() {

		const {
			stage,
			orgName,
			primaryColor,
			form,
			allowP2P
		} = this.props;

		const publicOnly = stage === 'public' ? true : false;
		const allowSharing = util.getValue(form, 'allowSharing', true);
		const showP2P = util.getValue(form, 'showP2P', true);

		return (
			<div className='gbx3Footer'>
				<div className='footerContainer flexCenter flexColumn'>
					{ publicOnly ?
					<div style={{ marginBottom: 20 }} className='publicActionBar'>
						{allowSharing ? <Social /> : ''}
						{showP2P && allowP2P ?
						<GBLink
							onClick={() => this.props.onClickVolunteerFundraiser()}
							className='link p2pLink'
							customColor={primaryColor}
							allowCustom={true}
						>
							Support {orgName}<br /> by starting a Peer-2-Peer Fundraiser
						</GBLink> : ''}
					</div> : ''}
					<Image url='https://s3-us-west-1.amazonaws.com/givebox/public/gb-logo5.svg' maxSize={'30px'} style={{ minHeight: 30 }} />
					<div className="copyright">
						<span>&copy; {Moment().format('YYYY')} Givebox</span>
						<GBLink allowCustom={true} customColor={primaryColor} onClick={() => window.open('https://givebox.com')}>www.givebox.com</GBLink>
					</div>
				</div>
			</div>
		)
	}

}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const info = util.getValue(gbx3, 'info', {});
	const stage = util.getValue(info, 'stage');
	const orgName = util.getValue(info, 'orgName');
	const primaryColor = util.getValue(gbx3, 'globals.gbxStyle.primaryColor');
	const form = util.getValue(gbx3, 'blocks.article.paymentForm.options.form', {});
	const allowP2P = util.getValue(state, 'resource.org.data.allowVolunteers', true);

	return {
		stage,
		orgName,
		primaryColor,
		form,
		allowP2P
	}
}

export default connect(mapStateToProps, {
})(Footer);
