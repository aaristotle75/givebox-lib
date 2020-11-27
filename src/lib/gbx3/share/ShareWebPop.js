import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import CodeBlock from '../../block/CodeBlock';
import * as types from '../../common/types';
import Choice from '../../form/Choice';
import ColorPicker from '../../form/ColorPicker';
import TextField from '../../form/TextField';
import GBX from '../../common/GBX';
import {
  updateInfo,
  updateGlobal,
  updateGlobals,
  saveGBX3
} from '../redux/gbx3actions';

const ENV = process.env.REACT_APP_ENV;
const REACT_APP_GBX_WIDGET = process.env.REACT_APP_GBX_WIDGET;
const REACT_APP_GBX_URL = process.env.REACT_APP_GBX_URL;

class ShareEmbed extends React.Component {

  constructor(props) {
    super(props);
    this.btnScript = this.btnScript.bind(this);
    this.toggleAuto = this.toggleAuto.bind(this);
    this.loadGBX = this.loadGBX.bind(this);
    this.copyCallback = this.copyCallback.bind(this);
    this.colorPickerCallback = this.colorPickerCallback.bind(this);
    this.updateStyle = this.updateStyle.bind(this);
    this.styles = this.styles.bind(this);
    this.state = {
      colorPickerOpen: [],
      autoPop: true,
      copied: false,
      updated: false
    }
  }

  componentDidMount() {
    //window.GIVEBOX.init({ env: 'staging'});
  }

  componentWillUnmount() {
    if (this.state.updated) {
      this.props.saveGBX3('article');
    }
  }

  colorPickerCallback(modalID) {
    const colorPickerOpen = this.state.colorPickerOpen;
    if (colorPickerOpen.includes(modalID)) {
      colorPickerOpen.splice(colorPickerOpen.indexOf(modalID), 1);
    } else {
      colorPickerOpen.push(modalID);
    }
    this.setState({ colorPickerOpen });
  }

  async updateStyle(name, value, save = false) {

    const embedButton = {
      ...this.props.embedButton,
      [name]: value
    };
    const globalUpdated = await this.props.updateGlobal('embedButton', embedButton);
    this.setState({ updated: true });
    if (globalUpdated && save) {
      this.props.saveGBX3('article');
    }
  }

  copyCallback() {
    this.setState({ copied: true });
    this.timeout = setTimeout(() => {
      this.setState({ copied: false });
      this.timeout = null;
    }, 1000);
  }

  btnScript() {
    const {
      articleID: ID,
      kind,
      embedButton
    } = this.props;

    const src = REACT_APP_GBX_WIDGET;
    const textValue = util.getValue(embedButton, 'text', types.kind(kind).cta);
    const autoPop = util.getValue(embedButton, 'autoPop');
    const auto = autoPop ? true : false;
    const autoParam = 'auto:'+ID;
    const styles = this.styles();

    let dataEnv = '';
    let envParam = '';
    switch (ENV) {
      case 'local': {
        dataEnv = `data-env="local"`;
        envParam = `env:"local"`;
        break;
      }

      case 'staging': {
        dataEnv = `data-env="staging"`;
        envParam = `env:"staging"`;
        break;
      }

      // no default
    }

    const script =
    `<script type='text/javascript' src='${src}'></script>
    <script type='text/javascript'>document.addEventListener('DOMContentLoaded',GIVEBOX.init([{${auto ? autoParam : ''}${envParam && auto ? ',' : ''}${envParam}}]));</script>
    <button type='button' class='givebox-btn' data-givebox='${ID}' ${dataEnv} style='${styles.styleStr}'>${textValue}</button>`;

    return script;
  }

  toggleAuto() {
    const {
      embedButton
    } = this.props;

    const autoPop = util.getValue(embedButton, 'autoPop');

    this.updateStyle('autoPop', autoPop ? false : true);
  }

  loadGBX() {
    const url = `${REACT_APP_GBX_URL}/${this.props.articleID}?public=true&modal=true&preview=true`;
    GBX.load(url);
    //window.GIVEBOX.load(url);
  }

  styles() {
    const {
      gbxStyle,
      primaryColor,
      buttonStyle,
      embedButton
    } = this.props;

    const styles = {};

    styles.globalTextColor = util.getValue(gbxStyle, 'textColor', '#000000');
    styles.pageColor = util.getValue(gbxStyle, 'pageColor', '#ffffff');
    styles.backgroundColor = util.getValue(gbxStyle, 'backgroundColor', util.getValue(gbxStyle, 'primaryColor'));
    styles.buttonBgColor = util.getValue(buttonStyle, 'bgColor', primaryColor);
    styles.buttonTextColor = util.getValue(buttonStyle, 'textColor', '#ffffff');
    styles.placeholderColor = util.getValue(gbxStyle, 'placeholderColor', styles.buttonTextColor);
    styles.textColor = util.getValue(embedButton, 'textColor', styles.buttonTextColor);
    styles.bgColor = util.getValue(embedButton, 'bgColor', styles.buttonBgColor);

    styles.style = {
      color: styles.textColor,
      background: styles.bgColor,
      borderRadius: '10px',
      padding: '10px 20px',
      border: 0
    };

    styles.styleStr = `color:${styles.textColor};background:${styles.bgColor};border-radius:10px;padding-top:10px;padding-bottom:10px;padding-left:20px;padding-right:20px;border:0;cursor:pointer;`;

    styles.extraColors = [
      primaryColor,
      styles.buttonTextColor,
      styles.globalTextColor,
      styles.pageColor,
      styles.buttonBgColor,
      styles.backgroundColor,
      styles.placeholderColor,
      styles.textColor,
      styles.bgColor
    ];

    return styles;
  }

  render() {

    const {
      kind,
      embedButton
    } = this.props;

    const textValue = util.getValue(embedButton, 'text', '');
    const autoPop = util.getValue(embedButton, 'autoPop');
    const styles = this.styles();

    return (
      <div className='shareWeb'>
        <div className='column'>
          <div className='settingsHeader'>
          <div className='subText'>Popup Widget Settings</div>
            <p>
              Customize the display of the button that will pop your {types.kind(kind).name}.
            </p>
          </div>
          <TextField
            name='text'
            label='Button Text'
            fixedLabel={true}
            placeholder='Enter Button Text'
            value={textValue}
            onChange={(e) => {
              const value = e.currentTarget.value;
              this.updateStyle('text', value);
            }}
          />
          <ColorPicker
            name='textColor'
            fixedLabel={true}
            label='Button Text Color'
            onAccept={(name, value) => {
              this.updateStyle('textColor', value);
            }}
            value={styles.textColor}
            modalID='colorPickeTextColor'
            opts={{
              customOverlay: {
                zIndex: 9999909
              }
            }}
            extraColors={styles.extraColors}
          />
          <ColorPicker
            name='bgColor'
            fixedLabel={true}
            label='Button Background Color'
            onAccept={(name, value) => {
              this.updateStyle('bgColor', value);
            }}
            value={styles.bgColor}
            modalID='colorPickeBgColor'
            opts={{
              customOverlay: {
                zIndex: 9999909
              }
            }}
            extraColors={styles.extraColors}
          />
          <div className='input-group'>
            <label className='label'>Button Preview</label>
            <div style={{ marginTop: 10 }}>
              <button style={styles.style} type='button'>
                {textValue || types.kind(kind).cta}
              </button>
            </div>
          </div>
          <Choice
            name='swipeApp'
            onChange={this.toggleAuto}
            type='checkbox'
            label='Autopop Form'
            value={autoPop}
            checked={autoPop}
            toggle={true}
          />
          <div className='fieldContext'>
            When your website is visited, your {types.kind(kind).name}<br />
            will automatically pop above your website.
          </div>
        </div>
        <div className='column'>
          <div className='subText'>Popup Widget Code</div>
          <p>Copy and paste this code anywhere in your website's HTML to pop the widget.</p>
          <CodeBlock showCopied={true} style={{ fontSize: '1em' }} className='flexCenter flexColumn' type='javascript' regularText={''} text={this.btnScript()} name={<div style={{ margin: '20px 0' }} className='copyButton'>Click Here to Copy Code</div>} nameIcon={false} nameStyle={{}} />
        </div>
      </div>
    )
  }
}

ShareEmbed.defaultProps = {
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const title = util.getValue(gbx3, 'data.title');
  const info = util.getValue(gbx3, 'info', {});
  const kind = util.getValue(info, 'kind');
  const articleID = util.getValue(info, 'articleID');
  const primaryColor = util.getValue(state, 'gbx3.globals.gbxStyle.primaryColor');
  const gbxStyle = util.getValue(state, 'gbx3.globals.gbxStyle', {});
  const embedButton = util.getValue(state, 'gbx3.globals.embedButton', {});
  const buttonStyle = util.getValue(state, 'gbx3.globals.button', {});

  return {
    kind,
    title,
    articleID,
    primaryColor,
    gbxStyle,
    embedButton,
    buttonStyle
  }
}

export default connect(mapStateToProps, {
  updateInfo,
  updateGlobal,
  updateGlobals,
  saveGBX3
})(ShareEmbed);
