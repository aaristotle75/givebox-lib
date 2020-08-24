import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	Fade,
	Portal,
	GBLink,
	Icon
} from '../';
import '../styles/gbx3Helper.scss';
import { toggleModal } from '../api/actions';
import {
	updateAdmin,
	updateHelperBlocks
} from './redux/gbx3actions';
import { FiCheckCircle } from 'react-icons/fi';

class Helper extends React.Component {

	constructor(props) {
		super(props);
		this.onClickEdit = this.onClickEdit.bind(this);
		this.onClick = this.onClick.bind(this);
		this.turnOffHelp = this.turnOffHelp.bind(this);
		this.doThisLater = this.doThisLater.bind(this);
		this.state = {
		}
	}

	componentDidMount() {
		const {
			blockType,
			currentHelperBlockName,
			helperPrefs,
			helperCheckStep
		} = this.props;

		if (!helperPrefs.includes(currentHelperBlockName) && helperCheckStep) {
			this.props.updateHelperBlocks(blockType, 'helperOpen', true);
		}
	}

	onClickEdit() {
		const {
			blockType,
			currentHelperBlockName
		} = this.props;

		const modalID = `modalBlock-${blockType}-${currentHelperBlockName}`;
		this.props.toggleModal(modalID, true);
		this.props.updateAdmin({ editBlock: `${blockType}-${currentHelperBlockName}`, editBlockJustAdded: false });
	}

	onClick() {
		const {
			helper
		} = this.props;

		switch (util.getValue(helper, 'action')) {

			case 'edit':
			default: {
				this.onClickEdit();
				break;
			}
		}
	}

	turnOffHelp() {
		console.log('turn off help');
	}

	doThisLater() {
		const {
			blockType
		} = this.props;

		this.props.updateHelperBlocks(blockType, 'helperOpen', false);
	}

	render() {

		const {
			helper,
			currentHelperBlockName,
			helperOpen: open
		} = this.props;

		const helperClass = util.getValue(helper, 'className');
		const helperStyle = util.getValue(helper, 'style');

		const el = document.getElementById(`block-${currentHelperBlockName}`);
		const style = {};
		if (el) {
			const rect = el.getBoundingClientRect();
			style.top = rect.y + util.getValue(helperStyle, 'top', 0);
			style.left = rect.x + util.getValue(helperStyle, 'left', 0);
		}

		const rootEl = document.getElementById('modal-root');

		return (
			<>
				{ open ?
				<Portal id={'gbx-helper-portal'} rootEl={rootEl} className='gbx3 popupWrapper'>
					<div onClick={() => this.doThisLater()} className='popupOverlay'></div>
					<Fade in={open}>
						<div
							className='gbx3Helper'
							style={{
							...util.getValue(helper, 'style', {}),
							...style
							}}
						>
							<div className='helperContainer'>
								<div onClick={this.onClick} className={`${helperClass}`}>
									<span className='helperIcon'><Icon><FiCheckCircle /></Icon></span>
									<h1>{util.getValue(helper, 'title')}</h1>
									<span className='text'>{util.getValue(helper, 'text')}</span>
								</div>
								<div className='helperDefaultActions'>
									<GBLink onClick={() => this.turnOffHelp()}><span className='icon icon-x'></span> Turn Off Help</GBLink>
									<GBLink onClick={() => this.doThisLater()}><span className='icon icon-clock'></span> Do This Later</GBLink>
								</div>
							</div>
						</div>
					</Fade>
				</Portal>
				: '' }
			</>
		)
	}
}

function mapStateToProps(state, props) {

	const blockType = props.blockType;
	const helperBlocks = util.getValue(state, `gbx3.admin.helperBlocks.${blockType}`);
	const helperOpen = util.getValue(helperBlocks, 'helperOpen');
	const helperStep = util.getValue(helperBlocks, 'helperStep');
	const helpersAvailable = util.getValue(helperBlocks, 'helpersAvailable', []);
	const helperCheckStep = util.getValue(helperBlocks, 'helperCheckStep');
	const currentHelper = helpersAvailable.find(h => h.step === helperStep);
	const currentHelperBlockName = util.getValue(currentHelper, 'blockName');
	const helperPrefs = util.getValue(state, `preferences.gbx3Helpers.${blockType}`, []);
	const block = util.getValue(state, `gbx3.blocks.${blockType}.${currentHelperBlockName}`, {});
	const helper = util.getValue(block, `options.helper`);

	return {
		helperOpen,
		helperStep,
		helpersAvailable,
		currentHelper,
		currentHelperBlockName,
		helperPrefs,
		helperCheckStep,
		block,
		helper
	}
}

export default connect(mapStateToProps, {
	updateAdmin,
	toggleModal,
	updateHelperBlocks
})(Helper);
