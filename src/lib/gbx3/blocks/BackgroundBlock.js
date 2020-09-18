import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	ModalRoute,
	Tabs,
	Tab,
	Collapse
} from '../../';
import Editor from './Editor';
import Button from './Button';
import ButtonEdit from './ButtonEdit';
import { toggleModal } from '../../api/actions';

class BackgroundBlock extends Component {

	constructor(props) {
		super(props);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);
		this.optionsUpdated = this.optionsUpdated.bind(this);

		this.state = {
			hasBeenUpdated: false,
			tab: 'edit'
		};
		this.width = null;
		this.height = null;
		this.displayRef = React.createRef();
	}

	componentDidMount() {
		this.blockRef = this.props.blockRef.current;
		if (this.blockRef) {
			this.width = this.blockRef.clientWidth;
			this.height = this.blockRef.clientHeight;
		}
	}

	componentDidUpdate() {
		this.props.setDisplayHeight(this.displayRef);
	}

	closeEditModal(type = 'save') {
		const {
			hasBeenUpdated
		} = this.state;
		if (type !== 'cancel') {
			this.props.saveBlock({
				hasBeenUpdated
			});
		} else {
			this.setState({
			}, this.props.closeEditModal);
		}
	}

	optionsUpdated(name, obj) {
		this.setState({ [name]: { ...obj }, hasBeenUpdated: true });
	}

	setTab(tab) {
		this.setState({ tab });
	}

	render() {

		const {
			name,
			modalID,
			title,
			articleID,
			orgID,
			breakpoint,
			primaryColor
		} = this.props;

		const {
			content,
			button,
			tab
		} = this.state;

		return (
			<div className={`backgroundBlock`}>
				<ModalRoute
					className='gbx3'
					optsProps={{ closeCallback: this.onCloseUploadEditor }}
					id={modalID}
					effect='3DFlipVert' style={{ width: '70%' }}
					draggable={true}
					draggableTitle={`Editing ${title}`}
					closeCallback={this.closeEditModal}
					disallowBgClose={true}
					component={() =>
						<div className='modalWrapper'>
							<Collapse
								label={`Edit ${title}`}
								iconPrimary='edit'
							>
								<div className='formSectionContainer'>
									<div className='formSection'>
										Edit Background Block
									</div>
								</div>
							</Collapse>
						</div>
					}
					buttonGroup={
						<div className='gbx3'>
							<div style={{ marginBottom: 0 }} className='button-group center'>
								<GBLink className='link remove' onClick={this.props.onClickRemove}><span className='icon icon-trash-2'></span> <span className='buttonText'>Remove</span></GBLink>
								<GBLink className='link' onClick={() => this.closeEditModal('cancel')}>Cancel</GBLink>
								<GBLink className='button' onClick={this.closeEditModal}>Save</GBLink>
							</div>
						</div>
					}
				/>
				<div className='backgroundBlockPanel' ref={this.displayRef}></div>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const primaryColor = util.getValue(state, 'gbx3.globals.gbxStyle.primaryColor');

	return {
		primaryColor
	}
}

export default connect(mapStateToProps, {
	toggleModal
})(BackgroundBlock);
