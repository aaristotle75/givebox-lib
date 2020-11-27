import React from 'react';
import { connect } from 'react-redux';
import {
  util
} from '../';
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
      dark: 'https://s3-us-west-1.amazonaws.com/givebox-marketing/images/2020/06/19054759/givebox_logo2020-grey-text.png',
      light: 'https://givebox-marketing.s3.us-west-1.amazonaws.com/images/2020/01/19210256/givebox_logo2020_white-text.svg'
    },
    mobile: {
      dark: 'https://givebox.s3-us-west-1.amazonaws.com/public/gb-logo5.png',
      light: 'https://givebox.s3-us-west-1.amazonaws.com/public/gb-logo5.png'
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
