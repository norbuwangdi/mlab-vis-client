import { createStore as _createStore, applyMiddleware } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import { routerMiddleware } from 'react-router-redux';
import clientMiddleware from './clientMiddleware';
import rootReducer from './rootReducer';

// create the Redux store
export default function createStore(history, api, data) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history);

  const middleware = [clientMiddleware(api), reduxRouterMiddleware];

  const finalCreateStore = applyMiddleware(...middleware)(_createStore);

  const reducer = enableBatching(rootReducer);

  let store;
  if (__DEVELOPMENT__ && __CLIENT__) {
    store = finalCreateStore(reducer, data, window.devToolsExtension && window.devToolsExtension());
  } else {
    store = finalCreateStore(reducer, data);
  }

  // add in hook for hot reloading reducer
  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./rootReducer', () => {
      store.replaceReducer(enableBatching(require('./rootReducer').default)); // eslint-disable-line
    });
  }

  // make available in window for development
  if (__DEVELOPMENT__ && __CLIENT__) {
    console.log('[dev] reduxStore = ', store);
    window.reduxStore = store;
  }

  return store;
}
