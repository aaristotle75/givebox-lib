import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store'
import './lib/styles/index.scss';
import './lib/styles/theme.scss';
import App from './App';

const store = configureStore()

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
