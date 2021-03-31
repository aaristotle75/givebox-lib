import React from 'react';
import Design from './Design';
import OrgModalRoutes from '../../OrgModalRoutes';

class OrgAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      step
    } = this.props;

    switch (step) {

      case 'design':
      default: {
        return (
          <div>
            <OrgModalRoutes />
            <Design
              reloadGBX3={this.props.reloadGBX3}
              loadGBX3={this.props.loadGBX3}
              exitAdmin={this.props.exitAdmin}
            />
          </div>
        )
      }
    }
  }
}

export default OrgAdmin;
