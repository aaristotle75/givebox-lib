import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	Fade,
	Portal
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
import { savePrefs } from '../../api/helpers';
import HelperPopup from './HelperPopup';
import HelperSidebar from './HelperSidebar';

class Helper extends React.Component {

	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
		this.turnOffHelp = this.turnOffHelp.bind(this);
		this.doThisLater = this.doThisLater.bind(this);
		this.onClickEdit = this.onClickEdit.bind(this);
		this.onClickColor = this.onClickColor.bind(this);
		this.onClickShare = this.onClickShare.bind(this);
		this.getElements = this.getElements.bind(this);

		this.state = {
			el: null,
			rootEl: null
		}
	}

	componentDidMount() {
		this.getElements();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.helperStep !== this.props.helperStep) {
			this.getElements();
		}
	}

	getElements() {
		const {
			helper,
			blockName,
			blockType,
			portalBindID
		} = this.props;

		const helperType = util.getValue(helper, 'type');
		const elID = helperType === 'block' ? `block-${blockName}` : util.getValue(helper, 'targetID', `helper-${helperType}`);
		const el = document.getElementById(elID) || document.getElementById('gbx3Layout');
		const rootEl = document.getElementById(portalBindID);

		this.setState({
			el,
			rootEl
		}, this.props.checkForHelper(blockType));
	}

	onClickEdit() {
		const {
			blockType,
			blockName
		} = this.props;

		const modalID = `modalBlock-${blockType}-${blockName}`;
		this.props.toggleModal(modalID, true);
		this.props.updateAdmin({ editBlock: `${blockType}-${blockName}`, editBlockJustAdded: false });
	}

	onClickColor() {
		this.props.toggleModal('colorPickerTheme', true);
	}

	onClickShare() {
		this.props.toggleModal('share', true);
	}

	onClick(action) {

		const {
			blockType,
			helper
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
				switch (util.getValue(helper, 'type')) {
					case 'color': {
						this.onClickColor();
						break;
					}

					case 'share': {
						this.onClickShare();
						break;
					}

					default: {
						this.onClickEdit();
					break;
					}
				}
				break;
			}
		}
	}

	turnOffHelp() {
		this.props.savePrefs({
			gbx3Helpers: 'off'
		});
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
			stage,
			blockType,
			isLastStep,
			helperPref,
			helperOpen: open
		} = this.props;

		const {
			el,
			rootEl
		} = this.state;

		if (!el || !rootEl || stage !== 'admin' || helperPref === 'off') return <></>;

		return (
			<>
				<HelperSidebar
					helper={helper}
					blockType={blockType}
				/>
				{ open ?
				<Portal id={'gbx-helper-portal'} rootEl={rootEl} className='gbx3 popupWrapper'>
					<HelperPopup
						open={open}
						isLastStep={isLastStep}
						helper={helper}
						onClick={this.onClick}
						targetElement={el}
						blockType={blockType}
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
	const helperBlocks = util.getValue(state, `gbx3.helperBlocks.${blockType}`);
	const helperOpen = util.getValue(helperBlocks, 'helperOpen');
	const helperStep = +util.getValue(helperBlocks, 'helperStep', 0);
	const helpersAvailable = util.getValue(helperBlocks, 'helpersAvailable', []);
	const isLastStep = ( helpersAvailable.length - 1 ) === helperStep ? true : false;
	const helper = util.getValue(helpersAvailable, helperStep, {});
	const blockName = util.getValue(helper, 'blockName');
	const stage = util.getValue(state, 'gbx3.info.stage');
	const preview = util.getValue(state, 'gbx3.info.preview');
	const helperPref = util.getValue(state, 'preferences.gbx3Helpers');

	return {
		blockType,
		editBlock,
		helperOpen,
		helperStep,
		isLastStep,
		helpersAvailable,
		blockName,
		helper,
		stage,
		preview,
		helperPref
	}
}

export default connect(mapStateToProps, {
	updateAdmin,
	toggleModal,
	checkForHelper,
	nextHelperStep,
	closeHelper,
	updateHelperBlocks,
	savePrefs
})(Helper);
