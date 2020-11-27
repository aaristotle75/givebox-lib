import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../common/utility';
import Portal from '../common/Portal';
import GBLink from '../common/GBLink';
import Fade from '../common/Fade';
import HelpDesk from './HelpDesk';
import Draggable from 'react-draggable';

class HelpDeskButton extends Component {

  constructor(props) {
    super(props);
    const btnColor = props.btnColor;
    this.setCategory = this.setCategory.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.state = {
      loading: true,
      category: '',
      open: false,
      buttonStyle: {
        normal: {
          border: `1px solid ${btnColor}`,
          background: 'white',
          color: `${btnColor}`
        },
        hover: {
          border: `1px solid ${btnColor}`,
          background: `${btnColor}`,
          color: 'white'
        }
      },
      buttonState: 'normal'
    };
  }

  componentDidMount() {
    this.setCategory(util.getValue(this.props.location, 'pathname'));

  }

  componentDidUpdate(prev) {
    if (util.getValue(prev.location, 'pathname') !== util.getValue(this.props.location, 'pathname')) {
      this.setCategory(util.getValue(this.props.location, 'pathname'), util.getValue(prev.location, 'pathname'));
    }
  }

  onMouseEnter() {
    this.setState({ buttonState: 'hover' });
  }

  onMouseLeave() {
    this.setState({ buttonState: 'normal' });
  }

  setCategory(path, path2) {
    const pathname = path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
    const arr = pathname.split('/');
    const category = !util.isEmpty(arr) ? arr[arr.length - 1] : '';
    this.setState({ category }, this.setState({ loading: false }));
  }

  toggleDisplay() {
    const open = this.state.open ? false : true;
    this.setState({ open });
  }

  render() {

    const {
      access,
      btnColor
    } = this.props;

    const {
      open
    } = this.state;

    if (this.state.loading) return this.props.loader('Loading help center...');

    const email = util.getValue(access, 'email'); //'buddyteal333@gmail.com';
    const orgName = util.getValue(access, 'orgName');
    const orgID = util.getValue(access, 'orgID');

    const rootEl = document.getElementById('help-center');

    return (
      <Portal id={'help-center-portal'} rootEl={rootEl}>
        <Draggable
          allowAnyClick={false}
          handle={'.handle'}
        >
          <div className={`helpdeskContainer ${open ? 'open' : 'closed'}`}>
            <div className='handle'><span className='icon icon-move'></span></div>
            <Fade in={open}>
              <HelpDesk
                orgName={orgName}
                orgID={orgID}
                email={email}
                firstName={util.getValue(access, 'firstName')}
                lastName={util.getValue(access, 'lastName')}
                role={util.getValue(access, 'role')}
                category={this.state.category}
                scrollHeight={'300px'}
                closeHelpDeskCb={this.toggleDisplay}
                channel={this.props.channel}
                kb={this.props.kb}
                departmentId={this.props.departmentId}
                teamId={this.props.teamId}
                showKB={this.props.showKB}
              />
            </Fade>
          </div>
        </Draggable>
        <GBLink onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={btnColor ? this.state.buttonStyle[this.state.buttonState] : {}} onClick={this.toggleDisplay} className='helpDeskButton'>
          {open ? 'Close' : 'Help' }
        </GBLink>
      </Portal>
    )
  }
}

HelpDeskButton.defaultProps = {
  channel: 'Nonprofit Admin',
  kb: 'faq',
  departmentId: '458931000000006907',
  teamId: '458931000000192161'
}

function mapStateToProps(state, props) {

  return {
    access: util.getValue(state.resource, 'access', {})
  }
}

export default connect(mapStateToProps, {
})(HelpDeskButton);
