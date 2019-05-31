import React, {Component} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import GBLink from '../common/GBLink';
import Highlight from 'react-highlight';

class CodeBlock extends Component{
	constructor(props){
		super(props);
  	this.onCopy = this.onCopy.bind(this);
    this.state = {
      copied: false,
    };
	}

	componentDidMount() {
		document.addEventListener('copy', e => {
		  const textContent = e.target.textContent;
		  const filterText = 'CopyToClipboard\n';
		  if (textContent.startsWith(filterText)) {
		    e.clipboardData.setData('text/plain', textContent.replace(filterText, ''));
		    e.preventDefault();
		  }
		});
	}

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  onCopy() {
		this.setState({copied: true });
		this.timeout = setTimeout(() => {
			this.setState({copied: false });
      this.timeout = null;
		}, 1000);
	}

	render() {
		const {
      text,
      name,
			nameStyle,
			nameIcon,
      type,
			copiedText,
			copiedTextStyle,
			regularText
		} = this.props;

    const {
      copied
    } = this.state;

		return (
      <div className="codeBlockComponent">
				<div className={`codeBlockText ${this.props.className}`}>
					{regularText}
	        <CopyToClipboard name={name} text={text} onCopy={() => this.onCopy()}>
	          <span className="copy">
	            <GBLink>{(nameIcon) && <i className="material-icons"><span className="icon-copy"></span></i>}<span style={nameStyle}>{name}</span></GBLink>
	        	</span>
	        </CopyToClipboard>
				</div>
        <div className="codeBlock wordwrap">
          <Highlight className={`${type} code ${copied ? 'highlight' : ''}`}>
            {text}
          </Highlight>
        </div>
      </div>
		)
	}
};

CodeBlock.defaultProps = {
	className: '',
	regularText: '',
	copiedText: '...copied to clipboard',
	copiedTextStyle : {
		fontSize: 10
	},
	nameStyle: {
		fontSize: 14
	},
	nameIcon: true
}

export default CodeBlock;
