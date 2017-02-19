import { createStore, combineReducers } from 'redux'
import PolymerRedux from 'polymer-redux'
import { dispatchActionBehavior } from './config'

import {commonSystemReducer,commonSystemAction} from './reducer/commonSystem'
import {authReducer,authAction} from './reducer/auth'
import {providerReducer,providerAction} from './reducer/provider'
import {appReducer,appAction} from './reducer/app'
import { connectionReducer, connectionAction } from './reducer/connection'

const rootReducer = combineReducers({
    commonSystem:commonSystemReducer,
    auth:authReducer,
    provider:providerReducer,
    app:appReducer,
    connection: connectionReducer
});
const storeApp = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

window.ReduxBehavior = [PolymerRedux(storeApp), dispatchActionBehavior()];
window.dispatchActionBehavior = dispatchActionBehavior();

window.commonSystemAction = commonSystemAction(storeApp);
window.authAction = authAction(storeApp);
window.providerAction = providerAction(storeApp);
window.appAction = appAction(storeApp);
window.connectionAction = connectionAction(storeApp);