import React from 'react';
import { connect } from 'react-redux';
import * as util from '../common/utility';
import GBLink from '../common/GBLink';
import Image from '../common/Image';

class Logo extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state = {
    };
  }

  onClick() {
    if (this.props.onClick) this.props.onClick();
    else window.open('https://admin.givebox.com', '_blank');
  }

  render() {

    const {
      breakpoint,
      maxWidth,
      maxSize,
      maxHeight,
      alt,
      className,
      logoURL,
      theme
    } = this.props;

    return (
      <div className={className} onClick={this.onClick}>
        <Image minHeight={'0px'} maxWidth={maxWidth} maxHeight={maxHeight} maxSize={maxSize} url={logoURL[breakpoint][theme]} alt={alt} />
      </div>
    )
  }
}

Logo.defaultProps = {
  alt: 'Givebox',
  theme: 'dark',
  logoURL: {
    desktop: {
      dark: 'https://cdn.givebox.com/givebox/public/givebox-logo_dark-grey.png',
      light: 'https://cdn.givebox.com/givebox/public/givebox-logo_white.png'
    },
    mobile: {
      dark: 'https://cdn.givebox.com/givebox/public/gb-logo5.png',
      light: 'https://cdn.givebox.com/givebox/public/gb-logo5.png'
    }
  }
}

function mapStateToProps(state, props) {
  const gbx3 = util.getValue(state, 'gbx3', {});
  const info = util.getValue(gbx3, 'info', {});
  const breakpoint = util.getValue(info, 'breakpoint');

  return {
    breakpoint
  }
}

export default connect(mapStateToProps, {
})(Logo);
