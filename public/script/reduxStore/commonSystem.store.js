import axios from '../axios'

const initialState = {
    module: [],
    appList: [],
    role: []
}

export function commonSystemReducer(state = initialState, action) {
    switch (action.type) {
        case 'COMMON_MODULE':
            return Object.assign({}, state, { module: action.payload });
        case 'COMMON_APP_LIST':
            return Object.assign({}, state, { appList: action.payload });
        case 'COMMON_ROLE':
            return Object.assign({}, state, { role: action.payload });
        default:
            return state;
    }
}

export function commonSystemAction(store) {
    return {
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
            },
            COMMON_ROLE: function () {
                axios.get('./common/roleList')
                    .then((response) => {
                        store.dispatch({ type: 'COMMON_ROLE', payload: response.data })
                    })
                    .catch((error) => {
                        console.log('error');
                        console.log(error);
                    });
            }
        }
}