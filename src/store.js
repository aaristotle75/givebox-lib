import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk';
import rootReducer from './lib/api/reducers';

export default function configureStore(preloadedState) {
  const logger = createLogger();
  const middlewares = [thunk, logger];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const store = createStore(rootReducer, preloadedState, middlewareEnhancer);
  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./lib/api/reducers', () =>
      store.replaceReducer(rootReducer)
    )
  }
  return store;
}
