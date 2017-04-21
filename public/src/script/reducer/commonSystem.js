import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    module: [],
    appList: []
}

export function commonSystemReducer(state = initialState, action) {
    switch (action.type) {
        case 'COMMON_MODULE':
            return Object.assign({}, state, { module: action.payload });
        case 'COMMON_APP_LIST':
            return Object.assign({}, state, { appList: action.payload });
        default:
            return state;
    }
}

export function commonSystemAction(store) {
    return [
        commonAction(), {
            COMMON_MODULE: function (data) {
                // var user = store.getState().auth.user;
                axios.get('/common/module/')
                    .then(res => {
                        store.dispatch({ type: 'COMMON_MODULE', payload: res.data })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            COMMON_APP_LIST: function () {
                axios.get('./common/appList/')
                    .then((response) => {
                        store.dispatch({ type: 'COMMON_APP_LIST', payload: response.data })
                    })
                    .catch((error) => {
                        console.log('error');
                        console.log(error);
                    });
            }
        }
    ]
}