import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	ModalRoute,
	ModalLink
} from '../../';
import BackgroundsEdit from './BackgroundsEdit';
const ResizableBox = require('react-resizable').Resizable;


class Backgrounds extends Component {

	constructor(props) {
		super(props);
		this.onResize = this.onResize.bind(this);
		this.onResizeStop = this.onResizeStop.bind(this);
		this.onResizeStart = this.onResizeStart.bind(this);
		this.state = {
			width: 1000,
			height: 500
		};
		this.mounted = false;
		this.backgroundRef = React.createRef();
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	onResize(e, data) {
		const width = util.getValue(data, 'size.width');
		const height = util.getValue(data, 'size.height');
		this.setState({ width, height });
	}

	onResizeStop(e, data) {
		const el = this.backgroundRef.current;
		if (el) {
			const rect = el.getBoundingClientRect();
			console.log('onResizeStop', rect);
		}
	}

	onResizeStart(e, data) {
		console.log('onResizeStart', data);
	}

	render() {

		const {
			width,
			height
		} = this.state;

		const {
			editable
		} = this.props;
		console.log('execute', width, height);

		return (
			<>
				<ModalRoute
					className='gbx3'
					id={'background1'}
					effect='3DFlipVert' style={{ width: '70%' }}
					draggable={true}
					draggableTitle={`Editing Background`}
					closeCallback={() => console.log('closeCallback')}
					disallowBgClose={true}
					component={() => <BackgroundsEdit /> }
				/>
				{ editable ?
					<ResizableBox
						width={width}
						height={height}
						axis={'y'}
						maxConstraints={[1000, 2000]}
						minConstraints={[1000, 1]}
						onResize={this.onResize}
						onResizeStop={this.onResizeStop}
						onResizeStart={this.onResizeStart}
						resizeHandles={['s', 'sw', 'se']}
					>
						<ModalLink id='background1' type='div' linkRef={this.backgroundRef} style={{ width, height }} className='backgroundPanel'></ModalLink>
					</ResizableBox>
				:
					<div ref={this.backgroundRef} style={{ width, height }} className='backgroundPanel'></div>
				}
			</>
		)
	}
}

function mapStateToProps(state, props) {

	const editable = util.getValue(state, 'gbx3.admin.editable');

	return {
		editable
	}
}

export default connect(mapStateToProps, {
})(Backgrounds);
