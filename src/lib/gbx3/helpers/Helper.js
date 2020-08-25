import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	Fade,
	Portal,
	GBLink,
	Icon
} from '../../';
import '../../styles/gbx3Helper.scss';
import { toggleModal } from '../../api/actions';
import {
	updateAdmin,
	checkForHelper,
	nextHelperStep,
	closeHelper,
	updateHelperBlocks
} from '../redux/gbx3actions';
import { FiCheckCircle } from 'react-icons/fi';
import HelperPopup from './HelperPopup';
import { helpers } from './helperTemplates';
import HelperSidebar from './HelperSidebar';

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
			blockType
		} = this.props;

		this.props.checkForHelper(blockType);
	}

	componentDidUpdate(prevProps) {
		const {
			blockType
		} = this.props;

		/*
		const numberOfSteps = helpersAvailable.length;

		if (helperStep > numberOfSteps && helperOpen) {
			this.props.updateHelperBlocks(blockType, 'helperOpen', false);
			return;
		}

		if (((prevProps.editBlock !== this.props.editBlock) && editBlock && helperOpen)) {
			this.props.updateHelperBlocks(blockType, 'helperOpen', false);
			return;
		}

		if (((prevProps.helperCheckStep !== this.props.helperCheckStep) && !editBlock && !helperOpen)) {
			this.props.updateHelperBlocks(blockType, 'helperOpen', true);
			return;
		}

		if (!helperPrefs.includes(currentHelperBlockName) && helperCheckStep && !editBlock && !helperOpen && (helperStep <= numberOfSteps)) {
			this.props.updateHelperBlocks(blockType, 'helperOpen', true);
			return;
		}
		*/
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

	onClick(action) {

		const {
			blockType
		} = this.props;

		switch (action) {

			case 'close': {
				this.props.closeHelper(blockType);
				break;
			}

			case 'turnOff': {
				this.turnOffHelp();
				break;
			}

			case 'doLater': {
				this.doThisLater();
				break;
			}

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

		this.props.nextHelperStep(blockType);
	}

	render() {

		const {
			helper,
			portalBindID,
			stage,
			blockType,
			currentHelperBlockName: blockName,
			helperOpen: open
		} = this.props;

		const helperType = util.getValue(helper, 'type');
		const elID = helperType === 'block' ? `block-${blockName}` : `helper-${helperType}`;
		const el = document.getElementById(elID);
		const rootEl = document.getElementById(portalBindID);

		if (!el || !rootEl || stage === 'public') return <></>;

		return (
			<>
				<HelperSidebar
					helper={helper}
					blockType={blockType}
				/>
				{ open ?
				<Portal id={'gbx-helper-portal'} rootEl={rootEl} className='gbx3 popupWrapper'>
					<HelperPopup
						helper={helper}
						onClick={this.onClick}
						targetElement={el}
					/>
				</Portal>
				: '' }
			</>
		)
	}
}

function mapStateToProps(state, props) {

	const blockType = props.blockType;
	const editBlock = util.getValue(state, `gbx3.admin.editBlock`);
	const helperBlocks = util.getValue(state, `gbx3.admin.helperBlocks.${blockType}`);
	const helperOpen = util.getValue(helperBlocks, 'helperOpen');
	const helperStep = util.getValue(helperBlocks, 'helperStep');
	const helpersAvailable = util.getValue(helperBlocks, 'helpersAvailable', []);
	const currentHelper = helpersAvailable.find(h => h.step === helperStep);
	const currentHelperBlockName = util.getValue(currentHelper, 'blockName');
	const helper = util.getValue(helpers, `${blockType}.${currentHelperBlockName}`);
	const stage = util.getValue(state, 'gbx3.info.stage');
	const preview = util.getValue(state, 'gbx3.info.preview');

	return {
		blockType,
		editBlock,
		helperOpen,
		helperStep,
		helpersAvailable,
		currentHelper,
		currentHelperBlockName,
		helper,
		stage,
		preview
	}
}

export default connect(mapStateToProps, {
	updateAdmin,
	toggleModal,
	checkForHelper,
	nextHelperStep,
	closeHelper,
	updateHelperBlocks
})(Helper);
